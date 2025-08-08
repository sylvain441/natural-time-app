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

// Function to generate routes for each language
const createLocalizedRoutes = (lang) => [
  { 
    path: `/${lang}/`, 
    name: getLocalizedRouteName('welcome', lang), 
    component: WelcomeView,
    meta: { locale: lang },
    beforeEnter: (to, from, next) => {
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
      const configStore = useConfigStore()
      configStore.clearNavigationState()
      // Enable tutorial mode if requested via query param
      if (to.query && (to.query.tutorial === '1' || to.query.tutorial === 1 || to.query.tutorial === true)) {
        configStore.clockTutorialMode = true
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
      const configStore = useConfigStore()
      configStore.clearNavigationState()
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