import { DeploymentLog } from "@/core/logging/domain/deployment-log";
import { ScoredError } from "@/core/scoring/domain/scored-error";

export interface ScoreErrorLogService {
    score(logs: DeploymentLog[]): Promise<ScoredError[]>;
}