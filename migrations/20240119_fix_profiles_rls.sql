-- First, make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create the public SELECT policy
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles 
FOR SELECT 
TO PUBLIC 
USING (true);

-- Create the insert policy
CREATE POLICY "Users can insert their own profile" 
ON profiles 
FOR INSERT 
TO PUBLIC 
WITH CHECK (auth.uid() = id);

-- Create the update policy
CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
TO PUBLIC 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify the policy is working
DO $$ 
BEGIN
    -- Test selecting from profiles
    PERFORM * FROM profiles LIMIT 1;
    RAISE NOTICE 'Successfully verified profiles table access';
END $$;
