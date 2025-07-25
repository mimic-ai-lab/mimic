import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/agent-activities';

const { generatePersona, generateEvals } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

export interface AgentBootstrapInput {
    agentId: string;
    teamId: string;
    agentName: string;
    agentDescription: string;
    platform: string;
}

export async function agentBootstrapWF(input: AgentBootstrapInput): Promise<void> {
    console.log(`🚀 Starting agent bootstrap workflow for agent: ${input.agentId}`);

    try {
        console.log('🎭 Generating personas...');
        await generatePersona({
            agentId: input.agentId,
            teamId: input.teamId,
            agentName: input.agentName,
            agentDescription: input.agentDescription,
            platform: input.platform,
        });

        console.log('📊 Generating evaluations...');
        await generateEvals({
            agentId: input.agentId,
            teamId: input.teamId,
            agentName: input.agentName,
            agentDescription: input.agentDescription,
            platform: input.platform,
        });

        console.log(`✅ Agent bootstrap workflow completed for agent: ${input.agentId}`);
    } catch (error) {
        console.error(`❌ Agent bootstrap workflow failed for agent: ${input.agentId}`, error);
        throw error;
    }
} 