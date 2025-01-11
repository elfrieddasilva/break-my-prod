import { DeploymentLog } from "@/core/logging/domain/log";

export interface GetDeploymentLogsService {
    getDeploymentLogs(): Promise<DeploymentLog[]>;
   
}