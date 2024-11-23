-- Check existing data for monkey profile
SELECT id, username, full_name 
FROM profiles 
WHERE username = 'monkey';

-- Check links
SELECT l.*, p.username
FROM links l
JOIN profiles p ON l.user_id = p.id
WHERE p.username = 'monkey';

-- Check appearance settings
SELECT a.*, p.username
FROM appearance_settings a
JOIN profiles p ON a.user_id = p.id
WHERE p.username = 'monkey';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profiles', 'links', 'appearance_settings')
ORDER BY tablename, policyname;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON public.links;
DROP POLICY IF EXISTS "Users can manage their own links" ON public.links;

CREATE POLICY "Public links are viewable by everyone" 
ON public.links 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own links" 
ON public.links 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.links TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.appearance_settings TO anon, authenticated;

-- Verify links are accessible
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'links'
) as links_table_exists;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'links', 'appearance_settings');
