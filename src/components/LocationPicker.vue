<template>
  <div id="settings-view" class="overflow-y-auto flex flex-col h-full dark:bg-gray-900" @submit.prevent>
    <!-- Location Picker title -->
    <h4 :class="[
      viewType === 'spiral' ? 'border-nt-cyan-light' : 'border-nt-yellow-light'
    ]" class="section-header flex flex-row items-center justify-between">
      <span>Choisir un lieu</span>
    </h4>
    
    <!-- Form -->
    <div v-if="isOnline" :class="[
      viewType === 'spiral' 
        ? 'bg-nt-cyan-lighter dark:bg-nt-cyan-dark' 
        : 'bg-nt-yellow-lighter dark:bg-nt-yellow-dark'
    ]" class="px-4 pt-1 pb-4">
      <!-- This form is here (at the top) so that is is visible when keyboard is open on mobile -->
      <template v-if="markerPlaced && (shouldShowForm)">
        <label for="locationName" :class="[
          viewType === 'spiral' 
            ? 'text-nt-cyan-darkest' 
            : 'text-nt-yellow-darkest'
        ]" class="text-sm font-mono font-extrabold">Donner un nom au lieu</label>
        <div class="flex flex-row items-center justify-between">
          <div class="grow flex items-center space-x-2 justify-start">
            <input 
            id="locationName" 
            v-model="tempLocation" 
            type="text" 
            placeholder="(Facultatif)"
            :class="[
              viewType === 'spiral' 
                ? 'border-nt-cyan-light focus:border-nt-cyan-dark dark:border-nt-cyan-light' 
                : 'border-nt-yellow-light focus:border-nt-yellow-dark dark:border-nt-yellow-light'
            ]"
            class="flex-grow py-2 px-3 border-2 rounded text-sm focus:outline-none bg-white text-slate-900"
            @keyup.enter="save"
            />
            <button @click="save" :class="[viewType === 'spiral' ? 'bg-nt-cyan-dark hover:bg-nt-cyan-light dark:bg-slate-700 dark:hover:bg-slate-800 dark:text-white' : 'bg-nt-yellow-dark hover:bg-nt-yellow-darker dark:bg-slate-700 dark:hover:bg-slate-800 dark:text-white']" class="text-black text-xs uppercase font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform flex items-center disabled:bg-gray-200 disabled:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
              </svg>
              Valider
            </button>
          </div>
        </div>
      </template>
      
      <div v-if="!markerPlaced || !shouldShowForm" class="flex items-center space-x-2 pt-2 text-slate-600">
        <mapIcon class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
        <span class="italic">
          {{ !markerPlaced ? 'Cliquer la carte pour choisir un lieu' : 'Cliquer la carte pour choisir un autre point' }}
        </span>
      </div>
    </div>

    <div id="map-container" class="relative h-full flex-grow touch-manipulation">
      <div id="map-canvas" v-if="isOnline" class="absolute inset-0 w-full h-full cursor-move min-h-16 min-w-16 z-10 bg-white" style="-webkit-transform: translateZ(0); transform: translateZ(0);"></div>
      <div class="w-full h-full flex flex-col items-center justify-center p-8">
        <p v-if="!isOnline" class="text-center text-gray-600 dark:text-gray-400">
          L'appareil semble hors-ligne. Veuillez vérifier votre connexion internet ou entrer vos coordonnées GPS manuellement.
        </p>
        <div class="flex flex-col">
          <div class="grow flex flex-col items-center space-y-2 justify-center hover:opacity-100 py-2" :class="[isOnline ? 'opacity-50' : '']">
            <div class="dark:text-white">
              <span>Latitude</span> 
              <input 
                autocomplete="off"
                :placeholder="0" 
                v-model="tempLatitude" 
                @submit.prevent
                @focus="preventZoom"
                type="number" 
                inputmode="decimal"
                pattern="[0-9]*"
                min="-90" 
                max="90" 
                class="w-24 ml-2 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
            <div class="dark:text-white">
              <span>Longitude</span> 
              <input 
                autocomplete="off"
                :placeholder="0" 
                v-model="tempLongitude" 
                @submit.prevent
                @focus="preventZoom"
                type="number" 
                inputmode="decimal"
                pattern="[0-9]*"
                min="-180" 
                max="180" 
                class="w-24 ml-2 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
            <div class="dark:text-white">
              <span>Nom</span> 
              <input 
                autocomplete="off"
                v-model="tempLocation" 
                @submit.prevent
                @focus="preventZoom"
                type="text" 
                placeholder="(Facultatif)" 
                class="w-36 ml-2 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                @keyup.enter="save" 
              />
            </div>
          </div>
          <div class="flex justify-center p-4">
            <button @click="save" :class="[viewType === 'spiral' ? 'bg-nt-cyan-light hover:bg-nt-cyan-lighter' : 'bg-nt-yellow-light hover:bg-nt-yellow-darker']" class="text-black text-xs uppercase font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
              </svg>
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>

    <div :class="[viewType === 'spiral' ? 'bg-nt-cyan-ultralight dark:bg-nt-cyan-light dark:bg-opacity-30' : 'bg-nt-yellow-ultralight dark:bg-nt-yellow-light dark:bg-opacity-30']" class="pt-2 pb-4 px-4">

      <!-- Geolocation -->
      <div class="flex items-center justify-between pt-2 text-slate-700 dark:text-slate-300">
        <transition name="fadein">
          <div v-if="enableGeolocation && geolocationStatus === 'searching'" class="flex items-center space-x-2">
            <spinIcon class="h-6 w-6 animate-spin text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Géolocalisation en cours...</span>
          </div>
          <div v-else-if="enableGeolocation && geolocationStatus === 'success'" class="flex items-center space-x-2">
            <geolocationIcon class="h-6 w-6 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Position GPS détectée</span> <button v-if="positionChanged" @click="acceptNewGeolocation()" class="text-blue-500 dark:text-blue-400 underline ml-2">Recentrer</button>
          </div>
          <div v-else-if="enableGeolocation" class="flex items-center space-x-2">
            <geolocationIcon class="h-6 w-6 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Géolocalisation activée</span>
          </div>
          <div v-else class="flex items-center space-x-2">
            <geolocationIcon class="h-6 w-6 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Activer la géolocalisation</span>
          </div>
        </transition>
        <ToggleButton v-model="enableGeolocation" class="bg-blue-500 dark:bg-blue-600" />
      </div>

      <div v-if="enableGeolocation" class="flex items-center space-x-2 text-sm">
        <div class="w-full">
          <transition name="fadein">
            <!-- Errors -->
            <div v-if="geolocationStatus === 'permission denied'" class="flex items-center mt-2">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-2">
                  <infoIcon class="h-6 w-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                  <span class="text-red-500 dark:text-red-400">Veuillez activer la géolocalisation dans votre navigateur</span>
                </div>
              </div>
            </div>
            <div v-else-if="geolocationStatus === 'position unavailable'" class="flex items-center mt-2">
              <div class="flex items-center justify-between w-full space-x-2">
                <div class="flex items-center space-x-2">
                  <infoIcon class="h-6 w-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                  <span class="text-red-500 dark:text-red-400">Position non disponible</span>
                </div>
              </div>
              <button @click="getGeolocation()" class="text-blue-500 dark:text-blue-400 underline ml-2">Réessayer</button>
            </div>
            <div v-else-if="geolocationStatus === 'timeout'" class="flex items-center mt-2">
              <div class="flex items-center space-x-2">            
                <infoIcon class="h-6 w-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                <span class="text-red-500 dark:text-red-400">Délai de géolocalisation dépassé</span>
              </div>
              <button @click="getGeolocation" class="text-blue-500 dark:text-blue-400 underline ml-2">Réessayer</button>
            </div>
            <div v-else-if="geolocationStatus === 'error'" class="flex items-center mt-2">
              <div class="flex items-center space-x-2">
                <infoIcon class="h-6 w-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                <span class="text-red-500 dark:text-red-400">Erreur de géolocalisation</span>
              </div>
              <button @click="getGeolocation" class="text-blue-500 dark:text-blue-400 underline ml-2">Réessayer</button>
            </div>
          
          </transition>
        </div>
      </div>
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400 px-4 pt-2 pb-4 italic text-center">
      Le temps naturel a besoin d'une position géographique pour déterminer la position du soleil.<br>
      Aucune donnée personnelle n'est enregistrée.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted, watch } from 'vue';
