-- Function to check RLS status
CREATE OR REPLACE FUNCTION public.check_rls_status()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
BEGIN
    result = jsonb_build_object(
        'profiles_rls_enabled', (
            SELECT rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'profiles'
        ),
        'profiles_policies', (
            SELECT jsonb_agg(jsonb_build_object(
                'policy_name', policyname,
                'roles', roles,
                'cmd', cmd,
                'permissive', permissive
            ))
            FROM pg_policies
            WHERE schemaname = 'public' 
            AND tablename = 'profiles'
        )
    );
    
    RETURN result;
END;
$$;
