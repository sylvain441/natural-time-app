import { createRouter, createMemoryHistory } from 'vue-router'
import { useContextStore } from '../stores/contextStore'
import { version } from '../../package.json'

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

const migrateData = () => {
  console.log('Migrating data from', localStorage.getItem('appVersion'), 'to', version)
}

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('appVersion') !== version) 
    migrateData()
  else
    localStorage.setItem('appVersion', version)

  // If first launch of a PWA and location is set, redirect to the clock view
  if (!from.name && isStandalone()) {
    const contextStore = useContextStore()
    
    // Check if location is set by verifying stored coordinates
    if (contextStore.storedLatitude && contextStore.storedLongitude) {
      next({ name: 'time' })
      return
    }
  }
  
  next()
})

export { routes }
export default router