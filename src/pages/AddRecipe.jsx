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
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-soft p-6 sm:p-8 border border-secondary-100">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Add New Recipe</h1>
          <p className="mt-2 text-secondary-600">Share your culinary creation with the community</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={255}
              className="input-field"
              placeholder="Enter your recipe title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients *</label>
            <p className="form-helper">List each ingredient on a new line</p>
            <textarea
              id="ingredients"
              name="ingredients"
              required
              rows={5}
              className="input-field font-mono text-sm"
              placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup sugar"
              value={formData.ingredients}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="steps">Cooking Instructions *</label>
            <p className="form-helper">List each step on a new line</p>
            <textarea
              id="steps"
              name="steps"
              required
              rows={6}
              className="input-field"
              placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients"
              value={formData.steps}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="cooking_time">Cooking Time (minutes) *</label>
              <input
                type="number"
                id="cooking_time"
                name="cooking_time"
                required
                min="1"
                max="1440"
                className="input-field"
                placeholder="Enter cooking time"
                value={formData.cooking_time}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="diet_type">Diet Type</label>
              <select
                id="diet_type"
                name="diet_type"
                className="input-field"
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

          <div className="form-group">
            <label>Recipe Image</label>
            <p className="form-helper">Add a photo of your finished dish</p>
            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={imagePreview}
              onRemove={handleImageRemove}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-100">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Recipe...
                </span>
              ) : (
                'Create Recipe'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRecipe 