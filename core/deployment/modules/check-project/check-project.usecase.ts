import { Usecase } from "@/core/shared/usecase";
import { CheckProjectException } from "./check-project.exception";
import { CheckProjectPayload } from "./check-project.payload";
import { CheckProjectService } from "./service/check-project.service";
import { ProjectType } from "@/core/shared/types/project-type";

export class CheckProjectUsecase implements Usecase<CheckProjectPayload, ProjectType> {
    private checkProjectService: CheckProjectService;
    constructor (checkProjectService: CheckProjectService){
        this.checkProjectService = checkProjectService;
    }
    async execute(payload: CheckProjectPayload) {
        try {
            const projectType = await this.checkProjectService.detectProjectType(payload.githubUrl);
            if (projectType === "unknown") {
                throw new Error("Unable to detect Project type");
            }
            return projectType;
        } catch (error) {
            throw new CheckProjectException((error as Error).message);
        }
    }
}