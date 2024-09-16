<template>
  <div id="day-view" class="flex flex-row h-screen overflow-hidden">
    
    <!-- Main content -->
    <div :class="['relative h-full transition-all duration-300 ease-in-out', (showSettings || showFAQ) ? 'w-0 md:block md:w-1/2 xl:w-2/3' : 'w-full']">
     
      <!-- APP menu -->  
      <MainMenu />

      <div class="fixed z-10 inset-0 h-full flex flex-col items-center justify-end" style="width: inherit;">
        
        <!-- ClockComponent -->
        <ClockComponent class="absolute w-full h-full"
          :context="context"
        ></ClockComponent>
        
        <!-- Bottom informations -->
        <div class="z-20 text-center" style="padding-bottom: 5vh;">
          <h1 class="text-slate-800 font-extrabold text-2xl mt-1">{{ contextStore.location || 'Natural Time' }}</h1>
          <h2 class="text-slate-400 text-xl mt-2">{{ context.naturalDate }}</h2>
          
          <!-- TIME CONTROLS -->
          <div v-if="showTimeControls" id="time-controls" class="relative z-20 bg-white mt-4 p-2 rounded-lg" style="background-image: url('https://www.transparenttextures.com/patterns/debut-light.png');">
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
            <button v-touch:tap="timeTravel" v-longclick="timeTravel"
              :data-variation="+365*24*60*60" :title="$t('timeControl.moveForward')+' 7 '+$t('timeControl.days')+' '+$t('timeControl.future')">+1y{{$t('timeControl.days')}}</button>
            <button @click="toggleTimeControls" class="absolute -top-6 -right-6 p-4 w-6 h-6 bg-gray-600 rounded-full text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right panel (keep w-1 -mr-1 to prevent map width == 0 error) -->
    <div :class="['z-30 transition-all duration-300 ease-in-out', (showSettings || showFAQ) ? 'w-screen md:w-1/2 xl:w-1/3 md:relative md:p-8' : 'w-1 -mr-1']">
      <div class="overflow-hidden w-full h-full bg-white md:rounded-2xl md:shadow-2xl">
        <!-- Close button -->
        <button v-if="showSettings || showFAQ" @click="closeRightPanel" 
                class="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-500 text-slate-200 focus:outline-none transition-all duration-300 hover:bg-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="overflow-hidden h-full">
          <SettingsComponent v-if="showSettings" @close="closeRightPanel" />
          <div v-if="showFAQ" id="faq" class="overflow-y-auto h-full">
            <div class="my-6 mx-4 md:my-8 md:mx-8">
              <FAQAccordion :categories="[2]" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings toggle button -->
    <button v-if="!showSettings && !showFAQ" @click="toggleSettings" class="fixed top-4 right-4 z-30 p-2 rounded-full bg-slate-500 text-slate-200 focus:outline-none transition-all duration-300 hover:bg-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </button>

    <!-- FAQ toggle button -->
    <button v-if="!showSettings && !showFAQ" @click="toggleFAQ" class="fixed top-16 right-4 z-30 p-2 rounded-full bg-slate-500 text-slate-200 focus:outline-none transition-all duration-300 hover:bg-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </button>
      
    <!-- DEFINE GLOBAL CSS VARS -->
    <component :is="'style'">
      :root {
        --hemisphere: {{context.hemisphere}};
        --day-progression: {{context.dayProgression}};
        --abs-day-progression: {{Math.abs(context.dayProgression * 2 - 1)}}; /* close to sunrise and sunset */
      }
    </component>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia'
import { NaturalDate } from '../../../natural-time-js';
import { NaturalSunAltitude, NaturalSunEvents, NaturalMoonPosition, NaturalMoonEvents, MustachesRange } from '../../../natural-time-js/context';
import ClockComponent from '@/components/ClockComponent.vue';
import SettingsComponent from '@/components/SettingsComponent.vue';
import FAQAccordion from '@/components/FAQAccordion.vue';
import MainMenu from '@/components/MainMenu.vue';

// CONTEXT STORE
import { useContextStore } from '@/stores/contextStore'
const contextStore = useContextStore()

// I18N
import { useI18n } from 'vue-i18n'
const i18n = useI18n();

let { latitude, longitude, location, currentTime } = storeToRefs(contextStore);

// Compute context
let context = computed(() => {
  // Compute date from Now + Variation
  let naturalDate = new NaturalDate(new Date(currentTime.value.getTime() + timeVariation.value), longitude.value);

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

  let mustaches = MustachesRange(naturalDate, latitude.value);

  let hemisphere = latitude.value >= 0 ? 1 : -1;

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

  // UPDATE PAGE TITLE TODO: make this reactive
  document.title = `${naturalDate.toTimeString(2, 5)} ${naturalDate.toLongitudeString()} ${location.value ? " | " + location.value : ""} | ${naturalDate.toDateString()} | ${i18n.t('nt')}`;

  return {
    naturalDate: naturalDate,
    sun: sun,
    moon: moon,
    mustaches: mustaches,
    hemisphere: hemisphere,
    dayProgression: dayProgression,
  };
});

let timeVariation = ref(0);

// Allows user to move through time with buttons
function timeTravel(event) {
    const variation = event.target.dataset.variation;
  if(variation == 0)
    timeVariation.value = 0

  timeVariation.value += variation * 1000;
}

const showSettings = ref(false);
const showFAQ = ref(false);
const showTimeControls = ref(false);

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
  if (showSettings.value) {
    showFAQ.value = false;
  }
};

const toggleFAQ = () => {
  showFAQ.value = !showFAQ.value;
  if (showFAQ.value) {
    showSettings.value = false;
  }
};

const toggleTimeControls = () => {
  showTimeControls.value = !showTimeControls.value;
};

const closeRightPanel = () => {
  showSettings.value = false;
  showFAQ.value = false;
  contextStore.restoreFromLocalStorage();
};

</script>

<style lang="scss">
#day-view {
  position: relative;
  overflow: hidden;
  background-image: url("https://www.transparenttextures.com/patterns/debut-light.png");
  background-repeat: repeat;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  // Night gradient
  &::before {
    background: radial-gradient(circle at center, #071135, #000000);
    opacity: calc((1 - var(--day-progression)) * 0.8);
  }

  // Day gradient
  &::after {
    background: radial-gradient(circle at center, #ffffff, #d5f7fd);
    opacity: calc(var(--day-progression) *0.5);
  }
}

#faq{
  .faq-question{
    @apply text-sm;
  }
  .faq-answer{
    @apply text-sm;
  }
}
</style>