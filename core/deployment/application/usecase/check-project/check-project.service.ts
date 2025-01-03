export type ProjectType = 'nodejs' | 'python' | 'java' | 'docker' | 'unknown';

export interface CheckProjectService {
    detectProjectType(url: string): Promise<ProjectType>;

}