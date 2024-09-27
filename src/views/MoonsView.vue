<template>
  <div id="moons-view" class="relative w-full h-screen bg-sky-50 bg-texture">
    <div id="year" class="relative w-384 transition-all duration-800 delay-100">
      <!-- Display component -->
      <div id="display" class="relative">
        <!-- DISPLAY: YEAR ) MOON ) DAY -->
        <div v-if="!displayDate.isRainbowDay" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer">
          <div class="flex items-center font-radio text-7xl font-bold">
            <div class="text-center">
              <div class="digit">{{displayDate.toYearString()}}</div>
              <div class="label uppercase text-4xl">Année</div>
            </div>
            <div class="mx-2 text-7xl" :style="{color:'var(--color-'+displayDate.dayOfWeek+')'}">)</div>
            <div class="text-center">
              <div class="digit">{{displayDate.toMoonString()}}</div>
              <div class="label uppercase text-4xl">Lune</div>
            </div>
            <div class="mx-2 text-7xl" :style="{color:'var(--color-'+displayDate.dayOfWeek+')'}">)</div>
            <div class="text-center">
              <div class="digit">{{displayDate.toDayOfMoonString()}}</div>
              <div class="label uppercase text-4xl">Jour</div>
            </div>
          </div>
          <div class="flex items-center justify-center text-gray-600 font-mono text-xl mt-2">
            <div class="time">{{ location ? location.replace(/_/g, " ") + " | " : "" }}{{ today.toTimeString(2,5) }} {{ today.toLongitudeString() }}</div>
          </div>
        </div>
        
        <!-- DISPLAY: RAINBOW DAY -->
        <div v-else class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer">
          <div class="flex items-center font-radio text-7xl font-bold">
            <div class="text-center">
              <div class="digit">&nbsp;</div>
              <div class="label uppercase text-4xl">Arc</div>
            </div>
            <div class="mx-2 text-7xl">)</div>
            <div class="text-center">
              <div class="digit">Jour</div>
              <div class="label uppercase text-4xl">En</div>
            </div>
            <div class="mx-2 text-7xl">)</div>
            <div class="text-center">
              <div class="digit">&nbsp;</div>
              <div class="label uppercase text-4xl">Ciel</div>
            </div>
          </div>
          <div class="flex items-center justify-center text-xl mt-2" :style="{color:'var(--color-'+displayDate.dayOfWeek+')'}">
            <div v-for="color = 1 in 7" :key="color">
              <ElementIcon :element="4 - Math.abs(4 - color)" :color="color"></ElementIcon>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 13 Moons -->
      <Moon v-for="moon in 14" 
        :key="moon"
        :id="`moon-${moon}`"
        :today="today" 
        :moon="moon" 
        @hover-date="hoverDateEvent"
        @reset-hover="resetHoverDate"
        class="min-w-fit min-h-fit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useContextStore } from '@/stores/contextStore'
import { NaturalDate } from 'natural-time-js';

import Moon from '@/components/MoonComponent.vue';
import ElementIcon from '@/components/ElementIcon.vue';

const contextStore = useContextStore()
const { latitude, longitude, location, currentTime } = storeToRefs(contextStore)

const today = computed(() => new NaturalDate(currentTime.value, latitude.value, longitude.value));

onMounted(() => {
  const currentMoon = document.querySelector('.currentMoon');
  if (currentMoon) {
    currentMoon.scrollIntoView({ behavior: 'smooth' });
  }
});

const hoverDate = ref(null);
const hoverDateEvent = (payload) => { hoverDate.value = payload }
const resetHoverDate = () => { hoverDate.value = null }

const displayDate = computed(() => hoverDate.value || today.value);
</script>

<style lang="scss">

#year {
	@apply flex flex-wrap;
	
	& > div { @apply w-1/4 h-1/4; }
	#display { @apply w-1/2; }
	
	#moon-1 {
		order: 1;
		.bottom {
			border-top-left-radius: 0!important;
			border-bottom-left-radius: 0!important;
		}
	}
	#moon-2 { order: 2; }
	#moon-3 { order: 3; }
	#moon-4 { order: 4; }
	#moon-5 { order: 8; }
	#moon-6 { order: 11; }
	#moon-7 { order: 15; }
	#moon-8 { order: 14; }
	#moon-9 { order: 13; }
	#moon-10 { order: 12; }
	#moon-11 { order: 9; }
	#moon-12 { order: 5; }
	#moon-13 { order: 6; }
	#moon-14 { order: 7; }
	#display {
		order: 10;
		.center-me {
			top: 60%;
			left: 52%;
		}
	}
	
	.moonComponent {
		.top {
			.title {
				font-size: .8em;
				line-height: 2.5;
				font-weight: 500;
				span {
					display: none;
				}
			}
		}
		.bottom {
			background-color: var(--yearloop-bg-color);
		}
		
		&:not(#moon-1) {
			.left svg, .dayColors { @apply opacity-0; }
		}
		&#moon-1 .title { @apply opacity-0; }
		&:hover {
			.left svg { @apply opacity-70 !important; }
			.title { @apply opacity-0 !important; }
			.dayColors { @apply opacity-100 !important; }
		}
	}
}

#legend {
  @apply absolute z-[3000] bottom-7 left-1/2 -translate-x-1/2 font-mono text-center text-[#7B7A8B] opacity-65 text-[1.1em] uppercase break-normal w-full cursor-pointer;
  
  &:hover {
    @apply underline;
  }
}
</style>