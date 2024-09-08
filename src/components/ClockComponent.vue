<script setup>

import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  naturalDate: {
    type: Object,
    required: true
  },
  sunContext: Object,
  moonContext: Object,
  hemisphere: Number,
  location: String
});

const settings = {
  // DIAL ELEMENTS SIZES
  dialSize: 110,
  ringSize: 90,
  ntzSize: 74.9,
  blurSize: 165,
  // MOON LOOP circle positions
  xstart: 2.02,
  xspan: 0.05,
  ystart: 1.455,
  yspan: 0.06,
  // Period type colors
  periodColors: {
    golden: "#FFC856",
    day: "#80CCFF",
    pinky: "#FFC856",
    nautical: "#2A2F55",
    night: "#000",
  }
}

// SVG pie chart are not straightforward
// We use the dashed stroke hack to build them
function drawPeriod(start, end, stroke, radiusSize) {
  if(start > end) end += 360; // Night starts at the end of the "day"
  return {
    "stroke-dasharray": (end - start) * Math.PI * (radiusSize/180) + " " + Math.PI * radiusSize * 2,
    "transform": "rotate(" + start + " 180 180)",
    "r": radiusSize, "cx": "180", "cy": "180",
    "stroke-width": radiusSize,
    "stroke": stroke,
    "fill": "transparent"
  }
}

</script>

