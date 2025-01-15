import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { DeploymentLog } from '../../logging/domain/deployment-log'
import { MistralAIErrorScorer } from '../modules/score-error-log/gateway/mistralai-error-scorer.gateway'

describe('MistralAIErrorScorer', () => {
  let scorer: MistralAIErrorScorer
  let sampleLogs: DeploymentLog[]

  beforeEach(() => {
    // Mock environment variable
    process.env.MISTRAL_API_KEY = 'test-key'
    
    scorer = new MistralAIErrorScorer()
    
    // Setup sample logs
    sampleLogs = [
      new DeploymentLog(
        "Error: Failed to pull Docker image registry.example.com/user-api:latest - connection timeout",
        new Date('2024-01-10T10:01:15Z')
      ),
      new DeploymentLog(
        "Container health check failed: service 'user-api' is not responding on port 8080",
        new Date('2024-01-10T10:02:30Z')
      ),
      new DeploymentLog(
        "Critical: Kubernetes node eks-node-1 is not ready",
        new Date('2024-01-10T10:07:45Z')
      )
    ]
  })

  it('should analyze logs and return scored errors', async () => {
    // Mock the Mistral client response
    const mockResponse = {
      choices: [{
        message: {
          content: JSON.stringify([
            {
              score: 7,
              severity: 'HIGH',
              timestamp: '2024-01-10T10:01:15Z',
              description: 'Docker image pull failure',
              message: "Error: Failed to pull Docker image registry.example.com/user-api:latest - connection timeout"
            },
            {
              score: 6,
              severity: 'MEDIUM',
              timestamp: '2024-01-10T10:02:30Z',
              description: 'Service health check failure',
              message: "Container health check failed: service 'user-api' is not responding on port 8080"
            },
            {
              score: 8,
              severity: 'CRITICAL',
              timestamp: '2024-01-10T10:07:45Z',
              description: 'Infrastructure failure',
              message: "Critical: Kubernetes node eks-node-1 is not ready"
            }
          ])
        }
      }]
    }

    // Mock the Mistral chat.complete method
    vi.spyOn(scorer.client.chat, 'complete').mockResolvedValue(mockResponse as any)

    const result = await scorer.analyzeAndScore(sampleLogs)

    expect(result).toHaveLength(3)
    expect(result[0]).toMatchObject({
      score: 7,
      severity: 'HIGH',
      description: 'Docker image pull failure'
    })
    expect(result[1]).toMatchObject({
      score: 6,
      severity: 'MEDIUM',
      description: 'Service health check failure'
    })
    expect(result[2]).toMatchObject({
      score: 8,
      severity: 'CRITICAL',
      description: 'Infrastructure failure'
    })
  })

  it('should throw error when Mistral response is null', {
    retry: 2
  }, async () => {
    // Mock null response
    vi.spyOn(scorer.client.chat, 'complete').mockResolvedValue({
      choices: [{ message: { content: null } }]
    } as any)

    await expect(scorer.analyzeAndScore(sampleLogs)).rejects.toThrow(
      'Error while generating the score with Mistral'
    )
  })

  it('should handle empty logs array',  async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: '[]'
        }
      }]
    }

    vi.spyOn(scorer.client.chat, 'complete').mockResolvedValue(mockResponse as any)

    const result = await scorer.analyzeAndScore([]);
    expect(result).toEqual([])
  })

  it('should handle Mistral API errors', {
    retry: 3
  }, async () => {
    vi.spyOn(scorer.client.chat, 'complete').mockRejectedValue(
      new Error('API Error')
    )

    await expect(scorer.analyzeAndScore(sampleLogs)).rejects.toThrow('API Error')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
})
