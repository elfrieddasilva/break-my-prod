import { Project } from "@/models/project";
import { ProjectService } from "../interface/project.service";

export class ProjectServiceMock implements ProjectService {
    private sampleProjects: Project[] = [
        {
            id: "1",
            url: "github.com/elfrieddasilva/sample-project",
            errorLogs: [
                {
                    description: "Invalid credentials specified",
                    timestamp: new Date('2024-01-10T10:02:15Z'),
                    severity: 'HIGH'
                },
                {
                    description:"Buffer overflow",
                    timestamp: new Date('2024-01-10T10:02:30Z'),
                    severity: 'CRITICAL',
                },
                {
                    description:"Null pointer exception",
                    timestamp: new Date('2024-01-10T10:03:45Z'),
                    severity: 'LOW',
                }
            ],
            user: {
                name: "elfrieddasilva"
            },
            score: 300,
            
            type: 'java'

        },
        {
            id: "2",
            url: "github.com/amirdas/project",
            errorLogs: [
                {
                    description: "Invalid credentials specified",
                    timestamp: new Date('2024-01-10T10:02:15Z'),
                    severity: 'HIGH'
                },
                {
                    description:"Buffer overflow",
                    timestamp: new Date('2024-01-10T10:02:30Z'),
                    severity: 'CRITICAL',
                },
                {
                    description:"Null pointer exception",
                    timestamp: new Date('2024-01-10T10:03:45Z'),
                    severity: 'LOW',
                }
            ],
            user: {
                name: "amirdas"
            },
            score: 300,
            
            type: 'nodejs'

        }
    ]
    async getProjects(): Promise<Project[]> {
        return Promise.resolve(this.sampleProjects);
    }
    async getProjectById(id: string): Promise<Project> {
        return Promise.resolve(this.sampleProjects[0]);
    }
    
}

