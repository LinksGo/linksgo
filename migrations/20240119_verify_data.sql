-- Get the profile ID for monkey
SELECT id, username, full_name
FROM profiles
WHERE username = 'monkey';

-- Check links data
SELECT l.*, p.username
FROM links l
JOIN profiles p ON l.user_id = p.id
WHERE p.username = 'monkey';

-- Check appearance settings
SELECT a.*, p.username
FROM appearance_settings a
JOIN profiles p ON a.user_id = p.id
WHERE p.username = 'monkey';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'links', 'appearance_settings');

-- Check current policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('links', 'appearance_settings');
