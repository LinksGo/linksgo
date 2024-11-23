-- Check table structure
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'appearance_settings'
ORDER BY 
    ordinal_position;

-- Check table constraints
SELECT
    con.conname as constraint_name,
    con.contype as constraint_type,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM
    pg_constraint con
    JOIN pg_namespace nsp ON nsp.oid = con.connamespace
    JOIN pg_class cls ON cls.oid = con.conrelid
WHERE
    cls.relname = 'appearance_settings'
    AND nsp.nspname = 'public';

-- Check current data sample
SELECT 
    user_id,
    theme,
    rounded_corners,
    show_shadow,
    glassmorphism,
    background_image,
    mobile_background_url,
    created_at,
    updated_at
FROM 
    appearance_settings
LIMIT 5;

-- Check for any NULL or invalid theme values
SELECT 
    theme,
    COUNT(*) as count
FROM 
    appearance_settings
GROUP BY 
    theme
ORDER BY 
    count DESC;

-- Check RLS policies
SELECT
    pol.polname as policy_name,
    CASE pol.polpermissive
        WHEN TRUE THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as permissive,
    CASE pol.polroles[1]
        WHEN 0 THEN 'PUBLIC'
        ELSE r.rolname
    END as role,
    pol.polcmd as command,
    pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
    pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression
FROM
    pg_policy pol
    LEFT JOIN pg_roles r ON r.oid = pol.polroles[1]
WHERE
    pol.polrelid = 'appearance_settings'::regclass;
