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
    // This is just the interface - the actual implementation will be in the worker
    throw new Error('generatePersona activity not implemented');
}

export async function generateEvals(input: GenerateEvalsInput): Promise<void> {
    // This is just the interface - the actual implementation will be in the worker
    throw new Error('generateEvals activity not implemented');
} 