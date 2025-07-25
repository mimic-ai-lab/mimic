import { Client, Connection } from '@temporalio/client';
import { agentBootstrapWF } from './workflows/agent-bootstrap';

export interface TriggerAgentBootstrapInput {
    agentId: string;
    teamId: string;
    agentName: string;
    agentDescription: string;
    platform: string;
}

export async function triggerAgentBootstrap(input: TriggerAgentBootstrapInput): Promise<string> {
    // Use local server if Temporal Cloud credentials are not available
    const useLocalServer = !process.env.TEMPORAL_API_KEY;

    console.log('useLocalServer', useLocalServer);
    console.log('TEMPORAL_ADDRESS', process.env.TEMPORAL_ADDRESS);
    console.log('TEMPORAL_API_KEY', process.env.TEMPORAL_API_KEY);
    console.log('TEMPORAL_NAMESPACE', process.env.TEMPORAL_NAMESPACE);

    const connection = await Connection.connect({
        address: useLocalServer ? '127.0.0.1:7233' : (process.env.TEMPORAL_ADDRESS || '127.0.0.1:7233'),
        tls: useLocalServer ? undefined : true,
        apiKey: useLocalServer ? undefined : process.env.TEMPORAL_API_KEY,
    });

    const client = new Client({
        connection,
        namespace: useLocalServer ? 'default' : (process.env.TEMPORAL_NAMESPACE || 'default'),
    });

    const handle = await client.workflow.start(agentBootstrapWF, {
        args: [input],
        taskQueue: 'agent-bootstrap',
        workflowId: `agent-bootstrap-${input.agentId}`,
    });

    console.log(`Started workflow ${handle.workflowId}`);
    return handle.workflowId;
}

export async function getWorkflowStatus(workflowId: string): Promise<any> {
    // Use local server if Temporal Cloud credentials are not available
    const useLocalServer = !process.env.TEMPORAL_API_KEY;

    const connection = await Connection.connect({
        address: useLocalServer ? '127.0.0.1:7233' : (process.env.TEMPORAL_ADDRESS || '127.0.0.1:7233'),
        tls: useLocalServer ? undefined : true,
        apiKey: useLocalServer ? undefined : process.env.TEMPORAL_API_KEY,
    });

    const client = new Client({
        connection,
        namespace: useLocalServer ? 'default' : (process.env.TEMPORAL_NAMESPACE || 'default'),
    });
    const handle = client.workflow.getHandle(workflowId);

    try {
        const status = await handle.describe();
        return status;
    } catch (error) {
        console.error(`Error getting workflow status for ${workflowId}:`, error);
        throw error;
    }
} 