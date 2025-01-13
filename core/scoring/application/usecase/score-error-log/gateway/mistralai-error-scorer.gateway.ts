import { Mistral } from "@mistralai/mistralai";
import { AIErrorScorerGateway } from './ai-error-scorer.gateway';
import { DeploymentLog } from '@/core/logging/domain/log';
import { ScoredError } from '@/core/scoring/domain/scored-error';

export class MistralAIErrorScorerException extends Error {}

export class MistralAIErrorScorer implements AIErrorScorerGateway {
    client: Mistral;
    constructor() {
        this.client = new Mistral({
            apiKey: process.env.MISTRAL_API_KEY
        })
    }
    async analyze(logs: DeploymentLog[]): Promise<ScoredError[]> {
        const prompt = `Analyze the following AWS deployment error logs: ${logs}

Input Format: Array of objects with structure:
{
    "message": string,
    "timestamp": string
}

Required Output: Array of scored error objects with structure:
{
    "score": number (0-100, where 100 is most severe),
    "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "timestamp": string (preserve from input),
    "description": string (brief analysis of the error),
    "message": string (must be exactly the same as input message)
}

Rules:
1. Each input log MUST have exactly one corresponding output object
2. The 'message' field in output MUST be identical to input message
3. The 'timestamp' field MUST be preserved from input
4. If input array is empty, return empty array
5. Score should reflect deployment impact severity
6. Description should explain the error's potential impact


Return the response as a JSON array of objects matching the output structure.`;

        
        const completion = await this.client.chat.complete({
            messages: [{role: "system", content: prompt}],
            model: "mistral-large-latest",
            responseFormat: {type: "json_object"},
            temperature: 0.3
        });
        const content = completion?.choices?.[0]?.message?.content;

        if (content === null || content === undefined) {
            throw new Error("Error while generating the score with Mistral");
        }
        const result =  JSON.parse(String(content));
        console.log((content as unknown as any[]))
        return Promise.resolve(result);
    }
    
}