-- Migration: Create team API keys table
-- This migration adds secure storage for team API keys used by CLI
-- API keys are hashed for security and belong to teams
-- Create team API keys table
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

-- Create indexes for performance
CREATE INDEX idx_team_api_keys_team_id ON team_api_keys (team_id);

CREATE INDEX idx_team_api_keys_key_hash ON team_api_keys (key_hash);

CREATE INDEX idx_team_api_keys_key_prefix ON team_api_keys (key_prefix);

CREATE INDEX idx_team_api_keys_is_active ON team_api_keys (is_active);

CREATE INDEX idx_team_api_keys_created_by ON team_api_keys (created_by);

-- Add comments for documentation
COMMENT ON TABLE team_api_keys IS 'Secure storage for team API keys used by CLI';

COMMENT ON COLUMN team_api_keys.key_hash IS 'SHA-256 hash of the API key for secure storage';

COMMENT ON COLUMN team_api_keys.key_prefix IS 'First 10 characters of key for identification (mk_live_...)';

COMMENT ON COLUMN team_api_keys.scope IS 'Permission scope: read, write, or full access';

COMMENT ON COLUMN team_api_keys.created_by IS 'User who created this API key';

COMMENT ON COLUMN team_api_keys.expires_at IS 'Optional expiration date for the key';

COMMENT ON COLUMN team_api_keys.last_used_at IS 'Last time this key was used for authentication';