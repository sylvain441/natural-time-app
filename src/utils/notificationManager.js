// Simple notification manager to avoid leaking dynamically mounted apps
import { createApp } from 'vue';

// Dynamic imports to keep initial bundles small
let ModalNotificationComp = null;
let UpdateNotificationComp = null;

let modalAppInstance = null;
let modalContainer = null; // Centered overlay container

let updateAppInstance = null;
let updateContainer = null; // Top-right notification container

export async function showModalNotification({ title, message, type = 'clock' }, i18nInstance) {
  if (!ModalNotificationComp) {
    ModalNotificationComp = (await import('@/components/ModalNotification.vue')).default;
  }

  // Ensure unique container for modal
  if (!modalContainer) {
    modalContainer = document.getElementById('tutorial-notification-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'tutorial-notification-container';
      document.body.appendChild(modalContainer);
    }
  }

  // If an instance already exists, unmount it first to avoid duplicates
  if (modalAppInstance) {
    try { modalAppInstance.unmount(); } catch (_) {}
    modalAppInstance = null;
  }

  modalAppInstance = createApp(ModalNotificationComp, { title, message, type });
  if (i18nInstance) modalAppInstance.use(i18nInstance);
  const vm = modalAppInstance.mount(modalContainer);
  return vm;
}

export function hideModalNotification(removeContainer = true) {
  if (modalAppInstance) {
    try { modalAppInstance.unmount(); } catch (_) {}
    modalAppInstance = null;
  }
  if (removeContainer && modalContainer) {
    try {
      modalContainer.remove();
    } catch (_) {}
    modalContainer = null;
  }
}

export async function showUpdateNotification(props = {}, i18nInstance) {
  if (!UpdateNotificationComp) {
    UpdateNotificationComp = (await import('@/components/UpdateNotification.vue')).default;
  }

  // Try to use the container that exists in App.vue; fallback to creating one
  updateContainer = document.getElementById('notification-container');
  if (!updateContainer) {
    updateContainer = document.createElement('div');
    updateContainer.id = 'notification-container';
    document.body.appendChild(updateContainer);
  }

  if (updateAppInstance) {
    try { updateAppInstance.unmount(); } catch (_) {}
    updateAppInstance = null;
  }

  updateAppInstance = createApp(UpdateNotificationComp, props);
  if (i18nInstance) updateAppInstance.use(i18nInstance);
  const vm = updateAppInstance.mount(updateContainer);
  if (typeof vm?.open === 'function') vm.open();
  return vm;
}

export function hideUpdateNotification() {
  if (updateAppInstance) {
    try { updateAppInstance.unmount(); } catch (_) {}
    updateAppInstance = null;
  }
  // Do not remove the container; App.vue may own it
}


