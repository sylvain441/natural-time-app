<template>

  <div id="settings-view" class="flex flex-col w-full h-screen md:p-10">

    <h1 class="text-center text-2xl md:text-4xl font-bold md:mb-3 p-2 md:p-0 order-2 md:order-1"><strong class="font-title" style="text-decoration: underline; text-decoration-color: yellow; text-decoration-thickness: 4px;">Choisir un lieu</strong><br><small class="text-sm md:text-base font-normal italic" style="display: block;">Le Temps Naturel dépends de la position sur Terre</small></h1>

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
          <p class="text-center text-gray-600">
            La connexion internet semble ne pas fonctionner.<br>
            La carte ne peux donc pas s'afficher.<br>
            Il reste la possibilité de renseigner ci-dessous la latitude et la longitude.
          </p>
        </div>
      </template>
    </div>
    
    <div id="form" class="p-1 md:p-4 text-xs order-3">
        <div class="mb-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          
          <button @click="save" class="bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-bold py-2 px-6 rounded transition duration-300 ease-in-out transform hover:scale-105">
              {{ $t('locationPicker.form.save') }}
          </button>

          <div class="flex items-center space-x-2 opacity-50 hover:opacity-100 px-3">
            <div class="flex items-center">
              <label for="latitude" class="mr-1">{{ $t('locationPicker.form.latitude') }}</label>
              <input type="number" id="latitude" step=".01" max="90" min="-90" v-model="newLatitude" @change="updateCenter" class="border rounded px-1 py-1 w-18">
            </div>
            <div class="flex items-center">
              <label for="longitude" class="mr-1">{{ $t('locationPicker.form.longitude') }}</label>
              <input type="number" id="longitude" step=".01" max="180" min="-180" v-model="newLongitude" @change="updateCenter" class="border rounded px-1 py-1 w-18">
            </div>
          </div>

          <button @click="cancel" class="text-gray-400 hover:text-blue-600 font-medium underline">
            annuler
          </button>
        </div>
      </div>

  </div>

</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();

import { fromLonLat, toLonLat } from 'ol/proj';
import { useContextStore } from '@/stores/contextStore';
import { storeToRefs } from 'pinia';

import Geocoder from "ol-geocoder/dist/ol-geocoder.js";
import 'vue3-openlayers/dist/vue3-openlayers.css'

import { useI18n } from 'vue-i18n'
const i18n = useI18n();

// GET LOCATION FROM LOCALSTORAGE
const contextStore = useContextStore()
let { latitude, longitude, location } = storeToRefs(contextStore)

// CREATE TMP VARIABLES
let newLatitude = ref();
let newLongitude = ref();
let newLocation = ref();
newLatitude.value = latitude.value;
newLongitude.value = longitude.value;
newLocation.value = location.value;

// ONLINE / OFFLINE STATUS
const isOnline = ref(window.navigator.onLine);
const updateOnlineStatus = () => {
  isOnline.value = window.navigator.onLine;
};

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// REFERENCE DOM ELEMENTS
const map = ref(null);
const view = ref(null);
const locateButton = ref(null)
const geolocation = ref(null);
// OPENLAYER SETUP
let zoomLevel = ref(localStorage.longitude ? 3 : 2)
const setupCoordinates = fromLonLat([longitude.value, latitude.value]);

// UPDATE LAT/LONG INPUTS WHEN USING THE MAP
function centerChanged(event) {
  let center = event.target.get("center");
  newLatitude.value = parseFloat(toLonLat(center)[1].toFixed(2));
  newLongitude.value = parseFloat(toLonLat(center)[0].toFixed(2));

  if(String(newLocation.value).startsWith(i18n.t('longitude')) || !newLocation.value)
    newLocation.value = i18n.t('longitude') + " " + parseInt(newLongitude.value);
}

// UPDATE CENTER OF THE MAP WHEN CHANGING LAT/LONG INPUTS
function updateCenter() {
  newLongitude = ((parseFloat(newLongitude) + 180) % 360) - 180;
  newLatitude = Math.max(-90, Math.min(90, newLatitude));
  view.value.setCenter(fromLonLat([newLongitude, newLatitude]));
}

// ASK SOMETIMES FOR HTML5 GEO API CALL// TRACK GPS
let trackUserLocation = ref(false);
watch(trackUserLocation, (isTracking) => console.log(geolocation.value/*.setTracking(isTracking)*/) );

const GPSChanged = (event) => {
  console.log("AAAAA", event.target.getPosition());
  view.value?.setCenter(event.target?.getPosition());
  //view.value.fit([loc[0], loc[1], loc[0], loc[1]], { maxZoom: 7 });
  trackUserLocation.value = false;
}

onMounted(() => {
    // Address search field
    const geocoder = new Geocoder('nominatim', {
        provider: 'photon',
        lang: 'fr-FR',
        placeholder: i18n.t('locationPicker.searchFor'),
        targetType: 'text-input',
        autoComplete: true,
        autoCompleteMinLength: 4,
        autoCompleteTimeout: 500,
        preventMarker: true,
        limit: 4,
        keepOpen: true,
    });
    geocoder.on('addresschosen', function(evt) {
        location.value = evt.place.address.city || evt.place.address.name || evt.place.address.state || evt.place.address.country;
    });
    map.value.map.addControl(geocoder);

});

// SAVE AND GO TO THE CLOCK
function save() {
    let locationPrompt = window.prompt(i18n.t('locationPicker.promptLocationName'), newLocation.value);
    contextStore.update(newLatitude.value, newLongitude.value, locationPrompt);
    const previousPage = route.query.from;
    if ((previousPage === '/time' || previousPage === '/13moons')) {
      router.back();
    } else {
      router.push('/time');
    }
}

import { useRoute } from 'vue-router';

const route = useRoute();

function cancel() {
  const previousPage = route.query.from;
  if ((previousPage === '/time' || previousPage === '/13moons') && !contextStore.isEmpty) {
    router.back();
  } else {
    router.push('/');
  }
}

</script>

<style lang="scss">
    #reticule{
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      background: url('@/assets/icon/reticule.svg') center no-repeat;
      background-size: cover;
    }

// GEOCODER
@import 'ol-geocoder/dist/ol-geocoder.min.css';

.ol-geocoder.gcd-txt-container {
    width: 35%;
    min-width: 250px;
    height: auto;
    top: .7em;
    left: auto;
    right: .7em;
    padding: 0;
}

.ol-geocoder .gcd-txt-control {
    position: relative;
    width: 100%;
    height: 2.375em;
}

.ol-geocoder .gcd-txt-input {
    height: 100%;
    padding: 5px 30px 5px 8px;
}

.ol-geocoder .gcd-txt-search::after {
    content: "\23CE";
    font-size: 1em;
}

.ol-geocoder .gcd-txt-glass {
    display: none;
}

.ol-geocoder ul.gcd-txt-result {
    top: 2.8em;
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    box-shadow: none; 
}

.ol-geocoder ul.gcd-txt-result > li > a:hover {
    background-color: #fff9c5;
}

.ol-geocoder ul.gcd-txt-result > li:nth-child(odd) {
    background-color: #f1f1f1;
}

</style>