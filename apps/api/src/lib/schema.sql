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

-- Agent Personas table - stores generated personas for agents
CREATE TABLE
    agent_personas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        agent_id UUID NOT NULL REFERENCES agents (id) ON DELETE CASCADE,
        team_id UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
        created_by UUID NOT NULL REFERENCES users (id),
        -- Persona identification
        name VARCHAR(255) NOT NULL,
        -- Basic demographics
        age INTEGER CHECK (
            age >= 0
            AND age <= 120
        ),
        gender VARCHAR(50), -- 'male', 'female', 'non-binary', etc.
        location VARCHAR(255),
        occupation VARCHAR(255),
        tech_literacy VARCHAR(50) CHECK (tech_literacy IN ('low', 'medium', 'high')),
        preferred_channel VARCHAR(100),
        -- Detailed persona info
        background TEXT,
        goals JSONB NOT NULL DEFAULT '[]', -- Array of goal strings
        frustrations JSONB NOT NULL DEFAULT '[]', -- Array of frustration strings
        tone VARCHAR(255),
        -- Typing style preferences
        typing_style JSONB NOT NULL DEFAULT '{}', -- Object with capitalisation, punctuation, speed, emojis
        -- Example interactions
        example_opening_message TEXT,
        sample_phrases JSONB NOT NULL DEFAULT '[]', -- Array of sample phrases
        -- Simulation configuration
        stop_conditions JSONB NOT NULL DEFAULT '{}', -- Object with max_turns, timeout_minutes, resolution_keywords
        simulation_tags JSONB NOT NULL DEFAULT '[]', -- Array of tags for categorization
        -- LLM configuration
        llm_prompt TEXT, -- For LLM-based persona generation
        -- Metadata
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            -- Constraints
            UNIQUE (agent_id, id)
    );

-- Agent Evaluations table - stores generated evaluations for agents
CREATE TABLE
    agent_evaluations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        agent_id UUID NOT NULL REFERENCES agents (id) ON DELETE CASCADE,
        team_id UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
        created_by UUID NOT NULL REFERENCES users (id),
        -- Evaluation identification
        name VARCHAR(255) NOT NULL,
        metric VARCHAR(100) NOT NULL, -- 'latency_ms', 'boolean', 'sentiment_score', 'string_match', 'llm_score_0_5'
        description TEXT NOT NULL,
        method VARCHAR(100) NOT NULL, -- 'timestamp_diff', 'LLM_match', 'sentiment_analysis', 'regex_match', 'LLM_grade'
        -- Evaluation criteria
        pass_criteria JSONB NOT NULL DEFAULT '{}', -- Object with pass/warning/fail thresholds
        severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        -- Method-specific configuration
        llm_prompt TEXT, -- For LLM-based evaluations
        regex_example VARCHAR(255), -- For regex-based evaluations
        notes TEXT,
        -- Metadata
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            -- Constraints
            UNIQUE (agent_id, id)
    );

-- Indexes for performance
CREATE INDEX idx_teams_slug ON teams (slug);

CREATE INDEX idx_teams_is_active ON teams (is_active);

CREATE INDEX idx_users_clerk_id ON users (clerk_id);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_team_members_team_id ON team_members (team_id);

CREATE INDEX idx_team_members_user_id ON team_members (user_id);

CREATE INDEX idx_agents_team_id ON agents (team_id);

CREATE INDEX idx_agents_created_by ON agents (created_by);

CREATE INDEX idx_agents_agent_type ON agents (agent_type);

CREATE INDEX idx_agents_platform ON agents (platform);

CREATE INDEX idx_agents_status ON agents (status);

CREATE INDEX idx_agents_is_active ON agents (is_active);

CREATE INDEX idx_team_api_keys_team_id ON team_api_keys (team_id);

CREATE INDEX idx_team_api_keys_key_hash ON team_api_keys (key_hash);

CREATE INDEX idx_team_api_keys_key_prefix ON team_api_keys (key_prefix);

CREATE INDEX idx_team_api_keys_is_active ON team_api_keys (is_active);

CREATE INDEX idx_team_api_keys_created_by ON team_api_keys (created_by);

CREATE INDEX idx_agent_personas_agent_id ON agent_personas (agent_id);

CREATE INDEX idx_agent_personas_team_id ON agent_personas (team_id);

CREATE INDEX idx_agent_personas_created_by ON agent_personas (created_by);

CREATE INDEX idx_agent_personas_is_active ON agent_personas (is_active);

CREATE INDEX idx_agent_personas_simulation_tags ON agent_personas USING GIN (simulation_tags);

CREATE INDEX idx_agent_evaluations_agent_id ON agent_evaluations (agent_id);

CREATE INDEX idx_agent_evaluations_team_id ON agent_evaluations (team_id);

CREATE INDEX idx_agent_evaluations_created_by ON agent_evaluations (created_by);

CREATE INDEX idx_agent_evaluations_is_active ON agent_evaluations (is_active);

CREATE INDEX idx_agent_evaluations_metric ON agent_evaluations (metric);

CREATE INDEX idx_agent_evaluations_method ON agent_evaluations (method);

CREATE INDEX idx_agent_evaluations_severity ON agent_evaluations (severity);