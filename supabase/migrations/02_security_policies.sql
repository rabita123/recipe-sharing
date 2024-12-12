-- Enable Row Level Security on all tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies for recipes table
CREATE POLICY "Recipes are viewable by everyone" 
  ON recipes FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own recipes" 
  ON recipes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" 
  ON recipes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" 
  ON recipes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for images table
CREATE POLICY "Images are viewable by everyone" 
  ON images FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert images for their recipes" 
  ON images FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE id = recipe_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images for their recipes" 
  ON images FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE id = recipe_id AND user_id = auth.uid()
    )
  ); 