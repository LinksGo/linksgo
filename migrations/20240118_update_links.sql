-- Update links table schema
ALTER TABLE links DROP COLUMN IF EXISTS expires_at;
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE links ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;
