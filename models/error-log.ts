export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ErrorLog = {
    description: string;
    timestamp: Date;
    severity : Severity;
}