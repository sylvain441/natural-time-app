<template>
  <div class="moon-component relative" 
       :style="{ 
         '--base-size': baseSize + 'px',
         '--spacing': spacing + 'px'
       }"
       :class="{
         'opacity-100': today.moon >= moon,
         'past-moon': pastMoon,
         'isRainbowDay': today.isRainbowDay
       }">

    <Transition name="fade">
      <div v-if="moon < 14" class="moon-top absolute top-0 left-4 right-4 h-4 z-10"></div>
    </Transition>
    <Transition name="fade">
      <div v-if="moon < 14" class="moon-bottom absolute bottom-0 left-4 right-4 h-4"></div>
    </Transition>
    <Transition name="fade">
      <div v-if="moon < 14" class="moon-left absolute top-4 bottom-4 left-0 w-4"></div>
    </Transition>
    <Transition name="fade">
      <div v-if="moon < 14" class="moon-right absolute top-4 bottom-4 right-0 w-4"></div>
    </Transition>

    <div v-if="moon < 14" class="moon-container relative flex justify-center items-center">
      <Transition name="scale-with-delay">
        <div class="moon-center flex flex-wrap overflow-hidden">
          <div v-for="day in daysOfMoon" 
            class="day-of-moon flex items-center justify-center rounded-full border-white border-4 cursor-pointer"
            :class="day.dayClasses"
            :title="isClient ? 'Temps Naturel => ' + day.date.toDateString() + '\n' + 'Temps artificiel => ' + new Date(day.date.unixTime).toLocaleDateString() : ''"
            @click="openTimeTravelForDay(day.date)">
            <span v-if="spiralSkin.showDaysNumber" class="day-of-moon-number font-mono font-bold text-xl">{{day.date.toDayOfMoonString()}}</span>
          </div>
        </div>
      </Transition>
    </div>

    <div v-else class="moon-rainbow-day flex justify-center items-center">
      <Transition name="scale-with-delay">
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
      </Transition>
    </div>
  </div>
</template>


<script setup>
import { computed, ref, onMounted } from 'vue';
import { NaturalDate } from 'natural-time-js';
import { useConfigStore } from '@/stores/configStore';
import { storeToRefs } from 'pinia';
const configStore = useConfigStore();
const { spiralSkin } = storeToRefs(configStore);

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
      NaturalDate.MILLISECONDS_PER_DAY * i +
      12 * 60 * 60 * 1000 // Set to midday to prevent bug when selecting 01)01 000°
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
    padding: 1px;
    width: calc(var(--base-size) * 7 + 2px);
    height: calc(var(--base-size) * 4 + 2px);
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
      left: calc(var(--spacing) - 1px);
      right: calc(var(--spacing) - 1px);
      height: calc(var(--spacing) + 2px);
    }
    &.moon-top { top: -1px; }
    &.moon-bottom { bottom: -1px; }

    &.moon-left, &.moon-right {
      top: calc(var(--spacing) - 1px);
      bottom: calc(var(--spacing) - 1px);
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
        @apply bg-gray-700 text-white rounded-none border-none;
      }
    }
  }
  .day-of-moon {
    &:nth-child(7n+1){ @apply border-red-500 text-red-500 border-opacity-0 text-opacity-50}
    &:nth-child(7n+2){ @apply border-orange-500 text-orange-500 border-opacity-0 text-opacity-50 }
    &:nth-child(7n+3){ @apply border-yellow-500 text-yellow-500 border-opacity-0 text-opacity-50 }
    &:nth-child(7n+4){ @apply border-green-500 text-green-500 border-opacity-0 text-opacity-50 }
    &:nth-child(7n+5){ @apply border-sky-500 text-sky-500 border-opacity-0 text-opacity-50 }
    &:nth-child(7n+6){ @apply border-indigo-500 text-indigo-500 border-opacity-0 text-opacity-50 }
    &:nth-child(7n+0){ @apply border-violet-500 text-violet-500 border-opacity-0 text-opacity-50 }
    &.isPast:not(:hover):not(.isRainbowDay) {
      @apply bg-gray-700 text-white border-opacity-50;
    }
    &.isToday {
      @apply border-opacity-100 text-opacity-100;
    }
    &.isFuture:not(:hover) {
      @apply bg-opacity-0 text-gray-500;
    }
    &:hover {
      @apply border-opacity-100 text-opacity-100 cursor-pointer;
    }
    &.isRainbowDay {
      @apply border-opacity-20;
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

// Add these animation classes at the end
.nt-animate {
  transition-property: all;
  transition-duration: var(--nt-animation-speed, 300ms);
  transition-timing-function: ease;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: var(--nt-animation-speed, 300ms);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-with-delay-enter-active,
.scale-with-delay-leave-active {
  transition: opacity var(--nt-animation-speed, 300ms),
              transform 1s cubic-bezier(0.25, 0.1, 0.25, 2) 1s;
}

.scale-with-delay-enter-from,
.scale-with-delay-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.scale-with-delay-enter-to,
.scale-with-delay-leave-from {
  opacity: 1;
  transform: scale(1);
}

// Add smooth transitions to existing elements
.day-of-moon {
  @extend .nt-animate;
  // ... existing styles ...
}

.rainbow-circle {
  @extend .nt-animate;
  // ... existing styles ...
}

</style>