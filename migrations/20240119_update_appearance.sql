-- Update theme column to support new theme options
ALTER TABLE appearance_settings 
  ALTER COLUMN theme TYPE text,
  ALTER COLUMN theme SET DEFAULT 'system';

-- Add check constraint for theme values
ALTER TABLE appearance_settings 
  DROP CONSTRAINT IF EXISTS theme_values,
  ADD CONSTRAINT theme_values 
    CHECK (theme IN ('light', 'dark', 'system', 'smart'));

-- Update existing rows to use system theme
UPDATE appearance_settings 
SET theme = 'system' 
WHERE theme NOT IN ('light', 'dark', 'system', 'smart');
