import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ratingsService } from '../services/ratings'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

function RatingSection({ recipeId }) {
  const { user } = useAuth()
  const [ratings, setRatings] = useState([])
  const [userRating, setUserRating] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [review, setReview] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadRatings()
  }, [recipeId])

  const loadRatings = async () => {
    try {
      setLoading(true)
      const [ratingsData, userRatingData] = await Promise.all([
        ratingsService.getRecipeRatings(recipeId),
        user ? ratingsService.getUserRating(recipeId) : null
      ])
      
      setRatings(ratingsData || [])
      if (userRatingData) {
        setUserRating(userRatingData)
        setSelectedRating(userRatingData.rating)
        setReview(userRatingData.review || '')
      }
    } catch (error) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to rate this recipe')
      return
    }

    if (selectedRating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      if (userRating) {
        await ratingsService.updateRating(userRating.id, selectedRating, review)
      } else {
        await ratingsService.addRating(recipeId, selectedRating, review)
      }
      
      await loadRatings()
      setIsEditing(false)
      toast.success('Rating submitted successfully!')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!userRating || !window.confirm('Are you sure you want to delete your rating?')) return

    try {
      setSubmitting(true)
      await ratingsService.deleteRating(userRating.id)
      setUserRating(null)
      setSelectedRating(0)
      setReview('')
      await loadRatings()
      toast.success('Rating deleted successfully!')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({ rating, onHover, onClick, size = 'h-6 w-6' }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onHover?.(0)}
          onClick={() => onClick?.(star)}
          className={`${size} ${
            star <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          {star <= (hoverRating || rating) ? (
            <StarIcon className="w-full h-full" />
          ) : (
            <StarOutlineIcon className="w-full h-full" />
          )}
        </button>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Ratings & Reviews ({ratings.length})
        </h3>
        {user && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {userRating ? 'Edit your review' : 'Write a review'}
          </button>
        )}
      </div>

      {/* Rating Form */}
      {(isEditing || (!userRating && user)) && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating
            </label>
            <StarRating
              rating={selectedRating}
              onHover={setHoverRating}
              onClick={setSelectedRating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Share your thoughts about this recipe..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            {userRating && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setSelectedRating(userRating?.rating || 0)
                setReview(userRating?.review || '')
              }}
              disabled={submitting}
              className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || selectedRating === 0}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}

      {/* Ratings List */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to review this recipe!
          </p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StarRating rating={rating.rating} size="h-4 w-4" />
                  <span className="text-sm text-gray-600">
                    by {rating.users?.email?.split('@')[0]}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(rating.created_at).toLocaleDateString()}
                </span>
              </div>
              {rating.review && (
                <p className="text-gray-700 text-sm">{rating.review}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RatingSection 