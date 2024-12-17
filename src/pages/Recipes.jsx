import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { recipesService } from '../services/recipes'
import RecipeCard from '../components/RecipeCard'
import { 
  FireIcon, 
  ClockIcon, 
  CakeIcon, 
  SparklesIcon, 
  HeartIcon 
} from '@heroicons/react/24/outline'

function Recipes() {
  const [searchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 12

  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  const searchTerm = searchParams.get('searchTerm')

  const categoryFilters = [
    { name: 'Popular', icon: FireIcon, value: 'popular', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700', iconColor: 'text-red-500' },
    { name: 'Quick & Easy', icon: ClockIcon, value: 'quick', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', iconColor: 'text-blue-500' },
    { name: 'Breakfast', icon: CakeIcon, value: 'breakfast', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-700', iconColor: 'text-yellow-500' },
    { name: 'Main Course', icon: SparklesIcon, value: 'main', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700', iconColor: 'text-purple-500' },
    { name: 'Desserts', icon: HeartIcon, value: 'desserts', color: 'pink', bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-700', iconColor: 'text-pink-500' }
  ]

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        const filters = {
          page,
          limit: ITEMS_PER_PAGE,
          searchTerm,
          dietType: category
        }

        if (sort === 'popular') {
          filters.orderBy = 'views'
          filters.ascending = false
        }

        const { data, totalPages } = await recipesService.getAll(filters)
        
        if (page === 1) {
          setRecipes(data || [])
        } else {
          setRecipes(prev => [...prev, ...(data || [])])
        }
        
        setHasMore(page < totalPages)
      } catch (error) {
        console.error('Error fetching recipes:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [page, category, sort, searchTerm])

  // Loading skeleton
  const RecipeSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-t-xl"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {category ? categoryFilters.find(f => f.value === category)?.name : 
           sort === 'popular' ? 'Popular Recipes' : 
           searchTerm ? 'Search Results' : 'All Recipes'}
        </h1>
        {searchTerm && (
          <p className="mt-2 text-gray-600">
            Showing results for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Category Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {categoryFilters.map((filter) => (
          <Link
            key={filter.value}
            to={`/recipes?category=${filter.value}`}
            className={`flex items-center p-4 rounded-xl border ${
              category === filter.value 
                ? `${filter.bgColor} ${filter.borderColor} ${filter.textColor}`
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            } transition-colors`}
          >
            <filter.icon className={`h-5 w-5 mr-2 ${
              category === filter.value ? filter.iconColor : ''
            }`} />
            <span className="font-medium">{filter.name}</span>
          </Link>
        ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && page === 1 ? (
          // Show loading skeletons for initial load
          [...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <RecipeSkeleton />
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-600">
            {error}
          </div>
        ) : recipes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-600">
            No recipes found
          </div>
        ) : (
          <>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </>
        )}
      </div>

      {/* Load More Button */}
      {!loading && hasMore && recipes.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading indicator for load more */}
      {loading && page > 1 && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-6 py-3 text-gray-600">
            Loading more recipes...
          </div>
        </div>
      )}
    </div>
  )
}

export default Recipes 