<template>

  <svg height="100%" width="100%" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet" overflow="visible">
    <!-- SVG DEFS -->
    <defs>
      <!-- BLUR -->
      <filter id="blurry">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
      </filter>

      <!-- PERIODS GRADIENTS -->
      <radialGradient v-for="(periodColor, name) in settings.periodColors" :key="name" :id="name" cx="50%" cy="50%" r="50%">
        <stop offset="50%" :stop-color="periodColor" stop-opacity="1" />
        <stop offset="100%" :stop-color="periodColor" stop-opacity="0" />
      </radialGradient>

      <!-- NORTHERN DIAL -->
      <pattern id="northernDial" height="100%" width="100%" patternContentUnits="objectBoundingBox">
        <image preserveAspectRatio="none" width="1" height="1" href="../assets/clock/northern-dial.jpg"></image>
      </pattern>

      <!-- SOUTHERN DIAL -->
      <pattern id="southernDial" height="100%" width="100%" patternContentUnits="objectBoundingBox">
        <image preserveAspectRatio="none" width="1" height="1" href="../assets/clock/southern-dial.jpg"></image>
      </pattern>
    </defs>
    
    <!-- BLURRY DIAL BACKGROUND -->
   <g id="blurryPeriodsRing"  filter="url(#blurry)">
      <circle v-bind="drawPeriod(sunContext.sunrise, sunContext.morningGoldenHour, 'url(#golden)', settings.blurSize)" />
      <circle v-bind="drawPeriod(sunContext.morningGoldenHour, sunContext.eveningGoldenHour,'url(#day)', settings.blurSize)" />
      <circle v-bind="drawPeriod(sunContext.eveningGoldenHour, sunContext.sunset, 'url(#pinky)', settings.blurSize)" />
      <circle v-bind="drawPeriod(sunContext.nightStart, sunContext.nightEnd, 'url(#night)', settings.blurSize)" />
      <circle v-bind="drawPeriod(sunContext.nightEnd, sunContext.sunrise, 'url(#nautical)', settings.blurSize)" />
      <circle v-bind="drawPeriod(sunContext.sunset, sunContext.nightStart, 'url(#nautical)', settings.blurSize)" />
   </g>

    <!-- DAY PERIODS RING -->
    <g id="periodsRing">
      <circle v-bind="drawPeriod(sunContext.sunrise, sunContext.morningGoldenHour, settings.periodColors.golden, settings.ringSize)" />
      <circle v-bind="drawPeriod(sunContext.morningGoldenHour, sunContext.eveningGoldenHour, settings.periodColors.day, settings.ringSize)" />
      <circle v-bind="drawPeriod(sunContext.eveningGoldenHour, sunContext.sunset, settings.periodColors.pinky, settings.ringSize)" />
      <circle v-bind="drawPeriod(sunContext.nightStart, sunContext.nightEnd, settings.periodColors.night, settings.ringSize)" />
      <circle v-bind="drawPeriod(sunContext.nightEnd, sunContext.sunrise, settings.periodColors.nautical, settings.ringSize)" />
      <circle v-bind="drawPeriod(sunContext.sunset, sunContext.nightStart, settings.periodColors.nautical, settings.ringSize)" />
    </g>

    <!-- SUN -->
    <g id="sun" width="100%" height="100%">
      <image v-if="hemisphere > 0" href="@/assets/clock/northern-sun-circle.png" width="100%" height="100%" />
      <image v-else href="@/assets/clock/southern-sun-circle.png" width="100%" height="100%" />
    </g>

    <!-- MOON -->
    <g id="moon" width="100%" height="100%">
      <!-- Cheap trick: pre-create all 36 moon phases for webpack inclusion in build -->
      <image v-if="Math.floor((360-moonContext.phase)/10) == 0" href="@/assets/moon/moon-0.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 1" href="@/assets/moon/moon-1.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 2" href="@/assets/moon/moon-2.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 3" href="@/assets/moon/moon-3.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 4" href="@/assets/moon/moon-4.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 5" href="@/assets/moon/moon-5.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 6" href="@/assets/moon/moon-6.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 7" href="@/assets/moon/moon-7.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 8" href="@/assets/moon/moon-8.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 9" href="@/assets/moon/moon-9.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 10" href="@/assets/moon/moon-10.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 11" href="@/assets/moon/moon-11.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 12" href="@/assets/moon/moon-12.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 13" href="@/assets/moon/moon-13.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 14" href="@/assets/moon/moon-14.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 15" href="@/assets/moon/moon-15.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 16" href="@/assets/moon/moon-16.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 17" href="@/assets/moon/moon-17.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 18" href="@/assets/moon/moon-18.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 19" href="@/assets/moon/moon-19.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 20" href="@/assets/moon/moon-20.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 21" href="@/assets/moon/moon-21.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 22" href="@/assets/moon/moon-22.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 23" href="@/assets/moon/moon-23.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 24" href="@/assets/moon/moon-24.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 25" href="@/assets/moon/moon-25.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 26" href="@/assets/moon/moon-26.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 27" href="@/assets/moon/moon-27.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 28" href="@/assets/moon/moon-28.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 29" href="@/assets/moon/moon-29.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 30" href="@/assets/moon/moon-30.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 31" href="@/assets/moon/moon-31.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 32" href="@/assets/moon/moon-32.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 33" href="@/assets/moon/moon-33.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 34" href="@/assets/moon/moon-34.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
      <image v-if="Math.floor((360-moonContext.phase)/10) == 35" href="@/assets/moon/moon-35.png" :width="(moonWidth = 11) + '%'" :height="moonWidth + '%'" :x="50 - moonWidth/2 + '%'" :y="50 - moonWidth/2 + '%'" />
    </g>

    <!-- DIAL -->
    <circle id="dialLoadingBg" :r="settings.dialSize" cx="180" cy="180" fill="#E3E3E3" />
    <circle id="dial" :r="settings.dialSize" cx="180" cy="180" :fill="hemisphere > 0 ? 'url(#northernDial)' : 'url(#southernDial)'" />
    
    <!-- NTZ 0° / +180° -->
    <image id="ntzNeedle" xlink:href="../assets/clock/NTZ.png" width="100%" height="100%" />

    <!-- PROMPT -->
    <g id="prompt">

      <!-- LOCATION -->
      <text id="location" x="180" y="211">{{ location.replace(/_/g, " ") }} ({{ naturalDate.toLongitudeString() }})<title>{{ $t('nav.openLocationPicker') }}</title></text>

      <!-- MOON LOOP -->
      <g> 
        <circle v-if="!naturalDate.isRainbowDay" v-for="n in 28" 
          :cx="(settings.ystart + settings.yspan * ((n-1)%7)) * settings.dialSize" 
          :cy="(settings.xstart + settings.xspan * parseInt((n-1)/7)) * settings.dialSize" 
          :r="n == naturalDate.dayOfMoon ? 2 : 1.4" 
          :class="n == naturalDate.dayOfMoon ? 'color-'+naturalDate.dayOfWeek : ''"></circle>
      </g>
    </g>

    <!-- SUN NEEDLE -->
    <image id="sunNeedle" href="@/assets/clock/sun-needle.png" width="100%" height="100%" />
    
    <!-- TIME -->
    <g id="time">
      <text id="units" x="174" y="196">{{ ('00'+Math.floor(naturalDate.time)).slice(-3) }}°</text>
      <text id="decimals" x="228" y="196" >{{ ('0' + Math.floor((naturalDate.time - Math.floor(naturalDate.time))  * 100/1) * 1).slice(-2) }}</text>
      <title>{{ $t('nav.openLocationPicker') }}</title>
    </g>

  </svg>

  <!-- DEFINE GLOBAL CSS VARS -->
  <component :is="'style'">
    :root {
      --sun-time: {{naturalDate.time * hemisphere}}deg;
      --ntz-time: {{(naturalDate.time - naturalDate.longitude) * hemisphere}}deg;
      --sun-altitude: {{sunContext.altitude * 0.9}}px;
      --moon-time: {{naturalDate.time * hemisphere - moonContext.phase * hemisphere}}deg;
      --moon-altitude: {{moonContext.altitude * 0.9}}px;
    }
  </component>

