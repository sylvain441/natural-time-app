import { createRouter, createWebHashHistory } from 'vue-router'

import DayView from '../views/DayView.vue'
import MoonsView from '../views/MoonsView.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'time', 
      component: DayView,
    },
    { 
      path: '/13moons', 
      name: 'date', 
      component: MoonsView,
    },
    { 
      path: '/about', 
      name: 'about', 
      component: About,
    },
  ]
})

export default router
