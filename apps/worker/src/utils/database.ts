import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { Database } from '@mimic/core';
import { GeneratedPersona, GeneratedEvaluation } from './openai';

let db: Kysely<Database>;

function getDatabase(): Kysely<Database> {
    if (!db) {
        db = new Kysely<Database>({
            dialect: new PostgresDialect({
                pool: new pg.Pool({
                    connectionString: process.env.DATABASE_URL,
                    max: 10,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 2000,
                }),
            }),
        });
    }
    return db;
}

export async function savePersonaToDatabase(
    agentId: string,
    teamId: string,
    createdBy: string,
    persona: GeneratedPersona
): Promise<void> {
    try {
        const database = getDatabase();
        await database
            .insertInto('agent_personas' as any)
            .values({
                agent_id: agentId,
                team_id: teamId,
                created_by: createdBy,
                name: persona.name,
                age: persona.age,
                gender: persona.gender,
                location: persona.location,
                occupation: persona.occupation,
                tech_literacy: persona.tech_literacy,
                preferred_channel: persona.preferred_channel,
                background: persona.background,
                goals: JSON.stringify(persona.goals),
                frustrations: JSON.stringify(persona.frustrations),
                tone: persona.tone,
                typing_style: JSON.stringify(persona.typing_style),
                example_opening_message: persona.example_opening_message,
                sample_phrases: JSON.stringify(persona.sample_phrases),
                stop_conditions: JSON.stringify(persona.stop_conditions),
                simulation_tags: JSON.stringify(persona.simulation_tags),
                llm_prompt: `Generated persona for agent ${agentId}`,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            } as any)
            .execute();

        console.log(`✅ Persona saved to database for agent: ${agentId}`);
    } catch (error) {
        console.error('❌ Failed to save persona to database:', error);
        throw error;
    }
}

export async function saveEvaluationsToDatabase(
    agentId: string,
    teamId: string,
    createdBy: string,
    evaluations: GeneratedEvaluation[]
): Promise<void> {
    try {
        const database = getDatabase();

        for (const evaluation of evaluations) {
            await database
                .insertInto('agent_evaluations' as any)
                .values({
                    agent_id: agentId,
                    team_id: teamId,
                    created_by: createdBy,
                    name: evaluation.name,
                    metric: evaluation.metric,
                    description: evaluation.description,
                    method: evaluation.method,
                    pass_criteria: JSON.stringify(evaluation.pass_criteria),
                    severity: evaluation.severity,
                    notes: evaluation.notes,
                    llm_prompt: evaluation.llm_prompt,
                    regex_example: evaluation.regex_example,
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                } as any)
                .execute();
        }

        console.log(`✅ ${evaluations.length} evaluations saved to database for agent: ${agentId}`);
    } catch (error) {
        console.error('❌ Failed to save evaluations to database:', error);
        throw error;
    }
} 