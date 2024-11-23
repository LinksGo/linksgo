-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON public.links;
DROP POLICY IF EXISTS "Users can manage their own links" ON public.links;
DROP POLICY IF EXISTS "Public appearance settings are viewable by everyone" ON public.appearance_settings;
DROP POLICY IF EXISTS "Users can manage their own appearance" ON public.appearance_settings;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Links policies
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

-- Appearance settings policies
CREATE POLICY "Public appearance settings are viewable by everyone" 
ON public.appearance_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own appearance" 
ON public.appearance_settings 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Verify policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM
    pg_policies
WHERE
    tablename IN ('profiles', 'links', 'appearance_settings')
ORDER BY
    tablename,
    policyname;
