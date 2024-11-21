import VueMatomo from 'vue-matomo'

export const setupMatomo = (app, router) => {
  // Ignore Matomo in dev mode
  if (import.meta.env.DEV) return
  
  app.use(VueMatomo, {
    host: 'https://stats.naturaltime.app/matomo',
    siteId: 1,
    router: router
  })
}