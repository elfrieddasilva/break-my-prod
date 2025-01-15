import { ProjectDeploymentStatus } from "@/core/shared/types/project-deployment-status";

export type ProjectCreationParams = {
    projectName: string;
    roleArn: string;
    buildOutputBucket: string;
    githubUrl: string;
}

export interface AWSDeployGateway {
    createAWSDeploymentProject(params: ProjectCreationParams): Promise<void>
    triggerProjectDeployment(projectName: string): Promise<ProjectDeploymentStatus>
}

