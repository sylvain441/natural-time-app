import VueMatomo from 'vue-matomo'

export function setupMatomo(app, router) {
  app.use(VueMatomo, {
    host: 'https://stats.naturaltime.app/matomo',
    siteId: 1,
    router: router
  })
}