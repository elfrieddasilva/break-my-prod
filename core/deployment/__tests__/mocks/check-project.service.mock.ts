import { CheckProjectRepository } from "../../application/repository/check-project.repository";
import { CheckProjectError } from "../../application/usecase/check-project/check-project.error";
import { CheckProjectService, ProjectType } from "../../application/usecase/check-project/check-project.service";

export class CheckProjectServiceMock implements CheckProjectService {
    private checkProjectRepository: CheckProjectRepository;
    constructor(checkProjectRepository: CheckProjectRepository) {
        this.checkProjectRepository = checkProjectRepository;
    }
    async detectProjectType(url: string): Promise<ProjectType> {
        try {
            const isValidGithubUrl = await this.checkProjectRepository.validateGithubUrl(url);
            if (isValidGithubUrl) {
                const projectType = await this.checkProjectRepository.detectProjectType(url);
                return projectType;    
            }
            throw new Error("invalid url specified");
            
        } catch (error) {
            throw new CheckProjectError((error as Error).message);
        }
    }
    
}