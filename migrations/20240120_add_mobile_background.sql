-- Add mobile_background_url column to appearance_settings
ALTER TABLE appearance_settings 
ADD COLUMN IF NOT EXISTS mobile_background_url TEXT;

-- Update any invalid theme values to 'light' before modifying constraint
UPDATE appearance_settings 
SET theme = 'light' 
WHERE theme NOT IN (
  'light', 
  'dark', 
  'system', 
  'smart',
  'ajith',
  'vijay',
  'psychopath',
  'ajith_mobile_unstable',
  'vijay_mobile_unstable'
);

-- Add custom theme option
ALTER TABLE appearance_settings 
  DROP CONSTRAINT IF EXISTS theme_values;

ALTER TABLE appearance_settings 
  ADD CONSTRAINT theme_values 
    CHECK (theme IN (
      'light', 
      'dark', 
      'system', 
      'smart',
      'ajith',
      'vijay',
      'psychopath',
      'ajith_mobile_unstable',
      'vijay_mobile_unstable',
      'custom'
    ));
