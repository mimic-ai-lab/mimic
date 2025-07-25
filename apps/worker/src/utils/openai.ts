import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface PersonaGenerationInput {
    agentName: string;
    agentDescription: string;
    platform: string;
}

// Zod schema for structured output
const PersonaSchema = z.object({
    name: z.string(),
    age: z.number().min(0).max(120),
    gender: z.string(),
    location: z.string(),
    occupation: z.string(),
    tech_literacy: z.enum(['low', 'medium', 'high']),
    preferred_channel: z.string(),
    background: z.string(),
    goals: z.array(z.string()),
    frustrations: z.array(z.string()),
    tone: z.string(),
    typing_style: z.object({
        capitalisation: z.string(),
        punctuation: z.string(),
        speed: z.string(),
        emojis: z.string(),
    }),
    example_opening_message: z.string(),
    sample_phrases: z.array(z.string()),
    stop_conditions: z.object({
        max_turns: z.number(),
        timeout_minutes: z.number(),
        resolution_keywords: z.array(z.string()),
    }),
    simulation_tags: z.array(z.string()),
    llm_summary: z.string(),
});

export type GeneratedPersona = z.infer<typeof PersonaSchema>;

export async function generatePersonaWithOpenAI(input: PersonaGenerationInput): Promise<GeneratedPersona> {
    const systemPrompt = `You are an expert at creating realistic customer personas for AI agents. 

Create a detailed persona for a customer who would interact with an AI agent. The persona should be realistic and representative of actual customers who would use this type of service.

The persona should include:
- Realistic demographic information (name, age, gender, location, occupation)
- Appropriate tech literacy level for the platform
- Realistic background and situation
- Clear goals and frustrations
- Natural communication style and tone
- Realistic typing patterns and emoji usage
- Sample phrases they might use
- Appropriate stop conditions for the conversation
- A summary of the persona for the agent to use in the conversation based on the generated persona`;

    try {
        const completion = await openai.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {
                    role: "developer",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `Generate a persona for an AI agent named "${input.agentName}" that handles ${input.agentDescription} via ${input.platform}.`
                }
            ],
            response_format: zodResponseFormat(PersonaSchema, "persona"),
            temperature: 0.7,
            max_tokens: 2000,
        });

        const persona = completion.choices[0].message.parsed;
        if (!persona) {
            throw new Error('No parsed persona received from OpenAI');
        }
        return persona;
    } catch (error) {
        console.error('Error generating persona with OpenAI:', error);
        throw new Error(`Failed to generate persona: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export interface EvaluationGenerationInput {
    agentName: string;
    agentDescription: string;
    platform: string;
}

// Zod schema for evaluation structured output
const EvaluationSchema = z.object({
    name: z.string(),
    metric: z.enum(['latency_ms', 'boolean', 'sentiment_score', 'accuracy_percentage', 'count']),
    description: z.string(),
    method: z.enum(['timestamp_diff', 'LLM_match', 'sentiment_analysis', 'regex_match', 'custom_script']),
    pass_criteria: z.object({
        pass: z.string().nullable(),
        warning: z.string().nullable(),
        fail: z.string().nullable(),
    }),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    notes: z.string().nullable(),
    llm_prompt: z.string().nullable(),
    regex_example: z.string().nullable(),
});

// Wrap evaluations in an object for OpenAI structured output
const EvaluationsResponseSchema = z.object({
    evaluations: z.array(EvaluationSchema),
});

export type GeneratedEvaluation = z.infer<typeof EvaluationSchema>;

export async function generateEvaluationsWithOpenAI(input: EvaluationGenerationInput): Promise<GeneratedEvaluation[]> {
    const systemPrompt = `You are an expert at creating evaluation metrics for AI agents. 

Create 3-5 comprehensive evaluation metrics for an AI agent that will be used to assess its performance in customer interactions. The evaluations should be specific to the agent's purpose and platform.

Each evaluation should include:
- A clear, descriptive name
- Appropriate metric type (latency_ms, boolean, sentiment_score, accuracy_percentage, count)
- Detailed description of what it measures
- Evaluation method (timestamp_diff, LLM_match, sentiment_analysis, regex_match, custom_script)
- Pass/fail criteria with specific thresholds
- Severity level (low, medium, high, critical)
- Helpful notes about the evaluation
- LLM prompt for evaluation (if applicable)
- Regex example (if applicable)

Focus on metrics that are relevant to the agent's specific use case and platform.`;

    try {
        const completion = await openai.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {
                    role: "developer",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `Generate evaluation metrics for an AI agent named "${input.agentName}" that handles ${input.agentDescription} via ${input.platform}. Return 3-5 evaluations that would be most relevant for this specific agent.`
                }
            ],
            response_format: zodResponseFormat(EvaluationsResponseSchema, "evaluations_response"),
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0].message.parsed;
        if (!response || !response.evaluations) {
            throw new Error('No parsed evaluations received from OpenAI');
        }
        return response.evaluations;
    } catch (error) {
        console.error('Error generating evaluations with OpenAI:', error);
        throw new Error(`Failed to generate evaluations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 