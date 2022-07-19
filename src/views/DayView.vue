<script setup>

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';

import { NaturalDate } from 'natural-time-js';
import { NaturalSunAltitude, NaturalSunEvents, NaturalMoonPosition, NaturalMoonEvents } from '../../../natural-time-js/context';

import ClockComponent from '@/components/ClockComponent.vue';

const route = useRoute();
const router = useRouter();

// Search for GPS coordinates in URL
if(!route.params.latlng) {
  if(!localStorage.latitude || !localStorage.longitude)
    router.push({name: 'settings'});
  else {
    router.push({name: 'time', params: {
      latlng: localStorage.latitude+','+localStorage.longitude,
      location: localStorage.location || null
    }});
  }
}

// Initialize date
const date = ref(Date.now());

// Update clock automatically
let timerInterval = null;
onMounted(() => { timerInterval = setInterval(() => date.value = Date.now(), 1200) });
onUnmounted(() => { clearInterval(timerInterval) });

// Get coordinates from LOCAL STORAGE > DEFAULT
const	latitude = ref(parseFloat(localStorage.latitude) || 42.42);
const longitude = ref(parseFloat(localStorage.longitude) || 0);
const location = ref(route.params.location || localStorage.location || "");

// Overwrite with URL params if present
if(route.params.latlng) {
  latitude.value = parseFloat(route.params.latlng.split(',')[0]);
  longitude.value = parseFloat(route.params.latlng.split(',')[1]);
  
  // When coming for the first time record the URI into localStorage
  if(!localStorage.latitude) localStorage.latitude = latitude.value;
  if(!localStorage.longitude) localStorage.longitude = longitude.value;
  if(!localStorage.location) localStorage.location = location.value;
}

const context = computed(() => {

  // Compute date from Now + Variation
  let artificialDate = new Date(date.value + timeVariation.value);
  let naturalDate = new NaturalDate(artificialDate, longitude.value);
  
  // Compute Sun data
  let sun = { 
    ...NaturalSunAltitude(naturalDate, latitude.value),
    ...NaturalSunEvents(naturalDate, latitude.value)
  };

  // Compute Moon data
  let moon = {
    ...NaturalMoonPosition(naturalDate, latitude.value),
    ...NaturalMoonEvents(naturalDate, latitude.value)
  };

  // Calculate luminosity progression for day/night mode
  let dayProgression = 0;

  let dayPeriods = [
    {rangeStart: sun.morningGoldenHour, rangeStop: sun.eveningGoldenHour, start: 1, stop: 1},
    {rangeStart: sun.nightEnd, rangeStop: sun.morningGoldenHour, start: 0, stop: 1},
    {rangeStart: sun.eveningGoldenHour, rangeStop: sun.nightStart, start: 1, stop: 0},
  ];

  for(let step of dayPeriods) {
    if(naturalDate.time >= step.rangeStart & naturalDate.time < step.rangeStop) {
      dayProgression = step.start + (step.stop - step.start) * ((naturalDate.time - step.rangeStart) / (step.rangeStop - step.rangeStart));
    }
  }

  // UPDATE PAGE TITLE
  document.title = `${naturalDate.toTimeString(2, 5)} ${naturalDate.toLongitudeString()} | ${location.value} | ${naturalDate.toDateString()}`;

	return {
		naturalDate: naturalDate,
		artificialDate: artificialDate,
		sun: sun,
		moon: moon,
		dayProgression: dayProgression,
	};
});

// Hemisphere
const hemisphere = computed(() => latitude.value >= 0 ? 1 : -1)

const timeVariation = ref(0);
// Allows user to move through time with buttons
function timeTravel(event) {
  const variation = event.target.dataset.variation;
  if(variation == 0)
    timeVariation.value = 0

  timeVariation.value += variation * 1000;
}

// Make the UI shade away when idle
const uiOpacity = ref(0);
let timeoutUI = null;

function displayUI() {
  uiOpacity.value = 1;
  clearTimeout(timeoutUI);
  timeoutUI = setTimeout(() => {
    uiOpacity.value = 0;
  }, 5000);
}

// Update current location from URI change
onBeforeRouteUpdate((to, from) => {
  if(to.params.length && !to.params.latlng.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/)) {
    router.push({name: 'settings'});
  } else {
    if(to.params.latlng !== undefined) {
      latitude.value = parseFloat(to.params.latlng.split(',')[0]);
      longitude.value = parseFloat(to.params.latlng.split(',')[1]);
    }
    if(to.params.location !== undefined) {
      location.value = to.params.location;
    }
  }
});

</script>

<template>

