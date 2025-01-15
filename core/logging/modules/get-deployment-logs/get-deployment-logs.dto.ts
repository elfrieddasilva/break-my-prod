export type GetDeploymentLogsDTO = {
    logGroupNames?: string[],
    dateRange?: [Date, Date],
    limit: number 
}
