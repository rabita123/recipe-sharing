export const IMAGES = {
  MAIN_DISH: '/images/main-dish.jpg',
  SIDE_DISH: '/images/side-dish.jpg',
  BREAKFAST: '/images/breakfast.jpg',
  PLACEHOLDER: {
    RECIPE: '/images/no-image.jpg',
    GOOGLE_PLAY: '/images/google-play.png',
    APP_STORE: '/images/app-store.png',
    APP_PREVIEW: '/images/app-preview.png'
  }
}

export const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random` 