<div v-touch:rollover="displayUI" v-touch:release="displayUI">

  <div id="backgrounds">
    <div id="stars" ></div>
    <div id="clouds"></div>
  </div>

  <div id="ClockComponent">

    <!-- DIAL ClockComponent -->
    <ClockComponent 
      :naturalDate="context.naturalDate"
      :sunContext="context.sun"
      :moonContext="context.moon"
      :hemisphere="hemisphere"
      :location="location"
      ></ClockComponent>
  </div>

  <!-- TIME CONTROLS -->
  <div id="time-controls" :class="timeVariation ? '' : 'UI'">
    <button v-touch:tap="timeTravel" v-longclick="timeTravel"
      :data-variation="-7*86400" :title="$t('timeControl.moveBackward')+' 7 '+$t('timeControl.days')+' '+$t('timeControl.past')">-7{{$t('timeControl.days')}}</button>
    <button v-touch:tap="timeTravel" v-longclick="timeTravel"
      :data-variation="-24*3600" :title="$t('timeControl.moveBackward')+' 1 '+$t('timeControl.day')+' '+$t('timeControl.past')">-360°</button>
    <button v-touch:tap="timeTravel" v-longclick="timeTravel"
      :data-variation="-8*60" :title="$t('timeControl.moveBackward')+' 2 '+$t('timeControl.degrees')+' '+$t('timeControl.past')">-2°</button>
    <button v-touch:tap="timeTravel" :disabled="timeVariation == 0"
      :data-variation="0" :title="$t('timeControl.resetTitle')">{{ $t('timeControl.reset') }}</button>
    <button v-touch:tap="timeTravel" v-longclick="timeTravel"
      :data-variation="+8*60" :title="$t('timeControl.moveForward')+' 2 '+$t('timeControl.degrees')+' '+$t('timeControl.future')">+2°</button>
    <button v-touch:tap="timeTravel" v-longclick="timeTravel"
      :data-variation="+24*60*60" :title="$t('timeControl.moveForward')+' 1 '+$t('timeControl.day')+' '+$t('timeControl.future')">+360°</button>
    <button v-touch:tap="timeTravel" v-longclick="timeTravel"
      :data-variation="+7*24*60*60" :title="$t('timeControl.moveForward')+' 7 '+$t('timeControl.days')+' '+$t('timeControl.future')">+7{{$t('timeControl.days')}}</button>
  </div>

  <div id="legend">
    {{ context.naturalDate }}<br>
    <small><strong>{{ $t("nt") }}</strong></small>
  </div>

  <!-- DEFINE GLOBAL CSS VARS -->
  <component :is="'style'">
    :root {
      --hemisphere: {{hemisphere}};
      --day-progression: {{context.dayProgression}};
      --day-saturation: saturate({{0.4 + context.dayProgression * 0.6}});
      --ui-opacity: {{uiOpacity}};
    }
  </component>

</div>

</template>

<style lang="scss">

#backgrounds {
  z-index: 0;
  &, div {
    position: absolute;
    width: 100vw;
    height: 100vh;
    margin: 0;
  }
  #stars { 
    z-index: 10; 
    background: url("@/assets/background/stars.jpg") center center; 
    background-size: cover; 
  }
  #clouds {
    z-index: 40; 
    background: url("@/assets/background/clouds.jpg") center center; 
    background-size: cover;
    opacity: var(--day-progression);
  }
}

#ClockComponent {
  position: absolute;
  z-index: 3000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: max(80vmin, calc(100vmin - calc((100vmin - 350px) / 2)));
  max-width: 888px;
  aspect-ratio: 1 / 1;
}

#time-controls{
  position: absolute;
  z-index: 4000;
  bottom: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  button{
    background-color: transparentize(#FFF, .2);
    border: none;
    border-radius: 5px;
    padding: .3em .5em;
    margin: .4em;
    font-size: 0.7em;
    transition: .3s;
    transition-delay: .1s;
    &:disabled{
      opacity: .5;
    }
    &:not(:disabled){
      &:hover{
        box-shadow: 0 0 5px transparentize(#000, .8);
      }
      &:active{
        transform: scale(1.2);
      }
    }
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
}

#legend{
  position: fixed;
  z-index: 3000;
  bottom: 1em;
  left: 50%;
  transform: translateX(-50%);
  font-family: Monospace;
  text-align: center;
  color: #7B7A8B;
  opacity: .65;
  font-size: 1.1em;
  text-transform: uppercase;
  word-break: normal;
  width: 100%;
}

@media (max-height: 500) and (orientation: landscape) {
  #time-controls{
    flex-direction: column;
    width: auto;
    height: 100%;
    right: 3%;
    bottom: 0;
  }
}

.UI{
  opacity: var(--ui-opacity);
  transition: opacity 1s;
}

</style>
