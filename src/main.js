import { createApp } from 'vue'
import router from './router/router'
import i18n from './i18n/i18n'
import longClickDirective from './directive/longclick'
import Vue3TouchEvents from "vue3-touch-events";
import OpenLayersMap from 'vue3-openlayers'

import App from './App.vue'

createApp(App)
    .use(router)
    .use(i18n, {missingWarn: false, silentFallbackWarn: true})
    .use(OpenLayersMap)
    .use(Vue3TouchEvents, {rollOverFrequency: 500})
    .directive('longclick', longClickDirective({delay: 222, interval: 111}))
    .mount('#app');


import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {
    //alert('This app works offline now');
  },
});