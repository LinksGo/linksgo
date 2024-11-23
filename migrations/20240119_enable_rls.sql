-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Links are viewable by everyone" ON links;
DROP POLICY IF EXISTS "Users can create own links" ON links;
DROP POLICY IF EXISTS "Users can delete own links" ON links;
DROP POLICY IF EXISTS "Users can update own links" ON links;

DROP POLICY IF EXISTS "Users can view own appearance settings" ON appearance_settings;
DROP POLICY IF EXISTS "Users can create own appearance settings" ON appearance_settings;
DROP POLICY IF EXISTS "Users can delete own appearance settings" ON appearance_settings;
DROP POLICY IF EXISTS "Users can update own appearance settings" ON appearance_settings;

-- Create policies for profiles table
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

-- Create policies for links table
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

-- Create policies for appearance_settings table
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

CREATE POLICY "Users can delete own appearance settings" 
ON appearance_settings FOR DELETE 
TO PUBLIC 
USING (auth.uid() = user_id);
