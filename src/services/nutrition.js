import { supabase } from './supabase'

const EDAMAM_APP_ID = import.meta.env.VITE_EDAMAM_APP_ID
const EDAMAM_APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY
const EDAMAM_API_URL = 'https://api.edamam.com/api/nutrition-details'

class NutritionService {
  async calculateNutrition(ingredients, servings = 1) {
    try {
      // Ensure ingredients is an array and each item is a string
      const processedIngredients = Array.isArray(ingredients) 
        ? ingredients.map(String) 
        : typeof ingredients === 'string'
          ? ingredients.split('\n').filter(i => i.trim())
          : []

      if (processedIngredients.length === 0) {
        throw new Error('No valid ingredients provided')
      }

      const response = await fetch(`${EDAMAM_API_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingr: processedIngredients,
          yield: servings
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to calculate nutrition')
      }

      const data = await response.json()
      
      return {
        calories: data.calories / servings,
        protein: data.totalNutrients.PROCNT?.quantity / servings || 0,
        fat: data.totalNutrients.FAT?.quantity / servings || 0,
        carbs: data.totalNutrients.CHOCDF?.quantity / servings || 0,
        fiber: data.totalNutrients.FIBTG?.quantity / servings || 0,
        sugar: data.totalNutrients.SUGAR?.quantity / servings || 0
      }
    } catch (error) {
      console.error('Error calculating nutrition:', error)
      throw error
    }
  }

  async getNutritionInfo(recipeId) {
    try {
      const { data, error } = await supabase
        .from('nutrition_info')
        .select('*')
        .eq('recipe_id', recipeId)
        .maybeSingle()

      if (error) throw error
      return data // Will be null if no nutrition info exists
    } catch (error) {
      console.error('Error fetching nutrition info:', error)
      throw error
    }
  }

  async saveNutritionInfo(recipeId, nutritionData, servings) {
    try {
      const { error } = await supabase
        .from('nutrition_info')
        .upsert({
          recipe_id: recipeId,
          calories: nutritionData.calories,
          protein: nutritionData.protein,
          fat: nutritionData.fat,
          carbs: nutritionData.carbs,
          fiber: nutritionData.fiber,
          sugar: nutritionData.sugar,
          servings: servings,
          serving_size: '1 serving',
          last_updated: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error saving nutrition info:', error)
      throw error
    }
  }

  async calculateAndSaveNutrition(recipeId, ingredients, servings = 1) {
    try {
      const nutritionData = await this.calculateNutrition(ingredients, servings)
      await this.saveNutritionInfo(recipeId, nutritionData, servings)
      return nutritionData
    } catch (error) {
      console.error('Error calculating and saving nutrition:', error)
      throw error
    }
  }
}

export const nutritionService = new NutritionService() 