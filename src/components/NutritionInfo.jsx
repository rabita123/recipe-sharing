import { useState, useEffect } from 'react'
import { nutritionService } from '../services/nutrition'
import { toast } from 'react-hot-toast'
import {
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

function NutritionInfo({ recipeId, ingredients = [], servings = 1, canUpdate = false }) {
  const [nutritionData, setNutritionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadNutritionInfo()
  }, [recipeId])

  const loadNutritionInfo = async () => {
    try {
      setLoading(true)
      const data = await nutritionService.getNutritionInfo(recipeId)
      setNutritionData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateNutrition = async () => {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      toast.error('No ingredients available to calculate nutrition')
      return
    }

    try {
      setUpdating(true)
      const data = await nutritionService.calculateAndSaveNutrition(
        recipeId,
        ingredients,
        servings
      )
      setNutritionData({
        ...data,
        servings,
        serving_size: '1 serving'
      })
      toast.success('Nutrition information updated')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        {error}
      </div>
    )
  }

  if (!nutritionData && !canUpdate) {
    return (
      <div className="text-gray-500 text-sm">
        No nutrition information available
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5 text-emerald-500" />
          <h3 className="font-medium text-gray-900">Nutrition Information</h3>
        </div>
        {canUpdate && (
          <button
            onClick={updateNutrition}
            disabled={updating}
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <ArrowPathIcon className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
            {updating ? 'Updating...' : 'Update'}
          </button>
        )}
      </div>

      {nutritionData ? (
        <>
          <div className="text-sm text-gray-500 mb-3">
            Per serving ({nutritionData.serving_size})
            {nutritionData.servings > 1 && ` • ${nutritionData.servings} servings`}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(nutritionData.calories)}
              </div>
              <div className="text-sm text-gray-500">Calories</div>
            </div>

            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(nutritionData.protein)}g
              </div>
              <div className="text-sm text-gray-500">Protein</div>
            </div>

            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(nutritionData.fat)}g
              </div>
              <div className="text-sm text-gray-500">Fat</div>
            </div>

            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(nutritionData.carbs)}g
              </div>
              <div className="text-sm text-gray-500">Carbs</div>
            </div>

            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(nutritionData.fiber)}g
              </div>
              <div className="text-sm text-gray-500">Fiber</div>
            </div>

            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(nutritionData.sugar)}g
              </div>
              <div className="text-sm text-gray-500">Sugar</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">
            Click update to calculate nutrition information
          </p>
          <button
            onClick={updateNutrition}
            disabled={updating}
            className="btn-primary"
          >
            {updating ? 'Calculating...' : 'Calculate Nutrition'}
          </button>
        </div>
      )}
    </div>
  )
}

export default NutritionInfo 