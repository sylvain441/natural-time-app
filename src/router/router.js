import { createRouter, createMemoryHistory } from 'vue-router'
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
]

export { routes }

export default createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
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