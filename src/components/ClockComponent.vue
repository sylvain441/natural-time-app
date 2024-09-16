<template>
  <div class="clock-wrapper flex items-center justify-center" ref="clockWrapper">
    <div class="clock-box relative" :style="clockBoxStyle">
      <!-- DAY / NIGHT -->
      <div class="clock-day-night nt-box-outer rotate-180">
        <div class="nt-box-outer blur-2xl">
          <svg class="w-full h-full" viewBox="0 0 800 800">
            <path :d="dayPeriodPath(context.sun.sunrise, context.sun.sunset)" fill="#AFE0FF" />
            <path :d="dayPeriodPath(context.sun.sunset, context.sun.sunrise)" fill="#1C1241" style="opacity: 0.5" />
          </svg>
        </div>
        <div class="nt-box-outer opacity-70">
          <svg class="w-full h-full" viewBox="0 0 800 800">
            <path :d="dayPeriodPath(context.sun.sunset + 3, context.sun.sunrise - 3)" fill="#000" /> 
            <path :d="dayPeriodPath(context.sun.sunrise - 3, context.sun.sunrise + 3)" fill="#FFC856" /> 
            <path :d="dayPeriodPath(context.sun.sunset - 3, context.sun.sunset + 3)" fill="#FFC856" /> 
            <path :d="dayPeriodPath(context.sun.sunrise + 3, context.sun.sunset - 3)" fill="#80CCFF" /> 
          </svg>
        </div>
      </div>

      <!-- SUN -->
      <div class="clock-sun nt-box-outer rotate-180">
        <div class="nt-box-outer text-center" :style="{transform: `scale(${context.sun.altitude*0.50 + 100}%) rotate(${context.naturalDate.time * context.hemisphere}deg)`}">
          <div class="inline-block" style="width: 72px; height: 72px;">
            <div class="w-full h-full rounded-full bg-ntyellow-dark" style="box-shadow: 0 0 40px 0 rgba(255, 205, 0, var(--day-progression)); filter: blur(calc(var(--day-progression) * 5px));"></div>
          </div>
        </div>
      </div>

      <!-- MOON -->
      <div class="clock-moon nt-box-outer rotate-180">
        <div class="nt-box-outer flex justify-center" :style="{transform: `scale(${context.moon.altitude*0.50 + 100}%) rotate(${(context.naturalDate.time - context.moon.phase) * context.hemisphere}deg)`}"> 
          <div style="width: 72px; height: 72px; box-shadow: 0 0 60px rgba(255, 255, 255, calc(1 - var(--day-progression)));" class="relative rounded-full overflow-hidden flex align-center shadow shadow-slate-800/50">
            <!-- LIGHT SIDE-->
            <div class="w-1/2 h-full bg-slate-100" :class="{ 'order-1': context.moon.phase < 180 }"></div>
            <!-- DARK SIDE -->
            <div class="w-1/2 h-full bg-slate-800"></div>
            <!-- 3D FLIPPER-->
            <div class="moon-divider bg-slate-800 after:bg-slate-100"
              :style="{transform: `rotate3d(0, 1, 0, ${context.moon.phase}deg)`}"></div>
          </div>
        </div>
      </div>

      <!-- HAND NTZ-->
      <div class="clock-hand-ntz nt-box-outer rotate-180 text-white">
        <div class="nt-box-outer" :style="{ transform: `rotate(${(context.naturalDate.time - context.naturalDate.longitude) * context.hemisphere}deg) scaleX(${context.hemisphere})`}">
          <HandNtzSVG fill="currentColor"/>
        </div>
      </div>

      <!-- DIAL -->
      <div class="clock-dial nt-box-outer">
        <div class="nt-box-inner rounded-full bg-white shadow-xl"></div>
      </div>

      <!-- MUSTACHES EQUINOXES -->
      <div class="clock-mustache-equinox nt-box-outer text-slate-400">
        <MustacheEquinoxSVG fill="currentColor"/>
      </div>

      <!-- MUSTACHES WINTER SUNRISE -->
      <div class="clock-mustache-winter-sunrise nt-box-outer rotate-180 text-slate-400">
        <div class="nt-box-inner" :style="{transform: `rotate(${(context.mustaches.winterSunrise) * context.hemisphere}deg)`}">
          <MustacheSVG fill="currentColor" />
        </div>
      </div>

      <!-- MUSTACHES SUMMER SUNRISE -->
      <div class="clock-mustache-summer-sunrise nt-box-outer rotate-180 text-slate-400">
        <div class="nt-box-inner" :style="{transform: `rotate(${(context.mustaches.summerSunrise) * context.hemisphere}deg)`}">
          <MustacheSVG fill="currentColor" />
        </div>
      </div>

      <!-- MUSTACHES WINTER SUNSET -->
      <div class="clock-mustache-winter-sunset nt-box-outer rotate-180 text-slate-400">
        <div class="nt-box-inner" :style="{transform: `rotate(${(context.mustaches.winterSunset) * context.hemisphere}deg)`}">
          <MustacheSVG fill="currentColor" />
        </div>
      </div>

      <!-- MUSTACHES SUMMER SUNSET -->
      <div class="clock-mustache-summer-sunset nt-box-outer rotate-180 text-slate-400">
        <div class="nt-box-inner" :style="{transform: `rotate(${(context.mustaches.summerSunset) * context.hemisphere}deg)`}">
          <MustacheSVG fill="currentColor" />
        </div>
      </div>

      <!-- TITLE -->
      <div class="clock-title nt-box-outer text-slate-300 text-2xl text-center font-bold">
        <div class="nt-box-inner">
          <h1 style="padding-top: 67%;">Temps Naturel</h1>
        </div>
      </div>

      <!-- NUMBERS -->
      <div class="clock-numbers nt-box-outer rotate-180 text-2xl">
        <div class="nt-box-inner absolute text-center p-1"
          v-once
          v-for="n in 36" 
          :key="`dial-number-${(n - 1) * 10}`" 
          :data-time="(n - 1) * 10" 
          :style="{ transform: `rotate(${((n - 1) * 10 * context.hemisphere)}deg)` }"
          :class="{
            'multiple-of-90 font-extrabold text-slate-900': (n - 1) % 9 === 0,
            'multiple-of-30 font-normal text-slate-400': (n - 1) % 3 === 0 && (n - 1) % 9 !== 0,
            'multiple-of-10 font-thin text-slate-200': (n - 1) % 3 !== 0
          }">
          <span>{{ (n - 1) * 10 }}</span>
        </div>
      </div>

      <!-- DOTS -->
      <div class="clock-dots nt-box-outer rotate-180">
        <div class="nt-box-inner absolute text-center"
          v-once
          v-for="n in 36" 
          :key="`dial-dot-${(n - 1) * 10}`" 
          :style="{ transform: `rotate(${((n - 1) * 10 * context.hemisphere)}deg)` }"
          :class="{
            'multiple-of-90': (n - 1) % 9 === 0,
            'multiple-of-30': (n - 1) % 3 === 0 && (n - 1) % 9 !== 0,
            'multiple-of-10': (n - 1) % 3 !== 0
          }">
          <div class="w-2 h-2 inline-block mt-12 rounded-full bg-slate-300"></div>
        </div>
      </div>

      <!-- HAND -->
      <div class="clock-hand nt-box-outer rotate-180">
        <div class="nt-box-inner" :style="{ transform: `rotate(${context.naturalDate.time * context.hemisphere}deg)` }">
          <HandSVG fill="currentColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HandSVG from '@/assets/clock/hand-default.svg';
