import { CheckProjectError } from "./check-project.error";
import { CheckProjectPayload } from "./check-project.payload";
import { CheckProjectService } from "./check-project.service";

export class CheckProjectUsecase {
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
            throw new CheckProjectError((error as Error).message);
        }
    }
}