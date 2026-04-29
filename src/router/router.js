import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { useContextStore } from '../stores/contextStore'
import { useConfigStore } from '../stores/configStore'
import i18n from '../i18n/i18n'
import { languageService } from '../i18n/i18n'
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, getLocalizedPath, getLocalizedRouteName } from '../i18n/config'

import WelcomeView from '../views/WelcomeView.vue'
import ClockView from '../views/ClockView.vue'
import SpiralView from '../views/SpiralView.vue'
import NotFoundView from '../views/404.vue'

const firstQueryValue = (value) => Array.isArray(value) ? value[0] : value

const parseNumberQuery = (value) => {
  const parsed = Number.parseFloat(firstQueryValue(value))
  return Number.isFinite(parsed) ? parsed : null
}

const getRouteLocation = (query = {}) => {
  const latitude = parseNumberQuery(query.lat ?? query.latitude)
  const longitude = parseNumberQuery(query.lon ?? query.lng ?? query.long ?? query.longitude)
  if (latitude == null || longitude == null) return null
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null
  return {
    latitude,
    longitude,
    location: firstQueryValue(query.location ?? query.place ?? '') || ''
  }
}

const stripRouteLocationQuery = (query = {}) => {
  const nextQuery = { ...query }
  for (const key of ['lat', 'latitude', 'lon', 'lng', 'long', 'longitude', 'location', 'place']) {
    delete nextQuery[key]
  }
  return nextQuery
}

const applyRouteLocation = (to) => {
  const contextStore = useContextStore()
  const routeLocation = getRouteLocation(to.query)
  if (routeLocation) {
    contextStore.setRouteLocation(routeLocation)
    return true
  } else {
    contextStore.clearRouteLocation()
    return false
  }
}

const acceptFirstRouteLocation = (to, next, onAccepted) => {
  const contextStore = useContextStore()
  const hasStoredLocation = contextStore.storedLatitude != null && contextStore.storedLongitude != null
  if (!contextStore.hasRouteLocation || hasStoredLocation) {
    return false
  }
  contextStore.acceptRouteLocation()
  onAccepted?.()
  next({ path: to.path, query: stripRouteLocationQuery(to.query), replace: true })
  return true
}

// Function to generate routes for each language
const createLocalizedRoutes = (lang) => [
  { 
    path: `/${lang}/`, 
    name: getLocalizedRouteName('welcome', lang), 
    component: WelcomeView,
    meta: { locale: lang },
    beforeEnter: (to, from, next) => {
      applyRouteLocation(to)
      if (acceptFirstRouteLocation(to, next)) return
      // Clear navigation state when changing routes
      const configStore = useConfigStore()
      configStore.clearNavigationState()

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
    meta: { locale: lang },
    beforeEnter: (to, from, next) => {
      const hasRouteLocation = applyRouteLocation(to)
      const configStore = useConfigStore()
      if (acceptFirstRouteLocation(to, next, () => {
        configStore.clockWelcomeMode = false
      })) return
      configStore.clearNavigationState()
      if (hasRouteLocation) {
        configStore.clockWelcomeMode = false
      }
      // Enable tutorial mode if requested via query param
      if (to.query && (to.query.tutorial === '1' || to.query.tutorial === 1 || to.query.tutorial === true)) {
        configStore.clockTutorialMode = true
      }
      if (to.query && to.query.mode === 'diy') {
        const contextStore = useContextStore()
        if (contextStore.hasRouteLocation || (contextStore.storedLatitude != null && contextStore.storedLongitude != null)) {
          configStore.clockTutorialMode = false
          configStore.clockWelcomeMode = false
          configStore.clockDiyMode = true
        } else {
          const query = { ...to.query }
          delete query.mode
          delete query.lat
          delete query.lng
          delete query.lon
          next({ path: to.path, query, replace: true })
          return
        }
      }
      next()
    }
  },
  { 
    path: `/${lang}/${getLocalizedPath('13moons', lang)}`, 
    name: getLocalizedRouteName('13moons', lang), 
    component: SpiralView,
    meta: { locale: lang },
    beforeEnter: (to, from, next) => {
      const hasRouteLocation = applyRouteLocation(to)
      const configStore = useConfigStore()
      if (acceptFirstRouteLocation(to, next, () => {
        configStore.spiralWelcomeMode = false
      })) return
      configStore.clearNavigationState()
      if (hasRouteLocation) {
        configStore.spiralWelcomeMode = false
      }
      // Enable tutorial mode if requested via query param
      if (to.query && (to.query.tutorial === '1' || to.query.tutorial === 1 || to.query.tutorial === true)) {
        configStore.spiralTutorialMode = true
      }
      next()
    }
  },
]

// Create routes for all available languages
const localizedRoutes = AVAILABLE_LANGUAGES.flatMap(createLocalizedRoutes)

const routes = [
  {
    path: '/',
    redirect: to => {
      // Use language service to detect the browser language
      const detectedLocale = languageService.getCurrentLanguage();
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
      const locale = languageService.getCurrentLanguage()
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
      const locale = languageService.getCurrentLanguage()
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
    beforeEnter: (to, from, next) => {
      applyRouteLocation(to)
      // Make sure the locale is defined for the 404 page using language service
      const locale = languageService.getCurrentLanguage();
      next();
    }
  },
]

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
})

// Navigation guard to change language based on URL
router.beforeEach((to, from, next) => {
  // Extract language from route using centralized logic
  let locale = DEFAULT_LANGUAGE;
  
  // Check if the route has a locale in meta
  if (to.meta.locale) {
    locale = to.meta.locale;
  } 
  // Otherwise, try to extract from path
  else {
    locale = languageService.getLanguageFromURL(to.path) || DEFAULT_LANGUAGE;
    // Set the meta for future reference
    if (to.matched.length && to.matched[0].meta) {
      to.matched[0].meta.locale = locale;
    }
  }
  
  // Update language using the language service
  languageService.setLanguage(locale);
  
  next();
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
