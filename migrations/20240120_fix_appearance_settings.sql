-- Drop old columns that are no longer used
ALTER TABLE appearance_settings 
DROP COLUMN IF EXISTS light_theme,
DROP COLUMN IF EXISTS dark_theme,
DROP COLUMN IF EXISTS current_theme,
DROP COLUMN IF EXISTS primary_color;

-- Add missing columns if they don't exist
ALTER TABLE appearance_settings 
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS rounded_corners BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_shadow BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS glassmorphism BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS background_image TEXT,
ADD COLUMN IF NOT EXISTS mobile_background_url TEXT;

-- Update theme constraint to include all current themes
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

-- Update any invalid theme values to 'light'
UPDATE appearance_settings 
SET theme = 'light' 
WHERE theme IS NULL OR theme NOT IN (
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
);
