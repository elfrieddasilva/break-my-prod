import { CheckProjectController } from "./check-project-controller";
import { CheckProjectServiceImpl } from "../service/check-project.service.impl";
import { CheckProjectUsecase } from "../check-project.usecase";

const checkProjectService = new CheckProjectServiceImpl();
const checkProjectUsecase = new CheckProjectUsecase(checkProjectService);
const checkProjectController = new CheckProjectController(checkProjectUsecase);

export {checkProjectController, checkProjectUsecase}
