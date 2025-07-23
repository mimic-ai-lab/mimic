-- Migration: Update email field to be NOT NULL
-- This migration ensures email is required for all users
-- First, check if there are any users without email addresses
-- If there are, we need to handle them before making the column NOT NULL
-- Update any users without email addresses to have a placeholder
-- (This should be rare since Clerk typically requires email)
UPDATE users
SET
    email = 'unknown-' || clerk_id || '@placeholder.com'
WHERE
    email IS NULL;

-- Now make the email column NOT NULL
ALTER TABLE users
ALTER COLUMN email
SET
    NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN users.email IS 'User email address - required and unique';