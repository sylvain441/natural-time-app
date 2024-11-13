<template>
  <div class="moon-component relative overflow-hidden" 
       :style="{ 
         '--base-size': baseSize + 'px',
         '--spacing': spacing + 'px'
       }"
       :class="{
         'opacity-100': today.moon >= moon,
         'past-moon': pastMoon
       }">
    <div v-if="moon < 14" class="moon-container flex justify-center items-center">
      <div class="moon-center flex flex-wrap">
        <div v-for="day in daysOfMoon" 
          class="day-of-moon flex items-center justify-center rounded-full cursor-pointer"
          :class="day.dayClasses"
          :title="isClient ? 'Temps Naturel => ' + day.date.toDateString() + '\n' + 'Temps artificiel => ' + new Date(day.date.unixTime).toLocaleDateString() : ''"
          @click="openTimeTravelForDay(day.date)">
          <span v-if="spiralShowDaysNumber" class="day-of-moon-number font-mono font-bold text-xl">{{day.date.toDayOfMoonString()}}</span>
        </div>
      </div>
    </div>

    <div v-else class="moon-rainbow-day flex justify-center items-center">
      <div class="container flex items-center justify-center space-x-4">
        <div 
          @click="openTimeTravelForDay(new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 364, today.longitude))" 
          class="rainbow-circle cursor-pointer"
          :class="{'is-active animate-spin-slow': today.dayOfYear === 365}">
        </div>
        <div 
          v-if="today.yearDuration === 366" 
          @click="openTimeTravelForDay(new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 365, today.longitude))" 
          class="rainbow-circle cursor-pointer"
          :class="{'is-active animate-spin-slow': today.dayOfYear === 366}">
        </div>
      </div>
    </div>

    <div v-if="moon < 14" class="moon-top absolute top-0 left-4 right-4 h-4 z-10"></div>
    <div v-if="moon < 14" class="moon-bottom absolute bottom-0 left-4 right-4 h-4"></div>
    <div v-if="moon < 14" class="moon-left absolute top-4 bottom-4 left-0 w-4"></div>
    <div v-if="moon < 14" class="moon-right absolute top-4 bottom-4 right-0 w-4"></div>
  </div>
</template>


<script setup>
import { computed, ref, onMounted } from 'vue';
import { NaturalDate } from 'natural-time-js';
import { useConfigStore } from '@/stores/configStore';
import { storeToRefs } from 'pinia';
const configStore = useConfigStore();
const { spiralShowDaysNumber } = storeToRefs(configStore);

const props = defineProps({
  today: {
    type: NaturalDate,
    required: true
  },
  moon: {
    type: Number,
    required: true
  },
  baseSize: {
    type: Number,
    default: 48
  },
  spacing: {
    type: Number,
    default: 16
  }
});

const emit = defineEmits(['openTimeTravel']);

const daysOfMoon = computed(() => {
  let allDays = [];
  for(var i = 0 ; i < 28; i++){
    let date = new NaturalDate(
      props.today.yearStart + 
      NaturalDate.MILLISECONDS_PER_DAY * 28 * (props.moon - 1) + 
      NaturalDate.MILLISECONDS_PER_DAY * i
    , props.today.longitude);
    
    allDays[i] = {
      date: date,
      dayClasses: {
        isToday: props.today.toDateString() == date.toDateString(),
        isPast: props.today.toDateString() > date.toDateString(),
        isFuture: props.today.toDateString() < date.toDateString(),
        isRainbowDay: props.today.isRainbowDay,
      },
    };
  }
  return allDays;
})

const isClient = ref(false);

const openTimeTravelForDay = (day) => {
  emit('openTimeTravel', day);
};

onMounted(() => {
  isClient.value = true;
});

const pastMoon = computed(() => {
  return props.today.moon > props.moon;
});

</script>

