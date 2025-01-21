import { ProjectDeploymentStatus } from "@/core/shared/types/project-deployment-status";
import { ProjectType } from "@/core/shared/types/project-type";

export type ProjectCreationParams = {
    projectName: string;
    roleArn: string;
    buildOutputBucket: string;
    githubUrl: string;
    projectType: ProjectType;
}

export interface AWSDeployGateway {
    createAWSDeploymentProject(params: ProjectCreationParams): Promise<void>
    triggerProjectDeployment(projectName: string): Promise<ProjectDeploymentStatus>
}

