<template>
  <div id="settings-view" class="flex flex-col w-full h-screen p-0 md:p-10 fixed inset-0 bg-white bg-opacity-95 z-50 overflow-y-auto">
    <button @click.stop="emit('close')" class="fixed top-2 md:top-6 left-2 md:left-6 z-50 md:p-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <h1 class="text-center text-2xl md:text-4xl font-bold md:mb-3 p-2 md:p-0 order-2 md:order-1">
      <strong class="font-title underline-yellow">{{ $t('settings.title') }}</strong>
      <br>
      <small class="text-sm md:text-base font-normal italic block">{{ $t('settings.subtitle') }}</small>
    </h1>

    <div id="map-container" class="w-full flex-grow relative order-1 md:order-2 max-w-screen-lg mx-auto md:p-5" style="min-height: 60vh">
      <template v-if="isOnline">
        <ol-map id="map-canvas" class="w-full h-full md:rounded-lg overflow-hidden md:shadow-xl" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" ref="map">
          <ol-view ref="view" :center="setupCoordinates" :zoom="zoomLevel" @change:center="centerChanged" />
          <ol-geolocation ref="geolocation" :tracking="trackUserLocation" @change:position="GPSChanged"></ol-geolocation>
          <ol-zoom-control />
          <ol-tile-layer>
            <ol-source-osm />
          </ol-tile-layer>
        </ol-map>
        <div id="reticule" class="block absolute w-6 h-6"></div>
      </template>
      <template v-else>
        <div class="w-full h-full flex items-center justify-center bg-gray-100 md:rounded-lg overflow-hidden md:shadow-xl">
          <p class="text-center text-gray-600" v-html="$t('settings.offlineMessage')"></p>
        </div>
      </template>
    </div>
    
    <div id="form" class="p-1 md:p-4 text-xs order-3">
      <div class="mb-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">

        <div class="flex items-center space-x-2 opacity-50 hover:opacity-100 px-3">
          <span>{{ $t('settings.form.latitude') }}</span>
          <input :placeholder="$t('settings.form.latitude')" v-model="newLatitude" type="number" step="0.01" min="-90" max="90" @change="updateCenter" class="w-18 p-1 border rounded" />
          <span>{{ $t('settings.form.longitude') }}</span>
          <input :placeholder="$t('settings.form.longitude')" v-model="newLongitude" type="number" step="0.01" min="-180" max="180" @change="updateCenter" class="w-18 p-1 border rounded" />
        </div>

        <button @click="setupGeolocation" class="relative bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm py-2 px-6 rounded">
          {{ $t('settings.form.useGeolocation') }}
          <span v-if="isTracking" class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-800 opacity-95"></span>
        </button>
        <button @click="save" class="bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-bold py-2 px-6 rounded transition duration-300 ease-in-out transform hover:scale-105">
          {{ $t('settings.form.save') }}
        </button>

        <button @click="emit('close')" class="md:hidden text-blue-400 hover:text-blue-600 font-medium underline">
          {{ $t('settings.form.cancel') }} 
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fromLonLat, toLonLat } from 'ol/proj';
import { useContextStore } from '@/stores/contextStore';
import { storeToRefs } from 'pinia';
import Geocoder from 'ol-geocoder/dist/ol-geocoder.js';
import 'vue3-openlayers/dist/vue3-openlayers.css';
import { useI18n } from 'vue-i18n';
import Geolocation from 'ol/Geolocation';

const i18n = useI18n();
const contextStore = useContextStore();
const { latitude, longitude, location } = storeToRefs(contextStore);

const newLatitude = ref(latitude.value);
const newLongitude = ref(longitude.value);
const newLocation = ref(location.value);

const isOnline = ref(window.navigator.onLine);
const map = ref(null);
const view = ref(null);
const zoomLevel = ref(localStorage.longitude ? 5 : 2);
const setupCoordinates = fromLonLat([longitude.value, latitude.value]);
const trackUserLocation = ref(false);

const updateOnlineStatus = () => isOnline.value = window.navigator.onLine;
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

const centerChanged = (event) => {
  const center = event.target.get("center");
  [newLongitude.value, newLatitude.value] = toLonLat(center).map(coord => parseFloat(coord.toFixed(2)));
  if (String(newLocation.value).startsWith(i18n.t('longitude')) || !newLocation.value) {
    newLocation.value = `${i18n.t('longitude')} ${parseInt(newLongitude.value)}`;
  }
};

const updateCenter = () => {
  newLongitude.value = ((parseFloat(newLongitude.value) + 180) % 360) - 180;
  newLatitude.value = Math.max(-90, Math.min(90, newLatitude.value));
  view.value.setCenter(fromLonLat([newLongitude.value, newLatitude.value]));
};

const GPSChanged = (event) => {
  view.value?.setCenter(event.target?.getPosition());
  trackUserLocation.value = false;
};

const emit = defineEmits(['close']);

const lastGeolocationRequest = ref(localStorage.getItem('lastGeolocationRequest') || 0);
const geolocationCooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const isTracking = ref(false);

const canRequestGeolocation = computed(() => {
  return Date.now() - lastGeolocationRequest.value > geolocationCooldown;
});

const setupGeolocation = () => {
  const geolocation = new Geolocation({
    trackingOptions: { enableHighAccuracy: true },
    projection: view.value.getProjection(),
  });

  geolocation.setTracking(true);
  isTracking.value = true;
  geolocation.on('change:position', () => {
    const coordinates = geolocation.getPosition();
    if (coordinates) {
      view.value.setCenter(coordinates);
      view.value.setZoom(12);
      geolocation.setTracking(false);
      isTracking.value = false;
      lastGeolocationRequest.value = Date.now();
      localStorage.setItem('lastGeolocationRequest', lastGeolocationRequest.value);
    }
  });
};

onMounted(() => {
  setupGeocoder();
  if (canRequestGeolocation.value) {
    setupGeolocation();
  }
});

const setupGeocoder = () => {
  const geocoder = new Geocoder('nominatim', {
    provider: 'photon',
    lang: 'fr-FR',
    placeholder: i18n.t('settings.searchFor'),
    targetType: 'text-input',
    autoComplete: true,
    autoCompleteMinLength: 4,
    autoCompleteTimeout: 500,
    preventMarker: true,
    limit: 4,
    keepOpen: true,
  });
  geocoder.on('addresschosen', (evt) => {
    newLocation.value = evt.place.address.city || evt.place.address.name || evt.place.address.state || evt.place.address.country;
  });
  map.value.map.addControl(geocoder);
};

const save = () => {
  const locationPrompt = window.prompt(i18n.t('settings.promptLocationName'), newLocation.value);
  contextStore.update(newLatitude.value, newLongitude.value, locationPrompt);
  emit('close');
};
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
    min-width: 250px;
    height: auto;
    top: .7em;
    left: auto;
    right: .7em;
    padding: 0;
  }

  .gcd-txt-control {
    position: relative;
    width: 100%;
    height: 2.375em;
  }

  .gcd-txt-input {
    height: 100%;
    padding: 5px 30px 5px 8px;
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
</style>