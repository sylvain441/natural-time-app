import { createRouter, createWebHashHistory } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'
import TimeView from '../views/TimeView.vue'
import MoonsView from '../views/MoonsView.vue'
import NotFoundView from '../views/404.vue'

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
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    }
  ],
})

export default router
