import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import RecipeCard from '../components/RecipeCard'

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    dietType: searchParams.get('diet') || '',
    page: parseInt(searchParams.get('page')) || 1
  })

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchRecipes()
  }, [filters.page])

  async function fetchRecipes() {
    try {
      setLoading(true)
      const { data, totalPages } = await recipesService.getAll({
        searchTerm: filters.searchTerm,
        dietType: filters.dietType,
        page: filters.page,
        limit: ITEMS_PER_PAGE
      })
      
      setRecipes(data)
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, page: 1 }))
    setSearchParams({
      search: filters.searchTerm,
      diet: filters.dietType,
      page: '1'
    })
    fetchRecipes()
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
    setSearchParams({
      search: filters.searchTerm,
      diet: filters.dietType,
      page: newPage.toString()
    })
  }

  return (
    <div className="page-container space-y-8">
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search recipes..."
              className="input-field"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={filters.dietType}
              onChange={(e) => setFilters(prev => ({ ...prev, dietType: e.target.value }))}
            >
              <option value="">All Diets</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten Free</option>
            </select>
          </div>
          <button type="submit" className="btn-primary whitespace-nowrap">
            Search Recipes
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-secondary-600">Loading recipes...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary-600">No recipes found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    // Show first page, last page, current page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= filters.page - 1 && page <= filters.page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded ${
                            page === filters.page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }
                    // Show ellipsis for skipped pages
                    if (
                      page === filters.page - 2 ||
                      page === filters.page + 2
                    ) {
                      return <span key={page}>...</span>
                    }
                    return null
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home 