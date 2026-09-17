import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import i18n from './i18n/i18n'
import { languageService, preloadLocaleAssets, ensureLocaleMessages } from './i18n/i18n'
import { DEFAULT_LANGUAGE } from './i18n/config'
import longClickDirective from './directive/longclick'
import Vue3TouchEvents from "vue3-touch-events";
import { version } from '../package.json'
import { watch } from 'vue'

import { initializePWA } from './plugins/pwa'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { ViteSSG } from 'vite-ssg'

export const createApp = ViteSSG(
  App, 
  {
    base: '/',
    routes: router.options.routes,
  },
  async ({ app, router, initialState, head }) => {

    const pinia = createPinia();
    if(!import.meta.env.SSR) {
      pinia.use(piniaPluginPersistedstate);
    }
    app.use(pinia)

    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value
      
      const routePath = router.currentRoute.value?.path || '';
      const lang = languageService.determineAndSetLanguage({
        isSSR: true,
        pathname: routePath
      });
      await ensureLocaleMessages(lang);
      await ensureLocaleMessages(DEFAULT_LANGUAGE);
      i18n.global.locale.value = lang;
      head.htmlAttrs = { lang };
      head.title = i18n.global.t('welcome.meta.title');
      head.meta = head.meta || [];
      head.meta.push({
        name: 'description',
        content: i18n.global.t('welcome.meta.description')
      });
      
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
    
    if (!import.meta.env.SSR) {
      router.beforeEach((to, from, next) => {
        const storedVersion = localStorage.getItem('appVersion')
        
        if (!storedVersion) {
          console.log('First-time user, setting initial version:', version)
          localStorage.setItem('appVersion', version)
        }
        next()
      })
    }

    app.use(i18n)

    if (!import.meta.env.SSR) {
      const initialPathLang = languageService.determineAndSetLanguage({ pathname: window.location.pathname });
      await Promise.all([
        ensureLocaleMessages(initialPathLang),
        ensureLocaleMessages(DEFAULT_LANGUAGE),
      ]);
      i18n.global.locale.value = initialPathLang;
      await preloadLocaleAssets(initialPathLang);

      app
        .use(Vue3TouchEvents, {rollOverFrequency: 500})
        .directive('longclick', longClickDirective({delay: 200, interval: 50}));

      watch(() => i18n.global.locale.value, (newLocale) => {
        if (typeof localStorage !== 'undefined' && newLocale) {
          localStorage.setItem('user-language', newLocale);
        }
        if (newLocale) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          preloadLocaleAssets(newLocale);
        }
      });

      import('./plugins/matomo').then(({ setupMatomo }) => {
        setupMatomo(app, router)
      })
      
      initializePWA()
    }

  }
)
