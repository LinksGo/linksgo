-- Create links table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create page_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    device_type TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create appearance_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.appearance_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    theme TEXT DEFAULT 'light',
    primary_color TEXT DEFAULT '#000000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_appearance UNIQUE (user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for links
CREATE POLICY "Public links are viewable by everyone" 
ON public.links FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Users can manage their own links" 
ON public.links FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policies for page_views
CREATE POLICY "Users can view their own page views" 
ON public.page_views FOR SELECT 
TO authenticated 
USING (auth.uid() = profile_id);

CREATE POLICY "Anyone can insert page views" 
ON public.page_views FOR INSERT 
TO public 
WITH CHECK (true);

-- Create policies for appearance_settings
CREATE POLICY "Public appearance settings are viewable by everyone" 
ON public.appearance_settings FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Users can manage their own appearance settings" 
ON public.appearance_settings FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant appropriate permissions
GRANT ALL ON public.links TO postgres, service_role;
GRANT SELECT ON public.links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.links TO authenticated;

GRANT ALL ON public.page_views TO postgres, service_role;
GRANT SELECT ON public.page_views TO authenticated;
GRANT INSERT ON public.page_views TO anon, authenticated;

GRANT ALL ON public.appearance_settings TO postgres, service_role;
GRANT SELECT ON public.appearance_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.appearance_settings TO authenticated;

-- Insert some test data for the monkey profile
INSERT INTO public.links (user_id, title, url, position, is_active)
VALUES 
    ('c0468aff-297f-45ec-9c0d-5b028b3ddcc8', 'GitHub', 'https://github.com', 0, true),
    ('c0468aff-297f-45ec-9c0d-5b028b3ddcc8', 'Twitter', 'https://twitter.com', 1, true),
    ('c0468aff-297f-45ec-9c0d-5b028b3ddcc8', 'LinkedIn', 'https://linkedin.com', 2, true)
ON CONFLICT DO NOTHING;

-- Insert default appearance settings for the monkey profile
INSERT INTO public.appearance_settings (user_id, theme, primary_color)
VALUES ('c0468aff-297f-45ec-9c0d-5b028b3ddcc8', 'dark', '#00ff9f')
ON CONFLICT (user_id) DO UPDATE 
SET theme = EXCLUDED.theme, 
    primary_color = EXCLUDED.primary_color;
