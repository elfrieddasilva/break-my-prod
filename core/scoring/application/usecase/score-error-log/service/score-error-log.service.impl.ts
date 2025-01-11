import { DeploymentLog } from "@/core/logging/domain/log";
import { ScoredError, Severity } from "@/core/scoring/domain/scored-error";
import { ScoreErrorLogService } from "./score-error-log.service";
import { AIErrorScorerGateway } from "../gateway/ai-error-scorer.gateway";

export interface ErrorScore {
  pattern: RegExp;
  baseScore: number;
  severity: Severity;
  description: string;
}

export const errorPatterns: ErrorScore[] = [
  {
    pattern: /out of memory|memory leak/i,
    baseScore: 90,
    severity: 'CRITICAL',
    description: 'Memory-related failures'
  },
  {
    pattern: /permission denied|access denied|unauthorized/i,
    baseScore: 80,
    severity: 'HIGH',
    description: 'Security and permissions issues'
  },
  {
    pattern: /timeout|connection refused/i,
    baseScore: 70,
    severity: 'HIGH',
    description: 'Network and timeout issues'
  },
  {
    pattern: /resource not found|404|missing dependency/i,
    baseScore: 60,
    severity: 'MEDIUM',
    description: 'Resource availability issues'
  },
  {
    pattern: /invalid configuration|misconfiguration/i,
    baseScore: 50,
    severity: 'MEDIUM',
    description: 'Configuration problems'
  },
  {
    pattern: /warning|deprecated/i,
    baseScore: 30,
    severity: 'LOW',
    description: 'Non-critical warnings'
  }
];

export class ScoredErrorLogServiceException extends Error {
  super(message: string) { }
}

export class ScoreErrorLogServiceImpl implements ScoreErrorLogService {
  private aiErrorScorerGateway: AIErrorScorerGateway;
  constructor(aiErrorScorerGateway: AIErrorScorerGateway) {
    this.aiErrorScorerGateway = aiErrorScorerGateway;
  }
  async score(logs: DeploymentLog[]): Promise<ScoredError[]> {
    try {
      const aiScoredErrors = await this.aiErrorScorerGateway.analyze(logs);
      let scoredErrors: ScoredError[] = [];
      for (const log of logs) {
        const scoredError = await this.scoreError(log);
        scoredErrors.push(scoredError);
      }
      let finalScoredErrors: ScoredError[] = [];
      for (let i = 0; i < aiScoredErrors.length; i++) {
        const finalScoredError: ScoredError = {
          ...scoredErrors[i],
          ...aiScoredErrors[i],
          score: Math.round((scoredErrors[i].score * 0.6) + (aiScoredErrors[i].score * 0.4))
        }
        finalScoredErrors.push(finalScoredError);
      }
      return finalScoredErrors;
    } catch (error) {
      throw new ScoredErrorLogServiceException((error as Error).message);
    }
  }

  private async scoreError(errorLog: DeploymentLog): Promise<ScoredError> {
    let baseScore = 0;
    let severity: Severity = 'LOW';
    let description = 'Unclassified error';

    for (const pattern of errorPatterns) {
      if (pattern.pattern.test(errorLog.message)) {
        baseScore = pattern.baseScore;
        severity = pattern.severity;
        description = pattern.description;
        break;
      }
    }

    let finalScore = baseScore;
    if (errorLog.message.includes('repeated')) {
      finalScore *= 1.2;
    }
    if (errorLog.message.includes('production')) {
      finalScore *= 1.5;
    }
    if (errorLog.message.includes('customer') || errorLog.message.includes('user')) {
      finalScore *= 1.3;
    }

    return {
      message: errorLog.message,
      score: Math.min(100, Math.round(finalScore)),
      severity,
      timestamp: new Date().toISOString(),
      description,
    };
  }


}