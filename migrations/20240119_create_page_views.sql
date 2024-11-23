-- Create page_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.page_views (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_agent text,
    referrer text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON public.page_views
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow profile owner to view their page views
CREATE POLICY "Allow profile owner to view their page views" ON public.page_views
    FOR SELECT TO authenticated
    USING (profile_id IN (
        SELECT id FROM public.profiles
        WHERE id = auth.uid()
    ));

-- Grant necessary permissions
GRANT INSERT ON public.page_views TO anon;
GRANT SELECT ON public.page_views TO authenticated;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_profile_id ON public.page_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
