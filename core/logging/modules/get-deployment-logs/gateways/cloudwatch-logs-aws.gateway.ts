import { CloudWatchLogsClient, StartQueryCommand, GetQueryResultsCommand, GetQueryResultsCommandOutput, ResultField } from "@aws-sdk/client-cloudwatch-logs";
import { GetDeploymentLogsAWSGateway } from './aws-get-deployment-logs.gateway';
import { DeploymentLog } from '../../../domain/deployment-log';
import { CloudWatchLogsAWSGatewayException } from "./cloudwatch-logs-aws-gateway.error";
import { GetDeploymentLogsDTO } from "../get-deployment-logs.dto";

type QueryConfigParams = {
    logGroupNames: string[],
    dateRange: [Date, Date],
    queryConfig: { limit: number }
}

export class CloudWatchQuery {
    private client: CloudWatchLogsClient;
    private logGroupNames: string[];
    private startTime: number;
    private endTime: number;
    private limit: number;

    constructor(client: CloudWatchLogsClient, { logGroupNames, dateRange, queryConfig }: QueryConfigParams) {
        this.client = client;
        this.logGroupNames = logGroupNames;
        this.startTime = Math.floor(dateRange[0].getTime() / 1000);
        this.endTime = Math.floor(dateRange[1].getTime() / 1000);
        this.limit = queryConfig.limit;
    }

    async executeQuery(queryString: string): Promise<ResultField[][]> {
        try {
            const startQueryCommand = new StartQueryCommand({
                logGroupNames: this.logGroupNames,
                startTime: this.startTime,
                endTime: this.endTime,
                queryString,
                limit: this.limit
            });

            const queryResponse = await this.client.send(startQueryCommand);
            const queryId = queryResponse?.queryId;

            if (!queryId) {
                throw new Error('Failed to start query');
            }

            // Poll for results
            let results: GetQueryResultsCommandOutput;
            do { 
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between polls
                const getResultsCommand = new GetQueryResultsCommand({ queryId });
                results = await this.client.send(getResultsCommand);
            } while (results.status === 'Running');

            return results.results || [];
        } catch (error) {
            throw error;
        }
    }
}

export class CloudWatchLogsAWSGateway implements GetDeploymentLogsAWSGateway {
    private client: CloudWatchLogsClient;

    constructor() {
        this.client = new CloudWatchLogsClient({
            region: process.env.AWS_REGION || 'us-east-1'
        });
    }

    async getAWSDeploymentLogs(params: GetDeploymentLogsDTO): Promise<DeploymentLog[]> {
        try {
            const query = new CloudWatchQuery(this.client, {
                logGroupNames: ['/aws/codedeploy/deployments'],
                dateRange: [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()], // Last 24 hours
                queryConfig: { limit: 20 }
            });

            const queryString = `
                fields @timestamp, @message
                | sort @timestamp desc
                | limit ${params.limit || 20}
            `;

            const results = await query.executeQuery(queryString);

            return results.map((result: ResultField[]) => {
                const timestamp = result.find((field: ResultField) => field.field === '@timestamp')?.value;
                const message = result.find((field: ResultField) => field.field === '@message')?.value;
                return new DeploymentLog(message || 'No message', new Date(timestamp!));
            });
        } catch (error) {
            throw new CloudWatchLogsAWSGatewayException((error as Error).message);
        }
    }
}
