import { Link } from 'react-router-dom'
import ImageDebug from './ImageDebug'

function RecipeCard({ recipe }) {
  console.log('Recipe in card:', recipe)
  const imageUrl = recipe.images?.[0]?.image_url || null
  console.log('Image URL:', imageUrl)

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            console.error('Image load error:', e)
            console.log('Failed image URL:', imageUrl)
            e.target.onerror = null // Prevent infinite loop
            e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent('No Image')}`
          }}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-gray-600 mt-2">
          Cooking time: {recipe.cooking_time} minutes
        </p>
        {recipe.diet_type && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
            {recipe.diet_type}
          </span>
        )}
        {process.env.NODE_ENV === 'development' && (
          <ImageDebug imageUrl={imageUrl} />
        )}
      </div>
    </Link>
  )
}

export default RecipeCard 