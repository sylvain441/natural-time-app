import { createRouter, createWebHashHistory } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'
import TimeView from '../views/TimeView.vue'
import MoonsView from '../views/MoonsView.vue'
import About from '../views/About.vue'
import SettingsView from '../views/SettingsView.vue'

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
      name: 'date', 
      component: MoonsView,
    },
    { 
      path: '/about', 
      name: 'about', 
      component: About,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView
    }
  ]
})

export default router
