<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useContextStore } from '@/stores/contextStore'

import { NaturalDate } from 'natural-time-js';
import { NaturalSunAltitude, NaturalSunEvents, NaturalMoonPosition, NaturalMoonEvents } from 'natural-time-js/context';

import ClockComponent from '@/components/ClockComponent.vue';
import LocationPicker from '@/components/LocationPicker.vue';

const i18n = useI18n();

const contextStore = useContextStore()
contextStore.initialize() 
let { latitude, longitude, location, currentTime } = storeToRefs(contextStore);

// Compute context
let context = computed(() => {
  // Compute date from Now + Variation
  let artificialDate = new Date(currentTime.value.getTime() + timeVariation.value);
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
  document.title = `${naturalDate.toTimeString(2, 5)} ${naturalDate.toLongitudeString()} ${location.value ? " | " + location.value : ""} | ${naturalDate.toDateString()} | ${i18n.t('nt')}`;

  return {
    naturalDate: naturalDate,
    artificialDate: artificialDate,
    sun: sun,
    moon: moon,
    dayProgression: dayProgression,
  };
});

let hemisphere = computed(() => latitude.value >= 0 ? 1 : -1)

let editLocation = ref(contextStore.coordinatesFrom === "default")

let timeVariation = ref(0);

onMounted(() => { });
onUnmounted(() => { contextStore.terminate() });

// Allows user to move through time with buttons
function timeTravel(event) {
    const variation = event.target.dataset.variation;
  if(variation == 0)
    timeVariation.value = 0

  timeVariation.value += variation * 1000;
}

// Make the UI shade away when idle
let uiOpacity = ref(0);
let timeoutUI = null;

function displayUI() {
  uiOpacity.value = 1;
  clearTimeout(timeoutUI);
  timeoutUI = setTimeout(() => {
    uiOpacity.value = 0;
  }, 5000);
}

</script>

<template>
  <div id="day-view" v-touch:rollover="displayUI" v-touch:release="displayUI">

<div id="backgrounds">
  <div id="stars" ></div>
  <div id="clouds"></div>
</div>

<div id="ClockComponent" v-if="!editLocation && context">
  <!-- DIAL ClockComponent -->
  <ClockComponent 
    :naturalDate="context.naturalDate"
    :sunContext="context.sun"
    :moonContext="context.moon"
    :hemisphere="hemisphere"
    :location="location"
    @editLocation="editLocation = true"
    ></ClockComponent>
</div>

<transition name="fade" mode="out-in">
<div id="location-picker" v-if="editLocation" :style="{backgroundColor: 'rgba(255,255,255,' + (1-context.dayProgression)*0.9 + ')'}">
  <LocationPicker @close="editLocation = false"></LocationPicker>
</div>
</transition>

<!-- TIME CONTROLS -->
<div id="time-controls" v-if="!editLocation" :class="timeVariation ? '' : 'UI'">
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

<div id="legend" v-if="!editLocation" @click="editLocation = true" :title="i18n.t('nav.editLocation')">
  {{ context.naturalDate }}
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
  
  #day-view{
  height: 100%;
  min-height: 555px;
}

#backgrounds {
  z-index: 0;
  background-color: rgba(0, 3, 13, calc(1 - var(--day-progression)));
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
  width: max(65vmin, calc(100vmin - calc((100vmin - 350px) / 2)));
  max-width: 888px;
  aspect-ratio: 1 / 1;
  transition: 1.5s;
  &.blur-me{
    filter: blur(10px);
    opacity: 0;
  }
}

#location-picker{
  position: relative;
  z-index: 5000;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 700px) and (min-height: 700px) {
  #location-picker{
    position: absolute;
  }
}

#time-controls{
  position: absolute;
  z-index: 4000;
  bottom: 3.5em;
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
    cursor: pointer;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
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
    &[data-variation='0']:not(:disabled){
      color: red;
    }
  }
}

#legend{
  position: absolute;
  z-index: 3000;
  bottom: 1.8em;
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
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
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