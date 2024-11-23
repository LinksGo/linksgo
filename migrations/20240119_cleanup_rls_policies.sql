-- First, drop ALL existing policies to start fresh
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename IN ('profiles', 'links', 'appearance_settings')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;

-- Simple, clear policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can manage own profile" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Simple, clear policies for links
CREATE POLICY "Public links are viewable by everyone" 
ON public.links FOR SELECT 
USING (true);

CREATE POLICY "Users can manage own links" 
ON public.links 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Simple, clear policies for appearance settings
CREATE POLICY "Public appearance settings are viewable by everyone" 
ON public.appearance_settings FOR SELECT 
USING (true);

CREATE POLICY "Users can manage own appearance settings" 
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

-- Verify data is accessible
SELECT COUNT(*) FROM profiles WHERE username = 'monkey';
SELECT COUNT(*) FROM links WHERE user_id = (SELECT id FROM profiles WHERE username = 'monkey');
SELECT COUNT(*) FROM appearance_settings WHERE user_id = (SELECT id FROM profiles WHERE username = 'monkey');
