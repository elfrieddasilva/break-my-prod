import { DeployProjectPayload } from "../deploy-project.payload";
import { DeployProjectService } from "./deploy-project.service";

export class DeployProjectServiceImpl implements DeployProjectService {
    deployProject(payload: DeployProjectPayload): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}