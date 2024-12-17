-- Create nutrition_info table
CREATE TABLE IF NOT EXISTS public.nutrition_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  calories DECIMAL(10, 2),
  protein DECIMAL(10, 2),
  fat DECIMAL(10, 2),
  carbs DECIMAL(10, 2),
  fiber DECIMAL(10, 2),
  sugar DECIMAL(10, 2),
  serving_size VARCHAR(50),
  servings INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(recipe_id)
);

-- Enable RLS
ALTER TABLE nutrition_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Nutrition info is viewable by everyone"
ON nutrition_info FOR SELECT
USING (true);

CREATE POLICY "Users can insert nutrition info for their recipes"
ON nutrition_info FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update nutrition info for their recipes"
ON nutrition_info FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_id
    AND user_id = auth.uid()
  )
);

-- Create index for better performance
CREATE INDEX idx_nutrition_recipe_id ON nutrition_info(recipe_id); 