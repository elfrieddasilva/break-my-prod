import { ProjectType } from "../usecase/check-project/check-project.service";

export interface CheckProjectRepository {
    validateGithubUrl(url: string): Promise<boolean>;
    detectProjectType(githubUrl: string): Promise<ProjectType>;
    parseToGithubUrl(url: string): Promise<string | undefined>;
}