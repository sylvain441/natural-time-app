<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n/index'
import { fromLonLat, toLonLat } from 'ol/proj';
import 'vue3-openlayers/dist/vue3-openlayers.css'

const router = useRouter();
const i18n = useI18n();

document.title = i18n.t('nt') + " | " + i18n.t('settings.title');

// ASK SOMETIMES FOR HTML5 GEO API CALL// TRACK GPS
const trackGeolocation = ref(false);
const geoLocChange = (loc) => {
  view.value.fit([loc[0], loc[1], loc[0], loc[1]], { maxZoom: 7 });
  trackGeolocation.value = false;
}

// GET LOCATION FROM LOCALSTORAGE
const latitude = ref(localStorage.latitude);
const longitude = ref(localStorage.longitude);
const location = ref(localStorage.location?.replace(/_/g, " ") || i18n.t('longitude') + " 0");

// ONLINE / OFFLINE STATUS
const isOnline = ref(window.navigator.onLine);
window.addEventListener('online',  () => { isOnline.value = window.navigator.onLine });
window.addEventListener('offline', () => { isOnline.value = window.navigator.onLine });

// OPENLAYER SETUP
const view = ref(null);
const zoomLevel = ref(localStorage.longitude ? 3 : 2)
const setupCoordinates = fromLonLat([longitude.value, latitude.value]);

// UPDATE LAT/LONG INPUTS WHEN USING THE MAP
function centerChanged(center) {
  latitude.value = parseFloat(toLonLat(center)[1].toFixed(2));
  longitude.value = parseFloat(toLonLat(center)[0].toFixed(2));

  if(String(location.value).startsWith(i18n.t('longitude')) || !location.value)
    location.value = i18n.t('longitude') + " " + parseInt(longitude.value);
}

// SAVE AND GO TO THE CLOCK
function save() {
  localStorage.location = location.value.replace(/\s/g, '_');
  localStorage.longitude = longitude.value;
  localStorage.latitude = latitude.value;
  localStorage.coordinatesFrom = 'user';
  
  router.push({name: 'time', params: {
    location: localStorage.location,
    latlng: localStorage.latitude + "," + localStorage.longitude
  }});
}

</script>

<template><div>
  
  <div id="backgrounds">
    <div id="milkyway"></div>
  </div>

  <div class="center-me">

    <!-- LEFT GLOBE -->
    <div class="left">
      <div class="circle">
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true">

          <ol-view ref="view" :center="setupCoordinates" :zoom="zoomLevel" @centerChanged="centerChanged" />
          <ol-geolocation :tracking="trackGeolocation" @positionChanged="geoLocChange"></ol-geolocation>

          <ol-zoom-control />

          <ol-tile-layer>
              <ol-source-osm />
          </ol-tile-layer>
            
        </ol-map>
      </div>
      <span class="reticule"></span>
    </div>

    <!-- RIGHT FORM -->
    <div class="right">
      <div class="circle">
        <div>
          <table>
            <tr>
              <td colspan="2"><h1>{{ $t('settings.title') }}</h1></td>
            </tr>
            <tr>
              <td>
                <label for="latitude">{{ $t('settings.form.latitude') }}</label><br>
                <input type="number" name="latitude" step=".01" size="4" v-model="latitude">
              </td>
              <td>
                <label for="longitude">{{ $t('settings.form.longitude') }}</label><br>
                <input type="number" name="longitude" step=".01" size="4" v-model="longitude">
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <label for="location">{{ $t('settings.form.location') }}</label><br>
                <input type="text" name="location" size="16" maxlength="30" v-model="location" v-on:keyup.enter="save">
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <a @click="trackGeolocation = true">{{ $t('settings.form.trackGPS') }}</a>
              </td>
              <td style="text-align: right;">
                <button @click="save" :disabled="!location || !latitude || !longitude">{{ $t('settings.form.save') }}</button>
              </td>
            </tr>
            <tr>
              <td colspan="2">_ - 0 - _</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>

</div></template>

<style lang="scss" scoped>

#backgrounds {
  z-index: 0;
  &, div {
    position: absolute;
    width: 100vw;
    height: 100vh;
    margin: 0;
  }
  #milkyway { 
    z-index: 10; 
    background: url("@/assets/background/milkyway.jpg") center center; 
    background-size: cover; 
  }
}



.center-me{
  position: absolute;
  width: 100%;
  aspect-ratio: 1.618 / 1;
  max-width: min(calc(85vh * 1.618), 92vw, 1234px);
  top: 55%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: #FFF;

  .circle{
    width: 78%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    overflow: hidden;
    & > div{
      width: 100%;
      height: 100%;
    }
  }

  .left{
    position: absolute;
    aspect-ratio: 1 / 1;
    height: 100%;
    z-index: 2000;
    top: 0;
    left: 0;
    background: url('@/assets/settings/globe-support.png') center no-repeat;
    background-size: cover;
    .circle{
      box-shadow: 0 0 123px transparentize($color: #000000, $amount: 0.5);
      background: radial-gradient(#13273d 0%, #080b1f 80%, #020309 100%);
      cursor: grab;
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
  }
  .right{
    position: absolute;
    aspect-ratio: 1 / 1;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 1000;
    .circle{
      box-shadow: 0 0 123px transparentize($color: #ffffff, $amount: 0.75);
      background: radial-gradient(#0b1a2a 0%, #080b1f 80%, #020309 100%);
      max-width: 350px;
      & > div{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transform: translateX(0%);
        table{
          margin-bottom: 1em;
          text-align: center;
          td{
            width: 50%;
            padding: .2em 0;
          }
          h1{
            font-size: 0.9em;
            font-weight: 300;
            letter-spacing: .03em;
            font-family: "Radio Canada", sans-serif;
            text-decoration: underline;
          }
          label{
            text-transform: uppercase;
            font-weight: bold;
            font-family: Monospace;
          }
          input{
            padding: .3em .5em;
            &[type='number']{
              max-width: 5em;
            }
          }
          button{
            border: none;
            padding: .3em .5em;
            margin-top: 1em;
            font-size: 0.9em;
            cursor: pointer;
          }
          a{
            font-size: 0.8em;
            transform: translateY(0.3em);
            font-weight: 300;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      
    }
  }
  
}

@media (max-width: 700px) and (orientation: portrait) {
  .center-me{
    aspect-ratio: 1 / 1.618;
    width: auto;
    max-width: none;
    max-height: min(80vh, calc(100vw * 1.618));
    height: 100%;
    .left{
      height: auto;
      width: 100%;
      top: 0;
      left: 0;
    }
    .right{
      z-index: 3000;
      height: auto;
      width: 100%;
      bottom: 0;
      left: 0;
      top: auto;
    }
  }
}

</style>

<style lang="scss">
  /* UNSCOPPED STYLING */
  .ol-zoom {
    top: 50%;
    left: .5em;
    transform: translateY(-50%);
  }
</style>