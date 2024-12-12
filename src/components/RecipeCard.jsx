import { Link } from 'react-router-dom'
import { ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

function RecipeCard({ recipe }) {
  const imageUrl = recipe.images?.[0]?.image_url || null

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Image Container */}
      <div className="aspect-w-16 aspect-h-10 bg-gray-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent('No Image')}`
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary-50">
            <span className="text-secondary-400">No image available</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-secondary-900 line-clamp-1 group-hover:text-primary-600 transition-colors duration-200">
          {recipe.title}
        </h3>

        {/* Meta Information */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center text-secondary-600">
            <ClockIcon className="h-5 w-5 mr-1.5" />
            <span className="text-sm">{recipe.cooking_time} mins</span>
          </div>
          {recipe.diet_type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {recipe.diet_type}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="mt-3 text-sm text-secondary-500">
          by {recipe.users?.email?.split('@')[0] || 'Anonymous'}
        </div>

        {/* View Details Button */}
        <Link
          to={`/recipe/${recipe.id}`}
          className="mt-4 inline-flex w-full items-center justify-center px-4 py-2 border border-transparent 
                     text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 
                     transition-colors duration-200 group-hover:shadow-md"
        >
          View Details
          <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Overlay Link for entire card */}
      <Link
        to={`/recipe/${recipe.id}`}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      />
    </div>
  )
}

export default RecipeCard 