-- Add psychopath theme option
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
      'vijay_mobile_unstable'
    ));
