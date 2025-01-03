import { expect, describe, it, test, beforeEach } from "vitest";
import { CheckProjectRepository } from "../../application/repository/check-project.repository";
import { CheckProjectRepositoryMock, InvalidGithubProjectError } from "./check-project.repository.mock";

describe('check project repository mock', () => {
    let checkProjectRepository: CheckProjectRepository; 
    let checkProjectRepositoryError: Error;
    const validHttpUrl = "https://www.github.com/amir/prog";
    const invalidHttpUrl = "http://randomUrl.com";
    const validParsedGithubUrl = "github.com/amir/prog";
    const validWWWUrl = "www.github.com/amir/prog";
    const invalidWWWUrl = "www.randomurl.com";

    beforeEach(() => {
        checkProjectRepository = new CheckProjectRepositoryMock();
    })
    test('should return valid github url for http url', async () => {
        const isValidGithubUrl = await checkProjectRepository.validateGithubUrl(validHttpUrl);
        expect(isValidGithubUrl).toBe(true);
    })
    it('should return invalid github url for http url', async () => {
        try {
            const isValidGithubUrl = await checkProjectRepository.validateGithubUrl(invalidHttpUrl);
            expect(isValidGithubUrl).toBe(false);
        } catch (error) {
            checkProjectRepositoryError = (error as Error);
            expect(checkProjectRepositoryError).toBeInstanceOf(InvalidGithubProjectError)
        }
    })
    it('should parse to valid url for http url', async () => {
        const parsedGithubUrl = await checkProjectRepository.parseToGithubUrl(validHttpUrl);
        console.log(parsedGithubUrl)
        expect(parsedGithubUrl).toEqual(validParsedGithubUrl);
    });
    it('should return valid for www url', async () => {
        const isValidGithubUrl = await checkProjectRepository.validateGithubUrl(validWWWUrl);
        expect(isValidGithubUrl).toBe(true);
    });
    it('should parse to valid url for www url', async () => {
        const parsedGithubUrl = await checkProjectRepository.parseToGithubUrl(validWWWUrl);
        expect(parsedGithubUrl).toEqual(validParsedGithubUrl);
    });
    it('should return invalid github url for http url', async () => {
        try {
            const isValidGithubUrl = await checkProjectRepository.validateGithubUrl(invalidWWWUrl);
            expect(isValidGithubUrl).toBe(false);
        } catch (error) {
            checkProjectRepositoryError = (error as Error);
            expect(checkProjectRepositoryError).toBeInstanceOf(InvalidGithubProjectError)
        }
    });
    it('should return valid for valid github url', async () => {
        const parsedGithubUrl = await checkProjectRepository.parseToGithubUrl(validParsedGithubUrl);
        expect(parsedGithubUrl).toEqual(validParsedGithubUrl);
    })
})