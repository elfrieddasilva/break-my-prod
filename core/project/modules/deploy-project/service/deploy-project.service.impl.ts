import { ProjectDeploymentStatus } from "@/core/shared/types/project-deployment-status";
import { DeployProjectPayload } from "../deploy-project.payload";
import { DeployProjectService } from "./deploy-project.service";
import { AWSDeployGateway } from "../gateways/aws-deploy.gateway";
import { ProjectName } from "@/core/shared/project-name";

export class DeployProjectServiceImpl implements DeployProjectService {
    private awsDeploymentGateway: AWSDeployGateway;
    constructor (awsDeploymentGateway: AWSDeployGateway) {
        this.awsDeploymentGateway = awsDeploymentGateway;
    }
    async deployProject(payload: DeployProjectPayload): Promise<ProjectDeploymentStatus> {
        const projectName = ProjectName.createName(payload.projectType.toString());
        try {
           await this.awsDeploymentGateway.createAWSDeploymentProject({
                projectName,
                roleArn: "",
                buildOutputBucket: "",
                githubUrl: payload.url,
                projectType: payload.projectType
            });
            return await this.awsDeploymentGateway.triggerProjectDeployment(projectName);
        } catch (error) {
            throw error;
        }
    }
    
}