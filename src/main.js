import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import i18n from './i18n/i18n'
import longClickDirective from './directive/longclick'
import Vue3TouchEvents from "vue3-touch-events";
import { version } from '../package.json'
import { watch } from 'vue'

import { initializePWA } from './plugins/pwa'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { ViteSSG } from 'vite-ssg'

const migrateData = () => {
  // Clear both stores by removing their persisted data from localStorage
  //localStorage.removeItem('configStore')
  //localStorage.removeItem('contextStore')
  console.log('Migrating data from', localStorage.getItem('appVersion'), 'to', version)
}

export const createApp = ViteSSG(
  App, 
  {
    base: '/',
    routes: router.options.routes,
  },
  ({ app, router, initialState }) => {

    // PINIA LOGIC
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
    
    // MIGRATION LOGIC
    if (!import.meta.env.SSR) {
      router.beforeEach((to, from, next) => {
        const storedVersion = localStorage.getItem('appVersion')
        
        if (!storedVersion || storedVersion !== version) {
          migrateData()
          // Only set the version for first-time users
          // Let the PWA plugin handle version updates for existing users
          if (!storedVersion) {
            localStorage.setItem('appVersion', version)
          }
        }
        
        next()
      })
    }

    app
      .use(router)
      .use(i18n)

    // CLIENT SIDE ONLY LOGIC
    if (!import.meta.env.SSR) {
      app
        .use(Vue3TouchEvents, {rollOverFrequency: 500})
        .directive('longclick', longClickDirective({delay: 200, interval: 50}));

      // Set up watcher for locale changes
      watch(() => i18n.global.locale.value, (newLocale) => {
        if (typeof localStorage !== 'undefined' && newLocale) {
          localStorage.setItem('user-language', newLocale);
        }
      });

      // Dynamic import for Matomo
      import('./plugins/matomo').then(({ setupMatomo }) => {
        setupMatomo(app, router)
      })
      
      initializePWA()
    }

  }
)