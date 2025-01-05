import { DeployProjectPayload } from "../deploy-project.payload";

export interface DeployProjectService {
    deployProject(payload: DeployProjectPayload): Promise<boolean>;
}