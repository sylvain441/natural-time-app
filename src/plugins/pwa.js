import { registerSW } from 'virtual:pwa-register'

export function initializePWA() {
  const updateSW = registerSW({
    onOfflineReady() {
      console.log('This app is now available offline');
      // You can show a notification to the user here if desired
    },
    onNeedRefresh() {
      console.log('New content is available; please refresh.');
      // Prompt the user to refresh
    },
  })

  // Return the updateSW function in case it's needed elsewhere
  return updateSW;
}