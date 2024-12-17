-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shopping_list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  ingredient TEXT NOT NULL,
  quantity VARCHAR(100),
  checked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists"
ON shopping_lists FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shopping lists"
ON shopping_lists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists"
ON shopping_lists FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists"
ON shopping_lists FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for shopping_list_items
CREATE POLICY "Users can view their own shopping list items"
ON shopping_list_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE id = shopping_list_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create items in their own shopping lists"
ON shopping_list_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE id = shopping_list_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update items in their own shopping lists"
ON shopping_list_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE id = shopping_list_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete items from their own shopping lists"
ON shopping_list_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE id = shopping_list_id
    AND user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX idx_shopping_list_items_list_id ON shopping_list_items(shopping_list_id);
CREATE INDEX idx_shopping_list_items_recipe_id ON shopping_list_items(recipe_id);

-- Add trigger for updated_at
CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 