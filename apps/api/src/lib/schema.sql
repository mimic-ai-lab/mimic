-- Simple Team and User Schema for Mimic
-- Core tables for team-based multi-tenant architecture
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE
    teams (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            deleted_at TIMESTAMP
        WITH
            TIME ZONE
    );

-- Users table - synced from Clerk
CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        clerk_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        image_url TEXT,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            last_sign_in_at TIMESTAMP
        WITH
            TIME ZONE,
            is_active BOOLEAN DEFAULT true
    );

-- Team members - many-to-many with roles
CREATE TABLE
    team_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        team_id UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
        joined_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            UNIQUE (team_id, user_id)
    );

-- Agents table
CREATE TABLE
    agents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        team_id UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
        created_by UUID NOT NULL REFERENCES users (id),
        -- Basic info
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('chat', 'voice')),
        platform VARCHAR(100) NOT NULL, -- 'whatsapp', 'slack', 'teams', 'sms', 'email', 'websocket'
        -- Platform-specific config (JSON)
        platform_config JSONB NOT NULL DEFAULT '{}',
        -- Status
        status VARCHAR(50) DEFAULT 'draft' CHECK (
            status IN ('draft', 'active', 'paused', 'archived')
        ),
        is_active BOOLEAN DEFAULT true,
        -- Timestamps
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            deleted_at TIMESTAMP
        WITH
            TIME ZONE
    );

-- Team API keys table - for CLI authentication
CREATE TABLE
    team_api_keys (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        team_id UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        key_hash VARCHAR(255) UNIQUE NOT NULL,
        key_prefix VARCHAR(10) NOT NULL, -- First 10 chars for identification
        scope VARCHAR(50) NOT NULL DEFAULT 'full' CHECK (scope IN ('read', 'write', 'full')),
        created_by UUID NOT NULL REFERENCES users (id),
        expires_at TIMESTAMP
        WITH
            TIME ZONE,
            last_used_at TIMESTAMP
        WITH
            TIME ZONE,
            created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            is_active BOOLEAN DEFAULT true
    );

-- Basic indexes
CREATE INDEX idx_teams_slug ON teams (slug);

CREATE INDEX idx_teams_is_active ON teams (is_active);

CREATE INDEX idx_users_clerk_id ON users (clerk_id);

CREATE INDEX idx_team_members_team_id ON team_members (team_id);

CREATE INDEX idx_team_members_user_id ON team_members (user_id);

-- Agent indexes
CREATE INDEX idx_agents_team_id ON agents (team_id);

CREATE INDEX idx_agents_created_by ON agents (created_by);

CREATE INDEX idx_agents_agent_type ON agents (agent_type);

CREATE INDEX idx_agents_platform ON agents (platform);

CREATE INDEX idx_agents_status ON agents (status);

CREATE INDEX idx_agents_is_active ON agents (is_active);

-- Team API key indexes
CREATE INDEX idx_team_api_keys_team_id ON team_api_keys (team_id);

CREATE INDEX idx_team_api_keys_key_hash ON team_api_keys (key_hash);

CREATE INDEX idx_team_api_keys_key_prefix ON team_api_keys (key_prefix);

CREATE INDEX idx_team_api_keys_is_active ON team_api_keys (is_active);

CREATE INDEX idx_team_api_keys_created_by ON team_api_keys (created_by);