</template>

<style lang="scss" scoped>
  
// set all rotations origin to bottom
svg{
  transform: rotate(90deg);
}

#sun, #sunNeedle{
  transform: rotateZ(var(--sun-time));
  transform-origin: 50% 50%;
}

#sun{
  & > image{
  transform: translateX(var(--sun-altitude));
  filter: blur(calc(1px - var(--day-progression) * 1px)) var(--day-saturation);
}
}

#blurryPeriodsRing{
  opacity: calc(0.5 + var(--day-progression) / 5);
  transform: scale(calc(0.86 + var(--day-progression) * 0.14)) scaleY(var(--hemisphere));
  transform-origin: 50% 50%;
}

#periodsRing{
  opacity: calc(0.5 + var(--day-progression) * 0.5);
  transform: scale(calc(0.86 + var(--day-progression) * 0.14)) scaleY(var(--hemisphere));
  transform-origin: 50% 50%;
}

#ntz-ring{
  transform: scaleY(var(--hemisphere));
  transform-origin: 50% 50%;
}

#ntzNeedle{
  transform: rotateZ(var(--ntz-time)) scaleY(var(--hemisphere));
  transform-origin: 50% 50%;
}

#moon{
  transform: rotateZ(var(--moon-time)) scaleY(var(--hemisphere));
  transform-origin: 50% 50%;
  image{
    transform: translateX(calc(32% + var(--moon-altitude)));
  }
}

#time{
  cursor: pointer;
  transform: rotate(-90deg);
  transform-origin: center center;
  text-anchor: middle;
  font-family: "Radio Canada", sans-serif;
  font-weight: 700;
  fill: #4D4D59;
  #units{
    font-size: 3.4em;
  }
  #decimals{
    font-size: 1.1em;
    font-weight: 400;
    fill: #cccccd;
  } 
  &:hover{
    #units, #decimals{
      fill: #2b2b2b;
    }
  }

}

#prompt{
  transform: rotate(-90deg);
  transform-origin: center center;
  circle{
    fill: #CECECE;
  }

  #location{
    cursor: pointer;
    text-anchor: middle;
    font-family: monospace, sans-serif;
    font-size: 0.5em;
    fill: #9b9bb4;
    font-weight: bold;
  }
  #fulldate{
    text-anchor: middle;
    font-family: "Radio Canada", sans-serif;
    font-size: 0.45em;
    fill: #bfbfbf;
  }
}
  
</style>