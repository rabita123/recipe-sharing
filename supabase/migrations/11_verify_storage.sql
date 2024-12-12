-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- Recreate bucket if needed
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'recipe-images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'recipe-images' );

CREATE POLICY "Authenticated users can update own objects"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'recipe-images' AND (auth.uid() = owner OR auth.uid() IN (
  SELECT user_id FROM recipes WHERE id::text = storage.foldername(name)
)));

CREATE POLICY "Authenticated users can delete own objects"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'recipe-images' AND (auth.uid() = owner OR auth.uid() IN (
  SELECT user_id FROM recipes WHERE id::text = storage.foldername(name)
)));

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated; 