-- Check current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'profiles'
ORDER BY 
    ordinal_position;

-- Add missing columns if needed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS google_avatar_url TEXT;

-- Check existing data
SELECT 
    id,
    username,
    full_name,
    avatar_url,
    CASE 
        WHEN avatar_url LIKE 'https://lh3.googleusercontent.com/%' THEN avatar_url
        ELSE NULL 
    END as google_avatar_url
FROM 
    public.profiles
WHERE 
    username = 'monkey';
