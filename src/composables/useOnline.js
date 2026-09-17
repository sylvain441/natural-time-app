import { ref, onMounted, onBeforeUnmount } from 'vue';

// Reactive navigator.onLine, SSR-safe.
//
// Optimistic on purpose: the static render and the first hydration frame
// assume the visitor is online, which is true for almost everyone. A reader
// who really is offline flips to false on mount. The other way round (starting
// at false) made online-only content pop in a frame late on every single load.
export function useOnline() {
  const isOnline = ref(true);

  let handleOnline = null;
  let handleOffline = null;

  onMounted(() => {
    isOnline.value = navigator.onLine;
    handleOnline = () => { isOnline.value = true; };
    handleOffline = () => { isOnline.value = false; };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onBeforeUnmount(() => {
    if (handleOnline) window.removeEventListener('online', handleOnline);
    if (handleOffline) window.removeEventListener('offline', handleOffline);
  });

  return isOnline;
}
