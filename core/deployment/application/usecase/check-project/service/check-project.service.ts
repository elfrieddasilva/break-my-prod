import { ProjectType } from "@/core/shared/types/project-type";


export interface CheckProjectService {
    validateGithubUrl(url: string): Promise<boolean>;
    detectProjectType(githubUrl: string): Promise<ProjectType>;
    parseToGithubUrl(url: string): Promise<string | undefined>;
}