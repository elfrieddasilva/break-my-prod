import { BaseController } from "@/core/shared/base-controller";
import { DeployProjectPayload } from "../deploy-project.payload";
import { DeployProjectUsecase } from "../deploy-project.usecase";

export class DeployProjectController extends BaseController {
    private deployProjectUsecase: DeployProjectUsecase;
    constructor(deployProjectUsecase: DeployProjectUsecase) {
        super();
        this.deployProjectUsecase = deployProjectUsecase;
    }
    async executeImpl(req: Request) {
        const payload = await req.json() as DeployProjectPayload;
        try {
            const deploymentStatus = await this.deployProjectUsecase.execute(payload);
            if (deploymentStatus === 'COMPLETED') {
                this.ok(payload);
            }
            if (deploymentStatus === 'FAILED') {
                this.fail("Deployment failed")
            }
        } catch (error) {
            this.fail((error as Error).message);
        }
    }
}