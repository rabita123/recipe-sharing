-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can view recipe counts" ON recipes;
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;

-- Create simplified policies
CREATE POLICY "Enable read access for all users"
ON recipes FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON recipes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
ON recipes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
ON recipes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY; 