import { useContextStore } from '@/stores/contextStore';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import ToggleButton from '@/components/ToggleButton.vue';

// Import OpenLayers modules directly
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';
import ZoomControl from 'ol/control/Zoom';

// Icons
import mapMarkerCyanIcon from '@/assets/icon/map-marker-cyan.png';
import mapMarkerYellowIcon from '@/assets/icon/map-marker-yellow.png';
import spinIcon from '@/assets/icon/spin-icon.svg';
import infoIcon from '@/assets/icon/info-icon.svg';
import mapIcon from '@/assets/icon/map-icon.svg';
import geolocationIcon from '@/assets/icon/geolocation-icon.svg';

// Store setup
const contextStore = useContextStore();
const { latitude, longitude, enableGeolocation, geolocationStatus, tempLatitude, tempLongitude, tempLocation, geolocationLatitude, geolocationLongitude, positionChanged } = storeToRefs(contextStore);
const { getGeolocation } = contextStore;

// Composables
const i18n = useI18n();

// Refs
const isOnline = ref(false);
const map = ref(null);
const view = ref(null);
const vectorSource = ref(null);
const markerFeature = ref(null);
const geolocationFeature = ref(null);
const zoomLevel = ref(contextStore.longitude ? 5 : 4);
const geocoder = ref(null);
const mapInitialized = ref(false);

