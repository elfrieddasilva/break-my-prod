import { Usecase } from "@/core/shared/usecase";
import { ScoreErrorLogService } from "./service/score-error-log.service";
import { DeploymentLog } from "@/core/logging/domain/deployment-log";
import { ScoredError } from "../../domain/scored-error";
import { ScoreErrorLogException } from "./scored-error-log.exception";
import { ScoredErrorLogDTO } from "./scored-error-log.dto";

export class ScoreErrorLogUsecase implements Usecase<ScoredErrorLogDTO[], ScoredError[]>{
    private scoreErrorLogService: ScoreErrorLogService
    constructor(scoreErrorLogService: ScoreErrorLogService) {
        this.scoreErrorLogService = scoreErrorLogService;
    }
    async execute(payload: ScoredErrorLogDTO[]) {
        try {
            const deploymentLogs = payload.map((log) => {
                return DeploymentLog.createFromJsonObject(log);
            })
            return await this.scoreErrorLogService.score(deploymentLogs);
        } catch (error) {
            throw new ScoreErrorLogException((error as Error).message);
        }
    }
}