import HandNtzSVG from '@/assets/clock/hand-ntz-default.svg';
import MustacheEquinoxSVG from '@/assets/clock/mustache-equinox-default.svg';
import MustacheSVG from '@/assets/clock/mustache-default.svg';

const props = defineProps({
  context: {
    type: Object,
    required: true
  },
  style: {
    type: Object,
    default: () => ({})
  }
});

const clockWrapper = ref(null);
const scale = ref(1);
let resizeObserver = null;

const clockBoxStyle = computed(() => ({
  width: '800px',
  height: '800px',
  minWidth: '800px',
  minHeight: '800px',
  transform: `scale(${scale.value})`,
}));

const updateScale = () => {
  if (!clockWrapper.value) return;
  const wrapperWidth = clockWrapper.value.offsetWidth;
  const wrapperHeight = clockWrapper.value.offsetHeight;
  const scaleX = (wrapperWidth * 0.85) / 800;
  const scaleY = (wrapperHeight * 0.55) / 800;
  scale.value = Math.min(scaleX, scaleY, 1);
};

onMounted(() => {
  updateScale();
  
  resizeObserver = new ResizeObserver(updateScale);
  if (clockWrapper.value) {
    resizeObserver.observe(clockWrapper.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const dayPeriodPath = (start, end) => {
  // Adjust for cases where end is on the next day
  const adjustedEnd = end < start ? end + 360 : end;
  const largeArcFlag = adjustedEnd - start <= 180 ? 0 : 1;  
  const startX = 400 + 400 * Math.cos((start - 90) * Math.PI / 180);
  const startY = 400 + 400 * Math.sin((start - 90) * Math.PI / 180);
  const endX = 400 + 400 * Math.cos((end - 90) * Math.PI / 180);
  const endY = 400 + 400 * Math.sin((end - 90) * Math.PI / 180);
  return `M 400 400 L ${startX} ${startY} A 400 400 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
};

</script>

<style lang="scss" scoped>
  .nt-box-outer {
    @apply absolute inset-0 w-full h-full bg-cover bg-center;
  }
  .nt-box-inner {
    @apply w-[720px] h-[720px] m-[40px];
  }


.moon-divider {
  &,
  &:after {
    @apply absolute top-0 left-0 w-full h-full rounded-full;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  &:after {
    content: '';
    transform: rotateY(180deg);
  }
}
</style>