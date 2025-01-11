export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ScoredError = {
    score: number;
    severity: Severity;
    timestamp: string;
    description: string;
    message: string;
}
