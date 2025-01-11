import { DeploymentLog } from "@/core/logging/domain/log";
import { GetDeploymentLogsService } from "./get-deployment-logs.service";
import { GetDeploymentLogsAWSGateway } from "../gateways/aws-get-deployment-logs.gateway";

export class GetDeploymentLogsServiceImpl implements GetDeploymentLogsService {
    private getDeploymentLogsAWSGateway: GetDeploymentLogsAWSGateway;
    constructor(getDeploymentLogsAWSGateway: GetDeploymentLogsAWSGateway) {
        this.getDeploymentLogsAWSGateway = getDeploymentLogsAWSGateway;
    }
    async getDeploymentLogs(): Promise<DeploymentLog[]> {
        return (await this.getDeploymentLogsAWSGateway.getAWSDeploymentLogs());
    }

}