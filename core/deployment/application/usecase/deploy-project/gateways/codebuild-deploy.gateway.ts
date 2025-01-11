import { DeployAWSGateway, ProjectCreationParams } from "./aws-deploy.gateway";
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

interface CodeBuildConfig {
    region?: string;
    credentials?: CodeBuildClientConfig['credentials'];
}

export class CodeBuildDeployGateway implements DeployAWSGateway {
    private readonly client: CodeBuildClient;

    constructor(config: CodeBuildConfig = {}) {
        this.client = new CodeBuildClient({
            region: config.region || process.env.AWS_REGION || 'us-east-1',
            credentials: config.credentials
        });
    }

    async createAWSDeploymentProject(params: ProjectCreationParams): Promise<string> {
        try {
            const command = this.createProjectCommand(params);
            const response = await this.client.send(command);

            if (!response.project?.arn) {
                throw new Error('Failed to create CodeBuild project: Project ARN not returned');
            }

            return response.project.arn;
        } catch (error) {
            console.error('Error creating CodeBuild project:', error);
            throw new Error(`Failed to create CodeBuild project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async triggerProjectDeployment(projectName: string): Promise<string> {
        try {
            const command = new StartBuildCommand({
                projectName,
                // Optional: Add build specific parameters here
                // environmentVariablesOverride: [],
                // sourceVersion: 'main'
            });

            const response = await this.client.send(command);

            if (!response.build?.id) {
                throw new Error('Failed to start build: Build ID not returned');
            }

            return response.build.id;
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
                buildspec: this.generateBuildSpec(),
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

    private generateBuildSpec(): string {
        // You can customize this based on your needs
        const buildSpec = {
            version: '0.2',
            phases: {
                install: {
                    'runtime-versions': {
                        nodejs: '18'
                    }
                },
                pre_build: {
                    commands: [
                        'npm ci'
                    ]
                },
                build: {
                    commands: [
                        'npm run build'
                    ]
                },
                post_build: {
                    commands: [
                        'aws s3 sync ./dist s3://${BUCKET_NAME}/'
                    ]
                }
            },
            artifacts: {
                files: [
                    '**/*'
                ],
                'base-directory': 'dist'
            }
        };

        return JSON.stringify(buildSpec);
    }
}
