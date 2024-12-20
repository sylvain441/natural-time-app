import { ref, computed, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'

export const useContextStore = defineStore('context', () => {

  const storedLatitude = ref(null)
  const storedLongitude = ref(null)
  const storedLocation = ref('')

  const tempLatitude = ref(42.42)
  const tempLongitude = ref(0)
  const tempLocation = ref('')

  const geolocationLatitude = ref(null)
  const geolocationLongitude = ref(null)

  const currentTime = ref(Date.now())
  const timer = ref(null)
  const enableGeolocation = ref(false)
  const geolocationStatus = ref(null); // 'searching', 'success', 'error'

  const geolocationNotificationDismissedAt = ref(null);

  // Getters
  const latitude = computed(() => tempLatitude.value || storedLatitude.value || 42.42)
  const longitude = computed(() => tempLongitude.value || storedLongitude.value || 0)
  const location = computed(() => tempLocation.value || storedLocation.value || "")

  // Actions
  const initDone = ref(false)

  const clearLocalStorageAndReload = () => {
    if (confirm('Es-tu sûr de vouloir effacer toutes les données enregistrées ?')) {
      localStorage?.clear();
      window.location.reload();
    }
  }

  const init = () => {
    if (initDone.value) return

    timer.value = setInterval(() => currentTime.value = Date.now(), 2400);
    if (enableGeolocation.value === true) {
      getGeolocation();
    }
    tempLatitude.value = storedLatitude.value;
    tempLongitude.value = storedLongitude.value;
    tempLocation.value = storedLocation.value;

    onMounted(() => {
      window.addEventListener('keydown', (event) => {
        // CMD + K to clear localStorage
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
          clearLocalStorageAndReload();
        }
      });
    });

    initDone.value = true
  }

  watch(enableGeolocation, (newValue) => {
    if(!initDone.value)
      return;

    if (newValue){
      getGeolocation();
    }
    else {
      geolocationStatus.value = null;
    }
  })

  const saveLocation = () => {
    if (typeof tempLatitude.value === 'number' && !isNaN(tempLatitude.value)) {
      storedLatitude.value = parseFloat(Math.max(-90, Math.min(90, tempLatitude.value)))
    } else {
      console.warn('Invalid latitude value')
    }

    if (typeof tempLongitude.value === 'number' && !isNaN(tempLongitude.value)) {
      storedLongitude.value = parseFloat(Math.max(-180, Math.min(180, tempLongitude.value)))
    } else {
      console.warn('Invalid longitude value')
    }

    if (typeof tempLocation.value === 'string') {
      storedLocation.value = tempLocation.value.replace(/[<>]/g, '')
    } else {
      console.warn('Invalid location value')
    }
  }

  const resetLocation = () => {
    tempLatitude.value = storedLatitude.value
    tempLongitude.value = storedLongitude.value
    tempLocation.value = storedLocation.value
  }

  const getGeolocation = () => {
    if (navigator.geolocation) {
      geolocationStatus.value = 'searching';
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            geolocationLatitude.value = parseFloat(position.coords.latitude);
            geolocationLongitude.value = parseFloat(position.coords.longitude);
            // Set success state
            geolocationStatus.value = 'success';
          },
          (error) => {
            console.warn(error);
            geolocationLatitude.value = null;
            geolocationLongitude.value = null;
            // Differentiate error types
            switch (error.code) {
              case error.PERMISSION_DENIED:
                geolocationStatus.value = 'permission denied';
                break;
              case error.POSITION_UNAVAILABLE:
                geolocationStatus.value = 'position unavailable';
                break;
              case error.TIMEOUT:
                geolocationStatus.value = 'timeout';
                break;
              default:
                geolocationStatus.value = 'error';
                break;
            }
          },
          {
            timeout: 14400,
            enableHighAccuracy: false
          }
        );
      }, 5000); // Delay of 5000 milliseconds (5 seconds)
    } else {
      console.error("Geolocation is not supported by this browser.");
      geolocationStatus.value = 'error';
    }
  }

  /**
   * Check is there is a significant change in the user's position
   * in comparison with the last stored position.
   */
  const positionChanged = computed(() => {
    if(!geolocationLatitude.value && !geolocationLongitude.value) 
      return false;

    let relevantLatitude = tempLatitude.value || storedLatitude.value;
    let relevantLongitude = tempLongitude.value || storedLongitude.value;
    return Math.abs(geolocationLatitude.value - relevantLatitude) > 0.1 || 
           Math.abs(geolocationLongitude.value - relevantLongitude) > 0.1;
  });

  return {
    storedLatitude,
    storedLongitude,
    storedLocation,

    tempLatitude,
    tempLongitude,
    tempLocation,

    geolocationLatitude,
    geolocationLongitude,

    latitude,
    longitude,
    location,

    currentTime,
    init,
    saveLocation,
    resetLocation,
    enableGeolocation,
    geolocationStatus,
    getGeolocation,
    positionChanged,
    geolocationNotificationDismissedAt,
    clearLocalStorageAndReload,
  }
}, {
  persist: {
    key: 'contextStore',
    pick: [
      'storedLatitude', 
      'storedLongitude', 
      'storedLocation', 
      'enableGeolocation', 
      'geolocationNotificationDismissedAt',
    ]
  }
})