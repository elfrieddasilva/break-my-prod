import { expect, describe, it, beforeEach } from "vitest";
import { CheckProjectUsecase } from "../application/usecase/check-project/check-project.usecase";
import { CheckProjectService } from "../application/usecase/check-project/check-project.service";
import { CheckProjectRepository } from "../application/repository/check-project.repository";
import { CheckProjectRepositoryMock } from "./mocks/check-project.repository.mock";
import { CheckProjectServiceMock } from "./mocks/check-project.service.mock";
import { CheckProjectPayload } from "../application/usecase/check-project/check-project.payload";
import { CheckProjectError } from "../application/usecase/check-project/check-project.error";

describe('check project usecase', () => {
    let checkProjectUsecase: CheckProjectUsecase;
    let checkProjectService: CheckProjectService;
    let checkProjectRepository: CheckProjectRepository;
    let checkProjectError: Error;
    const projectPayload: CheckProjectPayload = {
        githubUrl: "https://www.github.com/amir/prog"
    }
    const invalidProjectUrlPayload: CheckProjectPayload = {
        githubUrl: "randomUrl.com"
    }
    beforeEach(() => {
        checkProjectRepository = new CheckProjectRepositoryMock();
        checkProjectService = new CheckProjectServiceMock(checkProjectRepository);
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
            expect(checkProjectError).toBeInstanceOf(CheckProjectError)
        }
    })
})