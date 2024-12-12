-- Add policies for user recipes
CREATE POLICY "Users can view their own recipes"
ON recipes
FOR SELECT
USING (
  auth.uid() = user_id
);

-- Allow users to view recipe counts
CREATE POLICY "Users can view recipe counts"
ON recipes
FOR SELECT
USING (true);

-- Update existing policies
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;
CREATE POLICY "Recipes are viewable by everyone"
ON recipes
FOR SELECT
USING (true);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_recipes_user_id_created_at
ON recipes(user_id, created_at DESC); 