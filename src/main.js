import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import i18n from './i18n/i18n'
import longClickDirective from './directive/longclick'
import Vue3TouchEvents from "vue3-touch-events";
import { version } from '../package.json'

import { setupMatomo } from './plugins/matomo'
import { initializePWA } from './plugins/pwa'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { ViteSSG } from 'vite-ssg'

const migrateData = () => {
  console.log('Migrating data from', localStorage.getItem('appVersion'), 'to', version)
}

export const createApp = ViteSSG(
  App, 
  {
    base: '/',
    routes: router.options.routes,
  },
  ({ app, router, initialState }) => {
    const pinia = createPinia();
    if(!import.meta.env.SSR) {
      pinia.use(piniaPluginPersistedstate);
    }
    app.use(pinia)

    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value
    } else {
      pinia.state.value = initialState.pinia || {}
    }
    
    router.beforeEach((to, from, next) => {
      const storedVersion = localStorage.getItem('appVersion')
      
      if (!storedVersion || storedVersion !== version) {
        migrateData()
        localStorage.setItem('appVersion', version)
      }
      
      next()
    })

    app
      .use(router)
      .use(i18n)

    if (!import.meta.env.SSR) {
      app
        .use(Vue3TouchEvents, {rollOverFrequency: 500})
        .directive('longclick', longClickDirective({delay: 200, interval: 50}));

      setupMatomo(app, router)
      initializePWA()
    }

  }
)