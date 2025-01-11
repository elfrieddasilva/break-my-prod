import { DeploymentLog } from "@/core/logging/domain/log";
import { ScoredError } from "@/core/scoring/domain/scored-error";

export interface ScoreErrorLogService {
    score(logs: DeploymentLog[]): Promise<ScoredError[]>;
}