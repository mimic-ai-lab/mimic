import { Database } from '@mimic/core';
import { generatePersonaWithOpenAI, generateEvaluationsWithOpenAI, GeneratedPersona } from '../utils/openai';
import { savePersonaToDatabase, saveEvaluationsToDatabase } from '../utils/database';

// CLI system user ID for automated operations
const CLI_SYSTEM_USER_ID = '550e8400-e29b-41d4-a716-446655440003';

export interface GeneratePersonaInput {
    agentId: string;
    teamId: string;
    agentName: string;
    agentDescription: string;
    platform: string;
}

export interface GenerateEvalsInput {
    agentId: string;
    teamId: string;
    agentName: string;
    agentDescription: string;
    platform: string;
}

export async function generatePersona(input: GeneratePersonaInput): Promise<void> {
    console.log(`🎭 Generating persona for agent: ${input.agentId}`);

    try {
        // Generate persona using OpenAI
        const persona = await generatePersonaWithOpenAI({
            agentName: input.agentName,
            agentDescription: input.agentDescription,
            platform: input.platform,
        });

        console.log('✅ OpenAI persona generated:', persona);

        // Save to database
        await savePersonaToDatabase(
            input.agentId,
            input.teamId,
            CLI_SYSTEM_USER_ID,
            persona
        );

    } catch (error) {
        console.error('❌ Failed to generate persona:', error);
        throw error;
    }
}

export async function generateEvals(input: GenerateEvalsInput): Promise<void> {
    console.log(`📊 Generating evaluations for agent: ${input.agentId}`);

    try {
        // Generate evaluations using OpenAI
        const evaluations = await generateEvaluationsWithOpenAI({
            agentName: input.agentName,
            agentDescription: input.agentDescription,
            platform: input.platform,
        });

        console.log('✅ OpenAI evaluations generated:', evaluations);

        // Save to database
        await saveEvaluationsToDatabase(
            input.agentId,
            input.teamId,
            CLI_SYSTEM_USER_ID,
            evaluations
        );

    } catch (error) {
        console.error('❌ Failed to generate evaluations:', error);
        throw error;
    }
} 