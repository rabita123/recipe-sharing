import { supabase } from './supabase'
import { AuthError } from '../utils/errors'
import { uploadRecipeImage, deleteRecipeImage } from '../utils/storage'

class RecipesService {
  async create(recipeData, imageFile) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      // Add user_id to recipe data
      recipeData.user_id = user.id

      // Insert recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select()
        .single()

      if (recipeError) throw recipeError

      // Handle image upload if provided
      if (imageFile) {
        const imageUrl = await uploadRecipeImage(imageFile, recipe.id)
        
        // Insert image record
        const { error: imageError } = await supabase
          .from('images')
          .insert([{
            recipe_id: recipe.id,
            image_url: imageUrl
          }])

        if (imageError) throw imageError
      }

      return recipe
    } catch (error) {
      if (error instanceof AuthError) throw error
      console.error('Error creating recipe:', error)
      throw new Error('Failed to create recipe')
    }
  }

  // Read operations don't need auth
  async getAll(filters = {}) {
    try {
      const { page = 1, limit = 10 } = filters
      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('recipes')
        .select(`
          id,
          title,
          ingredients,
          steps,
          diet_type,
          cooking_time,
          created_at,
          user_id,
          images (
            id,
            image_url
          ),
          users!inner (
            email
          ),
          ratings!left (
            rating
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,ingredients.ilike.%${filters.searchTerm}%`)
      }

      if (filters.dietType) {
        query = query.eq('diet_type', filters.dietType)
      }

      if (filters.fiveStarOnly) {
        query = query.not('ratings', 'is', null)
          .eq('ratings.rating', 5)
      }

      const { data, error, count } = await query
      console.log('Fetched recipes:', data)

      // Transform data to ensure image URLs are absolute
      const transformedData = data?.map(recipe => ({
        ...recipe,
        images: recipe.images?.map(image => {
          if (!image?.image_url) return null;
          return {
            ...image,
            image_url: image.image_url?.startsWith('http')
              ? image.image_url
              : `${supabase.supabaseUrl}/storage/v1/object/public/recipe-images/${image.image_url}`
          }
        }).filter(Boolean)
      }))

      if (error) throw error
      return {
        data: transformedData,
        count,
        totalPages: Math.ceil(count / limit)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      throw new Error('Failed to fetch recipes')
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          users (email),
          images (image_url)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching recipe:', error)
      throw new Error('Failed to fetch recipe')
    }
  }

  async update(id, recipeData, imageFile) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      // Verify ownership and get existing recipe data
      const { data: existingRecipe } = await supabase
        .from('recipes')
        .select(`
          user_id,
          images (
            id,
            image_url
          )
        `)
        .eq('id', id)
        .single()

      if (!existingRecipe || existingRecipe.user_id !== user.id) {
        throw new Error('You do not have permission to edit this recipe')
      }

      // Update recipe data
      const { error: recipeError } = await supabase
        .from('recipes')
        .update(recipeData)
        .eq('id', id)

      if (recipeError) throw recipeError

      // Handle image update if provided
      if (imageFile) {
        try {
          // Delete existing image if any
          if (existingRecipe.images?.[0]?.image_url) {
            const existingImageUrl = existingRecipe.images[0].image_url
            // Extract the filename from the URL
            const imagePath = existingImageUrl.includes('recipe-images/') 
              ? existingImageUrl.split('recipe-images/').pop()
              : existingImageUrl.split('/').pop()

            if (imagePath) {
              try {
                await deleteRecipeImage(imagePath)
              } catch (deleteError) {
                console.warn('Failed to delete old image:', deleteError)
                // Continue with upload even if delete fails
              }
              
              // Delete the image record
              const { error: deleteError } = await supabase
                .from('images')
                .delete()
                .eq('recipe_id', id)
              
              if (deleteError) throw deleteError
            }
          }

          // Upload new image
          const imageUrl = await uploadRecipeImage(imageFile, id)
          
          // Create new image record
          const { error: imageError } = await supabase
            .from('images')
            .insert([{
              recipe_id: id,
              image_url: imageUrl
            }])

          if (imageError) throw imageError
        } catch (imageError) {
          console.error('Error handling image:', imageError)
          throw new Error('Failed to update recipe image: ' + imageError.message)
        }
      }

      // Return updated recipe with all related data
      const { data: updatedRecipe, error: fetchError } = await supabase
        .from('recipes')
        .select(`
          *,
          users (
            email
          ),
          images (
            id,
            image_url
          )
        `)
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Transform image URLs to absolute URLs if needed
      if (updatedRecipe.images?.length > 0) {
        updatedRecipe.images = updatedRecipe.images.map(image => ({
          ...image,
          image_url: image.image_url?.startsWith('http')
            ? image.image_url
            : `${supabase.supabaseUrl}/storage/v1/object/public/recipe-images/${image.image_url}`
        }))
      }

      return updatedRecipe
    } catch (error) {
      if (error instanceof AuthError) throw error
      console.error('Error updating recipe:', error)
      throw new Error('Failed to update recipe: ' + error.message)
    }
  }

  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      // Verify ownership
      const { data: existingRecipe } = await supabase
        .from('recipes')
        .select('user_id')
        .eq('id', id)
        .single()

      if (!existingRecipe || existingRecipe.user_id !== user.id) {
        throw new Error('You do not have permission to delete this recipe')
      }

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      if (error instanceof AuthError) throw error
      console.error('Error deleting recipe:', error)
      throw new Error('Failed to delete recipe')
    }
  }

  async getUserRecipes(userId, filters = {}) {
    try {
      const { page = 1, limit = 10 } = filters
      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('recipes')
        .select(`
          *,
          images (
            id,
            image_url
          ),
          users!inner (
            email
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,ingredients.ilike.%${filters.searchTerm}%`)
      }

      if (filters.dietType) {
        query = query.eq('diet_type', filters.dietType)
      }

      const { data, error, count } = await query

      if (error) throw error

      // Transform data to ensure image URLs are absolute
      const transformedData = data?.map(recipe => ({
        ...recipe,
        images: recipe.images?.map(image => {
          if (!image?.image_url) return null;
          return {
            ...image,
            image_url: image.image_url?.startsWith('http')
              ? image.image_url
              : `${supabase.supabaseUrl}/storage/v1/object/public/recipe-images/${image.image_url}`
          }
        }).filter(Boolean)
      }))

      return {
        data: transformedData,
        count,
        totalPages: Math.ceil(count / limit)
      }
    } catch (error) {
      console.error('Error fetching user recipes:', error)
      throw new Error('Failed to fetch user recipes: ' + error.message)
    }
  }
}

export const recipesService = new RecipesService() 