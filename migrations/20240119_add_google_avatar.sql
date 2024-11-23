-- Add raw_user_meta_data column if it doesn't exist
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS raw_user_meta_data jsonb;

-- Update profiles table to ensure we have the google avatar
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS google_avatar_url TEXT;

-- Create or replace function to sync Google avatar
CREATE OR REPLACE FUNCTION public.handle_google_avatar()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the google_avatar_url in profiles
  UPDATE public.profiles
  SET google_avatar_url = (
    CASE 
      WHEN NEW.raw_user_meta_data->>'avatar_url' IS NOT NULL THEN 
        NEW.raw_user_meta_data->>'avatar_url'
      WHEN NEW.raw_user_meta_data->'user_metadata'->>'avatar_url' IS NOT NULL THEN 
        NEW.raw_user_meta_data->'user_metadata'->>'avatar_url'
      ELSE
        NULL
    END
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for Google avatar sync
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_google_avatar();

-- Check current avatar data
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.google_avatar_url,
  u.raw_user_meta_data->'avatar_url' as google_avatar,
  u.raw_user_meta_data->'user_metadata'->'avatar_url' as user_metadata_avatar
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.username = 'monkey';
