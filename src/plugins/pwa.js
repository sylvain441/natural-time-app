import { registerSW } from 'virtual:pwa-register'
import { version } from '../../package.json'

/**
 * Compares two semantic version strings to determine if there's a major or minor version bump
 * @param {string} oldVersion - The old version in format x.y.z
 * @param {string} newVersion - The new version in format x.y.z
 * @returns {boolean} - True if there's a major or minor version bump
 */
function isSignificantUpdate(oldVersion, newVersion) {
  if (!oldVersion || !newVersion) return false;
  
  const oldParts = oldVersion.split('.').map(Number);
  const newParts = newVersion.split('.').map(Number);
  
  // Check for major version bump (x.y.z -> X.y.z where X > x)
  if (newParts[0] > oldParts[0]) return true;
  
  // Check for minor version bump (x.y.z -> x.Y.z where Y > y)
  if (newParts[0] === oldParts[0] && newParts[1] > oldParts[1]) return true;
  
  return false;
}

/**
 * Shows the update notification
 * @param {string} storedVersion - The previously stored version
 */
async function showUpdateNotification(storedVersion) {
  console.log(`Showing update notification for update from ${storedVersion} to ${version}`);
  
  try {
    // Dynamically import the required modules
    const { createApp } = await import('vue');
    const UpdateNotification = (await import('../components/UpdateNotification.vue')).default;
    
    // Find the notification container or create one if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container);
    }
    
    // Import the main i18n instance instead of creating a new one
    const i18n = (await import('../i18n/i18n')).default;
    
    // Create a new Vue app with the notification component
    const notificationApp = createApp(UpdateNotification, { 
      fromVersion: storedVersion 
    });
    
    // Use the main i18n instance
    notificationApp.use(i18n);
    
    // Mount the component
    const vm = notificationApp.mount(container);
    
    // Call the open method directly on the component instance
    if (typeof vm.open === 'function') {
      vm.open();
      console.log('Notification opened successfully');
    } else {
      console.error('open method not found on notification component', vm);
    }
    
    // Store the new version after showing the notification
    localStorage.setItem('appVersion', version);
    console.log(`Updated version in localStorage from ${storedVersion} to ${version}`);
  } catch (error) {
    console.error('Failed to show update notification:', error);
    // Still update the version even if notification fails
    localStorage.setItem('appVersion', version);
  }
}

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
      console.log('New content available, refreshing...');
      // Store this in sessionStorage so it persists through the refresh
      sessionStorage.setItem('pwa_update_detected', 'true');
      // Apply the update (this will refresh the page)
      updateSW(true);
    }
  });

  // Add event listener for PWA installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    localStorage.setItem('pwa_installed', 'true');
  });
  
  // Check for version changes on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const storedVersion = localStorage.getItem('appVersion');
      const wasUpdated = sessionStorage.getItem('pwa_update_detected') === 'true';
      
      console.log('Checking for updates:', { 
        storedVersion, 
        currentVersion: version, 
        wasUpdated,
        isSignificant: storedVersion ? isSignificantUpdate(storedVersion, version) : false
      });
      
      // Clear the update flag from session storage
      sessionStorage.removeItem('pwa_update_detected');
      
      // For testing purposes, always show notification if there's a significant update
      // regardless of whether it came from a PWA update
      if (storedVersion && 
          storedVersion !== version && 
          isSignificantUpdate(storedVersion, version)) {
        
        console.log('Significant version change detected, showing notification');
        showUpdateNotification(storedVersion);
      } else if (storedVersion !== version) {
        // Always update the stored version, even if we don't show a notification
        console.log(`Updating stored version from ${storedVersion} to ${version} (no notification)`);
        localStorage.setItem('appVersion', version);
      }
    }, 1000);
  });

  return updateSW;
}