import OpenAI from 'openai';
import { AIErrorScorerGateway } from './ai-error-scorer.gateway';
import { DeploymentLog } from '@/core/logging/domain/log';
import { ScoredError } from '@/core/scoring/domain/scored-error';

export class OpenAIErrorScorer implements AIErrorScorerGateway {
    client: OpenAI;
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
    }
    async analyze(logs: DeploymentLog[]): Promise<ScoredError[]> {
        const prompt = `Analyze the following aws deployment error structure: ${logs}
        Give each of the error a score based on this structure {
            score: number;
            severity: Severity;
            timestamp: string;
            description: string;
            message: string;
        }
        `;
        const completion = await this.client.chat.completions.create({
            messages: [{role: "system", content: prompt}],
            model: "gpt-4-turbo-preview",
            response_format: {type: "json_object"},
            temperature: 0.3
        });
        const content = completion.choices[0].message.content;
        if (content === null) {
            throw new Error("Error while generating the score with openai");
        }
        const scoredErrors: ScoredError[] =  JSON.parse(content);
        return Promise.resolve(scoredErrors);

    }
    
}