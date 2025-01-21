import { DeployProjectUsecase } from "../deploy-project.usecase";
import { CodeBuildDeployGateway } from "../gateways/codebuild-deploy.gateway";
import { DeployProjectServiceImpl } from "../service/deploy-project.service.impl";
import { DeployProjectController } from "./deploy-project.controller";
import {fromEnv} from "@aws-sdk/credential-providers"

const codeBuildDeployGateway = new CodeBuildDeployGateway({
    region: process.env.AWS_REGION,
    credentials: fromEnv()
});

const deployProjectService = new DeployProjectServiceImpl(codeBuildDeployGateway);
const deployProjectUsecase = new DeployProjectUsecase(deployProjectService);
const deployProjectController = new DeployProjectController(deployProjectUsecase);
export {
    deployProjectController,
    deployProjectUsecase
}