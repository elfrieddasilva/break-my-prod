import {Project} from "@/models/project"
export interface ProjectService {
    getProjects(): Promise<Project[]>
    getProjectById(id: string): Promise<Project>;
}