import { ProjectType } from "@/core/shared/types/project-type"


export type DeployProjectPayload = {
    url: string
    projectType: ProjectType
}