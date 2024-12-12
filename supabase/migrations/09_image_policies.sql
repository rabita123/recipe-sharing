-- Drop existing policies
DROP POLICY IF EXISTS "Images are viewable by everyone" ON images;
DROP POLICY IF EXISTS "Users can insert images for their recipes" ON images;
DROP POLICY IF EXISTS "Users can delete images for their recipes" ON images;

-- Create new policies
CREATE POLICY "allow_select_images"
ON images FOR SELECT
USING (true);

CREATE POLICY "allow_insert_images"
ON images FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "allow_delete_images"
ON images FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_id
    AND user_id = auth.uid()
  )
);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON images TO authenticated;
GRANT INSERT ON images TO authenticated;
GRANT DELETE ON images TO authenticated; 