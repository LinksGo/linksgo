-- Drop existing theme constraint
ALTER TABLE appearance_settings 
DROP CONSTRAINT IF EXISTS theme_values;

-- Add updated theme constraint with all available themes
ALTER TABLE appearance_settings 
ADD CONSTRAINT theme_values 
  CHECK (theme IN (
    'light',
    'dark',
    'valentine',
    'neon',
    'metal',
    'ajith',
    'vijay',
    'cyberpunk',
    'psychopath',
    'custom',
    'system',
    'smart'
  ));
