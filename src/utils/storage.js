import { supabase } from '../services/supabase'

export async function uploadRecipeImage(file, recipeId) {
  try {
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
    const fileName = `${recipeId}_${Date.now()}.${fileExt}`

    console.log('Uploading file:', { fileName, fileSize: file.size })

    // Upload file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get public URL with full path
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName)

    // Ensure the URL is absolute
    const fullUrl = publicUrl.startsWith('http') 
      ? publicUrl 
      : `${supabase.supabaseUrl}/storage/v1/object/public/recipe-images/${fileName}`

    console.log('Generated public URL:', fullUrl)
    return fullUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image: ' + error.message)
  }
}

export async function deleteRecipeImage(imagePath) {
  try {
    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([imagePath])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
} 