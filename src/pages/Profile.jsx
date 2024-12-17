import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { recipesService } from '../services/recipes'
import RecipeCard from '../components/RecipeCard'

function Profile() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalViews: 0,
    mostPopularRecipe: null
  })

  useEffect(() => {
    if (!user) return
    console.log('User in Profile:', user)
    loadUserRecipes()
  }, [user?.id])

  async function loadUserRecipes() {
    if (!user?.id) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log('Fetching recipes for user:', user.id)
      const { data: recipes, count } = await recipesService.getUserRecipes(user.id)
      
      if (!recipes || recipes.length === 0) {
        console.log('No recipes found')
        setRecipes([])
        setStats({
          totalRecipes: 0,
          totalViews: 0,
          mostPopularRecipe: null
        })
        return
      }

      console.log('Recipes loaded:', { recipes, count })
      setRecipes(recipes)
      
      // Calculate stats
      setStats({
        totalRecipes: count,
        totalViews: recipes.reduce((sum, recipe) => sum + (recipe.views || 0), 0),
        mostPopularRecipe: recipes.reduce((prev, current) => 
          (prev?.views || 0) > (current?.views || 0) ? prev : current
        , null)
      })
    } catch (error) {
      console.error('Error in loadUserRecipes:', error)
      setError(error.message)
      setRecipes([])
      setStats({
        totalRecipes: 0,
        totalViews: 0,
        mostPopularRecipe: null
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.email}
              </h1>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <Link
              to="/profile/edit"
              className="btn-primary"
            >
              Edit Profile
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Total Recipes</h3>
              <p className="mt-2 text-3xl font-semibold text-blue-900">
                {stats.totalRecipes}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Total Views</h3>
              <p className="mt-2 text-3xl font-semibold text-green-900">
                {stats.totalViews}
              </p>
            </div>
            {stats.mostPopularRecipe && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Most Popular Recipe</h3>
                <p className="mt-2 text-lg font-semibold text-purple-900 truncate">
                  {stats.mostPopularRecipe.title}
                </p>
                <p className="text-sm text-purple-800">
                  {stats.mostPopularRecipe.views || 0} views
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User's Recipes */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            My Recipes
          </h2>
          <Link
            to="/add-recipe"
            className="btn-primary"
          >
            Add New Recipe
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading recipes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No recipes yet
            </h3>
            <p className="text-gray-500 mb-4">
              Share your first recipe with the community!
            </p>
            <Link
              to="/add-recipe"
              className="btn-primary inline-flex"
            >
              Create Recipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showEditButton
                onDelete={loadUserRecipes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile 