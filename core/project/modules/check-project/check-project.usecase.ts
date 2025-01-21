import { Usecase } from "@/core/shared/usecase";
import { CheckProjectException } from "./check-project.exception";
import { CheckProjectPayload } from "./check-project.payload";
import { CheckProjectService } from "./service/check-project.service";


export class CheckProjectUsecase implements Usecase<CheckProjectPayload, boolean> {
    private checkProjectService: CheckProjectService;
    constructor (checkProjectService: CheckProjectService){
        this.checkProjectService = checkProjectService;
    }
    async execute(payload: CheckProjectPayload) {
        try {
            const isValid = await this.checkProjectService.validateGithubUrl(payload.url);
            return isValid;
        } catch (error) {
            throw new CheckProjectException((error as Error).message);
        }
    }
}