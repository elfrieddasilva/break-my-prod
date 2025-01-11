import { expect, describe, it, test, beforeEach } from "vitest";
import { InvalidGithubProjectException } from "../application/usecase/check-project/check-project.error";
import { CheckProjectService } from "../application/usecase/check-project/service/check-project.service";
import { CheckProjectServiceImpl } from "../application/usecase/check-project/service/check-project.service.impl";


describe('check project service impl', () => {
    let checkProjectService: CheckProjectService; 
    let checkProjectServiceError: Error;
    const validHttpUrl = "https://www.github.com/amir/prog";
    const invalidHttpUrl = "http://randomUrl.com";
    const validParsedGithubUrl = "github.com/amir/prog";
    const validWWWUrl = "www.github.com/amir/prog";
    const invalidWWWUrl = "www.randomurl.com";

    beforeEach(() => {
        checkProjectService = new CheckProjectServiceImpl();
    })
    test('should return valid github url for http url', async () => {
        const isValidGithubUrl = await checkProjectService.validateGithubUrl(validHttpUrl);
        expect(isValidGithubUrl).toBe(true);
    })
    it('should return invalid github url for http url', async () => {
        try {
            const isValidGithubUrl = await checkProjectService.validateGithubUrl(invalidHttpUrl);
            expect(isValidGithubUrl).toBe(false);
        } catch (error) {
            checkProjectServiceError = (error as Error);
            expect(checkProjectServiceError).toBeInstanceOf(InvalidGithubProjectException)
        }
    })
    it('should parse to valid url for http url', async () => {
        const parsedGithubUrl = await checkProjectService.parseToGithubUrl(validHttpUrl);
        console.log(parsedGithubUrl)
        expect(parsedGithubUrl).toEqual(validParsedGithubUrl);
    });
    it('should return valid for www url', async () => {
        const isValidGithubUrl = await checkProjectService.validateGithubUrl(validWWWUrl);
        expect(isValidGithubUrl).toBe(true);
    });
    it('should parse to valid url for www url', async () => {
        const parsedGithubUrl = await checkProjectService.parseToGithubUrl(validWWWUrl);
        expect(parsedGithubUrl).toEqual(validParsedGithubUrl);
    });
    it('should return invalid github url for http url', async () => {
        try {
            const isValidGithubUrl = await checkProjectService.validateGithubUrl(invalidWWWUrl);
            expect(isValidGithubUrl).toBe(false);
        } catch (error) {
            checkProjectServiceError = (error as Error);
            expect(checkProjectServiceError).toBeInstanceOf(InvalidGithubProjectException)
        }
    });
    it('should return valid for valid github url', async () => {
        const parsedGithubUrl = await checkProjectService.parseToGithubUrl(validParsedGithubUrl);
        expect(parsedGithubUrl).toEqual(validParsedGithubUrl);
    })
})