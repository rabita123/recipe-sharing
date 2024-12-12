-- Add updated_at column to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Update existing rows to have updated_at equal to created_at
UPDATE recipes
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Make updated_at NOT NULL after setting initial values
ALTER TABLE recipes
ALTER COLUMN updated_at SET NOT NULL;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 