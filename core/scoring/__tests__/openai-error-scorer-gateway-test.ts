import { describe, it, expect, beforeEach } from 'vitest'

import { DeploymentLog } from '../../logging/domain/log'
import { OpenAIErrorScorer } from '../application/usecase/score-error-log/gateway/openai-error-scorer.gateway'

describe('OpenAIErrorScorer', () => {
  let scorer: OpenAIErrorScorer

  beforeEach(() => {
    scorer = new OpenAIErrorScorer()
  })

  it('should analyze logs and return scored errors', {
    retry: 3 // Will retry failed test up to 3 times
  }, async () => {
    const mockLogs: DeploymentLog[] = [
        new DeploymentLog(
          "Starting deployment of service 'user-api' to production",
          new Date('2024-01-10T10:00:00Z')
        ),
        new DeploymentLog(
          "Error: Failed to pull Docker image registry.example.com/user-api:latest - connection timeout",
          new Date('2024-01-10T10:01:15Z')
        ),
        new DeploymentLog(
          "Container health check failed: service 'user-api' is not responding on port 8080",
          new Date('2024-01-10T10:02:30Z')
        ),
        new DeploymentLog(
          "Warning: Memory usage exceeded 85% threshold in pod user-api-7845d9f66-xk2n9",
          new Date('2024-01-10T10:03:45Z')
        ),
        new DeploymentLog(
          "Successfully rolled out 3/3 replicas of 'user-api'",
          new Date('2024-01-10T10:05:00Z')
        ),
        new DeploymentLog(
          "Database migration failed: could not establish connection to RDS instance",
          new Date('2024-01-10T10:06:30Z')
        ),
        new DeploymentLog(
          "Critical: Kubernetes node eks-node-1 is not ready",
          new Date('2024-01-10T10:07:45Z')
        ),
        new DeploymentLog(
          "Deployment rollback initiated due to increasing error rate",
          new Date('2024-01-10T10:08:15Z')
        ),
        new DeploymentLog(
          "SSL certificate validation failed for domain api.example.com",
          new Date('2024-01-10T10:09:30Z')
        ),
        new DeploymentLog(
          "Deployment completed with 3 errors and 1 warning",
          new Date('2024-01-10T10:10:00Z')
        )
      ];
      

    const result = await scorer.analyze(mockLogs)
    expect(result).toBeDefined()
    // Add your assertions here
  })

  it('should handle empty logs array', {
    retry: 2
  }, async () => {
    const result = await scorer.analyze([])
    expect(result).toEqual([])
  })

})
