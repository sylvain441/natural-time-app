import { registerSW } from 'virtual:pwa-register'
import { version } from '../../package.json'
import { showUpdateNotification } from '@/utils/notificationManager'

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
 * Handles data migration between versions
 * @param {string} oldVersion - The old version
 * @param {string} newVersion - The new version
 */
function migrateData(oldVersion, newVersion) {
  // Clear both stores by removing their persisted data from localStorage
  // localStorage.removeItem('configStore')
  // localStorage.removeItem('contextStore')
  console.log('Migrating data from', oldVersion, 'to', newVersion);
}

/**
 * Shows the update notification
 * @param {string} storedVersion - The previously stored version
 */
async function showUpdateNotificationInternal(storedVersion) {
  console.log(`Showing update notification for update from ${storedVersion} to ${version}`);
  
  try {
    // Handle migration before showing notification
    migrateData(storedVersion, version);
    
    const i18n = (await import('../i18n/i18n')).default;
    await showUpdateNotification({ fromVersion: storedVersion }, i18n);
    
    // Store the new version after showing the notification
    localStorage.setItem('appVersion', version);
    // Updated version in localStorage
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
  
  // Function to check for version changes
  function checkVersionUpdate() {
    const storedVersion = localStorage.getItem('appVersion');
    const wasUpdated = sessionStorage.getItem('pwa_update_detected') === 'true';
    
    // Debug: checking for updates
    
    // Clear the update flag from session storage
    sessionStorage.removeItem('pwa_update_detected');
    
    // Handle version changes
    if (storedVersion && storedVersion !== version) {
      if (isSignificantUpdate(storedVersion, version)) {
        // Significant version change detected
        showUpdateNotificationInternal(storedVersion);
      } else {
        // Minor version change - just migrate and update version without notification
        // Minor version update, no notification needed
        migrateData(storedVersion, version);
        localStorage.setItem('appVersion', version);
      }
    }
  }

  // Check for version changes - use multiple triggers to ensure it runs
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkVersionUpdate);
  } else {
    // Document already loaded, run immediately
    setTimeout(checkVersionUpdate, 100);
  }
  
  // Backup: also listen for load event
  window.addEventListener('load', () => {
    setTimeout(checkVersionUpdate, 500);
  });

  // Expose function for debugging
  if (import.meta.env.DEV) {
    window.forceVersionCheck = checkVersionUpdate;
    window.debugVersion = () => {
      console.log('=== DEBUG VERSION INFO ===');
      console.log('Current version:', version);
      console.log('Stored version:', localStorage.getItem('appVersion'));
      console.log('Versions match:', localStorage.getItem('appVersion') === version);
      console.log('Is significant update:', isSignificantUpdate(localStorage.getItem('appVersion'), version));
    };
  }

  return updateSW;
}