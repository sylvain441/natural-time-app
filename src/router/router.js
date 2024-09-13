import { createRouter, createWebHashHistory } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'
import TimeView from '../views/TimeView.vue'
import MoonsView from '../views/MoonsView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'welcome', 
      component: WelcomeView,
    },
    { 
      path: '/time', 
      name: 'time', 
      component: TimeView,
    },
    { 
      path: '/13moons', 
      name: '13moons', 
      component: MoonsView,
    },
  ]
})

export default router