<style lang="scss">
.moon-component {
  .moon-container {
    width: calc(var(--base-size) * 7 + var(--spacing) * 2);
    height: calc(var(--base-size) * 4 + var(--spacing) * 2);
    padding: var(--spacing) 0;
  }

  .moon-center {
    width: calc(var(--base-size) * 7);
    height: calc(var(--base-size) * 4);
  }

  .moon-rainbow-day {
    width: calc(var(--base-size) * 7 + var(--spacing) * 2);
    height: calc(var(--base-size) * 4 + var(--spacing) * 2);
    padding: var(--spacing) 0;
  }

  .day-of-moon {
    width: var(--base-size);
    height: var(--base-size);
  }

  .rainbow-circle {
    height: calc(var(--base-size) * 1.75);
    aspect-ratio: 1;
  }

  // Border elements (we add +1px to the spacing to avoid phantom lines)
  .moon-top, .moon-bottom, .moon-left, .moon-right {
    &.moon-top, &.moon-bottom {
      left: calc(var(--spacing));
      right: calc(var(--spacing));
      height: calc(var(--spacing) + 2px);
    }
    &.moon-top { top: -1px; }
    &.moon-bottom { bottom: -1px; }

    &.moon-left, &.moon-right {
      top: calc(var(--spacing));
      bottom: calc(var(--spacing));
      width: calc(var(--spacing) + 2px);
    }
    &.moon-left { left: -1px; }
    &.moon-right { right: -1px; }
  }

  .moon-center, .moon-top, .moon-bottom, .moon-left, .moon-right { @apply bg-white }
  
  &.past-moon {
    .moon-center, .moon-top, .moon-bottom, .moon-left, .moon-right { @apply bg-gray-700 }
    .day-of-moon.isPast:not(:hover):not(.isRainbowDay) {
      @media (max-width: 768px) { 
        @apply bg-gray-600 bg-opacity-40 scale-75;
      }
      @media (min-width: 768px) { 
        @apply bg-gray-700 text-white rounded-none;
      }
    }
  }
  .day-of-moon {
    &:nth-child(7n+1){ @apply bg-red-500 text-white bg-opacity-0}
    &:nth-child(7n+2){ @apply bg-orange-500 text-white bg-opacity-0 }
    &:nth-child(7n+3){ @apply bg-yellow-500 text-white bg-opacity-0 }
    &:nth-child(7n+4){ @apply bg-green-500 text-white bg-opacity-0 }
    &:nth-child(7n+5){ @apply bg-sky-500 text-white bg-opacity-0 }
    &:nth-child(7n+6){ @apply bg-indigo-500 text-white bg-opacity-0 }
    &:nth-child(7n+0){ @apply bg-violet-500 text-white bg-opacity-0 }
    &.isPast:not(:hover):not(.isRainbowDay) {
      @apply bg-gray-700 text-gray-100;
    }
    &.isToday {
      @apply bg-opacity-50;
    }
    &.isFuture:not(:hover) {
      @apply bg-opacity-0 text-gray-500;
    }
    &:hover {
      @apply bg-opacity-50 cursor-pointer;
    }
    &.isRainbowDay {
      @apply bg-opacity-20;
    }
  }
}

// Add RainbowCircle styles
$shadow-depth: 16px;
$shadow-depth-hover-ratio: -1;
$shadow-blur: $shadow-depth * 0;
$shadow-spread: $shadow-depth * 0;

$y-offset: $shadow-depth * 0.5;
$x-offset: $y-offset * 1.7320508076; // √3
$y-offset-hover: $y-offset * $shadow-depth-hover-ratio;
$x-offset-hover: $x-offset * $shadow-depth-hover-ratio;

.rainbow-circle {
  position: relative;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow:
    inset $x-offset (-$y-offset) $shadow-blur $shadow-spread rgba(var(--color-1), 0.8),
    inset (-$x-offset) (-$y-offset) $shadow-blur $shadow-spread rgba(var(--color-3), 0.8),
    inset 0 $shadow-depth $shadow-blur $shadow-spread rgba(var(--color-5), 0.8),
    inset (-$x-offset) $y-offset $shadow-blur $shadow-spread rgba(var(--color-4), 0.8),
    inset $x-offset $y-offset $shadow-blur $shadow-spread rgba(var(--color-6), 0.8),
    inset 0 (-$shadow-depth) $shadow-blur $shadow-spread rgba(var(--color-2), 0.8);

  &:hover, &.is-active {
    box-shadow:
      inset $x-offset-hover (-$y-offset-hover) $shadow-blur $shadow-spread rgba(var(--color-1), 1),
      inset (-$x-offset-hover) (-$y-offset-hover) $shadow-blur $shadow-spread rgba(var(--color-3), 1),
      inset 0 ($shadow-depth * $shadow-depth-hover-ratio) $shadow-blur $shadow-spread rgba(var(--color-5), 1),
      inset (-$x-offset-hover) $y-offset-hover $shadow-blur $shadow-spread rgba(var(--color-4), 1),
      inset $x-offset-hover $y-offset-hover $shadow-blur $shadow-spread rgba(var(--color-6), 1),
      inset 0 (-$shadow-depth * $shadow-depth-hover-ratio) $shadow-blur $shadow-spread rgba(var(--color-2), 1);
  }
}

</style>