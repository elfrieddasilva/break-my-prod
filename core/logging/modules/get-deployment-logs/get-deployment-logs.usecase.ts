import { Usecase } from "@/core/shared/usecase";
import { GetDeploymentLogsService } from "./service/get-deployment-logs.service";
import { GetDeploymentLogsDTO } from "./get-deployment-logs.dto";
import { DeploymentLog } from "../../domain/deployment-log";

export class GetDeploymentLogsUsecase implements Usecase<GetDeploymentLogsDTO, DeploymentLog[]> {
    private getDeploymentLogsService: GetDeploymentLogsService;
    constructor(getDeploymentLogsService: GetDeploymentLogsService){
        this.getDeploymentLogsService = getDeploymentLogsService;
    }
    async execute(request: GetDeploymentLogsDTO) {
        const deploymentLogs = await this.getDeploymentLogsService.getDeploymentLogs(request);
        return deploymentLogs;
    }
}