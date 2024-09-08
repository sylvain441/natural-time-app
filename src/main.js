import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import i18n from './i18n/i18n'
import longClickDirective from './directive/longclick'
import Vue3TouchEvents from "vue3-touch-events";
import OpenLayersMap from 'vue3-openlayers'
import { setupMatomo } from './plugins/matomo'
import { initializePWA } from './plugins/pwa'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
   .use(router)
   .use(i18n, {missingWarn: false, silentFallbackWarn: true})
   .use(OpenLayersMap)
   .use(Vue3TouchEvents, {rollOverFrequency: 500})
   .directive('longclick', longClickDirective({delay: 222, interval: 111}))

//setupMatomo(app, router)
initializePWA()

app.mount('#app')

// Global error handler
/* app.config.errorHandler = (err, vm, info) => {
  // Handle the error, maybe send to an error tracking service
  console.error('Unhandled error:', err, info)
} */