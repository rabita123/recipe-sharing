/**
 * Generates an avatar URL using DiceBear API
 * @param {string} seed - The seed to generate the avatar (e.g., username or email)
 * @returns {string} The avatar URL
 */
export const getAvatarUrl = (seed) => {
  // Use DiceBear API to generate consistent avatars based on the seed
  const encodedSeed = encodeURIComponent(seed || 'anonymous')
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
} 