// Update the pointerCoordinates computed property
const pointerCoordinates = computed(() => {
  if (tempLatitude.value && tempLongitude.value) {
    return fromLonLat([parseFloat(tempLongitude.value), parseFloat(tempLatitude.value)]);
  }
  return null;
});

const markerPlaced = computed(() => {
  return tempLatitude.value && tempLongitude.value;
});

const updateOnlineStatus = () => {
  isOnline.value = window.navigator.onLine;
  if (isOnline.value) {
    // If coming back online, reinitialize the map
    nextTick(() => {
      initMap();
    });
  }
};

const initGeocoder = async () => {
  const { default: Geocoder } = await import('ol-geocoder');
  // Rest of your geocoder initialization code
  if (!map.value) {
    console.warn('Map not available, skipping geocoder setup');
    return;
  }
  
  geocoder.value = new Geocoder('nominatim', {
    provider: 'photon',
    lang: 'fr-FR',
    placeholder: 'Rechercher un lieu',
    targetType: 'text-input',
    preventMarker: true,
    limit: 3,
    keepOpen: true
  });
  
  geocoder.value.on('addresschosen', (evt) => {
    tempLocation.value = evt.place.address.city || evt.place.address.name || evt.place.address.state || evt.place.address.country;
    const coordinates = evt.coordinate;
    if (coordinates && view.value) {
      view.value.setZoom(12);
      tempLatitude.value = toLonLat(coordinates)[1];
      tempLongitude.value = toLonLat(coordinates)[0];
    }
    
    // Clear the geocoder input
    const input = document.getElementById('gcd-input-query');
    if (input) {
      input.value = '';
    }
  });
  
  map.value.addControl(geocoder.value);
  
  // AUTOCOMPLETE
  nextTick(() => {
    const setupAutocomplete = () => {
      const input = document.getElementById('gcd-input-query');
      if (input && geocoder.value) {
        const triggerAutocomplete = debounce(() => {
          if (input.value.length >= 3) {
            input.dispatchEvent(new KeyboardEvent('keypress', { keyCode: 13 }));
          }
        }, 700);
        input.addEventListener('input', triggerAutocomplete, { bubbles: true, capture: true });
      } else {
        // If the input is not found, retry after a short delay
        setTimeout(setupAutocomplete, 100);
      }
    };
    
    setupAutocomplete();
  });
};

const save = () => {
  contextStore.saveLocation();
  emit('close');
  emit('save');
};

const initialPosition = ref({
  lat: tempLatitude.value,
  lng: tempLongitude.value
});

const hasPositionChanged = computed(() => {
  return initialPosition.value.lat !== tempLatitude.value || 
         initialPosition.value.lng !== tempLongitude.value;
});

const shouldShowForm = computed(() => {
  // Show form if:
  // 1. No initial position was set (new location selection)
  // 2. OR if position has changed from initial position
  return !initialPosition.value.lat || hasPositionChanged.value;
});

