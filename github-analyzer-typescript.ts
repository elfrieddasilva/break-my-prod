import { 
  CodeBuild, 
  CodeDeploy, 
  DynamoDB, 
  CloudWatchLogs,
} from 'aws-sdk';
import { URL } from 'url';
import * as path from 'path';

// Types and interfaces
interface ProjectIndicators {
  [key: string]: string[];
}

type ProjectType = 'nodejs' | 'python' | 'java' | 'docker' | 'unknown';

interface DeploymentConfig {
  applicationName: string;
  deploymentGroupName: string;
  configName: string;
}

interface ProjectStatus {
  projectUrl: string;
  buildId: string;
  status: 'ANALYZING' | 'DEPLOYING' | 'COMPLETED' | 'FAILED';
  errors?: string[];
}

// Configuration
const PROJECT_INDICATORS: ProjectIndicators = {
  nodejs: ['package.json', 'tsconfig.json', 'node_modules'],
  python: ['requirements.txt', 'setup.py', 'Pipfile'],
  java: ['pom.xml', 'build.gradle'],
  docker: ['Dockerfile', 'docker-compose.yml']
};

class GithubProjectAnalyzer {
  private codebuild: CodeBuild;
  private codedeploy: CodeDeploy;
  private dynamodb: DynamoDB.DocumentClient;
  private cloudwatch: CloudWatchLogs;

  constructor() {
    this.codebuild = new CodeBuild();
    this.codedeploy = new CodeDeploy();
    this.dynamodb = new DynamoDB.DocumentClient();
    this.cloudwatch = new CloudWatchLogs();
  }

  private async detectProjectType(repoPath: string): Promise<ProjectType> {
    try {
      for (const [projectType, indicators] of Object.entries(PROJECT_INDICATORS)) {
        for (const indicator of indicators) {
          if (await this.fileExists(path.join(repoPath, indicator))) {
            return projectType as ProjectType;
          }
        }
      }
      return 'unknown';
    } catch (error) {
      console.error('Error detecting project type:', error);
      throw error;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    // Implementation would depend on how you're accessing the repository
    // This could be using fs.exists for local files or GitHub API for remote repos
    return true; // Placeholder
  }

  private async createCodeBuildProject(projectName: string, repoUrl: string): Promise<void> {
    const params: CodeBuild.CreateProjectInput = {
      name: projectName,
      source: {
        type: 'GITHUB',
        location: repoUrl,
        buildspec: 'buildspec.yml'
      },
      artifacts: {
        type: 'NO_ARTIFACTS'
      },
      environment: {
        type: 'LINUX_CONTAINER',
        image: 'aws/codebuild/standard:5.0',
        computeType: 'BUILD_GENERAL1_SMALL'
      },
      serviceRole: 'CodeBuildServiceRole'
    };

    try {
      await this.codebuild.createProject(params).promise();
    } catch (error) {
      console.error('Error creating CodeBuild project:', error);
      throw error;
    }
  }

  private async triggerDeployment(projectType: ProjectType, repoUrl: string): Promise<string> {
    const deploymentConfigs: Record<ProjectType, string> = {
      nodejs: 'NodeJSDeploymentConfig',
      python: 'PythonDeploymentConfig',
      java: 'JavaDeploymentConfig',
      docker: 'ContainerDeploymentConfig',
      unknown: 'CodeDeployDefault.OneAtATime'
    };

    const params: CodeDeploy.CreateDeploymentInput = {
      applicationName: `${projectType}-app`,
      deploymentGroupName: `${projectType}-deployment-group`,
      revision: {
        revisionType: 'GitHub',
        gitHubLocation: {
          repository: repoUrl,
          commitId: 'master'
        }
      },
      deploymentConfigName: deploymentConfigs[projectType]
    };

    try {
      const response = await this.codedeploy.createDeployment(params).promise();
      return response.deploymentId!;
    } catch (error) {
      console.error('Error triggering deployment:', error);
      throw error;
    }
  }

  private async updateProjectStatus(status: ProjectStatus): Promise<void> {
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'ProjectDeployments',
      Item: status
    };

    try {
      await this.dynamodb.put(params).promise();
    } catch (error) {
      console.error('Error updating project status:', error);
      throw error;
    }
  }

  private async parseDeploymentLogs(logGroupName: string, deploymentId: string): Promise<string[]> {
    const params: CloudWatchLogs.GetLogEventsRequest = {
      logGroupName,
      logStreamName: `deployment-${deploymentId}`,
      startFromHead: true
    };

    try {
      const response = await this.cloudwatch.getLogEvents(params).promise();
      return response.events?.map(event => event.message!) || [];
    } catch (error) {
      console.error('Error parsing deployment logs:', error);
      throw error;
    }
  }

  public async analyzeAndDeploy(githubUrl: string): Promise<ProjectStatus> {
    try {
      // Validate GitHub URL
      const url = new URL(githubUrl);
      if (url.hostname !== 'github.com') {
        throw new Error('Invalid GitHub URL');
      }

      // Create unique project name
      const projectName = `project-${url.pathname.replace(/\//g, '-')}`;

      // Create CodeBuild project
      await this.createCodeBuildProject(projectName, githubUrl);

      // Start build
      const buildResponse = await this.codebuild.startBuild({ projectName }).promise();
      const buildId = buildResponse.build!.id!;

      // Initial status update
      const initialStatus: ProjectStatus = {
        projectUrl: githubUrl,
        buildId,
        status: 'ANALYZING'
      };
      await this.updateProjectStatus(initialStatus);

      // Wait for build completion and detect project type
      const projectType = await this.detectProjectType('/tmp/repo'); // Path would be different in actual implementation

      // Trigger deployment
      const deploymentId = await this.triggerDeployment(projectType, githubUrl);

      // Update status to deploying
      const deployingStatus: ProjectStatus = {
        ...initialStatus,
        status: 'DEPLOYING'
      };
      await this.updateProjectStatus(deployingStatus);

      // Monitor deployment and parse logs
      const logs = await this.parseDeploymentLogs('/aws/codedeploy', deploymentId);

      // Final status update
      const finalStatus: ProjectStatus = {
        ...deployingStatus,
        status: 'COMPLETED',
        errors: logs.filter(log => log.includes('ERROR'))
      };
      await this.updateProjectStatus(finalStatus);

      return finalStatus;
    } catch (error) {
      console.error('Error in analyzeAndDeploy:', error);
      throw error;
    }
  }
}

// Lambda handler
export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  try {
    const { url } = JSON.parse(event.body || '{}');
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'GitHub URL is required' })
      };
    }

    const analyzer = new GithubProjectAnalyzer();
    const result = await analyzer.analyzeAndDeploy(url);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message })
    };
  }
};
