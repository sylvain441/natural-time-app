<template>
  <div class="moon-component relative" :style="{ width: `${baseSize}px`, height: `${(baseSize - spacing * 2) * 4 / 7 + spacing * 2}px`, '--border-width': `${baseSize * 0.008}px`, '--font-size': `${baseSize * 0.067}px`, '--base-size': `${baseSize}px` }"
       :class="{
         'opacity-100': today.moon >= moon,
         'past-moon': pastMoon,
         'isRainbowDay': today.isRainbowDay
       }"
       :title="moon === 14 ? (today.yearDuration === 366 ? $t('moon.title.rainbowDays') : $t('moon.title.rainbowDay')) : $t('moon.title.moon', { number: moon })">

    <div v-if="moon < 14" class="moon-top absolute" :style="{ top: 0, left: `${spacing}px`, right: `${spacing}px`, height: `${spacing}px` }"></div>
    <div v-if="moon < 14" class="moon-bottom absolute" :style="{ bottom: 0, left: `${spacing}px`, right: `${spacing}px`, height: `${spacing}px` }"></div>
    <div v-if="moon < 14" class="moon-left absolute" :style="{ top: `${spacing}px`, bottom: `${spacing}px`, left: 0, width: `${spacing}px` }"></div>
    <div v-if="moon < 14" class="moon-right absolute" :style="{ top: `${spacing}px`, bottom: `${spacing}px`, right: 0, width: `${spacing}px` }"></div>

    <div v-if="moon < 14" class="moon-center absolute flex flex-wrap" 
         :style="{ 
           left: `${spacing}px`, 
           right: `${spacing}px`, 
           top: `${spacing}px`, 
           bottom: `${spacing}px`
         }">
      <div v-for="day in daysOfMoon" 
        class="day-of-moon w-1/7 h-1/4 aspect-square flex items-center justify-center rounded-full border-white border-4"
        :class="[
          day.dayClasses,
          {'show-animation': spiralSkin.showAnimation},
          {'cursor-pointer': !spiralWelcomeMode}
        ]"
        :title="isClient ? $t('moon.dayTooltip.naturalTime', { date: day.date.toDateString() }) + '\n' + $t('moon.dayTooltip.artificialTime', { date: new Date(day.date.unixTime).toLocaleDateString() }) : ''"
        @click="!spiralWelcomeMode && openTimeTravelForDay(day.date)">
        <span v-if="spiralSkin.showDaysNumber" class="day-of-moon-number font-mono font-bold">{{day.date.toDayOfMoonString()}}</span>
      </div>
    </div>

    <div v-else class="moon-rainbow-day flex justify-center items-center h-full">
      <div class="container flex items-center justify-center space-x-4">
        <div 
          @click="openTimeTravelForDay(new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 364, today.longitude))" 
          class="spinner cursor-pointer"
          :class="{'is-active scale-110 animate-spin-slow': !spiralWelcomeMode && today.dayOfYear === 365}">
        </div>
        <div 
          v-if="today.yearDuration === 366" 
          @click="openTimeTravelForDay(new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 365, today.longitude))" 
          class="spinner cursor-pointer"
          :class="{'is-active scale-110 animate-spin-slow': !spiralWelcomeMode && today.dayOfYear === 366}">
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, ref, onMounted } from 'vue';
import { NaturalDate } from 'natural-time-js';
import { useConfigStore } from '@/stores/configStore';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const configStore = useConfigStore();
const { spiralSkin, spiralWelcomeMode } = storeToRefs(configStore);
const { t } = useI18n();

