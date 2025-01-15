import { DeploymentLog } from "@/core/logging/domain/deployment-log";
import { GetDeploymentLogsDTO } from "../get-deployment-logs.dto";



export interface GetDeploymentLogsAWSGateway {
    getAWSDeploymentLogs(params?: GetDeploymentLogsDTO): Promise<DeploymentLog[]>;
}

