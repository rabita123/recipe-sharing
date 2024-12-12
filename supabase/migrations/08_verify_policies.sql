-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can view recipe counts" ON recipes;
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;
DROP POLICY IF EXISTS "Enable read access for all users" ON recipes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON recipes;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON recipes;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON recipes;

-- Then create new simplified policies
CREATE POLICY "allow_select" ON recipes
FOR SELECT USING (true);

CREATE POLICY "allow_insert" ON recipes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow_update" ON recipes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "allow_delete" ON recipes
FOR DELETE USING (auth.uid() = user_id);

-- Verify RLS is enabled
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON recipes TO authenticated;
GRANT INSERT ON recipes TO authenticated;
GRANT UPDATE ON recipes TO authenticated;
GRANT DELETE ON recipes TO authenticated; 