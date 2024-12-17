import { supabase } from './supabase'
import { AuthError } from '../utils/errors'

class RatingsService {
  async getRecipeRatings(recipeId) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          users (
            email
          )
        `)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching ratings:', error)
      throw error
    }
  }

  async getUserRating(recipeId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      return data
    } catch (error) {
      console.error('Error fetching user rating:', error)
      throw error
    }
  }

  async addRating(recipeId, rating, review = '') {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { data, error } = await supabase
        .from('ratings')
        .upsert({
          recipe_id: recipeId,
          user_id: user.id,
          rating,
          review: review.trim(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding rating:', error)
      throw error
    }
  }

  async updateRating(ratingId, rating, review = '') {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { data, error } = await supabase
        .from('ratings')
        .update({
          rating,
          review: review.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', ratingId)
        .eq('user_id', user.id) // Extra safety check
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating rating:', error)
      throw error
    }
  }

  async deleteRating(ratingId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId)
        .eq('user_id', user.id) // Extra safety check

      if (error) throw error
    } catch (error) {
      console.error('Error deleting rating:', error)
      throw error
    }
  }
}

export const ratingsService = new RatingsService() 