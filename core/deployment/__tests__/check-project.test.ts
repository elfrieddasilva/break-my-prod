import { expect, describe, it, beforeEach } from "vitest";
import { CheckProjectUsecase } from "../modules/check-project/check-project.usecase";
import { CheckProjectService } from "../modules/check-project/service/check-project.service";

import { CheckProjectPayload } from "../modules/check-project/check-project.payload";
import { CheckProjectException } from "../modules/check-project/check-project.exception";
import { CheckProjectServiceImpl } from "../modules/check-project/service/check-project.service.impl";

describe('check project usecase', () => {
    let checkProjectUsecase: CheckProjectUsecase;
    let checkProjectService: CheckProjectService;
    let checkProjectError: Error;
    const projectPayload: CheckProjectPayload = {
        githubUrl: "https://www.github.com/amir/prog"
    }
    const invalidProjectUrlPayload: CheckProjectPayload = {
        githubUrl: "randomUrl.com"
    }
    beforeEach(() => {
        checkProjectService = new CheckProjectServiceImpl();
        checkProjectUsecase = new CheckProjectUsecase(checkProjectService);
    })
    it('should return valid project type for valid github url', async () => {
        const projectType = await checkProjectUsecase.execute(projectPayload);
        expect(projectType).toEqual("nodejs");
    })
    it('should throw error for invalid project url', async () => {
        try {
            const projectType = await checkProjectUsecase.execute(invalidProjectUrlPayload);
            expect(projectType).toEqual("unknown"); 
        } catch (error) {
            checkProjectError = (error as Error);           
            expect(checkProjectError).toBeInstanceOf(CheckProjectException)
        }
    })
})