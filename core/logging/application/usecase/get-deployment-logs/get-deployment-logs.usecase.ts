import { GetDeploymentLogsService } from "./service/get-deployment-logs.service";

export class GetDeploymentLogsUsecase {
    private getDeploymentLogsService: GetDeploymentLogsService;
    constructor(getDeploymentLogsService: GetDeploymentLogsService){
        this.getDeploymentLogsService = getDeploymentLogsService;
    }
    async execute() {
        const deploymentLogs = await this.getDeploymentLogsService.getDeploymentLogs();
        return deploymentLogs;
    }
}