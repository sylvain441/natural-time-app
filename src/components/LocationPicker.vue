<template>
  <div id="settings-view" class="overflow-y-auto flex flex-col h-full">
    <!-- Location Picker Section -->
    <h4 class="section-header border-nt-yellow-light flex flex-row items-center justify-between">
      <span>Choisir un lieu</span>
    </h4>
    
    <div id="map-container" class="relative h-full flex-grow">
      <div id="map-canvas" v-if="isOnline" class="absolute inset-0 w-full h-full cursor-move min-h-16 min-w-16 z-10 bg-white"></div>
      <div class="w-full h-full flex flex-col items-center justify-center p-8">
        <p v-if="!isOnline" class="text-center text-gray-600">
          L'appareil semble hors-ligne. Veuillez vérifier votre connexion internet ou entrer vos coordonnées GPS manuellement.
        </p>
        <div class="flex flex-col">
          <div class="grow flex flex-col items-center space-y-2 justify-center hover:opacity-100 py-2" :class="[isOnline ? 'opacity-50' : '']">
            <div>
              <span>Latitude</span> 
              <input 
                :placeholder="0" 
                v-model="tempLatitude" 
                @input="tempLatitude = parseFloat(Math.max(-90, Math.min(90, parseFloat($event.target.value))))" 
                type="number" 
                min="-90" 
                max="90" 
                class="w-24 ml-2 p-2 border rounded text-xs" 
              />
            </div>
            <div>
              <span>Longitude</span> 
              <input 
                :placeholder="0" 
                v-model="tempLongitude" 
                @input="tempLongitude = parseFloat(Math.max(-90, Math.min(90, parseFloat($event.target.value))))" 
                type="number" 
                min="-180" 
                max="180" 
                class="w-24 ml-2 p-2 border rounded text-xs" 
              />
            </div>
            <div>
              <span>Nom</span> 
              <input v-model="tempLocation" type="text" placeholder="(Facultatif)" class="w-36 ml-2 p-2 border rounded text-xs" @keyup.enter="save" />
            </div>
          </div>
          <div class="flex justify-center p-4">
            <button @click="save" class="bg-nt-yellow-light text-black hover:bg-nt-yellow-darker text-xs uppercase font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
              </svg>
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success -->
    <div v-if="enableGeolocation && geolocationStatus === 'success' && positionChanged" class="flex items-center justify-center -mt-12 z-10">
      <button @click="acceptNewGeolocation()" class="bg-white text-blue-500 hover:shadow-lg text-xs font-bold py-2 px-4 mt-2 mb-4 rounded transition duration-300 ease-in-out transform flex items-center">
        <span class="block h-4 w-4 mr-2 bg-blue-600 rounded-full border-2 border-gray-200 animate-pulse"></span>
        Centrer sur ma position GPS
      </button>
    </div>
    
    <div v-if="isOnline" class="px-4 pt-2 pb-5">
      <label v-if="markerPlaced" for="locationName" class="text-xs font-mono font-extrabold">Nom du lieu</label>
      <div class="flex flex-row items-center justify-between">
        <div v-if="markerPlaced" class="grow flex items-center space-x-2 justify-start ">
          <input 
          id="locationName" 
          v-model="tempLocation" 
          type="text" 
          placeholder="(Facultatif)"
          class="flex-grow py-2 px-3 border rounded text-sm"
          @keyup.enter="save"
          />
          <button @click="save" class="bg-nt-yellow-light text-black hover:bg-nt-yellow-darker text-xs uppercase font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform flex items-center disabled:bg-gray-200 disabled:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
            </svg>
            Valider
          </button>
        </div>
      </div>
      
      <div v-if="!markerPlaced" class="flex items-center space-x-2 pt-2">
        <mapIcon class="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
        <span class="italic">Cliquer la carte pour choisir un lieu</span>
      </div>
      
    </div>

    <div class="pt-2 pb-6 px-4 bg-nt-yellow-ultralight">

      <!-- Geolocation -->
      <div class="flex items-center justify-between pt-2  text-slate-700">
        <transition name="fadein">
          <div v-if="enableGeolocation && geolocationStatus === 'searching'" class="flex items-center space-x-2">
            <spinIcon class="h-6 w-6 text-nt-yellow-dark animate-spin" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Géolocalisation en cours...</span>
          </div>
          <div v-else-if="enableGeolocation && geolocationStatus === 'success'" class="flex items-center space-x-2">
            <geolocationIcon class="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Position GPS détectée</span>
          </div>
          <div v-else-if="enableGeolocation" class="flex items-center space-x-2">
            <geolocationIcon class="h-6 w-6 text-nt-yellow-dark" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Géolocalisation activée</span>
          </div>
          <div v-else class="flex items-center space-x-2">
            <geolocationIcon class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
            <span>Activer la géolocalisation</span>
          </div>
        </transition>
        <ToggleButton v-model="enableGeolocation" class="bg-blue-500" />
      </div>

      <div v-if="enableGeolocation" class="flex items-center space-x-2 text-sm">
        <div class="w-full">
          <transition name="fadein">
            <!-- Errors -->
            <div v-if="geolocationStatus === 'permission denied'" class="flex items-center mt-2">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-2">
                  <infoIcon class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                  <span class="text-red-500">Veuillez activer la géolocalisation dans votre navigateur</span>
                </div>
              </div>
            </div>
            <div v-else-if="geolocationStatus === 'position unavailable'" class="flex items-center mt-2">
              <div class="flex items-center justify-between w-full space-x-2">
                <div class="flex items-center space-x-2">
                  <infoIcon class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                  <span class="text-red-500">Position non disponible</span>
                </div>
              </div>
              <button @click="getGeolocation()" class="text-blue-500 underline ml-2">Réessayer</button>
            </div>
            <div v-else-if="geolocationStatus === 'timeout'" class="flex items-center mt-2">
              <div class="flex items-center space-x-2">            
                <infoIcon class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                <span class="text-red-500">Délai de géolocalisation dépassé</span>
              </div>
              <button @click="getGeolocation" class="text-blue-500 underline ml-2">Réessayer</button>
            </div>
            <div v-else-if="geolocationStatus === 'error'" class="flex items-center mt-2">
              <div class="flex items-center space-x-2">
                <infoIcon class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="none" />
                <span class="text-red-500">Erreur de géolocalisation</span>
              </div>
              <button @click="getGeolocation" class="text-blue-500 underline ml-2">Réessayer</button>
            </div>
          
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted, watch } from 'vue';
import { useContextStore } from '@/stores/contextStore';
import { storeToRefs } from 'pinia';
import Geocoder from 'ol-geocoder';
import { useI18n } from 'vue-i18n';
import ToggleButton from '@/components/ToggleButton.vue';
import { useConfigStore } from '@/stores/configStore';

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
import mapMarkerIcon from '@/assets/icon/map-marker.png';
const mapMarkerIconSrc = computed(() => mapMarkerIcon);
import checkIcon from '@/assets/icon/check-icon.svg';
import spinIcon from '@/assets/icon/spin-icon.svg';
import infoIcon from '@/assets/icon/info-icon.svg';
import mapIcon from '@/assets/icon/map-icon.svg';
import geolocationIcon from '@/assets/icon/geolocation-icon.svg';

