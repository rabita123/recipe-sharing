-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
DROP TABLE IF EXISTS public.articles;
DROP TABLE IF EXISTS public.categories;

CREATE TABLE public.categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create articles table
CREATE TABLE public.articles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  image_url text,
  category_id uuid NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_category
    FOREIGN KEY(category_id) 
    REFERENCES public.categories(id)
    ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX idx_articles_category_id ON public.articles(category_id);

-- Add some initial categories
INSERT INTO public.categories (name, description, icon, color) VALUES
  ('Cooking Tips', 'Essential cooking tips for home chefs', 'LightBulbIcon', 'yellow'),
  ('Techniques', 'Advanced cooking techniques and methods', 'AcademicCapIcon', 'blue'),
  ('Kitchen Science', 'The science behind cooking', 'BeakerIcon', 'purple'),
  ('Healthy Recipes', 'Nutritious and delicious recipes', 'HeartIcon', 'pink'),
  ('Quick Meals', 'Fast and easy recipes', 'ClockIcon', 'green'),
  ('Ingredient Guides', 'Understanding ingredients', 'SparklesIcon', 'indigo'),
  ('Food Trends', 'Latest food and cooking trends', 'FireIcon', 'red');

-- Add some initial articles
INSERT INTO public.articles (title, description, content, image_url, category_id) 
SELECT 
  'Essential Kitchen Tools',
  'A comprehensive guide to must-have kitchen equipment',
  'Full article content about essential kitchen tools...',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f',
  id
FROM public.categories 
WHERE name = 'Cooking Tips';

INSERT INTO public.articles (title, description, content, image_url, category_id)
SELECT 
  'Knife Skills 101',
  'Master basic cutting techniques',
  'Full article content about knife skills...',
  'https://images.unsplash.com/photo-1591972670162-4eef3b68c687',
  id
FROM public.categories 
WHERE name = 'Techniques';

INSERT INTO public.articles (title, description, content, image_url, category_id)
SELECT 
  'Understanding Gluten Development',
  'Learn about the science of gluten in baking',
  'Full article content about gluten development...',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  id
FROM public.categories 
WHERE name = 'Kitchen Science';

INSERT INTO public.articles (title, description, content, image_url, category_id)
SELECT 
  'Meal Prep Basics',
  'Learn how to efficiently prepare meals for the week',
  'Full article content about meal prep basics...',
  'https://images.unsplash.com/photo-1544378730-8b5104b38d9f',
  id
FROM public.categories 
WHERE name = 'Quick Meals';

INSERT INTO public.articles (title, description, content, image_url, category_id)
SELECT 
  'Guide to Asian Spices',
  'Discover the essential spices used in Asian cuisine',
  'Full article content about Asian spices...',
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757',
  id
FROM public.categories 
WHERE name = 'Ingredient Guides';

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.articles
  FOR SELECT USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
DROP TRIGGER IF EXISTS on_categories_updated ON public.categories;
CREATE TRIGGER on_categories_updated
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_articles_updated ON public.articles;
CREATE TRIGGER on_articles_updated
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at(); 