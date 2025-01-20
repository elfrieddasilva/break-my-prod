import { ProjectDeploymentStatus } from "@/core/shared/types/project-deployment-status";
import { DeployProjectPayload } from "../deploy-project.payload";

export interface DeployProjectService {
    deployProject(payload: DeployProjectPayload): Promise<ProjectDeploymentStatus>;
}