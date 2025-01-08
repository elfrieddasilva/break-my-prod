
export type ProjectCreationParams = {
    projectName: string;
    roleArn: string;
    buildOutputBucket: string;
    githubUrl: string;
}

export interface DeployAWSGateway {
    createAWSDeploymentProject(params: ProjectCreationParams): Promise<void>;
    triggerProjectDeployment(): Promise<void>
}

