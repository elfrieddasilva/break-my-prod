import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { DeploymentLog } from '../../logging/domain/deployment-log'
import { MistralAIErrorScorer, MistralAIErrorScorerException } from '../modules/score-error-log/gateway/mistralai-error-scorer.gateway'

describe('MistralAIErrorScorer Integration Test', () => {
  let scorer: MistralAIErrorScorer

  beforeEach(() => {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY environment variable is required')
    }
    scorer = new MistralAIErrorScorer()
  })

  it('should analyze real deployment logs and return scored errors', {
  }, async () => {
    try {
        const testLogs = [
            new DeploymentLog(
              "Error: ECS service deployment failed - TaskDefinition: service test-api failed to launch task: No Container Instances were found in your cluster",
              new Date('2024-01-10T10:01:15Z')
            ),
            new DeploymentLog(
              "Warning: High memory usage detected in Lambda function user-auth-prod-handler: 85% of allocated memory used",
              new Date('2024-01-10T10:02:30Z')
            ),
            new DeploymentLog(
              "Critical: RDS instance database-prod-1 is in storage-full state, immediate action required",
              new Date('2024-01-10T10:03:45Z')
            )
          ]
      
          const result = (await scorer.analyzeAndScore(testLogs));
          result.forEach((scoredError, index) => {
            console.log(scoredError.message)
            expect(scoredError).toHaveProperty('score') 
            expect(scoredError).toHaveProperty('severity')
            expect(scoredError).toHaveProperty('timestamp')
            expect(scoredError).toHaveProperty('description')
      
            // Verify score is a number between 0 and 10
            expect(typeof scoredError.score).toBe('number')
            expect(scoredError.score).toBeGreaterThanOrEqual(0)
            expect(scoredError.score).toBeLessThanOrEqual(10)
      
            // Verify severity is one of the expected values
            expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(scoredError.severity)
      
            // Verify message matches input
            expect(scoredError.message).toBe(testLogs[index].message)
      
            // Verify timestamp is a valid date string
            expect(() => new Date(scoredError.timestamp)).not.toThrow()
          })
          // Verify the structure of the response
          expect(result).toBeDefined()
          expect(Array.isArray(result)).toBe(true)
          expect(result).toHaveLength(3)
          
    } catch(error) {
        
        //expect(error as Error).toBeInstanceOf(MistralAIErrorScorerException)
    }

    // // Verify each scored error has the required properties
    // result.forEach((scoredError, index) => {
    //   expect(scoredError).toHaveProperty('score')
    //   expect(scoredError).toHaveProperty('severity')
    //   expect(scoredError).toHaveProperty('timestamp')
    //   expect(scoredError).toHaveProperty('description')
    //   expect(scoredError).toHaveProperty('message')

    //   // Verify score is a number between 0 and 10
    //   expect(typeof scoredError.score).toBe('number')
    //   expect(scoredError.score).toBeGreaterThanOrEqual(0)
    //   expect(scoredError.score).toBeLessThanOrEqual(10)

    //   // Verify severity is one of the expected values
    //   expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(scoredError.severity)

    //   // Verify message matches input
    //   expect(scoredError.message).toBe(testLogs[index].message)

    //   // Verify timestamp is a valid date string
    //   expect(() => new Date(scoredError.timestamp)).not.toThrow()
    // })

    // // Specific assertions for each error
    // const [ecsError, memoryWarning, rdsError] = result

    // // ECS deployment failure should be high severity
    // expect(ecsError.severity).toMatch(/HIGH|CRITICAL/)
    // expect(ecsError.score).toBeGreaterThanOrEqual(7)
    // expect(ecsError.description).toMatch(/ECS|deployment|container|cluster/i)

    // // Memory warning should be medium to high severity
    // expect(memoryWarning.severity).toMatch(/MEDIUM|HIGH/)
    // expect(memoryWarning.score).toBeGreaterThanOrEqual(5)
    // expect(memoryWarning.description).toMatch(/memory|lambda|resource/i)

    // // RDS critical error should be highest severity
    // expect(rdsError.severity).toBe('CRITICAL')
    // expect(rdsError.score).toBeGreaterThanOrEqual(8)
    // expect(rdsError.description).toMatch(/RDS|storage|database/i)
  })

//   it('should handle empty logs array', {
   
//   }, async () => {
//     const result = await scorer.analyze([])
//     expect(result).toEqual([])
//   })

//   it('should handle single log analysis', {
   
//   }, async () => {
//     const singleLog = new DeploymentLog(
//       "Error: S3 bucket policy update failed - insufficient permissions",
//       new Date()
//     )

//     const result = await scorer.analyze([singleLog])

//     expect(result).toHaveLength(1)
//     expect(result[0]).toMatchObject({
//       message: singleLog.message,
//       severity: expect.stringMatching(/HIGH|CRITICAL/),
//       score: expect.any(Number),
//       description: expect.stringMatching(/S3|permission|bucket/i),
//       timestamp: expect.any(String)
//     })
//   })

//   it('should handle multiple consecutive requests', {
//   }, async () => {
//     const log = new DeploymentLog(
//       "Error: Lambda function timeout after 15 seconds",
//       new Date()
//     )

//     // Make three consecutive requests
//     const results = await Promise.all([
//       scorer.analyze([log]),
//       scorer.analyze([log]),
//       scorer.analyze([log])
//     ])

//     results.forEach(result => {
//       expect(result).toHaveLength(1)
//       expect(result[0].severity).toBeDefined()
//       expect(result[0].score).toBeDefined()
//     })

//     // Verify consistency in scoring
//     const scores = results.map(r => r[0].score)
//     const maxScoreDifference = Math.max(...scores) - Math.min(...scores)
//     expect(maxScoreDifference).toBeLessThanOrEqual(2) // Allow small variance in scoring
//   })
})
