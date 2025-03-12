import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { useContextStore } from '../stores/contextStore'
import i18n from '../i18n/i18n'
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, getLocalizedPath, getLocalizedRouteName } from '../i18n/config'

import WelcomeView from '../views/WelcomeView.vue'
import ClockView from '../views/ClockView.vue'
import SpiralView from '../views/SpiralView.vue'
import NotFoundView from '../views/404.vue'

// Function to generate routes for each language
const createLocalizedRoutes = (lang) => [
  { 
    path: `/${lang}/`, 
    name: getLocalizedRouteName('welcome', lang), 
    component: WelcomeView,
    meta: { locale: lang },
    beforeEnter: (to, from, next) => {
      // if PWA is saved with the old v1 start_url scheme, redirect to time view (or welcome view as fallback)
      if (to.fullPath.includes('utm_source=web_app_manifest')) {
        const contextStore = useContextStore()
        next(contextStore.storedLatitude && contextStore.storedLongitude 
          ? { name: getLocalizedRouteName('time', lang) }
          : { name: getLocalizedRouteName('welcome', lang) }
        )
      } else {
        next()
      }
    }
  },
  { 
    path: `/${lang}/${getLocalizedPath('time', lang)}`, 
    name: getLocalizedRouteName('time', lang), 
    component: ClockView,
    meta: { locale: lang }
  },
  { 
    path: `/${lang}/${getLocalizedPath('13moons', lang)}`, 
    name: getLocalizedRouteName('13moons', lang), 
    component: SpiralView,
    meta: { locale: lang }
  },
]

// Generate routes for all configured languages
let localizedRoutes = []
AVAILABLE_LANGUAGES.forEach(lang => {
  localizedRoutes = [...localizedRoutes, ...createLocalizedRoutes(lang)]
})

const routes = [
  {
    path: '/',
    redirect: to => {
      // Detect browser language on initial visit
      const detectedLocale = i18n.global.locale.value || DEFAULT_LANGUAGE;
      return `/${detectedLocale}/`;
    },
    name: 'home',
  },
  // Localized routes for all languages
  ...localizedRoutes,
  { 
    path: '/startpwa/', 
    name: 'startpwa',
    redirect: to => {
      const contextStore = useContextStore()
      const locale = i18n.global.locale.value || DEFAULT_LANGUAGE
      return contextStore.storedLatitude && contextStore.storedLongitude 
        ? { name: getLocalizedRouteName('time', locale) }
        : { name: getLocalizedRouteName('welcome', locale) }
    }
  },
  // OLD ROUTES
  { 
    path: '/about', 
    redirect: { name: getLocalizedRouteName('welcome', DEFAULT_LANGUAGE) }
  },
  { 
    path: '/13moons/:latlng/:location?', 
    redirect: { name: getLocalizedRouteName('13moons', DEFAULT_LANGUAGE) }
  },
  { 
    path: '/:latlng/:location?',
    beforeEnter: (to, from, next) => {
      const latlngRegex = /^[0-9.,]+$/
      const locale = i18n.global.locale.value || DEFAULT_LANGUAGE
      if (latlngRegex.test(to.params.latlng)) {
        next({ name: getLocalizedRouteName('time', locale) })
      } else {
        next({ name: 'not-found' })
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
})

// Navigation guard to change language based on URL
router.beforeEach((to, from, next) => {
  // Extract locale from route
  const locale = to.meta.locale || DEFAULT_LANGUAGE
  
  // Update i18n locale
  if (i18n.global.locale.value !== locale) {
    i18n.global.locale.value = locale
  }
  
  next()
})

// Ignore Matomo in dev mode
if (import.meta.env.PROD) {
  router.afterEach((to) => {
    // Track page view in Matomo
    window._paq?.push(['setCustomUrl', to.fullPath])
    window._paq?.push(['trackPageView'])
  })
}

export { routes }
export default router