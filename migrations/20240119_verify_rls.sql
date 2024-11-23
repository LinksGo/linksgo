-- First, enable RLS on all tables
DO $$ 
BEGIN
    -- Enable RLS for profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on profiles table';
    END IF;
END $$;

-- Drop all existing policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create the most permissive SELECT policy first
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles 
FOR SELECT 
TO PUBLIC 
USING (true);

-- Test the policy
DO $$ 
DECLARE
    test_count integer;
BEGIN
    -- Try to select from profiles
    SELECT COUNT(*) INTO test_count FROM profiles;
    
    RAISE NOTICE 'Successfully counted % profiles', test_count;
    
    -- Try to select specific fields
    PERFORM id, username, full_name, avatar_url, bio 
    FROM profiles 
    LIMIT 1;
    
    RAISE NOTICE 'Successfully selected profile fields';
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Policy verification failed: %', SQLERRM;
END $$;

-- Output current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';
