import { ScoreErrorLogService } from "./service/score-error-log.service";

export class ScoreErrorLogUsecase {
    private scoreErrorLogService: ScoreErrorLogService
    constructor(scoreErrorLogService: ScoreErrorLogService) {
        this.scoreErrorLogService = scoreErrorLogService;
    }
    async execute() {

    }
}