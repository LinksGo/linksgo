-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view their own links" ON links;
DROP POLICY IF EXISTS "Users can update their own links" ON links;
DROP POLICY IF EXISTS "Users can delete their own links" ON links;
DROP POLICY IF EXISTS "Users can insert their own links" ON links;
DROP POLICY IF EXISTS "Public can view links" ON links;

-- Add RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public to view all profiles
CREATE POLICY "Public can view profiles"
    ON profiles FOR SELECT
    TO PUBLIC
    USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Add RLS policies for links
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Allow public to view all active links
CREATE POLICY "Public can view links"
    ON links FOR SELECT
    TO PUBLIC
    USING (is_active = true);

-- Allow users to update their own links
CREATE POLICY "Users can update their own links"
    ON links FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own links
CREATE POLICY "Users can delete their own links"
    ON links FOR DELETE
    USING (auth.uid() = user_id);

-- Allow users to insert their own links
CREATE POLICY "Users can insert their own links"
    ON links FOR INSERT
    WITH CHECK (auth.uid() = user_id);
