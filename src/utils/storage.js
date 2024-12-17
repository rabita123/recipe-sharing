import { supabase } from '../services/supabase'

export async function uploadRecipeImage(file, recipeId) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    // Validate file
    if (!file) throw new Error('No file provided')
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Image size must be less than 5MB')
    }

    // Create unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${recipeId}_${Date.now()}.${fileExt}`

    console.log('Uploading file:', { fileName, fileSize: file.size })

    // Upload file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName)

    // Verify the URL is accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' })
      if (!response.ok) {
        throw new Error('Image URL is not accessible')
      }
    } catch (error) {
      console.error('URL verification failed:', error)
      throw new Error('Failed to verify image URL')
    }

    console.log('Generated public URL:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image: ' + error.message)
  }
}

export async function deleteRecipeImage(imagePath) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    // Clean up the image path
    // Remove any URL parts and get just the path after recipe-images/
    imagePath = imagePath.includes('recipe-images/') 
      ? imagePath.split('recipe-images/').pop()
      : imagePath.replace(/^\/+/, '')

    if (!imagePath) {
      throw new Error('Invalid image path')
    }

    console.log('Deleting image:', imagePath)

    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([imagePath])

    if (error) {
      console.error('Storage delete error:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image: ' + error.message)
  }
} 