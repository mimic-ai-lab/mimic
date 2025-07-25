/**
 * Database type definitions for Kysely.
 *
 * Defines the TypeScript types for all database tables and their relationships.
 * These types are used by Kysely for type-safe database operations across the monorepo.
 */

export interface Database {
    agents: AgentsTable;
    teams: TeamsTable;
    users: UsersTable;
    team_members: TeamMembersTable;
    team_api_keys: TeamApiKeysTable;
    agent_personas: AgentPersonasTable;
    agent_evaluations: AgentEvaluationsTable;
}

export interface AgentsTable {
    id: string;
    team_id: string;
    name: string;
    description: string;
    agent_type: 'chat' | 'voice';
    platform: string;
    platform_config: Record<string, any>;
    status: 'draft' | 'active' | 'paused' | 'archived';
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface TeamsTable {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface UsersTable {
    id: string;
    clerk_id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    created_at: Date;
    updated_at: Date;
    last_sign_in_at: Date | null;
    is_active: boolean;
}

export interface TeamMembersTable {
    id: string;
    team_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface TeamApiKeysTable {
    id: string;
    team_id: string;
    name: string;
    key_hash: string;
    key_prefix: string;
    scope: 'read' | 'write' | 'full';
    created_by: string;
    expires_at: Date | null;
    last_used_at: Date | null;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}

export interface AgentPersonasTable {
    id: string;
    agent_id: string;
    team_id: string;
    created_by: string;
    name: string;
    age: number | null;
    gender: string | null;
    location: string | null;
    occupation: string | null;
    tech_literacy: 'low' | 'medium' | 'high' | null;
    preferred_channel: string | null;
    background: string | null;
    goals: string[];
    frustrations: string[];
    tone: string | null;
    typing_style: Record<string, any>;
    example_opening_message: string | null;
    sample_phrases: string[];
    stop_conditions: Record<string, any>;
    simulation_tags: string[];
    llm_prompt: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface AgentEvaluationsTable {
    id: string;
    agent_id: string;
    team_id: string;
    created_by: string;
    name: string;
    metric: string;
    description: string;
    method: string;
    pass_criteria: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
    llm_prompt: string | null;
    regex_example: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
} 