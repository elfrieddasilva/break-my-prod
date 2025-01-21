import { BaseController } from "@/core/shared/base-controller";
import { CheckProjectUsecase } from "../check-project.usecase";
import { CheckProjectPayload } from "../check-project.payload";

export class CheckProjectController extends BaseController {

    constructor (private checkProjectUsecase: CheckProjectUsecase) {
        super();
    }

    async executeImpl(req: Request) {
        const payload = await req.json() as CheckProjectPayload
       try {
        const isValidUrl = await this.checkProjectUsecase.execute(payload);
        if (!isValidUrl) {
            this.fail("Invalid url specified")
        }
       } catch (error) {
        this.fail((error as Error).message);
       }
    }
}