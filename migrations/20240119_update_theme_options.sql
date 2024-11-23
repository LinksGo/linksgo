-- Update theme column to support new theme options
ALTER TABLE appearance_settings 
  DROP CONSTRAINT IF EXISTS theme_values;

-- Add new theme options
ALTER TABLE appearance_settings 
  ADD CONSTRAINT theme_values 
    CHECK (theme IN (
      'light', 
      'dark', 
      'system', 
      'smart',
      'ajith',
      'vijay',
      'ajith_mobile_unstable',
      'vijay_mobile_unstable'
    ));

-- Update existing unstable themes to new format
UPDATE appearance_settings 
SET theme = 
  CASE 
    WHEN theme = 'ajith_unstable' THEN 'ajith'
    WHEN theme = 'vijay_unstable' THEN 'vijay'
    ELSE theme
  END
WHERE theme IN ('ajith_unstable', 'vijay_unstable');

-- Add comment to indicate theme status
COMMENT ON COLUMN appearance_settings.theme IS 
  'Available themes: light, dark, system, smart, ajith, vijay. Unstable themes: ajith_mobile, vijay_mobile';