// Store setup
const configStore = useConfigStore();
const contextStore = useContextStore();
const { uiActivePanel, welcomeMode } = storeToRefs(configStore);
const { latitude, longitude, enableGeolocation, geolocationStatus, tempLatitude, tempLongitude, tempLocation, geolocationLatitude, geolocationLongitude, positionChanged } = storeToRefs(contextStore);
const { getGeolocation } = contextStore;

// Composables
const i18n = useI18n();

// Refs
const isOnline = ref(window.navigator.onLine);
const map = ref(null);
const view = ref(null);
const vectorSource = ref(null);
const markerFeature = ref(null);
const geolocationFeature = ref(null);
const zoomLevel = ref(localStorage.longitude ? 5 : 4);
const setupCoordinates = fromLonLat([longitude.value, latitude.value]);
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

const setupGeocoder = () => {
  if (!map.value) {
    console.warn('Map not available, skipping geocoder setup');
    return;
  }
  
  geocoder.value = new Geocoder('nominatim', {
    provider: 'photon',
    lang: 'fr-FR',
    placeholder: i18n.t('settings.searchFor'),
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
  welcomeMode.value = false;
  uiActivePanel.value = null;
  emit('close');
  emit('save');
};

const handleMapClick = (event) => {
  const clickedCoord = event.coordinate;
  const lonLat = toLonLat(clickedCoord);
  if (Math.abs(tempLatitude.value - parseFloat(lonLat[1])) > 0.1 || Math.abs(tempLongitude.value - parseFloat(lonLat[0])) > 0.1) {
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

const destroyMap = () => {
  if (map.value) {
    // Remove event listeners
    map.value.un('singleclick', handleMapClick);
    
    // Remove controls (like geocoder)
    if (geocoder.value) {
      map.value.removeControl(geocoder.value);
      geocoder.value = null;
    }
    
    // Clear vector source
    if (vectorSource.value) {
      vectorSource.value.clear();
    }
    
    // Destroy the map
    map.value.setTarget(null);
    map.value = null;
  }
  
  // Reset other related values
  view.value = null;
  vectorSource.value = null;
  markerFeature.value = null;
  geolocationFeature.value = null;
  mapInitialized.value = false;
};

const initMap = () => {
  if (!isOnline.value) return; // Don't initialize if offline

  // Destroy existing map if it exists
  destroyMap();

  vectorSource.value = new VectorSource();
  
  view.value = new View({
    center: fromLonLat([longitude.value, latitude.value]),
    zoom: zoomLevel.value
  });

  map.value = new Map({
    target: 'map-canvas',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      new VectorLayer({
        source: vectorSource.value
      })
    ],
    view: view.value,
    controls: [new ZoomControl()]
  });

  map.value.on('singleclick', handleMapClick);

  updateMarker();
  updateGeolocationMarker();

  // Set mapInitialized to true after map is fully loaded
  map.value.once('postrender', () => {
    mapInitialized.value = true;
  });

  // Setup geocoder after map is initialized
  setupGeocoder();
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
        src: mapMarkerIcon,
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
});

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
  
  contextStore.resetLocation();
  destroyMap();
});

// Event listeners
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

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

</script>

<style lang="scss">
#reticule {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url('@/assets/icon/reticule.svg') center no-repeat;
  background-size: cover;
}

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
  }
  
  .gcd-txt-control {
    position: relative;
    width: 100%;
    height: 1.8em;
  }
  
  .gcd-txt-input {
    height: 100%;
    padding: 2px 30px 2px 8px;
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
</style>