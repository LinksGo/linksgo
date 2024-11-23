-- Enable RLS on links table
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON public.links;
DROP POLICY IF EXISTS "Users can manage their own links" ON public.links;

-- Create policies for links table
CREATE POLICY "Public links are viewable by everyone" 
ON public.links FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Users can manage their own links" 
ON public.links FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant permissions for links table
GRANT ALL ON public.links TO postgres, service_role;
GRANT SELECT ON public.links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.links TO authenticated;

-- Enable RLS on appearance_settings table
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public appearance settings are viewable by everyone" ON public.appearance_settings;
DROP POLICY IF EXISTS "Users can manage their own appearance settings" ON public.appearance_settings;

-- Create policies for appearance_settings table
CREATE POLICY "Public appearance settings are viewable by everyone" 
ON public.appearance_settings FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Users can manage their own appearance settings" 
ON public.appearance_settings FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant permissions for appearance_settings table
GRANT ALL ON public.appearance_settings TO postgres, service_role;
GRANT SELECT ON public.appearance_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.appearance_settings TO authenticated;
