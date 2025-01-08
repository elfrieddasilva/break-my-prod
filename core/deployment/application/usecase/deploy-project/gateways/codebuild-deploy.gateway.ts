import { DeployAWSGateway, ProjectCreationParams } from "./aws-deploy.gateway";
import {
    ArtifactsType,
    CodeBuildClient,
    ComputeType,
    CreateProjectCommand,
    EnvironmentType,
    SourceType,
  } from "@aws-sdk/client-codebuild";

export class CodeBuildDeployGateway implements DeployAWSGateway {
    async createAWSDeploymentProject(params: ProjectCreationParams): Promise<void> {
        const codebuildClient = new CodeBuildClient({
            
        });

        const response = await codebuildClient.send(
            new CreateProjectCommand({                artifacts: {
                    type: ArtifactsType.S3,
                    location: params.buildOutputBucket,
                },
                environment: {
                    computeType: ComputeType.BUILD_GENERAL1_SMALL,
                    image: "aws/codebuild/standard:7.0",
                    type: EnvironmentType.LINUX_CONTAINER
                },
                name: params.projectName,
                serviceRole: params.roleArn,
                source: {
                    type: SourceType.GITHUB,
                    location: params.githubUrl
                }
            })
        )
    }
    triggerProjectDeployment(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}