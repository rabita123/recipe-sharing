import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipesService } from '../services/recipes'
import { useAuth } from '../contexts/AuthContext'

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecipe()
  }, [id])

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
              onClick={() => navigate(`/edit-recipe/${id}`)}
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
          <div className="relative h-96">
            <img
              src={recipe.images[0].image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h1 className="absolute bottom-6 left-6 text-4xl font-bold text-white">
              {recipe.title}
            </h1>
          </div>
        ) : (
          <h1 className="p-6 text-4xl font-bold text-gray-900">
            {recipe.title}
          </h1>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center text-gray-600">
              <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {recipe.cooking_time} minutes
            </div>
            {recipe.diet_type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {recipe.diet_type}
              </span>
            )}
            <div className="text-gray-600">
              Posted by {recipe.users?.email}
            </div>
          </div>

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
        </div>
      </div>
    </div>
  )
}

export default RecipeDetails 