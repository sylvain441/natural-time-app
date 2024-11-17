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
       }"
       :title="moon === 14 ? (today.yearDuration === 366 ? 'Jours arc-en-ciel' : 'Jour arc-en-ciel') : `Lune #${moon}`">

    <div v-if="moon < 14" class="moon-top absolute top-0 left-4 right-4 h-4 z-10"></div>
    <div v-if="moon < 14" class="moon-bottom absolute bottom-0 left-4 right-4 h-4"></div>
    <div v-if="moon < 14" class="moon-left absolute top-4 bottom-4 left-0 w-4"></div>
    <div v-if="moon < 14" class="moon-right absolute top-4 bottom-4 right-0 w-4"></div>

    <div v-if="moon < 14" class="moon-container relative flex justify-center items-center">
      <Transition name="scale-with-delay">
        <div class="moon-center flex flex-wrap">
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
            class="spinner cursor-pointer"
            :class="{'is-active scale-110 animate-spin-slow': today.dayOfYear === 365}">
          </div>
          <div 
            v-if="today.yearDuration === 366" 
            @click="openTimeTravelForDay(new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 365, today.longitude))" 
            class="spinner cursor-pointer"
            :class="{'is-active scale-110 animate-spin-slow': today.dayOfYear === 366}">
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
    .moon-center, .moon-top, .moon-bottom, .moon-left, .moon-right { @apply bg-gray-100 }
    .day-of-moon.isPast:not(:hover):not(.isRainbowDay) {
      @media (max-width: 768px) { 
        @apply bg-gray-600 bg-opacity-40;
      }
      @media (min-width: 768px) { 
        @apply bg-gray-100 text-gray-500 border-none;
      }
    }
  }
  .day-of-moon {
    transform: scale(0.9);
    &:nth-child(7n+1){ @apply border-red-500 text-red-500 bg-red-500 border-opacity-0 text-opacity-100 bg-opacity-20}
    &:nth-child(7n+2){ @apply border-orange-500 text-orange-500 bg-orange-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+3){ @apply border-yellow-500 text-yellow-500 bg-yellow-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+4){ @apply border-green-500 text-green-500 bg-green-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+5){ @apply border-sky-500 text-sky-500 bg-sky-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+6){ @apply border-indigo-500 text-indigo-500 bg-indigo-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+0){ @apply border-violet-500 text-violet-500 bg-violet-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &.isPast:not(:hover):not(.isRainbowDay) {
      @apply bg-gray-50 text-gray-500 border-opacity-80;
    }
    &.isToday {
      @apply border-opacity-100 bg-opacity-100 text-white;
    }
    &.isFuture:not(:hover) {
      @apply bg-opacity-0 text-gray-300;
    }
    &:hover {
      @apply border-opacity-100 text-opacity-100 cursor-pointer;
    }
    &.isRainbowDay {
      @apply border-opacity-50 scale-75 animate-ping;
      &:nth-child(11n+1){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+2){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+3){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+4){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+5){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+6){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+7){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+8){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+9){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+10){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
      &:nth-child(11n+11){ 
        animation-delay: calc(random() * 9000ms); 
        animation-duration: calc(10000ms + random() * 6000ms);
      }
    }
  }

  &:hover {
    & .moon-center {
      @apply shadow-inner transition-all duration-500;
    }
    &::after {
      content: attr(title);
      position: absolute;
      top: -1.25rem;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(0, 0, 0, 0.8);
      font-size: 1.6rem;
      font-weight: 800;
      pointer-events: none;
      z-index: 50;
      animation: tooltip-fade 0.3s ease-out;
      white-space: nowrap;
    }
  }

  @keyframes tooltip-fade {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1; 
      transform: translate(-50%, 0);
    }
  }
}

.scale-with-delay-enter-active,
.scale-with-delay-leave-active {
  transition: opacity var(--nt-animation-speed, 300ms),
              transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 2) 0.4s;
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


.spinner {
  position:relative;
  background-color: purple;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: conic-gradient(rgba(var(--color-1), 0.9), rgba(var(--color-2), 0.9), rgba(var(--color-3), 0.9), rgba(var(--color-4), 0.9), rgba(var(--color-5), 0.9), rgba(var(--color-6), 0.9), rgba(var(--color-1), 0.9));
  transition: all 0.8s ease-in-out;
  &::before {
    content: "";
    background-color: white;
    opacity: 0.8;
    position: absolute;
    width: 30%;
    height: 30%;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:not(.is-active){
    width: 90px;
    height: 90px;
    &::before {
      width: 60%;
      height: 60%;
    }
  }
}
</style>