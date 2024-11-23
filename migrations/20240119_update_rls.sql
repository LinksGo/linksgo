-- First, enable RLS on all tables if not already enabled
DO $$ 
BEGIN
    -- Enable RLS for profiles if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for links if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'links' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE links ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for appearance_settings if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'appearance_settings' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Then, verify and update policies
DO $$ 
BEGIN
    -- For profiles table
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone" 
        ON profiles FOR SELECT 
        TO PUBLIC 
        USING (true);
    END IF;

    -- For links table
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'links' 
        AND policyname = 'Links are viewable by everyone'
    ) THEN
        CREATE POLICY "Links are viewable by everyone" 
        ON links FOR SELECT 
        TO PUBLIC 
        USING (true);
    END IF;

    -- For appearance_settings table
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'appearance_settings' 
        AND policyname = 'Appearance settings are viewable by everyone'
    ) THEN
        CREATE POLICY "Appearance settings are viewable by everyone" 
        ON appearance_settings FOR SELECT 
        TO PUBLIC 
        USING (true);
    END IF;
END $$;

-- Finally, verify the policies are working by testing a simple select
DO $$ 
BEGIN
    -- Test selecting from profiles
    PERFORM * FROM profiles LIMIT 1;
    RAISE NOTICE 'Successfully verified profiles table access';

    -- Test selecting from links
    PERFORM * FROM links LIMIT 1;
    RAISE NOTICE 'Successfully verified links table access';

    -- Test selecting from appearance_settings
    PERFORM * FROM appearance_settings LIMIT 1;
    RAISE NOTICE 'Successfully verified appearance_settings table access';
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE EXCEPTION 'Policy verification failed: %', SQLERRM;
END $$;
