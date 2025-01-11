import { DeploymentLog } from "@/core/logging/domain/log";

export type GetDeploymentLogsParams = {
    logGroupNames: string[],
    dateRange: [Date, Date],
     limit: number 
}


export interface GetDeploymentLogsAWSGateway {
    getAWSDeploymentLogs(params: GetDeploymentLogsParams): Promise<DeploymentLog[]>;
}

