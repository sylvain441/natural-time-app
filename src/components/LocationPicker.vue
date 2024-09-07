<script setup>
import { onMounted, ref, defineEmits, watch } from "vue";
import { useI18n } from 'vue-i18n'
import { fromLonLat, toLonLat } from 'ol/proj';
import { useContextStore } from '@/stores/contextStore';
import { storeToRefs } from 'pinia';

import Geocoder from "ol-geocoder/dist/ol-geocoder.js";
import Control from 'ol/control/Control';
import Geolocation from 'ol/Geolocation';
import ElementIcon from '@/components/ElementIcon.vue';
// import "ol-geoco er/dist/ol-geocoder.min.css"; // Overriden below

import 'vue3-openlayers/dist/vue3-openlayers.css'

const i18n = useI18n();
const emit = defineEmits(['close']);

// GET LOCATION FROM LOCALSTORAGE
const contextStore = useContextStore()
contextStore.initialize() 
let { latitude, longitude, location } = storeToRefs(contextStore)

// CREATE TMP VARIABLES
let newLatitude = latitude;
let newLongitude = longitude;
let newLocation = location;

// ONLINE / OFFLINE STATUS
let isOnline = ref(window.navigator.onLine);
window.addEventListener('online',  () => { isOnline.value = window.navigator.onLine });
window.addEventListener('offline', () => { isOnline.value = window.navigator.onLine });

// REFERENCE DOM ELEMENTS
const map = ref(null);
const view = ref(null);
const modal = ref(null);
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
  newLongitude.value = ((parseFloat(newLongitude.value) + 180) % 360) - 180;
  newLatitude.value = Math.max(-90, Math.min(90, newLatitude.value));
  view.value.setCenter(fromLonLat([newLongitude.value, newLatitude.value]));
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
    // Geolocation button
    map.value.map.addControl( new Control({ element: locateButton.value }) );
    
    // Address search field
    const geocoder = new Geocoder('nominatim', {
        provider: 'photon',
        lang: 'fr-FR',
        placeholder: i18n.t('locationPicker.searchFor'),
        targetType: 'text-input',
        autoComplete: true,
        autoCompleteMinLength: 4,
        autoCompleteTimeout: 500,
        limit: 4,
        keepOpen: true,
    });
    geocoder.on('addresschosen', function(evt) {
        location.value = evt.place.address.city || evt.place.address.name || evt.place.address.state || evt.place.address.country;
    });
    map.value.map.addControl(geocoder);

    // focus on the <div> to catch ESC events
    modal.value.focus();
});

// SAVE AND GO TO THE CLOCK
function save() {
    let locationPrompt = window.prompt(i18n.t('locationPicker.promptLocationName'), newLocation.value);

    if(locationPrompt == null) 
      return;

    contextStore.setCoordinates(newLatitude.value, newLongitude.value);
    contextStore.setLocation(locationPrompt);
    emit('close');
}

</script>

<template>
<div id="modal" ref="modal" @keydown.esc="emit('close');" tabindex="-1">
    <h1>
        {{ $t('locationPicker.title.line1') }}
        <small>{{ $t('locationPicker.title.line2') }}</small>
        <span>{{ $t('locationPicker.title.line3') }}</span>
        <div id="close-location-picker" @click="emit('close');">&#x2715;</div>
    </h1>

    <div id="map">
        <ol-map id="map-canvas" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" ref="map">

          <ol-view ref="view" :center="setupCoordinates" :zoom="zoomLevel" @change:center="centerChanged" />
          <ol-geolocation ref="geolocation" :tracking="trackUserLocation" @change:position="GPSChanged"></ol-geolocation>

          <ol-zoom-control />

          <div class="ol-control ol-unselectable locate" ref="locateButton" :class="{'is-tracking': trackUserLocation}">
            <button :title="i18n.t('locationPicker.locateMe')" @click="trackUserLocation = !trackUserLocation"><img src="@/assets/icon/geolocation.svg"></button>
          </div>

          <ol-tile-layer>
              <ol-source-osm />
          </ol-tile-layer>
            
        </ol-map>

        <span class="reticule"></span>

        <div id="form">
            <label for="latitude">{{ $t('locationPicker.form.latitude') }}&nbsp;<input type="number" id="latitude" step=".01" size="5" max="90" min="-90" v-model="newLatitude" @change="updateCenter"></label>&nbsp;&nbsp;
            <label for="longitude">{{ $t('locationPicker.form.longitude') }}&nbsp;&nbsp;<input type="number" id="longitude" step=".01" size="5" max="180" min="-180" v-model="newLongitude" @change="updateCenter"></label>
        </div>
    </div>

    <p>
      <button @click="save">{{ $t('locationPicker.form.save') }}</button>
      {{ $t('locationPicker.advise') }}
    </p>

    <div id="decoration">
        <div v-for="color = 1 in 7">
            <ElementIcon :element="4 - Math.abs(4 - color)" :color="color"></ElementIcon>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>