const props = defineProps({
  today: {
    type: Object,
    required: true,
    validator: (value) => value instanceof NaturalDate
  },
  moon: {
    type: Number,
    required: true,
    validator: (value) => value >= 1 && value <= 14
  },
  baseSize: {
    type: Number,
    required: true,
    default: 280
  },
  spacing: {
    type: Number,
    default: 10,
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
        isToday: props.today.toDateString() === date.toDateString(),
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
@use 'sass:math';

.moon-component {

  .moon-center, .moon-top, .moon-bottom, .moon-left, .moon-right { @apply bg-white/60 }
  
  &.past-moon {
    .moon-center, .moon-top, .moon-bottom, .moon-left, .moon-right { @apply bg-white/90 }
    .day-of-moon.isPast:not(:hover):not(.isRainbowDay) {
      @apply bg-transparent text-gray-600 border-opacity-0;
    }
  }
  .day-of-moon {
    transform: scale(0.9);
    border-width: var(--border-width);
    
    .day-of-moon-number {
      font-size: var(--font-size);
      line-height: 1.3;
    }
    
    &:nth-child(7n+1){ @apply border-red-500 text-red-500 bg-red-500 border-opacity-0 text-opacity-100 bg-opacity-20}
    &:nth-child(7n+2){ @apply border-orange-500 text-orange-500 bg-orange-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+3){ @apply border-yellow-500 text-yellow-500 bg-yellow-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+4){ @apply border-green-500 text-green-500 bg-green-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+5){ @apply border-sky-500 text-sky-500 bg-sky-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+6){ @apply border-indigo-500 text-indigo-500 bg-indigo-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    &:nth-child(7n+0){ @apply border-violet-500 text-violet-500 bg-violet-500 border-opacity-0 text-opacity-100 bg-opacity-20 }
    
    .past-moon &.isPast:not(:hover):not(.isRainbowDay) {
      @apply bg-transparent text-gray-600 border-opacity-0;
    }
    
    &.isToday {
      @apply border-opacity-100 border-white/20 bg-opacity-100 text-white;
    }
    
    .current-moon & {      
      &.isPast:not(.isToday):not(:hover):not(.isRainbowDay) {
        @apply border-opacity-100 bg-opacity-30;
      }
      
      &.isFuture:not(:hover) {
        @apply bg-opacity-10 border-opacity-100 text-gray-800;
      }
      
      &:hover:not(.isToday):not(.spiralWelcomeMode) {
        @apply border-opacity-100 bg-opacity-100 text-white;
      }
    }
    
    &.isFuture:not(:hover) {
      @apply bg-opacity-0 text-gray-500/50;
    }
    
    &:hover:not(.spiralWelcomeMode) {
      @apply border-opacity-100 text-opacity-100;
    }
    
    &.isRainbowDay {
      @apply border-opacity-50 scale-75;
      &.show-animation {
        @apply animate-ping;
        &:nth-child(11n+1){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+2){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+3){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+4){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+5){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+6){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+7){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+8){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+9){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+10){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
        &:nth-child(11n+11){ 
          animation-delay: calc(math.random() * 9000ms); 
          animation-duration: calc(10000ms + math.random() * 6000ms);
        }
      }
    }
  }

  &::after {
    opacity: 0;
    content: attr(title);
    position: absolute;
    top: calc(var(--font-size) * -1.9);
    left: 50%;
    transform: translateX(-50%);
    color: black;
    background-color: cyan;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: calc(var(--font-size) * 0.85);
    font-weight: 800;
    pointer-events: none;
    z-index: 50;
    white-space: nowrap;
    box-shadow: 0 2px 18px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    & .moon-center {
      @apply transition-all duration-500;
    }
    &::after {
      opacity: 1;
    }
  }
}

.spinner {
  position: relative;
  width: calc(var(--base-size) * 0.25);  // 25% of base size
  height: calc(var(--base-size) * 0.25);
  border-radius: 50%;
  background: conic-gradient(
    theme('colors.red.500'), 
    theme('colors.orange.500'), 
    theme('colors.yellow.500'), 
    theme('colors.green.500'), 
    theme('colors.sky.500'), 
    theme('colors.violet.500'), 
    theme('colors.red.500')
  );
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
  &:not(.is-active):not(:hover) {
    width: calc(var(--base-size) * 0.20);  // 20% of base size
    height: calc(var(--base-size) * 0.20);
    &::before {
      width: 60%;
      height: 60%;
    }
  }
  &.is-active, &:hover {
    &,&::before {
      transition: all 0.8s ease-in-out;
    }
  }
}
</style>