import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { recipesService } from '../services/recipes'
import RecipeCard from '../components/RecipeCard'
import { BookOpenIcon, FireIcon, ClockIcon, CakeIcon, SparklesIcon, HeartIcon, MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { IMAGES, getAvatarUrl } from '../constants/images'

function Home() {
  const navigate = useNavigate()
  const [popularRecipes, setPopularRecipes] = useState([])
  const [communityRecipes, setCommunityRecipes] = useState([])

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch popular recipes
        const popularResponse = await recipesService.getAll({ 
          orderBy: 'views',
          ascending: false,
          limit: 6
        })
        setPopularRecipes(popularResponse.data)

        // Fetch community recipes (recent with ratings)
        const communityResponse = await recipesService.getAll({ 
          orderBy: 'created_at',
          ascending: false,
          limit: 4
        })
        setCommunityRecipes(communityResponse.data)
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    }
    fetchRecipes()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const searchTerm = e.target.search.value
    navigate(`/recipes?searchTerm=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#2D5A4C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                The Easiest Way<br />
                To Make Your<br />
                Favorite Meal
              </h1>
              <p className="text-lg text-gray-200">
                Discover 1000+ recipes in your hand with the best recipe.<br />
                Help you to find the easiest way to cook.
              </p>
              <button
                onClick={() => navigate('/recipes')}
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-[#2D5A4C] bg-white hover:bg-gray-100 transition-colors"
              >
                Explore Recipes
              </button>
            </div>

            {/* Right Column - Featured Recipes */}
            <div className="relative">
              <div className="relative">
                {popularRecipes.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src={popularRecipes[0].images?.[0]?.image_url || IMAGES.PLACEHOLDER.RECIPE}
                      alt={popularRecipes[0].title}
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    {popularRecipes[1] && (
                      <img
                        src={popularRecipes[1].images?.[0]?.image_url || IMAGES.PLACEHOLDER.RECIPE}
                        alt={popularRecipes[1].title}
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                    )}
                  </div>
                )}
                
                {/* Rating Cards */}
                {popularRecipes.slice(0, 2).map((recipe, index) => (
                  <div
                    key={recipe.id}
                    className="absolute bottom-0 right-0 transform translate-y-1/2 bg-white rounded-xl shadow-lg p-4 max-w-[200px]"
                    style={{
                      right: index === 0 ? '20px' : 'auto',
                      left: index === 1 ? '20px' : 'auto'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatarUrl(recipe.users?.email?.split('@')[0] || 'Anonymous')}
                        alt={recipe.users?.email}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {recipe.users?.email?.split('@')[0] || 'Anonymous'}
                        </p>
                        <div className="flex text-yellow-400 text-xs">★★★★★</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Popular Recipes Of The Week</h2>
            <Link to="/recipes?sort=popular" className="text-emerald-600 hover:text-emerald-700">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRecipes.slice(0, 6).map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={recipe.images?.[0]?.image_url || IMAGES.PLACEHOLDER.RECIPE}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      By {recipe.users?.email?.split('@')[0] || 'Anonymous'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fresh From Community Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Fresh From Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {communityRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={getAvatarUrl(recipe.users?.email?.split('@')[0] || 'Anonymous')}
                    alt={recipe.users?.email}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {recipe.users?.email?.split('@')[0] || 'Anonymous'}
                    </p>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <img
                  src={recipe.images?.[0]?.image_url || IMAGES.PLACEHOLDER.RECIPE}
                  alt={recipe.title}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-gray-600">
                      <HeartIcon className="h-5 w-5" />
                      Like
                    </button>
                    <button className="flex items-center gap-1 text-gray-600">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Download App</h2>
              <p className="text-emerald-100">
                Download the app from App Store or Google Play for a better experience.
              </p>
              <div className="flex gap-4">
                <img src="/google-play.png" alt="Get it on Google Play" className="h-12" />
                <img src="/app-store.png" alt="Download on the App Store" className="h-12" />
              </div>
            </div>
            <div className="relative">
              <img src="/app-preview.png" alt="App Preview" className="w-full max-w-md mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#2D5A4C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Sign up for our newsletter!</h3>
              <p className="text-emerald-100">Stay updated with new recipes and features.</p>
            </div>
            <form className="flex w-full max-w-md gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 