#modal{
    padding: 100px 20px;
    font-size: min(calc(100vw * 0.04), 20px);
    max-width: 500px;
    margin: auto;
    border-radius: 10px;
    &:focus{
        outline: none;
    }
}

h1{
    position: relative;
    margin: 0;
    font-family: "Radio Canada", sans-serif;
    font-weight: 700;
    color: #4D4D59;
    span, small{
        display: block;
    }
    small{
        line-height: 1.25;
        font-weight: 500;
        font-size: .6em;
    }
    span{
        line-height: 1.2;
        font-size: 1.1em;
        text-transform: uppercase;
    }

    #close-location-picker{
        z-index: 1000;
        position: absolute;
        top: 0;
        right: 0;
        font-size: .8em;
        font-weight: bold;
        transform: translateY(-25%);
        cursor: pointer;
        color: #4D4D59;
        &:hover{
            color: #292930;
        }
    }
}

#clock{
  position: absolute;
  top: 0;
  right: 2%;
  width: 40%;
  transform: rotate(4deg) translateY(-65%);
  filter: blur(1px);
  opacity: .25;
  font-size: 16px;
}

#map{
    position: relative;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    aspect-ratio: 1.44 / 1;
    #map-canvas{
        width: 100%;
        height: 100%;
        border-radius: 16px;
        overflow: hidden;
        background-color: #ABD3DD;
    }
    span.reticule{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      display: block;
      width: 20px;
      aspect-ratio: 1 / 1;
      background: url('@/assets/icon/reticule.svg') center no-repeat;
      background-size: cover;
    }

    #form{
        display: block;
        position: absolute;
        bottom: .5em;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        font-size: 0.8em;
        font-family: "Helvetica Neue", sans-serif;
        font-style: italic;
        padding: 3px 20px;
        color: rgb(66, 66, 66);
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 6px;
        p{
            margin-top: 0;
            input{
                margin: 4px 0;
            }
        }
        label{
            white-space: nowrap;
        }
        input{
            display: inline-block;
            border: none;
            padding: 3px 7px;
            margin: 3px 0;
            border-radius: 3px;
            background-color: rgb(234, 234, 234);
        }
    }


    @media screen and (-webkit-min-device-pixel-ratio:0) {
      input{
        max-width: 60px;
        &:focus {
        font-size: 16px;
      }
      }
    }

}

p{
    font-family: "Helvetica Neue", sans-serif;
    font-style: italic;
    font-size: 0.6em;
    color: #999999;
    button{
      float: right;
      padding: .4em .8em;
      margin: 0 .8em;
      background-color: #eaeaeb;
    font-size: 1.2em;
      font-style: normal;
      border-radius: 6px;
      cursor: pointer;
      white-space: no-wrap;
      &:hover{
          box-shadow: 0 0 5px transparentize(#000, .8);
      }
    }
}

#decoration{
  clear: both;
    text-align: center;
    opacity: .8;
    transform: translateY(1.3em);
    height: 0;
    div{
        display: inline-block;
        width: 1.4em;
        padding: 0.4em;
    }
}

@media screen and (min-width: 700px) and (min-height: 700px) {
    #modal{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: max(80vmin, calc(100vmin - calc((100vmin - 350px) / 2)));
        max-width: 700px;
        padding: 40px;
    }
    #map{
        width: 100%;
        aspect-ratio: 1.618 / 1;
    }
}

</style>

<style lang="scss">

// Those styles need to be unscoped

