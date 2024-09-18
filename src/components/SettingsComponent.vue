<template>
  <div id="settings-view" class="overflow-y-auto flex flex-col h-full max-w-md mx-auto">
    <!-- Location Picker Section -->
    <section>
      <h4 class="section-header border-ntyellow-dark">
        Choisir un lieu
        <button v-if="askForGeolocation" @click="setupGeolocation" class="absolute right-0 -top-0 text-xs text-slate-700 font-sans font-normal bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 flex items-center">
          <span v-if="isTracking">Localisation... <span class="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-sky-500 opacity-95"></span></span>
          <span v-else>Me localiser</span>
        </button>
      </h4>
      <div id="map-container" class="relative px-4 h-96 min-h-96">
        <template v-if="isOnline">
          <ol-map id="map-canvas" class="w-full h-full rounded-lg overflow-hidden cursor-move min-h-16 min-w-16" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" ref="map">
            <ol-view ref="view" :center="setupCoordinates" :zoom="zoomLevel" :minZoom="4" />
            <ol-geolocation ref="geolocation" :tracking="trackUserLocation"></ol-geolocation>
            <ol-zoom-control />
            <ol-tile-layer>
              <ol-source-osm />
            </ol-tile-layer>
          </ol-map>
        </template>
        <template v-else>
          <div class="w-full h-full flex items-center justify-center p-8">
            <p class="text-center text-gray-600" v-html="$t('settings.offlineMessage')"></p>
          </div>
        </template>
      </div>
      <div class="px-4">
        <div class="mt-2 mb-1 flex items-center justify-end">
          <span class="text-sm  px-4 font-medium text-gray-700">Autoriser la géolocalisation</span>
          <ToggleButton v-model="askForGeolocation" class="bg-ntyellow-dark" />
        </div>
      </div>
      <div class="px-4 py-1">
        <div class="flex flex-row items-center justify-between">
          <div class="grow flex flex-row items-center space-x-1 justify-center hover:opacity-100 py-2" :class="[isOnline ? 'opacity-50' : '']">
            <span>{{ $t('settings.form.latitude') }}</span>
            <input :placeholder="$t('settings.form.latitude')" v-model="newLatitude" type="number" step="0.01" min="-90" max="90" @change="updateCenter" class="w-16 p-0.5 border rounded text-xs" />
            <span>{{ $t('settings.form.longitude') }}</span>
            <input :placeholder="$t('settings.form.longitude')" v-model="newLongitude" type="number" step="0.01" min="-180" max="180" @change="updateCenter" class="w-16 p-0.5 border rounded text-xs" />
          </div>
          <button @click="save" class="bg-ntyellow-dark text-black hover:bg-ntyellow-darker text-xs uppercase font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
            </svg>
            {{ $t('settings.form.save') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Other Settings Section -->
    <section>
      <h4 class="section-header border-ntcyan-light">Autres réglages</h4>
      <div class="px-4 py-2 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Afficher les graduations</span>
          <ToggleButton v-model="displayGraduations" class="bg-ntcyan-light" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Afficher les animations</span>
          <ToggleButton v-model="displayAnimations" class="bg-ntcyan-light" />
        </div>
      </div>
    </section>

    <!-- Bonus Section -->
    <section>
      <h4 class="section-header border-ntmagenta-light">Bonus</h4>
      <div class="px-4 py-2 space-y-4">
        <div class="flex flex-wrap items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Ouvrir le tutoriel</span>
          <ToggleButton v-model="displayTutorial" @click="emit('close')" class="bg-ntmagenta-light" />
        </div>
        <div class="flex flex-wrap items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Mode voyage temporel</span>
          <ToggleButton v-model="timeTravelMode" class="bg-ntmagenta-light" />
          <div class="w-full text-xs italic text-gray-400 px-3 pt-1 pb-4">
            <p>Le mode voyage temporel permet de voir l'heure à différent moments de l'histoire.</p>
            <p>Il est possible de voyager dans le passé de 1 à 7 jours, dans le futur de 1 à 7 jours, ou de 1 à 365 jours.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { fromLonLat, toLonLat } from 'ol/proj';
import { useContextStore } from '@/stores/contextStore';
import { storeToRefs } from 'pinia';
import Geocoder from 'ol-geocoder';
import 'vue3-openlayers/dist/vue3-openlayers.css';
import { useI18n } from 'vue-i18n';
import Geolocation from 'ol/Geolocation';
import ToggleButton from '@/components/ToggleButton.vue';
import { useConfigStore } from '@/stores/configStore';
import { debounce } from 'lodash';

// Store setup
const configStore = useConfigStore();
const contextStore = useContextStore();
const { askForGeolocation, timeTravelMode, displayGraduations, displayAnimations, displayTutorial } = storeToRefs(configStore);
const { latitude, longitude, location } = storeToRefs(contextStore);

// Composables
const i18n = useI18n();

// Refs
const newLatitude = ref(latitude.value);
const newLongitude = ref(longitude.value);
const newLocation = ref(location.value);
const isOnline = ref(window.navigator.onLine);
const map = ref(null);
const view = ref(null);
const zoomLevel = ref(localStorage.longitude ? 5 : 3);
const setupCoordinates = fromLonLat([longitude.value, latitude.value]);
const trackUserLocation = ref(false);
const isTracking = ref(false);
const geocoder = ref(null);

const updateOnlineStatus = () => isOnline.value = window.navigator.onLine;
const setupGeocoder = () => {
  geocoder.value = new Geocoder('nominatim', {
    provider: 'osm',
    lang: 'fr-FR',
    placeholder: i18n.t('settings.searchFor'),
    targetType: 'text-input',
    preventMarker: true,
    limit: 5,
    keepOpen: true,
  });

  geocoder.value.on('addresschosen', (evt) => {
    newLocation.value = evt.address.city || evt.address.name || evt.address.state || evt.address.country;
    const coordinates = evt.coordinate;
    if (coordinates) {
      view.value.setCenter(fromLonLat(coordinates));
      view.value.setZoom(12);
    }
  });
  
  map.value.map.addControl(geocoder.value);
  
  // AUTOCOMPLETE
  nextTick(() => {
    const input = document.getElementById('gcd-input-query');
    if (input && geocoder.value) {
      const triggerAutocomplete = debounce(() => {
        if (input.value.length >= 3) {
          console.log('SEARCH', input.value);
          input.dispatchEvent(new KeyboardEvent('keypress', { keyCode: 13 }));
        }
      }, 700);
      input.addEventListener('input', triggerAutocomplete, { bubbles: true, capture: true });
    }
  });
};

const save = () => {
  const locationPrompt = window.prompt(i18n.t('settings.promptLocationName'), newLocation.value);
  contextStore.saveToLocalStorage(newLatitude.value, newLongitude.value, locationPrompt);
  emit('close');
  emit('save');
};

// Lifecycle hooks
onMounted(() => {
  setupGeocoder();
});

// Event listeners
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Emits
const emit = defineEmits(['close', 'save']);
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
    top: .85em;
    left: 2.7em;
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
.ol-zoom{
  top: .5em;
  left: .5em;
}

.section-header {
  @apply relative font-mono font-bold mx-4 mt-5 mb-2 pb-1 text-base text-slate-800 border-b-4;
}

</style>