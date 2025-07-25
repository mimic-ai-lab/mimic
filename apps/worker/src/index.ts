import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities/agent-activities';
import { agentBootstrapWF } from '@mimic/temporal-workflows';

// Export client functions for use by other packages
export { triggerAgentBootstrap, getWorkflowStatus } from './client';

async function run() {
    console.log("🚀 Starting Mimic Temporal Worker");

    // Use local server if Temporal Cloud credentials are not available
    const useLocalServer = !process.env.TEMPORAL_API_KEY;

    console.log('Environment check:');
    console.log('- useLocalServer:', useLocalServer);
    console.log('- TEMPORAL_ADDRESS:', process.env.TEMPORAL_ADDRESS);
    console.log('- TEMPORAL_NAMESPACE:', process.env.TEMPORAL_NAMESPACE);
    console.log('- TEMPORAL_API_KEY:', process.env.TEMPORAL_API_KEY ? 'Present' : 'Missing');

    // Create connection for Temporal Cloud
    const connection = await NativeConnection.connect({
        address: useLocalServer ? '127.0.0.1:7233' : process.env.TEMPORAL_ADDRESS!,
        tls: useLocalServer ? undefined : true,
        apiKey: useLocalServer ? undefined : process.env.TEMPORAL_API_KEY!,
    });

    console.log('✅ Connected to Temporal');

    try {
        const worker = await Worker.create({
            connection,
            namespace: useLocalServer ? 'default' : process.env.TEMPORAL_NAMESPACE!,
            taskQueue: 'agent-bootstrap',
            workflowsPath: require.resolve('@mimic/temporal-workflows'),
            activities,
        });

        console.log('✅ Worker ready');
        console.log('📋 Task Queue: agent-bootstrap');
        console.log('🔄 Polling for workflows...');

        await worker.run();
        console.log('✅ Worker stopped');
    } finally {
        // Close the connection once the worker has stopped
        await connection.close();
    }
}

run().catch((err) => {
    console.error('❌ Worker failed to start:', err);
    process.exit(1);
});
