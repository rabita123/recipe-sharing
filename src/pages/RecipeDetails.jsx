import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipesService } from '../services/recipes'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { Dialog } from '@headlessui/react'
import ShoppingList from '../components/ShoppingList'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import NutritionInfo from '../components/NutritionInfo'
import ImageUpload from '../components/ImageUpload'
import RatingSection from '../components/RatingSection'

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    loadRecipe()
  }, [id])

  useEffect(() => {
    if (recipe) {
      setEditForm({
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        cooking_time: recipe.cooking_time,
        diet_type: recipe.diet_type
      })
    }
  }, [recipe])

  async function loadRecipe() {
    try {
      setLoading(true)
      const data = await recipesService.getById(id)
      setRecipe(data)
    } catch (error) {
      setError('Error loading recipe: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return

    try {
      await recipesService.delete(id)
      navigate('/')
    } catch (error) {
      setError('Error deleting recipe: ' + error.message)
    }
  }

  const handleImageSelect = (file) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      if (!editForm) {
        throw new Error('No form data available')
      }

      await recipesService.update(id, editForm, imageFile)
      const updatedRecipe = await recipesService.getById(id)
      setRecipe(updatedRecipe)
      setIsEditing(false)
      setImageFile(null)
      setImagePreview(null)
      toast.success('Recipe updated successfully!')
    } catch (error) {
      console.error('Error updating recipe:', error)
      setError(error.message || 'Failed to update recipe')
      toast.error(error.message || 'Failed to update recipe')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn-primary"
        >
          Back to Home
        </button>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900">Recipe not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn-primary"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const ingredientsList = recipe.ingredients
    .split('\n')
    .filter(ingredient => ingredient.trim())

  const stepsList = recipe.steps
    .split('\n')
    .filter(step => step.trim())

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Recipes
        </button>
        {user?.id === recipe.user_id && (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Recipe
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Recipe
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {recipe.images?.[0]?.image_url ? (
          <img
            src={recipe.images[0].image_url}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        ) : null}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {recipe.title}
            </h1>
            {user && (
              <button
                onClick={() => setIsShoppingListOpen(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                Add to Shopping List
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6 text-gray-600">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {recipe.cooking_time} minutes
            </div>
            {recipe.diet_type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {recipe.diet_type}
              </span>
            )}
          </div>

          {!isEditing ? (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Ingredients
                  </h2>
                  <ul className="space-y-2">
                    {ingredientsList.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3"></span>
                        <span className="text-gray-700">{ingredient.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Instructions
                  </h2>
                  <ol className="space-y-4">
                    {stepsList.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 pt-1">{step.trim()}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-8">
                <NutritionInfo
                  recipeId={recipe.id}
                  ingredients={ingredientsList}
                  servings={1}
                  canUpdate={user?.id === recipe.user_id}
                />
              </div>

              <div className="mt-8">
                <RatingSection recipeId={recipe.id} />
              </div>

              {user && user.id === recipe.user_id && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary"
                  >
                    Edit Recipe
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Recipe</h2>
              <form onSubmit={handleEdit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                  <p className="text-sm text-gray-500 mb-1">List each ingredient on a new line</p>
                  <textarea
                    value={editForm.ingredients}
                    onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Steps</label>
                  <p className="text-sm text-gray-500 mb-1">List each step on a new line</p>
                  <textarea
                    value={editForm.steps}
                    onChange={(e) => setEditForm({ ...editForm, steps: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cooking Time (minutes)</label>
                    <input
                      type="number"
                      value={editForm.cooking_time}
                      onChange={(e) => setEditForm({ ...editForm, cooking_time: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diet Type</label>
                    <select
                      value={editForm.diet_type}
                      onChange={(e) => setEditForm({ ...editForm, diet_type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Diet Type</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="gluten-free">Gluten Free</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      preview={imagePreview || recipe.images?.[0]?.image_url}
                      onRemove={handleImageRemove}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Shopping List Modal */}
      <Dialog
        open={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            <ShoppingList
              recipeId={recipe?.id}
              ingredients={recipe?.ingredients.split('\n').filter(i => i.trim())}
              onClose={() => setIsShoppingListOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default RecipeDetails 