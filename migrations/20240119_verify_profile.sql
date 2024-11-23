-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Check RLS policies
SELECT *
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Verify profile exists
SELECT id, username, full_name, avatar_url, bio
FROM profiles
WHERE username = 'monkey';

-- Check table permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name = 'profiles';
