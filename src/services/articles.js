import { supabase } from './supabase';

const ARTICLES = [
  // Cooking Tips
  {
    id: 'tip-1',
    title: 'Essential Kitchen Tools Every Home Cook Needs',
    description: 'A comprehensive guide to must-have kitchen equipment that will make your cooking journey easier and more enjoyable.',
    category: 'tips',
    imageUrl: '/images/articles/kitchen-tools.jpg'
  },
  {
    id: 'tip-2',
    title: 'Knife Skills 101: Basic Cutting Techniques',
    description: 'Master the fundamental cutting techniques that will improve your cooking efficiency and food presentation.',
    category: 'tips',
    imageUrl: '/images/articles/knife-skills.jpg'
  },
  {
    id: 'tip-3',
    title: 'Seasoning Secrets: How to Balance Flavors',
    description: 'Learn the art of seasoning and how to achieve the perfect balance of salt, acid, heat, and umami in your dishes.',
    category: 'tips',
    imageUrl: '/images/articles/seasoning.jpg'
  },

  // Techniques
  {
    id: 'tech-1',
    title: 'Mastering the Art of Sauté',
    description: 'A step-by-step guide to perfecting the sauté technique for vegetables, meats, and more.',
    category: 'techniques',
    imageUrl: '/images/articles/saute.jpg'
  },
  {
    id: 'tech-2',
    title: 'Perfect Pasta: From Boiling to Al Dente',
    description: 'Everything you need to know about cooking pasta perfectly every time, including timing, salting, and sauce pairing.',
    category: 'techniques',
    imageUrl: '/images/articles/pasta.jpg'
  },
  {
    id: 'tech-3',
    title: 'The Secret to Crispy Roasted Vegetables',
    description: 'Learn the techniques for achieving perfectly crispy roasted vegetables while maintaining their tenderness inside.',
    category: 'techniques',
    imageUrl: '/images/articles/roasted-vegetables.jpg'
  },

  // Kitchen Science
  {
    id: 'science-1',
    title: 'The Chemistry of Caramelization',
    description: 'Discover the scientific process behind caramelization and how it enhances the flavor of your dishes.',
    category: 'science',
    imageUrl: '/images/articles/caramelization.jpg'
  },
  {
    id: 'science-2',
    title: 'Understanding Gluten Development in Baking',
    description: 'A deep dive into how gluten works and its role in creating the perfect texture in bread and pastries.',
    category: 'science',
    imageUrl: '/images/articles/gluten.jpg'
  },
  {
    id: 'science-3',
    title: 'The Science of Marinades',
    description: 'Learn how different marinade ingredients affect meat texture and flavor at the molecular level.',
    category: 'science',
    imageUrl: '/images/articles/marinades.jpg'
  },

  // Healthy Recipes
  {
    id: 'healthy-1',
    title: 'Nutrient-Packed Buddha Bowls',
    description: 'Create balanced and nutritious meals with these customizable Buddha bowl recipes and guidelines.',
    category: 'healthy',
    imageUrl: '/images/articles/buddha-bowls.jpg'
  },
  {
    id: 'healthy-2',
    title: 'Protein-Rich Vegetarian Meals',
    description: 'Discover delicious vegetarian recipes that are high in protein and perfect for a balanced diet.',
    category: 'healthy',
    imageUrl: '/images/articles/vegetarian-protein.jpg'
  },
  {
    id: 'healthy-3',
    title: 'Healthy Meal Prep Guide',
    description: 'Learn how to prepare nutritious meals for the week while saving time and maintaining variety.',
    category: 'healthy',
    imageUrl: '/images/articles/meal-prep.jpg'
  },

  // Quick Meals
  {
    id: 'quick-1',
    title: '15-Minute Dinner Ideas',
    description: 'Quick and delicious recipes that you can prepare in just 15 minutes for busy weeknights.',
    category: 'quick',
    imageUrl: '/images/articles/quick-dinner.jpg'
  },
  {
    id: 'quick-2',
    title: 'One-Pan Wonder Meals',
    description: 'Effortless recipes that require just one pan, perfect for quick cooking and easy cleanup.',
    category: 'quick',
    imageUrl: '/images/articles/one-pan.jpg'
  },
  {
    id: 'quick-3',
    title: '5-Ingredient Recipes',
    description: 'Simple yet flavorful recipes that use only five ingredients or less.',
    category: 'quick',
    imageUrl: '/images/articles/five-ingredients.jpg'
  },

  // Ingredient Guides
  {
    id: 'ingredients-1',
    title: 'Guide to Asian Ingredients',
    description: 'Everything you need to know about essential Asian ingredients and how to use them in your cooking.',
    category: 'ingredients',
    imageUrl: '/images/articles/asian-ingredients.jpg'
  },
  {
    id: 'ingredients-2',
    title: 'Seasonal Produce Guide',
    description: 'A comprehensive guide to choosing and cooking with seasonal fruits and vegetables.',
    category: 'ingredients',
    imageUrl: '/images/articles/seasonal-produce.jpg'
  },
  {
    id: 'ingredients-3',
    title: 'Understanding Spices',
    description: 'Learn about different spices, their flavors, and how to use them effectively in your cooking.',
    category: 'ingredients',
    imageUrl: '/images/articles/spices.jpg'
  },

  // Food Trends
  {
    id: 'trends-1',
    title: 'Plant-Based Meat Alternatives',
    description: 'Explore the world of plant-based meat substitutes and how to cook with them.',
    category: 'trends',
    imageUrl: '/images/articles/plant-based-meat.jpg'
  },
  {
    id: 'trends-2',
    title: 'Global Food Fusion',
    description: 'Discover exciting fusion recipes that combine different culinary traditions.',
    category: 'trends',
    imageUrl: '/images/articles/fusion-food.jpg'
  },
  {
    id: 'trends-3',
    title: 'Social Media Food Trends',
    description: 'Learn to make the most popular viral recipes from social media platforms.',
    category: 'trends',
    imageUrl: '/images/articles/viral-food.jpg'
  }
];

export const getArticles = async (category = '') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (category) {
    return ARTICLES.filter(article => article.category === category);
  }
  return ARTICLES;
};

export const getArticle = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const article = ARTICLES.find(article => article.id === id);
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

export const getCategories = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'tips',
      name: 'Cooking Tips',
      description: 'Essential advice for improving your cooking skills',
      icon: 'LightBulbIcon',
      color: 'yellow'
    },
    {
      id: 'techniques',
      name: 'Techniques',
      description: 'Step-by-step guides to cooking methods',
      icon: 'AcademicCapIcon',
      color: 'blue'
    },
    {
      id: 'science',
      name: 'Kitchen Science',
      description: 'Understanding the science behind cooking',
      icon: 'BeakerIcon',
      color: 'purple'
    },
    {
      id: 'healthy',
      name: 'Healthy Recipes',
      description: 'Nutritious and balanced meal ideas',
      icon: 'HeartIcon',
      color: 'green'
    },
    {
      id: 'quick',
      name: 'Quick Meals',
      description: 'Fast and easy recipes for busy days',
      icon: 'ClockIcon',
      color: 'red'
    },
    {
      id: 'ingredients',
      name: 'Ingredient Guides',
      description: 'Detailed guides about ingredients and their uses',
      icon: 'BookOpenIcon',
      color: 'indigo'
    },
    {
      id: 'trends',
      name: 'Food Trends',
      description: 'Modern food trends and viral recipes',
      icon: 'SparklesIcon',
      color: 'pink'
    }
  ];
}; 