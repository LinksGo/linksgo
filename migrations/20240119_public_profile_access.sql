-- Enable RLS on required tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;

-- Set up public read access for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
TO PUBLIC 
USING (true);

-- Set up public read access for links
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON links;
CREATE POLICY "Public links are viewable by everyone" 
ON links FOR SELECT 
TO PUBLIC 
USING (true);

-- Set up public read access for appearance settings
DROP POLICY IF EXISTS "Public appearance settings are viewable by everyone" ON appearance_settings;
CREATE POLICY "Public appearance settings are viewable by everyone" 
ON appearance_settings FOR SELECT 
TO PUBLIC 
USING (true);