.locate{
    top: .5em;
    right: .5em;
    cursor: pointer;
    &.is-tracking{
        animation: beam 2s linear infinite;
    }
    @keyframes beam {  
        50% { opacity: 0; }
    }
}

/*!
 * ol-geocoder - v4.1.2
 * A geocoder extension for OpenLayers.
 * https://github.com/jonataswalker/ol-geocoder
 * Built: Wed Jan 20 2021 10:05:07 GMT-0300 (Brasilia Standard Time)
 */
.ol-touch .ol-control.gcd-gl-control button {
  font-size: 1.14em; }

.ol-touch .ol-geocoder.gcd-gl-container {
  font-size: 1.1em; }

.ol-geocoder.gcd-gl-container {
  position: absolute;
  top: calc(50% - 4.8em);
  left: .5em;
  box-sizing: border-box;
  font-size: 0.9em; }
  .ol-geocoder.gcd-gl-container *,
  .ol-geocoder.gcd-gl-container *::before,
  .ol-geocoder.gcd-gl-container *::after {
    box-sizing: inherit; }

.ol-geocoder .gcd-gl-control {
  width: 1.9em;
  height: 1.9em;
  overflow: hidden;
  transition: width 200ms, height 200ms; }

.ol-geocoder .gcd-gl-expanded {
  width: 15.625em;
  //! height: 2.1875em; 
  }

