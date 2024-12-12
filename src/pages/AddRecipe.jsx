import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { recipesService } from '../services/recipes'
import ImageUpload from '../components/ImageUpload'

function AddRecipe() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    steps: '',
    diet_type: '',
    cooking_time: ''
  })
  const [imageFile, setImageFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    if (!formData.ingredients.trim()) {
      setError('Ingredients are required')
      return false
    }
    if (!formData.steps.trim()) {
      setError('Cooking steps are required')
      return false
    }
    if (!formData.cooking_time || formData.cooking_time <= 0) {
      setError('Please enter a valid cooking time')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')

      console.log('Submitting recipe:', { formData, imageFile })

      const recipeData = {
        ...formData,
        cooking_time: parseInt(formData.cooking_time),
        user_id: user.id
      }

      await recipesService.create(recipeData, imageFile)
      navigate('/')
    } catch (error) {
      console.error('Error creating recipe:', error)
      setError('Failed to create recipe: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Recipe</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Recipe Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={255}
              className="input-field mt-1"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
              Ingredients *
            </label>
            <p className="text-sm text-gray-500 mb-1">
              List each ingredient on a new line
            </p>
            <textarea
              id="ingredients"
              name="ingredients"
              required
              rows={5}
              className="input-field mt-1 font-mono"
              placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup sugar"
              value={formData.ingredients}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700">
              Cooking Instructions *
            </label>
            <p className="text-sm text-gray-500 mb-1">
              List each step on a new line
            </p>
            <textarea
              id="steps"
              name="steps"
              required
              rows={6}
              className="input-field mt-1"
              placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients"
              value={formData.steps}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cooking_time" className="block text-sm font-medium text-gray-700">
                Cooking Time (minutes) *
              </label>
              <input
                type="number"
                id="cooking_time"
                name="cooking_time"
                required
                min="1"
                max="1440"
                className="input-field mt-1"
                value={formData.cooking_time}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="diet_type" className="block text-sm font-medium text-gray-700">
                Diet Type
              </label>
              <select
                id="diet_type"
                name="diet_type"
                className="input-field mt-1"
                value={formData.diet_type}
                onChange={handleChange}
              >
                <option value="">Select Diet Type</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="gluten-free">Gluten Free</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Image
            </label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={imagePreview}
              onRemove={handleImageRemove}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating Recipe...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRecipe 