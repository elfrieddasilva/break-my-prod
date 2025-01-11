import { CloudWatchLogsClient, StartQueryCommand, GetQueryResultsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { DeploymentLog } from '../../logging/domain/log';
import {vi, expect,it, describe, beforeEach, MockedObject} from 'vitest';
import { CloudWatchLogsAWSGateway, CloudWatchQuery } from "../application/usecase/get-deployment-logs/gateways/cloudwatch-logs-aws.gateway";
// Mock AWS SDK
vi.mock('@aws-sdk/client-cloudwatch-logs');

describe('CloudWatchLogsAWSGateway', () => {
    let gateway: CloudWatchLogsAWSGateway;
    let mockCloudWatchClient: MockedObject<CloudWatchLogsClient> = vi.mocked(new CloudWatchLogsClient({}));

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
        
        // Create gateway instance
        gateway = new CloudWatchLogsAWSGateway();
        mockCloudWatchClient = new CloudWatchLogsClient({}) as MockedObject<CloudWatchLogsClient>;
        (gateway as any).client = mockCloudWatchClient;
    });

    describe('getAWSDeploymentLogs', () => {
        it('should fetch and transform logs successfully', async () => {
            // Mock successful query start
            const mockQueryId = 'test-query-id';
            mockCloudWatchClient.send.mockImplementationOnce(() => Promise.resolve({ queryId: mockQueryId }));

            // Mock successful query results
            const mockResults = [{
                field: '@timestamp',
                value: '2023-12-20 10:00:00'
            }, {
                field: '@message',
                value: 'Test deployment message'
            }];

            mockCloudWatchClient.send.mockImplementationOnce(() => 
                Promise.resolve({ 
                    status: 'Complete',
                    results: [mockResults]
                })
            );

            const params = { limit: 10 };
            const logs = await gateway.getAWSDeploymentLogs(params);

            // Verify results
            expect(logs).toHaveLength(1);
            expect(logs[0]).toBeInstanceOf(DeploymentLog);
            expect(logs[0].message).toBe('Test deployment message');
            expect(logs[0].timestamp).toBeInstanceOf(Date);
        });

        it('should handle empty results', async () => {
            mockCloudWatchClient.send.mockImplementationOnce(() => Promise.resolve({ queryId: 'test-query-id' }));
            mockCloudWatchClient.send.mockImplementationOnce(() => 
                Promise.resolve({ 
                    status: 'Complete',
                    results: []
                })
            );

            const params = { limit: 10 };
            const logs = await gateway.getAWSDeploymentLogs(params);

            expect(logs).toHaveLength(0);
        });

        it('should handle query failure', async () => {
            mockCloudWatchClient.send.mockRejectedValueOnce(new Error('Query failed'));

            const params = { limit: 10 };
            await expect(gateway.getAWSDeploymentLogs(params)).rejects.toThrow('Query failed');
        });

        it('should handle missing queryId', async () => {
            mockCloudWatchClient.send.mockResolvedValueOnce();

            const params = { limit: 10 };
            await expect(gateway.getAWSDeploymentLogs(params)).rejects.toThrow('Failed to start query');
        });
    });
});

describe('CloudWatchQuery', () => {
    let query: any;
    let mockClient: MockedObject<CloudWatchLogsClient>;

    beforeEach(() => {
        mockClient = new CloudWatchLogsClient({}) as MockedObject<CloudWatchLogsClient>;
        const params = {
            logGroupNames: ['/aws/codedeploy/deployments'],
            dateRange: [new Date(), new Date()] as [Date, Date],
            queryConfig: { limit: 20 }
        };
        query = new CloudWatchQuery(mockClient, params);
    });

    describe('executeQuery', () => {
        it('should handle polling until completion', async () => {
            // Mock start query
            mockClient.send.mockImplementationOnce(() => 
                Promise.resolve({ queryId: 'test-query-id' })
            );

            // Mock first poll - running
            mockClient.send.mockImplementationOnce(() => 
                Promise.resolve({ status: 'Running' })
            );

            // Mock second poll - complete
            const mockResults = [[{ field: '@message', value: 'test' }]];
            mockClient.send.mockImplementationOnce(() => 
                Promise.resolve({ 
                    status: 'Complete',
                    results: mockResults
                })
            );

            const results = await query.executeQuery('test query');
            expect(results).toEqual(mockResults);
            expect(mockClient.send).toHaveBeenCalledTimes(3);
        });
    });
});
