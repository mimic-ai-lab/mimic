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