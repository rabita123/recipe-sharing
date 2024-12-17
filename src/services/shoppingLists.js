import { supabase } from './supabase'
import { AuthError } from '../utils/errors'

class ShoppingListsService {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { data, error } = await supabase
        .from('shopping_lists')
        .select(`
          *,
          shopping_list_items (
            id,
            ingredient,
            quantity,
            checked,
            recipe_id,
            recipes (
              title
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching shopping lists:', error)
      throw error
    }
  }

  async create(name) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({ name, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating shopping list:', error)
      throw error
    }
  }

  async addItems(listId, items) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert(
          items.map(item => ({
            shopping_list_id: listId,
            recipe_id: item.recipe_id,
            ingredient: item.ingredient,
            quantity: item.quantity
          }))
        )
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding shopping list items:', error)
      throw error
    }
  }

  async updateItem(itemId, updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { data, error } = await supabase
        .from('shopping_list_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating shopping list item:', error)
      throw error
    }
  }

  async deleteList(listId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting shopping list:', error)
      throw error
    }
  }

  async deleteItem(itemId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError()

      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting shopping list item:', error)
      throw error
    }
  }
}

export const shoppingListsService = new ShoppingListsService() 