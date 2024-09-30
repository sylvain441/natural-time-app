<script setup>
import { computed, ref, onMounted } from 'vue';
import { NaturalDate } from 'natural-time-js';

//import ElementIcon from '@/components/ElementIcon.vue';

const props = defineProps({
  today: {
    type: NaturalDate,
    required: true
  },
  moon: {
    type: Number,
    required: true
  }
});

const $emit = defineEmits(['hover-date', 'reset-hover'])

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

onMounted(() => {
  isClient.value = true;
});

const handleTouchStart = (date) => {
  if (isClient.value) {
    $emit('hover-date', date);
  }
};

const handleTouchEnd = () => {
  if (isClient.value) {
    $emit('reset-hover');
  }
};
</script>

<template>
  <div class="moonComponent relative" :class="{'opacity-100': today.moon >= moon}">
    <div v-if="moon < 14">
      <div class="bottom w-96 aspect-[7/4] flex flex-wrap">
        <div v-for="day in daysOfMoon" 
          class="day-of-moon relative w-1/7 aspect-square flex items-center justify-center rounded-full cursor-default"
          :class="day.dayClasses"
          :title="isClient ? 'Temps Naturel => ' + day.date.toDateString() + '\n' + 'Temps artificiel => ' + new Date(day.date.unixTime).toLocaleDateString() : ''"
          @mouseenter="$emit('hover-date', day.date)"
          @mouseleave="$emit('reset-hover')"
          @touchstart="handleTouchStart(day.date)"
          @touchend="handleTouchEnd">
          <span class="day-of-moon-number font-mono font-bold text-xl">{{day.date.toDayOfMoonString()}}</span>
        </div>
      </div>
    </div>

    <div v-else class="moon-rainbow-day" :class="{'saturate-100': today.isRainbowDay || hover}"
      @mouseenter="$emit('hover-date', new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 364, today.longitude))"
      @mouseleave="$emit('reset-hover')"
      @touchstart="handleTouchStart(new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 364, today.longitude))"
      @touchend="handleTouchEnd">
      <div v-if="today.yearDuration == 365">
        <img src="@/assets/13moons/rainbow-day.png" alt="Rainbow Day">
      </div>
      <div v-else>
        <img src="@/assets/13moons/rainbow-days.png" alt="Rainbow Days">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.moonComponent {

  .day-of-moon {
    border: 4px solid white;
    &:nth-child(7n+1){ @apply bg-red-500 text-red-900 bg-opacity-0}
    &:nth-child(7n+2){ @apply bg-orange-500 text-orange-900 bg-opacity-0 }
    &:nth-child(7n+3){ @apply bg-yellow-500 text-yellow-900 bg-opacity-0 }
    &:nth-child(7n+4){ @apply bg-green-500 text-green-900 bg-opacity-0 }
    &:nth-child(7n+5){ @apply bg-sky-500 text-sky-900 bg-opacity-0 }
    &:nth-child(7n+6){ @apply bg-indigo-500 text-indigo-900 bg-opacity-0 }
    &:nth-child(7n+0){ @apply bg-violet-500 text-violet-900 bg-opacity-0 }
    &.isPast {
      @apply bg-opacity-50 bg-slate-50;
    }
    &.isToday {
      @apply bg-opacity-80;
    }
    &.isFuture {
      @apply bg-opacity-0 text-slate-300;
    }
    &:hover {
      @apply bg-opacity-50;
    }
    &.isRainbowDay {
      @apply bg-opacity-100 animate-pulse;
    }
  }
  
  .moon-rainbow-day {
    @apply saturate-50;
    img {
      @apply absolute block w-full;
    }
  }
}
</style>