// Update handleMapClick to track position changes
const handleMapClick = (event) => {
  const clickedCoord = event.coordinate;
  const lonLat = toLonLat(clickedCoord);
  
  // Only clear location name if position has significantly changed
  if (Math.abs(tempLatitude.value - parseFloat(lonLat[1])) > 0.1 || 
      Math.abs(tempLongitude.value - parseFloat(lonLat[0])) > 0.1) {
    tempLocation.value = '';
  }
  
  tempLatitude.value = parseFloat(lonLat[1]);
  tempLongitude.value = parseFloat(lonLat[0]);
};

const acceptNewGeolocation = () => {
  tempLatitude.value = geolocationLatitude.value;
  tempLongitude.value = geolocationLongitude.value;
  tempLocation.value = '';
  const newCoordinates = fromLonLat([tempLongitude.value, tempLatitude.value]);
  if (view.value) {
    view.value.setCenter(newCoordinates);
    view.value.setZoom(12);
  }
}

// Update the geolocationCoordinates computed property
const geolocationCoordinates = computed(() => {
  if (geolocationLatitude.value && geolocationLongitude.value) {
    return fromLonLat([parseFloat(geolocationLongitude.value), parseFloat(geolocationLatitude.value)]);
  }
  return null;
});

const safeDestroyMap = (map) => {
  if (!map) return;
  
  try {
    const mapTarget = map.getTarget();
    if (mapTarget) {
      // Remove all listeners
      map.setTarget(null);
      // Clear target element
      if (typeof mapTarget === 'string') {
        const element = document.getElementById(mapTarget);
        if (element) {
          element.innerHTML = '';
        }
      }
    }
  } catch (error) {
    console.warn('Error during map cleanup:', error);
  }
};

// Update the destroyMap function
const destroyMap = () => {
  if (!map.value) return;

  try {
    // Remove event listeners first
    map.value.un('singleclick', handleMapClick);
    
    // Remove controls
    if (geocoder.value) {
      try {
        map.value.removeControl(geocoder.value);
        geocoder.value.dispose(); // Properly dispose geocoder
      } catch (e) {
        console.warn('Error removing geocoder:', e);
      }
      geocoder.value = null;
    }
    
    // Clear vector source
    if (vectorSource.value) {
      vectorSource.value.clear();
      vectorSource.value = null;
    }
    
    // Clear features
    markerFeature.value = null;
    geolocationFeature.value = null;
    
    // Safely destroy map
    safeDestroyMap(map.value);
    map.value = null;
    
    // Clear view
    if (view.value) {
      view.value.setCenter(null);
      view.value.setZoom(undefined);
      view.value = null;
    }
    
    mapInitialized.value = false;
  } catch (error) {
    console.warn('Error during map destruction:', error);
  }
};

// Update initMap function
const initMap = () => {
  if (!isOnline.value || mapInitialized.value) return;

  try {
    destroyMap();
    
    // Add error boundary
    const mapElement = document.getElementById('map-canvas');
    if (!mapElement) {
      console.warn('Map canvas element not found');
      return;
    }

    vectorSource.value = new VectorSource({
      wrapX: false // Prevent wrapping around globe
    });
    
    view.value = new View({
      center: fromLonLat([longitude.value || 0, latitude.value || 0]),
      zoom: zoomLevel.value,
      constrainResolution: true, // Prevent fractional zoom levels
      maxZoom: 18
    });

    map.value = new Map({
      target: 'map-canvas',
      layers: [
        new TileLayer({
          source: new OSM({
            crossOrigin: 'anonymous'
          })
        }),
        new VectorLayer({
          source: vectorSource.value,
          updateWhileAnimating: false, // Optimize performance
          updateWhileInteracting: false
        })
      ],
      view: view.value,
      controls: [new ZoomControl()],
      pixelRatio: 2 // Better rendering on high-DPI displays
    });

    // Add touch-specific interactions
    map.value.on('pointermove', (e) => {
      e.preventDefault(); // Prevent unwanted scrolling
    });

    map.value.on('singleclick', handleMapClick);

    updateMarker();
    updateGeolocationMarker();

    // Setup geocoder after ensuring map is ready
    map.value.once('postrender', () => {
      mapInitialized.value = true;
      initGeocoder();
    });

  } catch (error) {
    console.error('Error initializing map:', error);
    mapInitialized.value = false;
  }
};

