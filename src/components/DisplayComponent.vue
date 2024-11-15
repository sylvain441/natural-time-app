<template>
  <div id="display" class="relative" :class="{'w-1/2 h-1/4': !spiralSkin.singleMoonView}">
    <!-- DISPLAY: PLACEHOLDER -->
    <div v-if="!spiralSkin.showDisplay && spiralWelcomeMode" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div class="flex items-center font-radio text-7xl font-bold">
        <div class="text-center text-gray-400">
          <div class="digit">xxx</div>
          <div class="label uppercase text-4xl">Année</div>
        </div>
        <div class="mx-3 text-7xl text-gray-400">)</div>
        <div class="text-center text-gray-400">
          <div class="digit">xx</div>
          <div class="label uppercase text-4xl">Lune</div>
        </div>
        <div class="mx-3 text-7xl text-gray-400">)</div>
        <div class="text-center text-gray-400">
          <div class="digit">xx</div>
          <div class="label uppercase text-4xl">Jour</div>
        </div>
      </div>
    </div>

    <!-- DISPLAY: YEAR ) MOON ) DAY -->
    <div v-else-if="!displayDate.isRainbowDay" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-x-2 space-y-4">
      <div class="flex items-center font-radio text-7xl font-bold">
        <div class="text-center">
          <div class="digit">{{displayDate.toYearString()}}</div>
          <div class="label uppercase text-4xl">Année</div>
        </div>
        <div class="mx-3 text-7xl text-gray-400">)</div>
        <div class="text-center">
          <div class="digit">{{displayDate.toMoonString()}}</div>
          <div class="label uppercase text-4xl">Lune</div>
        </div>
        <div class="mx-3 text-7xl text-gray-400">)</div>
        <div class="text-center" :style="{color:'rgb(var(--color-'+displayDate.dayOfWeek+'))'}">
          <div class="digit">{{displayDate.toDayOfMoonString()}}</div>
          <div class="label uppercase text-4xl">Jour</div>
        </div>
      </div>
      <!-- Add gregorian date below only in time travel mode -->
      <div v-if="spiralTimeTravelMode" class="text-slate-400 text-xl italic">
        (eq. {{ new Date(context.naturalDate.unixTime).toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) }})
      </div>
    </div>

    <!-- DISPLAY: RAINBOW DAY -->
    <div v-else class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div class="flex items-center font-radio text-7xl font-bold">
        <div class="text-center">
          <div class="digit">&nbsp;</div>
          <div class="label uppercase text-4xl">Arc</div>
        </div>
        <div class="text-center">
          <div class="digit">Jour</div>
          <div class="label uppercase text-4xl">En</div>
        </div>
        <div class="text-center">
          <div class="digit">&nbsp;</div>
          <div class="label uppercase text-4xl">Ciel</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/configStore';

const props = defineProps({
  displayDate: {
    type: Object,
    required: true
  },
  context: {
    type: Object,
    required: true
  }
});

const configStore = useConfigStore();
const { spiralSkin, spiralTimeTravelMode, spiralWelcomeMode } = storeToRefs(configStore);
</script>
