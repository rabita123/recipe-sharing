-- Add views column to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_recipe_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recipes
  SET views = views + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for view counting
DROP TRIGGER IF EXISTS increment_views ON recipes;
CREATE TRIGGER increment_views
  AFTER SELECT ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION increment_recipe_views(); 