<template>
  <div id="display" class="relative" :style="{ width: `${containerSize * 2}px` }">
    <!-- DISPLAY: PLACEHOLDER -->
    <div v-if="!spiralSkin.showDisplay && spiralWelcomeMode" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div class="flex items-center font-extrabold display-container">
        <div class="text-center text-gray-400">
          <div class="digit">xxx</div>
          <div class="label uppercase">Année</div>
        </div>
        <div class="mx-3 text-gray-400 separator font-normal">)</div>
        <div class="text-center text-gray-400">
          <div class="digit">xx</div>
          <div class="label uppercase">Lune</div>
        </div>
        <div class="mx-3 text-gray-400 separator font-normal">)</div>
        <div class="text-center text-gray-400">
          <div class="digit">xx</div>
          <div class="label uppercase">Jour</div>
        </div>
      </div>
    </div>

    <!-- DISPLAY: YEAR ) MOON ) DAY -->
    <div v-else-if="!displayDate.isRainbowDay" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-x-2 space-y-4">
      <div class="flex items-center font-extrabold display-container">
        <div class="text-center">
          <div class="digit">{{displayDate.toYearString()}}</div>
          <div class="label uppercase">Année</div>
        </div>
        <div class="mx-3 text-gray-400 separator font-normal">)</div>
        <div class="text-center">
          <div class="digit">{{displayDate.toMoonString()}}</div>
          <div class="label uppercase">Lune</div>
        </div>
        <div class="mx-3 text-gray-400 separator font-normal">)</div>
        <div class="text-center" :style="{color:'rgb(var(--color-'+displayDate.dayOfWeek+'))'}">
          <div class="digit">{{displayDate.toDayOfMoonString()}}</div>
          <div class="label uppercase">Jour</div>
        </div>
      </div>
      <div v-if="spiralTimeTravelMode" class="text-slate-400 italic gregorian-date">
        ({{ new Date(context.naturalDate.unixTime).toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) }})
      </div>
    </div>

    <!-- DISPLAY: RAINBOW DAY -->
    <div v-else class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div class="flex items-center font-extrabold display-container">
        <div class="text-center">
          <div class="digit">&nbsp;</div>
          <div class="label uppercase">Arc</div>
        </div>
        <div class="text-center">
          <div class="digit">Jour</div>
          <div class="label uppercase">En</div>
        </div>
        <div class="text-center">
          <div class="digit">&nbsp;</div>
          <div class="label uppercase">Ciel</div>
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
  },
  containerSize: {
    type: Number,
    default: 800
  }
});

const configStore = useConfigStore();
const { spiralSkin, spiralTimeTravelMode, spiralWelcomeMode } = storeToRefs(configStore);
</script>

<style scoped>
.display-container {
  font-size: v-bind('`${containerSize * 0.2}px`');
  line-height: 1.1;
}

.label {
  font-size: v-bind('`${containerSize * 0.08}px`');
}

.separator {
  font-size: v-bind('`${containerSize * 0.17}px`');
}

.gregorian-date {
  font-size: v-bind('`${containerSize * 0.04}px`');
}
</style>
