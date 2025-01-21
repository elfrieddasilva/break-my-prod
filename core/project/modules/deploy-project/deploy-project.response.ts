export type DeployProjectResponse = {
    id: string;
    status: 'completed' | 'failed'
    timestamp: string;
    url: string;
}