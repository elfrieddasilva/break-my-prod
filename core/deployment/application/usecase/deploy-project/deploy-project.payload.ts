import { ProjectType } from "@/core/shared/types/project-type"


export type DeployProjectPayload = {
    conFig: {}
    url: string
    projectType: ProjectType
}