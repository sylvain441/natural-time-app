import { createRouter, createWebHashHistory } from 'vue-router'

import DayView from '../views/DayView.vue'
import MoonsView from '../views/MoonsView.vue'
import About from '../views/About.vue'

const checkLatlngFormat = (to, from) => {
  if(to.params.latlng !== undefined && !to.params.latlng.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/))
    return false
};

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/:latlng?/:location?', 
      name: 'time', 
      component: DayView,
      beforeRouteEnter: checkLatlngFormat,
    },
    { 
      path: '/13moons/:latlng?/:location?', 
      name: 'date', 
      component: MoonsView,
      beforeRouteEnter: checkLatlngFormat,
    },
    { 
      path: '/about', 
      name: 'about', 
      component: About,
    },
  ]
})

/**
 * Prepopulate with defaults when first arrival
 */
router.beforeEach((to, from) => {
  if(!localStorage.latitude) localStorage.latitude = 42.42;
  if(!localStorage.longitude) localStorage.longitude = 0;
  if(!localStorage.location) localStorage.location = '';
  if(!localStorage.coordinatesFrom) localStorage.coordinatesFrom = 'default';
});

export default router
