import { DeploymentLog } from "@/core/logging/domain/deployment-log";
import { ScoredError } from "@/core/scoring/domain/scored-error";

export interface AIErrorScorerGateway {
    analyzeAndScore(logs: DeploymentLog[]): Promise<ScoredError[]>;
}