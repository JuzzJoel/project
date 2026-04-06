-- Migration script: Add new columns to existing users table
-- Run this after the initial setup to add new features

ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_color VARCHAR(7) DEFAULT '#3B82F6';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME;

-- Add indexes for better query performance
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_username (username);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_email (email);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_reset_token (password_reset_token);

-- Set first user as admin (optional - uncomment to use)
-- UPDATE users SET is_admin = TRUE WHERE id = 1;
