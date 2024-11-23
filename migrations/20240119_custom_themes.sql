-- Add custom theme support
ALTER TABLE appearance_settings 
  DROP CONSTRAINT IF EXISTS theme_values;

-- Update theme column to support new theme options
ALTER TABLE appearance_settings 
  ADD CONSTRAINT theme_values 
    CHECK (theme IN (
      'light', 
      'dark', 
      'system', 
      'smart',
      'ajith_unstable',
      'vijay_unstable',
      'cyberpunk_unstable',
      'psychopath_unstable'
    ));

-- Add theme_data column for custom theme assets
ALTER TABLE appearance_settings
  ADD COLUMN IF NOT EXISTS theme_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS theme_version text DEFAULT '1.0';

-- Add comment to indicate unstable themes
COMMENT ON COLUMN appearance_settings.theme IS 
  'Available themes: light, dark, system, smart. Unstable themes: ajith, vijay, cyberpunk, psychopath';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_appearance_theme ON appearance_settings(theme);

-- Update existing custom themes to unstable version
UPDATE appearance_settings 
SET theme = theme || '_unstable' 
WHERE theme IN ('ajith', 'vijay', 'cyberpunk', 'psychopath');
