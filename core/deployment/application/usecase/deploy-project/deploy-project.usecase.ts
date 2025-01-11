import { Usecase } from "@/core/shared/usecase";
import { DeployProjectError } from "./deploy-project.error";
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
            throw new DeployProjectError((error as Error).message);
        }
    }
}