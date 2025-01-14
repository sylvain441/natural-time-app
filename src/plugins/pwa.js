import { registerSW } from 'virtual:pwa-register'

export function initializePWA() {
  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      console.log('Service Worker registered:', swUrl);
      // Check for updates every hour
      setInterval(() => r?.update(), 60 * 60 * 1000);
    },
    onOfflineReady() {
      console.log('App is ready for offline use');
    },
    onNeedRefresh() {
      console.log('New content available, reloading...');
      updateSW(true);
    }
  });

  // Add event listener for PWA installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    localStorage.setItem('pwa_installed', 'true');
  });

  return updateSW;
}