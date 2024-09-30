import { createRouter, createMemoryHistory } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'
import TimeView from '../views/TimeView.vue'
import MoonsView from '../views/MoonsView.vue'
import NotFoundView from '../views/404.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      redirect: '/fr/'
    },
    { 
      path: '/fr/', 
      name: 'welcome', 
      component: WelcomeView,
    },
    { 
      path: '/fr/horloge-temps-naturel', 
      name: 'time', 
      component: TimeView,
    },
    { 
      path: '/fr/spirale-13-lunes', 
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