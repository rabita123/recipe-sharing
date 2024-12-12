import { supabase } from './supabase'
import { uploadRecipeImage, deleteRecipeImage } from '../utils/storage'

class AuthError extends Error {
  constructor(message = 'You must be logged in to perform this action') {
    super(message)
    this.name = 'AuthError'
  }
}

export const recipesService = {
  async checkAuth() {
    const user = await supabase.auth.getUser()
    if (!user) throw new AuthError()
    return user
  },

  async create(recipeData, imageFile) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      // Verify user exists in public.users table
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (userError || !dbUser) {
        // Create user record if it doesn't exist
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString()
          }])

        if (insertError) {
          console.error('Error creating user record:', insertError)
          throw new Error('Failed to create user record')
        }
      }

      console.log('Creating recipe:', { recipeData, user })

      // Insert recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          ...recipeData,
          user_id: user.id
        }])
        .select()
        .single()

      if (recipeError) {
        console.error('Recipe creation error:', recipeError)
        throw new Error(`Failed to create recipe: ${recipeError.message}`)
      }

      // Upload image if provided
      if (imageFile) {
        try {
          console.log('Uploading image for recipe:', recipe.id)
          const imageUrl = await uploadRecipeImage(imageFile, recipe.id)
          
          // Insert image record
          const { error: imageError } = await supabase
            .from('images')
            .insert([{
              recipe_id: recipe.id,
              image_url: imageUrl
            }])

          if (imageError) {
            console.error('Image creation error:', imageError)
            // Delete uploaded file if database insert fails
            await deleteRecipeImage(`${recipe.id}/${imageFile.name}`)
            // Cleanup the recipe if image upload fails
            await this.delete(recipe.id).catch(console.error)
            throw new Error(`Failed to save image: ${imageError.message}`)
          }
        } catch (error) {
          console.error('Image upload error:', error)
          // Cleanup the recipe if image upload fails
          await this.delete(recipe.id).catch(console.error)
          throw error
        }
      }

      return recipe
    } catch (error) {
      if (error instanceof AuthError) throw error
      console.error('Error in create recipe:', error)
      throw new Error(error.message || 'Failed to create recipe')
    }
  },

  async update(id, recipeData, imageFile) {
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
        throw new Error('You do not have permission to edit this recipe')
      }

      // Update recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .update(recipeData)
        .eq('id', id)

      if (recipeError) throw recipeError

      // Handle image upload if provided
      if (imageFile) {
        const imageUrl = await uploadRecipeImage(imageFile, id)
        
        // Update or insert image
        const { error: imageError } = await supabase
          .from('images')
          .upsert([{
            recipe_id: id,
            image_url: imageUrl
          }])

        if (imageError) throw imageError
      }
    } catch (error) {
      if (error instanceof AuthError) throw error
      console.error('Error updating recipe:', error)
      throw new Error('Failed to update recipe')
    }
  },

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
  },

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

      const { data, error, count } = await query
      console.log('Fetched recipes:', data)

      // Transform data to ensure image URLs are absolute
      const transformedData = data?.map(recipe => ({
        ...recipe,
        images: recipe.images?.map(image => ({
          ...image,
          image_url: image.image_url?.startsWith('http')
            ? image.image_url
            : `${supabase.supabaseUrl}/storage/v1/object/public/recipe-images/${image.image_url}`
        }))
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
  },

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
  },

  async getUserRecipes(userId) {
    try {
      if (!userId) {
        console.error('No userId provided to getUserRecipes')
        return { data: [] }
      }

      // First verify if user exists
      const { data: userExists, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      console.log('User check result:', { userExists, userError })

      if (userError || !userExists) {
        console.error('User verification failed:', userError)
        throw new Error('User not found')
      }

      const { data, error } = await supabase
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
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Recipe query result:', { data, error })

      if (!data) {
        return { data: [] }
      }

      return { data }
    } catch (error) {
      console.error('Error fetching user recipes:', error)
      if (error.message === 'User not found') {
        return { data: [] }
      }
      throw new Error(`Failed to fetch user recipes: ${error.message}`)
    }
  },

  async updateProfile(userId, profileData) {
    try {
      const { error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating profile:', error)
      throw new Error('Failed to update profile')
    }
  }
} 