.ol-geocoder .gcd-gl-input {
  position: absolute;
  z-index: 99;
  top: 0.25em;
  left: 2.5em;
  width: 14.84375em;
  padding: 5px;
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: 0.875em;
  background-color: #fff;
  color: #222; }
  .ol-geocoder .gcd-gl-input:focus {
    border: none;
    outline: none;
    box-shadow: inset 0 0 0 1px #4d90fe, inset 0 0 5px #4d90fe; }

  @media screen and (-webkit-min-device-pixel-ratio:0) {
    #gcd-input-query{
      font-size: 16px;
    }
  }

.ol-geocoder .gcd-gl-reset {
  position: absolute;
  z-index: 100;
  top: 0em;
  right: 0.4em;
  width: 1.4em;
  height: 1.4em;
  line-height: 1.4;
  border: none;
  background-color: transparent;
  display: inline-block;
  outline: 0;
  cursor: pointer; }
  .ol-geocoder .gcd-gl-reset::after {
    content: "\d7";
    display: inline-block;
    color: #333;
    font-size: 1.4em;
    cursor: pointer; }

.ol-geocoder .gcd-gl-btn {
  position: absolute;
  width: 1.5625em;
  height: 1.5625em;
  top: 0.135em;
  left: 0.125em;
  background-size: 1.2em;
  background-image: url("@/assets/icon/search.svg");
  background-repeat: no-repeat;
  background-position: center center; }

.ol-geocoder ul.gcd-gl-result {
  position: absolute;
  top: 2.1875em;
  left: 2.3em;
  width: 16.25em;
  max-height: 18.75em;
  white-space: normal;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: white;
  border-radius: 4px;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  overflow-x: hidden;
  overflow-y: auto;
  //box-shadow: 0 1px 7px rgba(0, 0, 0, 0.8);
  transition: max-height 300ms ease-in; }
  .ol-geocoder ul.gcd-gl-result > li {
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    padding: 0;
    line-height: 0.875rem; }
    .ol-geocoder ul.gcd-gl-result > li > a {
      display: block;
      text-decoration: none;
      padding: 3px 5px; }
      .ol-geocoder ul.gcd-gl-result > li > a:hover {
        background-color: #d4d4d4; }
  .ol-geocoder ul.gcd-gl-result > li:nth-child(odd) {
    background-color: #f1f1f1; }

.ol-geocoder ul.gcd-gl-result:empty {
  display: none; }

.ol-geocoder.gcd-txt-container {
  position: absolute;
  width: 40%; //width: 25em;
  height: auto; //height: 4.375em;
  top: 0; //top: .5em;
  right: 2.5em; //left: calc(50% - 12.5em);
  padding: 10px; //!
  box-sizing: border-box; }
  .ol-geocoder.gcd-txt-container *,
  .ol-geocoder.gcd-txt-container *::before,
  .ol-geocoder.gcd-txt-container *::after {
    box-sizing: inherit; }

.ol-geocoder .gcd-txt-control {
  position: relative;
  width: 100%;
  border-radius: 6px; //!
  height: 1.6em; //height: 4.375em;
  border: none; //border: 1px solid #ccc;
  background-color: #fff;
  overflow: hidden; }

.ol-geocoder .gcd-txt-input {
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2px 40px 2px 15px;
  border: none;
  //!text-indent: 6px;
  background-color: transparent;
  font-family: inherit;
  font-size: 0.875em; }
  .ol-geocoder .gcd-txt-input:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px #4d90fe55, inset 0 0 6px #4d90fe55; }

.ol-geocoder .gcd-txt-reset {
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  width: 2.5em;
  height: 100%;
  line-height: 100%;
  border: none;
  background-color: transparent;
  display: inline-block;
  vertical-align: middle;
  outline: 0;
  cursor: pointer; }
  .ol-geocoder .gcd-txt-reset::after {
    content: "\d7";
    display: inline-block;
    color: #333;
    font-size: 2em;
    cursor: pointer; }

.ol-geocoder .gcd-txt-glass {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  display: inline-block;
  display: none;
  width: 2.2em;
  height: 100%;
  background-size: 1em; //background-size: 1.38889em;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23333' d='M29.156 29.961l-.709.709a2.006 2.006 0 0 1-2.838 0l-5.676-5.674c-.656-.658-.729-1.644-.281-2.412l-3.104-3.102a9.975 9.975 0 0 1-5.965 1.979C5.043 21.461.552 16.97.552 11.43S5.043 1.398 10.583 1.398c5.541 0 10.031 4.491 10.031 10.032 0 2.579-.98 4.923-2.58 6.7l3.035 3.035c.768-.447 1.754-.375 2.41.283l5.676 5.674c.784.785.784 2.056.001 2.839zM18.088 11.389c0-4.155-3.369-7.523-7.524-7.523a7.523 7.523 0 1 0-.001 15.046 7.525 7.525 0 0 0 7.525-7.523z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center center; }

.ol-geocoder ul.gcd-txt-result {
  //! position: absolute;
  //! top: 4.575em;
  //! left: 0;
  margin: .4em 0;
  width: 100%; //width: 25em;
  max-height: 18.75em;
  white-space: normal;
  list-style: none;
  padding: 0;
  background-color: white;
  border-radius: 6px; //border-radius: 4px;
  border-top: none;
  //! border-top-left-radius: 0;
  //! border-top-right-radius: 0;
  overflow-x: hidden;
  overflow-y: auto;
  //! box-shadow: 0 1px 7px rgba(0, 0, 0, 0.8);
  transition: max-height 300ms ease-in; }
  .ol-geocoder ul.gcd-txt-result > li {
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    padding: 0;
    line-height: 0.875rem; }
    .ol-geocoder ul.gcd-txt-result > li > a {
      display: block;
      text-decoration: none;
      padding: 3px 5px; }
      .ol-geocoder ul.gcd-txt-result > li > a:hover {
        background-color: #d4d4d4; }
  .ol-geocoder ul.gcd-txt-result > li:nth-child(odd) {
    background-color: #eeeeee; }

.ol-geocoder ul.gcd-txt-result:empty {
  display: none; }

.ol-geocoder .gcd-hidden {
  opacity: 0;
  visibility: hidden; }

.ol-geocoder .gcd-pseudo-rotate::after {
  -webkit-animation: spin .7s linear infinite;
          animation: spin .7s linear infinite; }

@-webkit-keyframes spin {
  from {
    transform: rotate(0deg); }
  to {
    transform: rotate(360deg); } }

@keyframes spin {
  from {
    transform: rotate(0deg); }
  to {
    transform: rotate(360deg); } }

.gcd-address {
  font-size: 0.875em;
  font-weight: 500;
  color: #333; }

.gcd-road {
  font-size: 0.875em;
  font-weight: 500;
  color: #333; }

.gcd-city {
  font-size: 0.75em;
  font-weight: normal;
  color: #333; }

.gcd-country {
  font-size: 0.75em;
  font-weight: lighter;
  color: #333; }

</style>