const updateMarker = () => {
  if (markerFeature.value) {
    vectorSource.value.removeFeature(markerFeature.value);
  }
  if (pointerCoordinates.value) {
    markerFeature.value = new Feature({
      geometry: new Point(pointerCoordinates.value)
    });
    markerFeature.value.setStyle(new Style({
      image: new Icon({
        src: props.viewType === 'spiral' ? mapMarkerCyanIcon : mapMarkerYellowIcon,
        scale: 0.5,
        anchor: [0.5, 0.95]
      })
    }));
    vectorSource.value.addFeature(markerFeature.value);
  }
};

const updateGeolocationMarker = () => {
  if (geolocationFeature.value) {
    vectorSource.value.removeFeature(geolocationFeature.value);
  }
  if (enableGeolocation.value && geolocationCoordinates.value) {
    geolocationFeature.value = new Feature({
      geometry: new Point(geolocationCoordinates.value)
    });
    geolocationFeature.value.setStyle(new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: 'blue' }),
        stroke: new Stroke({ color: 'white', width: 2 })
      })
    }));
    vectorSource.value.addFeature(geolocationFeature.value);
  }
};

onMounted(() => {
  nextTick(() => {
    if (isOnline.value) {
      initMap();
    }
    if (enableGeolocation.value) {
      getGeolocation();
    }
  });

  // Event listeners
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
});

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
  
  contextStore.resetLocation();
  destroyMap();
});

// Watchers for updating markers
watch(pointerCoordinates, updateMarker);
watch([enableGeolocation, geolocationCoordinates], updateGeolocationMarker);

// Add a watch for isOnline
watch(isOnline, (newValue) => {
  if (newValue) {
    // If coming back online, reinitialize the map
    nextTick(() => {
      initMap();
    });
  } else {
    // If going offline, destroy the map
    destroyMap();
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// Custom debounce function instead of heavy lodash
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add this prop
const props = defineProps({
  viewType: {
    type: String,
    default: 'clock', // 'clock' or 'spiral'
    required: true
  }
});

// Add meta viewport control function
const preventZoom = () => {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    
    // Reset viewport after input blur
    const resetViewport = () => {
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.removeEventListener('blur', resetViewport, true);
    };
    
    document.addEventListener('blur', resetViewport, true);
  }
};

</script>

<style lang="scss">
@import 'ol-geocoder/dist/ol-geocoder.min.css';

.ol-geocoder {
  &.gcd-txt-container {
    width: 35%;
    min-width: 200px;
    height: auto;
    top: .5em;
    left: auto;
    right: .5em;
    padding: 0;
    z-index: 20;
  }
  
  .gcd-txt-control {
    position: relative;
    width: 100%;
    height: 2.4em;
  }
  
  .gcd-txt-input {
    height: 100%;
    padding: 5px 30px 4px 8px;
  }
  
  .gcd-txt-search::after {
    content: "\23CE";
    font-size: 1em;
  }
  
  .gcd-txt-glass {
    display: none;
  }
  
  ul.gcd-txt-result {
    top: 2.8em;
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    box-shadow: none;
    z-index: 21;
    
    > li {
      &:nth-child(odd) {
        background-color: #f1f1f1;
      }
      
      > a:hover {
        background-color: #fff9c5;
      }
    }
  }
}
.ol-zoom{
  top: .5em;
  left: .5em;
}

.fadein-enter-active {
  transition: opacity 0.5s;
}
.fadein-enter, .fadein-leave-to {
  opacity: 0;
}

// Add OpenLayers default styles
@import 'ol/ol.css';

#map-canvas {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.ol-control {
  /* Prevent text selection on controls */
  -webkit-user-select: none;
  user-select: none;
}

/* Add these styles to prevent unwanted zoom behavior */
input[type="number"],
input[type="text"] {
  font-size: 16px; /* Prevents iOS zoom */
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;
}

/* Prevent double-tap zoom */
* {
  touch-action: manipulation;
}

/* Add these new styles */
#map-container {
  isolation: isolate;
}

.gcd-txt-input {
  font-size: 16px !important;
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;
}
</style>