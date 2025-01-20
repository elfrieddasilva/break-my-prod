import { Usecase } from "@/core/shared/usecase";
import { DeployProjectException } from "./deploy-project.exception";
import { DeployProjectPayload } from "./deploy-project.payload";
import { DeployProjectService } from "./service/deploy-project.service";

export class DeployProjectUsecase {
    private deployProjectService: DeployProjectService;
    constructor (deployProjectService: DeployProjectService){
        this.deployProjectService = deployProjectService;
    }
    async execute(payload: DeployProjectPayload) {
        try {
            const deploymentStatus = await this.deployProjectService.deployProject(payload);
            return deploymentStatus;
        } catch (error) {
            throw new DeployProjectException((error as Error).message);
        }
    }
}