import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useContextStore = defineStore('context', () => {

  const storedLatitude = ref(null)
  const storedLongitude = ref(null)
  const storedLocation = ref('')

  const routeLatitude = ref(null)
  const routeLongitude = ref(null)
  const routeLocation = ref('')
  const tempLatitude = ref(42.42)
  const tempLongitude = ref(0)
  const tempLocation = ref('')

  const geolocationLatitude = ref(null)
  const geolocationLongitude = ref(null)

  const currentTime = ref(null)
  const timer = ref(null)
  const enableGeolocation = ref(false)
  const geolocationStatus = ref(null); // 'searching', 'success', 'error'

  const geolocationNotificationDismissedAt = ref(null);

  // Getters
  const latitude = computed(() => tempLatitude.value ?? storedLatitude.value ?? 42.42)
  const longitude = computed(() => tempLongitude.value ?? storedLongitude.value ?? 0)
  const location = computed(() => tempLocation.value || storedLocation.value || "")
  const hasRouteLocation = computed(() => routeLatitude.value != null && routeLongitude.value != null)
  const routeLocationChanged = computed(() => {
    if (!hasRouteLocation.value) return false
    if (storedLatitude.value == null || storedLongitude.value == null) return false
    return Math.abs(routeLatitude.value - storedLatitude.value) > 0.0001 ||
           Math.abs(routeLongitude.value - storedLongitude.value) > 0.0001
  })

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

    currentTime.value = Date.now()
    timer.value = setInterval(() => currentTime.value = Date.now(), 2400);
    
    tempLatitude.value = routeLatitude.value ?? storedLatitude.value;
    tempLongitude.value = routeLongitude.value ?? storedLongitude.value;
    tempLocation.value = routeLocation.value || storedLocation.value;


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
    tempLatitude.value = routeLatitude.value ?? storedLatitude.value
    tempLongitude.value = routeLongitude.value ?? storedLongitude.value
    tempLocation.value = routeLocation.value || storedLocation.value
  }

  const setRouteLocation = ({ latitude, longitude, location = '' }) => {
    routeLatitude.value = latitude
    routeLongitude.value = longitude
    routeLocation.value = typeof location === 'string' ? location.replace(/[<>]/g, '') : ''
    tempLatitude.value = routeLatitude.value
    tempLongitude.value = routeLongitude.value
    tempLocation.value = routeLocation.value
  }

  const clearRouteLocation = () => {
    routeLatitude.value = null
    routeLongitude.value = null
    routeLocation.value = ''
    if (initDone.value) {
      tempLatitude.value = storedLatitude.value
      tempLongitude.value = storedLongitude.value
      tempLocation.value = storedLocation.value
    }
  }

  const acceptRouteLocation = () => {
    if (!hasRouteLocation.value) return
    tempLatitude.value = routeLatitude.value
    tempLongitude.value = routeLongitude.value
    tempLocation.value = routeLocation.value
    saveLocation()
    clearRouteLocation()
  }

  // Add new function to check geolocation permission
  const checkGeolocationPermission = async () => {
    try {
      // Check if the Permissions API is supported
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        
        if (result.state === 'granted') {
          enableGeolocation.value = true;
          return true;
        } else if (result.state === 'prompt') {
          // Will show the permission prompt
          return true;
        }
        // If denied, don't even try
        return false;
      }
      // If Permissions API not supported, fallback to normal behavior
      return true;
    } catch (error) {
      console.warn('Error checking geolocation permission:', error);
      return true; // Fallback to normal behavior
    }
  };

  const getGeolocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      geolocationStatus.value = 'error';
      return;
    }

    // Check permission first
    const canProceed = await checkGeolocationPermission();
    if (!canProceed) {
      geolocationStatus.value = 'permission denied';
      return;
    }

    geolocationStatus.value = 'searching';
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 14400,
          enableHighAccuracy: false
        });
      });
      
      geolocationLatitude.value = parseFloat(position.coords.latitude);
      geolocationLongitude.value = parseFloat(position.coords.longitude);
      geolocationStatus.value = 'success';
      enableGeolocation.value = true;

      // If position has changed significantly, get the place name
      if (positionChanged.value) {
        await getPlaceNameFromCoordinates();
      }
    } catch (error) {
      console.warn(error);
      geolocationLatitude.value = null;
      geolocationLongitude.value = null;
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          geolocationStatus.value = 'permission denied';
          enableGeolocation.value = false;
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
    }
  };

  // New state for place name
  const newPlaceName = ref(null);

  const getPlaceNameFromCoordinates = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${geolocationLatitude.value}&lon=${geolocationLongitude.value}&format=json&accept-language=fr`
      );
      const data = await response.json();
      
      // Try to get the most relevant name (city, town, village, or region)
      newPlaceName.value = data.address.city || 
                          data.address.town || 
                          data.address.village || 
                          data.address.county ||
                          data.address.state ||
                          'Position inconnue';
    } catch (error) {
      console.warn('Error getting place name:', error);
      newPlaceName.value = 'Position inconnue';
    }
  };

  // Fetch place name for any coordinates (used when manually selecting location)
  const fetchPlaceNameForCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`
      );
      const data = await response.json();
      
      // Try to get the most relevant name (city, town, village, or region)
      return data.address.city || 
             data.address.town || 
             data.address.village || 
             data.address.county ||
             data.address.state ||
             null;
    } catch (error) {
      console.warn('Error getting place name:', error);
      return null;
    }
  };

  const acceptNewGeolocation = () => {
    tempLatitude.value = geolocationLatitude.value;
    tempLongitude.value = geolocationLongitude.value;
    if (newPlaceName.value) {
      tempLocation.value = newPlaceName.value;
    }
    saveLocation();
    // Reset the notification state
    newPlaceName.value = null;
  };

  const dismissGeolocationChange = () => {
    newPlaceName.value = null;
  };

  // Refresh geolocation and automatically update location
  const refreshGeolocation = async () => {
    await getGeolocation();
    if (geolocationStatus.value === 'success' && geolocationLatitude.value != null && geolocationLongitude.value != null) {
      tempLatitude.value = geolocationLatitude.value;
      tempLongitude.value = geolocationLongitude.value;
      // Fetch and set place name
      await getPlaceNameFromCoordinates();
      if (newPlaceName.value) {
        tempLocation.value = newPlaceName.value;
      }
      saveLocation();
      newPlaceName.value = null;
    }
  };

  /**
   * Check is there is a significant change in the user's position
   * in comparison with the last stored position.
   */
  const positionChanged = computed(() => {
    if(geolocationLatitude.value == null || geolocationLongitude.value == null)
      return false;

    let relevantLatitude = tempLatitude.value ?? storedLatitude.value;
    let relevantLongitude = tempLongitude.value ?? storedLongitude.value;
    return Math.abs(geolocationLatitude.value - relevantLatitude) > 0.1 || 
           Math.abs(geolocationLongitude.value - relevantLongitude) > 0.1;
  });

  return {
    storedLatitude,
    storedLongitude,
    storedLocation,

    routeLatitude,
    routeLongitude,
    routeLocation,
    hasRouteLocation,
    routeLocationChanged,

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
    newPlaceName,
    acceptNewGeolocation,
    dismissGeolocationChange,
    refreshGeolocation,
    fetchPlaceNameForCoordinates,
    setRouteLocation,
    clearRouteLocation,
    acceptRouteLocation,
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
