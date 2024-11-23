-- Enable RLS on all tables that need it
ALTER TABLE customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Ensure RLS is enabled for core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DO $$ 
BEGIN
    -- Core tables
    EXECUTE 'DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Links are viewable by everyone" ON links';
    EXECUTE 'DROP POLICY IF EXISTS "Appearance settings are viewable by everyone" ON appearance_settings';
    
    -- Analytics and tracking
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can insert link clicks" ON link_clicks';
    EXECUTE 'DROP POLICY IF EXISTS "Link clicks are viewable by link owner" ON link_clicks';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views';
    EXECUTE 'DROP POLICY IF EXISTS "Page views are viewable by profile owner" ON page_views';
END $$;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
TO PUBLIC 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
TO PUBLIC 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
TO PUBLIC 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create policies for links
CREATE POLICY "Links are viewable by everyone" 
ON links FOR SELECT 
TO PUBLIC 
USING (true);

CREATE POLICY "Users can insert their own links" 
ON links FOR INSERT 
TO PUBLIC 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links" 
ON links FOR UPDATE 
TO PUBLIC 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own links" 
ON links FOR DELETE 
TO PUBLIC 
USING (auth.uid() = user_id);

-- Create policies for appearance_settings
CREATE POLICY "Appearance settings are viewable by everyone" 
ON appearance_settings FOR SELECT 
TO PUBLIC 
USING (true);

CREATE POLICY "Users can insert their own appearance settings" 
ON appearance_settings FOR INSERT 
TO PUBLIC 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appearance settings" 
ON appearance_settings FOR UPDATE 
TO PUBLIC 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policies for link_clicks
CREATE POLICY "Anyone can insert link clicks" 
ON link_clicks FOR INSERT 
TO PUBLIC 
WITH CHECK (true);

CREATE POLICY "Link clicks are viewable by link owner" 
ON link_clicks FOR SELECT 
TO PUBLIC 
USING (
    EXISTS (
        SELECT 1 FROM links 
        WHERE links.id = link_clicks.link_id 
        AND links.user_id = auth.uid()
    )
);

-- Create policies for page_views
CREATE POLICY "Anyone can insert page views" 
ON page_views FOR INSERT 
TO PUBLIC 
WITH CHECK (true);

CREATE POLICY "Page views are viewable by profile owner" 
ON page_views FOR SELECT 
TO PUBLIC 
USING (profile_id = auth.uid());

-- Create policies for user_settings
CREATE POLICY "Users can view own settings" 
ON user_settings FOR SELECT 
TO PUBLIC 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings" 
ON user_settings FOR INSERT 
TO PUBLIC 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings" 
ON user_settings FOR UPDATE 
TO PUBLIC 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create policies for analytics
CREATE POLICY "Users can view own analytics" 
ON analytics FOR SELECT 
TO PUBLIC 
USING (user_id = auth.uid());

CREATE POLICY "Users can create own analytics" 
ON analytics FOR INSERT 
TO PUBLIC 
WITH CHECK (user_id = auth.uid());

-- Create policies for customization
CREATE POLICY "Users can view their own customization" 
ON customization FOR SELECT 
TO PUBLIC 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own customization" 
ON customization FOR INSERT 
TO PUBLIC 
WITH CHECK (user_id = auth.uid());

-- Verify the policies are working
DO $$ 
BEGIN
    -- Test selecting from public tables
    PERFORM * FROM profiles LIMIT 1;
    PERFORM * FROM links LIMIT 1;
    PERFORM * FROM appearance_settings LIMIT 1;
    
    RAISE NOTICE 'Successfully verified public table access';
END $$;
