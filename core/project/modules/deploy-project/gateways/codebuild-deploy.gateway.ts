import { ProjectDeploymentStatus } from "@/core/shared/types/project-deployment-status";
import { AWSDeployGateway, ProjectCreationParams } from "./aws-deploy.gateway";
import {
    ArtifactsType,
    CodeBuildClient,
    ComputeType,
    CreateProjectCommand,
    EnvironmentType,
    SourceType,
    StartBuildCommand,
    CodeBuildClientConfig,
} from "@aws-sdk/client-codebuild";
import { BuildSpecGenerator } from "./build-spec-generator";

interface CodeBuildConfig {
    region?: string;
    credentials?: CodeBuildClientConfig['credentials'];
}

export class CodeBuildDeployGateway implements AWSDeployGateway {
    private readonly client: CodeBuildClient;
    private buildSpecGenerator: BuildSpecGenerator;

    constructor(config: CodeBuildConfig = {}) {
        this.client = new CodeBuildClient({
            region: config.region || process.env.AWS_REGION || 'us-east-1',
            credentials: config.credentials
        });
        this.buildSpecGenerator = new BuildSpecGenerator();
    }

    async createAWSDeploymentProject(params: ProjectCreationParams) {
        try {
            const command = this.createProjectCommand(params);
            const response = await this.client.send(command);

            if (!response.project?.arn) {
                throw new Error('Failed to create CodeBuild project: Project ARN not returned');
            }

        } catch (error) {
            console.error('Error creating CodeBuild project:', error);
            throw new Error(`Failed to create CodeBuild project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async triggerProjectDeployment(projectName: string): Promise<ProjectDeploymentStatus> {
        try {
            const command = new StartBuildCommand({
                projectName,
                // Optional: Add build specific parameters here
                // environmentVariablesOverride: [],
                // sourceVersion: 'main'
            });

            const response = await this.client.send(command);

            if (!response.build?.id) {
                return 'FAILED';
            }

            return 'COMPLETED';
        } catch (error) {
            console.error('Error triggering CodeBuild project:', error);
            throw new Error(`Failed to trigger CodeBuild project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private createProjectCommand(params: ProjectCreationParams): CreateProjectCommand {
        return new CreateProjectCommand({
            artifacts: {
                type: ArtifactsType.S3,
                location: params.buildOutputBucket,
            },
            environment: {
                computeType: ComputeType.BUILD_GENERAL1_SMALL,
                image: "aws/codebuild/standard:7.0",
                type: EnvironmentType.LINUX_CONTAINER,
                privilegedMode: true, // Enable if you need Docker support
            },
            name: params.projectName,
            serviceRole: params.roleArn,
            source: {
                type: SourceType.GITHUB,
                location: params.githubUrl,
                buildspec: this.buildSpecGenerator.generateBuildSpecFor(params.projectType),
            },
            description: `Deployment project for ${params.projectName}`,
            timeoutInMinutes: 30, // Configurable build timeout
            queuedTimeoutInMinutes: 30, // Configurable queue timeout
            cache: {
                type: 'NO_CACHE' // Configure caching if needed
            },
            logsConfig: {
                cloudWatchLogs: {
                    status: 'ENABLED'
                }
            }
        });
    }

}
