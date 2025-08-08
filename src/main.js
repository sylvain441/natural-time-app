import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import i18n from './i18n/i18n'
import { languageService, preloadLocaleAssets, ensureLocaleMessages } from './i18n/i18n'
import longClickDirective from './directive/longclick'
import Vue3TouchEvents from "vue3-touch-events";
import { version } from '../package.json'
import { watch } from 'vue'

import { initializePWA } from './plugins/pwa'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { ViteSSG } from 'vite-ssg'

// Self-hosted fonts (subset imports; WOFF2 bundled offline)
// Fonts are now loaded on-demand per locale in i18n service

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
  async ({ app, router, initialState, head }) => {

    // PINIA LOGIC
    const pinia = createPinia();
    if(!import.meta.env.SSR) {
      pinia.use(piniaPluginPersistedstate);
    }
    app.use(pinia)

    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value
      
      // Determine the language from route path for SSR using language service
      const routePath = router.currentRoute.value?.path || '';
      
      // Use language service to determine language from route path
      const lang = languageService.determineAndSetLanguage({
        isSSR: true,
        pathname: routePath
      });
      // Ensure messages are available for SSR before rendering head
      await ensureLocaleMessages(lang);
      // Set locale synchronously for SSR so components render translated strings
      i18n.global.locale.value = lang;
      
      // Set HTML attributes 
      head.htmlAttrs = { lang };
      
      // Set page metadata using i18n translations instead of hardcoded values
      // Use welcome page meta tags as default for the initial SSR
      head.title = i18n.global.t('welcome.meta.title');
      head.meta = head.meta || [];
      head.meta.push({
        name: 'description',
        content: i18n.global.t('welcome.meta.description')
      });
      
      // Add Open Graph meta tags
      head.meta.push({
        property: 'og:title',
        content: i18n.global.t('welcome.meta.title')
      });
      head.meta.push({
        property: 'og:description',
        content: i18n.global.t('welcome.meta.description')
      });
      head.meta.push({
        property: 'og:image',
        content: i18n.global.t('welcome.meta.ogImage')
      });
      head.meta.push({
        property: 'og:url',
        content: i18n.global.t('welcome.meta.ogUrl')
      });
      head.meta.push({
        property: 'og:type',
        content: 'website'
      });
      head.meta.push({
        name: 'twitter:card',
        content: 'summary_large_image'
      });
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

      // Set up watcher for locale changes (using i18n directly for backward compatibility)
      watch(() => i18n.global.locale.value, (newLocale) => {
        if (typeof localStorage !== 'undefined' && newLocale) {
          localStorage.setItem('user-language', newLocale);
        }
        // Load fonts/messages for the new locale on demand
        if (newLocale) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          preloadLocaleAssets(newLocale);
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