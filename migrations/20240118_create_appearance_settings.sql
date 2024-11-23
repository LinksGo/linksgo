-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own appearance settings" ON appearance_settings;
DROP POLICY IF EXISTS "Users can update their own appearance settings" ON appearance_settings;
DROP POLICY IF EXISTS "Users can insert their own appearance settings" ON appearance_settings;
DROP POLICY IF EXISTS "Public can view appearance settings" ON appearance_settings;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_appearance_settings_updated_at ON appearance_settings;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create the appearance_settings table
CREATE TABLE IF NOT EXISTS appearance_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    light_theme VARCHAR(50) DEFAULT 'light',
    dark_theme VARCHAR(50) DEFAULT 'dark',
    current_theme VARCHAR(50) DEFAULT 'system',
    primary_color VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to automatically set updated_at on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_appearance_settings_updated_at
    BEFORE UPDATE ON appearance_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to view all appearance settings
CREATE POLICY "Public can view appearance settings"
    ON appearance_settings FOR SELECT
    TO PUBLIC
    USING (true);

-- Allow users to update their own appearance settings
CREATE POLICY "Users can update their own appearance settings"
    ON appearance_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to insert their own appearance settings
CREATE POLICY "Users can insert their own appearance settings"
    ON appearance_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);
