import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { useContextStore } from '../stores/contextStore'

import WelcomeView from '../views/WelcomeView.vue'
import ClockView from '../views/ClockView.vue'
import SpiralView from '../views/SpiralView.vue'
import NotFoundView from '../views/404.vue'

const routes = [
  {
    path: '/',
    redirect: '/fr/',
    name: 'home',
  },
  { 
    path: '/fr/', 
    name: 'welcome', 
    component: WelcomeView,
  },
  { 
    path: '/fr/horloge-temps-naturel', 
    name: 'time', 
    component: ClockView,
  },
  { 
    path: '/fr/spirale-13-lunes', 
    name: '13moons', 
    component: SpiralView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
  // OLD ROUTES
  { 
    path: '/:latlng?/:location?', 
    redirect: { name: 'time' }
  },
  { 
    path: '/13moons/:latlng?/:location?', 
    redirect: { name: '13moons' }
  },
  { 
    path: '/about', 
    redirect: { name: 'welcome' }
  },
  { 
    path: '/startpwa',
    name: 'startpwa',
    redirect: to => {
      const contextStore = useContextStore()
      return contextStore.storedLatitude && contextStore.storedLongitude 
        ? { name: 'time' }
        : { name: 'welcome' }
    }
  },
]

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
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