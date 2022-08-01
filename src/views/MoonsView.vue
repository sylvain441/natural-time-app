<script setup>

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { NaturalDate } from 'natural-time-js';
import Moon from '@/components/MoonComponent.vue';
import ElementIcon from '@/components/ElementIcon.vue';

const route = useRoute();
const router = useRouter();

// If coordinates present in url && default localStorage => populate localStorage
if(route.params.latlng && localStorage.coordinatesFrom == 'default') {
  localStorage.latitude = parseFloat(route.params.latlng.split(',')[0]);
  localStorage.longitude = parseFloat(route.params.latlng.split(',')[1]);
  localStorage.location = route.params.location || '';
  localStorage.coordinatesFrom = "url";
}

// If empty url && localstorage different than default => populate url
if(!route.params.latlng && localStorage.coordinatesFrom != 'default') {
  router.push({name: 'date', params: {
    latlng:localStorage.latitude+','+localStorage.longitude,
    location: localStorage.location
  }});
}

// Get coordinates from LOCAL STORAGE
const latitude = ref(parseFloat(localStorage.latitude));
const longitude = ref(parseFloat(localStorage.longitude));
const location = ref(String(localStorage.location));

// Overwrite with URL params if present
if(route.params.latlng) {
  latitude.value = parseFloat(route.params.latlng.split(',')[0]);
  longitude.value = parseFloat(route.params.latlng.split(',')[1]);
  location.value = String(route.params.location);
}

// Initialize date
const now = ref(new Date());

// Update clock automatically
let timerInterval = null;
onMounted(() => { timerInterval = setInterval(() => now.value = Date.now(), 12000) });
onUnmounted(() => { clearInterval(timerInterval) });

// Translate to natural date
const today = computed(() => {
  let naturalDate = new NaturalDate(now.value, longitude.value);
  // Update page title
  document.title = `${naturalDate.toDateString()} - ${location.value ? location.value.replace(/_/g, " ") : ""} (${naturalDate.toLongitudeString()})`;
  return naturalDate;
});

// Retreive hover date from subcomponents
const hoverDate = ref(false);
const hoverDateEvent = (payload) => { hoverDate.value = payload }
const resetHoverDate = () => { hoverDate.value = false }

// Display either current day or hover date (if available)
const displayDate = computed(() => hoverDate.value || today.value);

onMounted(() => {
  // SCROLL TO MOON
  let currentMoon = document.getElementsByClassName('currentMoon')[0];
  window.scrollTo({
      top: currentMoon.offsetTop,
      behavior: 'smooth'
  });
})

// Update current location from URI change
onBeforeRouteUpdate((to, from) => {
  if(!to.params.latlng.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/)) {
    router.push({name: 'settings'});
  } else {
    latitude.value = parseFloat(to.params.latlng.split(',')[0]);
    longitude.value = parseFloat(to.params.latlng.split(',')[1]);
    location.value = to.params.location;
  }
})
</script>

<template>

<div id="moons-view">

  <div id="backgrounds">
    <div id="clouds"></div>
  </div>

  <div id="year">
    
    <!-- DISPLAY -->
    <div id="display">
      
      <!-- DISPLAY: YEAR ) MOON ) DAY -->
      <div v-if="!displayDate.isRainbowDay" class="center-me">
        <div class="display-top">
          <div class="display-year">
            <div class="digit">{{displayDate.toYearString()}}</div>
            <div class="label">{{ $t('year') }}</div>
          </div>
          <div class="separator" :style="{color:'var(--color-'+displayDate.dayOfWeek+')'}">)</div>
          <div class="display-moon">
            <div class="digit">{{displayDate.toMoonString()}}</div>
            <div class="label">{{ $t('moon') }}</div>
          </div>
          <div class="separator" :style="{color:'var(--color-'+displayDate.dayOfWeek+')'}">)</div>
          <div class="display-day" @click="router.push({name: 'time'})">
            <div class="digit">{{displayDate.toDayOfMoonString()}}</div>
            <div class="label">{{ $t('day') }}</div>
          </div>
        </div>
        <div class="display-bottom">
          <div class="time">{{ location ? location.replace(/_/g, " ") + " | " : "" }}{{ today.toTimeString(2,5) }} {{ today.toLongitudeString() }}</div>
        </div>
      </div>

      <!-- DISPLAY: RAINBOW DAY -->
      <div v-else class="center-me">
        <div class="display-top">
          <div class="display-year">
            <div class="digit">&nbsp;</div>
            <div class="label">{{ $t('rainbowDay.out') }}</div>
          </div>
          <div class="separator"></div>
          <div class="display-moon">
            <div class="digit">{{ $t('rainbowDay.day') }}</div>
            <div class="label">{{ $t('rainbowDay.of') }}</div>
          </div>
          <div class="separator"></div>
          <div class="display-day">
            <div class="digit">&nbsp;</div>
            <div class="label">{{ $t('rainbowDay.time') }}</div>
          </div>
        </div>
        <div class="display-bottom" :style="{color:'var(--color-'+displayDate.dayOfWeek+')'}">
          <div v-for="color = 1 in 7">
            <ElementIcon :element="4 - Math.abs(4 - color)" :color="color"></ElementIcon>
          </div>
        </div>
      </div>
    </div>

    <!-- 13 MOONS -->
    <Moon v-for="moon = 1 in 14" 
      :id="'moon-'+moon"
      :today="today" 
      :moon="moon" 
      @hover-date="hoverDateEvent"
      @reset-hover="resetHoverDate"></Moon>

  </div>
</div>

</template>

<style lang="scss">

#backgrounds {
  z-index: 0;
  &, div {
    position: fixed;
    width: 100vw;
    height: 100vh;
    margin: 0;
  }
  #clouds {
    z-index: 40; 
    background: url("@/assets/background/clouds.jpg") center center; 
    background-size: cover;
  }
}

@mixin lbg {  @media (min-width: 800px) { .left{ background-color: var(--yearloop-bg-color) } } }
@mixin tbg {  @media (min-width: 800px) { .top{ background-color: var(--yearloop-bg-color) } } }

@mixin tlr { .left, .bottom{ border-top-left-radius: var(--yearloop-radius) } }
@mixin blr { .left, .bottom{ border-bottom-left-radius: var(--yearloop-radius) } }
@mixin trr { .bottom{ border-top-right-radius: var(--yearloop-radius) } }
@mixin brr { .bottom{ border-bottom-right-radius: var(--yearloop-radius) } }

#moon-1{ @include lbg; @include tlr; @include blr; } 
#moon-2{ @include lbg; } 
#moon-3{ @include lbg; } 
#moon-4{ @include lbg; @include trr; } 
#moon-5{ @include tbg; } 
#moon-6{ @include tbg; } 
#moon-7{ @include lbg; @include tbg; @include brr; } 
#moon-8{ @include lbg; } 
#moon-9{ @include lbg; } 
#moon-10{ @include tbg; @include blr; } 
#moon-11{ @include tbg; } 
#moon-12{ @include tlr; } 
#moon-13{ @include lbg; @include trr; @include brr; } 

#year{
  position: relative;
  width: 100%;
  box-sizing: border-box;

  #display {
    position: relative;
    & > .center-me{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      .display-top{
        display: flex;
        align-items: center;
        font-family: "Radio Canada", sans-serif;
        font-weight: 700;
        & > div{
          text-align: center;
          .digit{
            font-size: 4.5em;
            line-height: 0.8;
          }
          .label{
            text-transform: uppercase;
            font-size: 1.7em;
          }
        }
        .separator{
          margin: -1em 0.6em 0;
          font-size: 1.7em;
        }
      }
      .display-bottom{
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(60, 60, 60);
        .time{
          font-family: monospace, sans-serif;
          font-size: 1em;
          margin-top: .6em;
        }
        & > div{
          font-family: "Helvetica Neue", sans-serif;
          font-weight: 400;
          font-size: 1.8em;
          margin: .2em;
        }
        svg{
          width: 1.5em;
          margin-top: 0.2em;
          margin-right: 0.3em;
        }
        .location{
          width: 100%;
          text-align: center;
          font-style: italic;
          font-size: 0.7em;
          line-height: 0.8;
        }
      }
    }
  }
  
  /* LINEAR YEAR (mobile) */
  @media (max-width: 799px) {

    #display{
      position: fixed;
      z-index: 1000;
      width: min(90vw, 555px);
      height: 14em;
      background: #FFF;
      font-size: 8px;
      bottom: 5vh;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 10px;
      box-shadow: 0 0 80px transparentize($color: #FFF, $amount: 0);
      @media (min-width: 800px) { 
        font-size: 12px;
      }
    }

    #moon-1{
      .dayColors{
        display: block;
      }
      .title{
        transform: translateY(-100%);
      }
      &::before{
        content: '';
        display: block;
        width: 100%;
        height: 8em;
      }
    }
    #moon-14{
      padding-bottom: 10em;
    }
    
    .moonComponent{
      width: 300px;
      margin: auto;
      padding: 5vh 0;
      .dayColors{
        display: none;
      }
      .left{
        display: none;
      }
    }
    @media (max-height: 500px) and (orientation: landscape) {
      #display {
        font-size: 7px;
      }
    }
  }

  /* SPIRAL YEAR (desktop) */
  @media (min-width: 800px) {
    position: absolute;
    z-index: 3000;
    aspect-ratio: 1.618 / 1;
    max-width: min(calc(94vh * 1.618), 92vw);
    height: auto;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: min(calc(100vw * 0.01), calc(100vh * 0.02));
    padding: 5%;
    display: flex;
    flex-wrap: wrap;

    & > div{ width: 25%; height: 25%; }
    #display{ width: 50%; }

    #moon-1{ 
      order: 1;
      .bottom{
        border-top-left-radius: 0!important;
        border-bottom-left-radius: 0!important;
      }
    } 
    #moon-2{ order: 2; } 
    #moon-3{ order: 3; } 
    #moon-4{ order: 4; } 
    #moon-5{ order: 8; } 
    #moon-6{ order: 11; } 
    #moon-7{ order: 15; } 
    #moon-8{ order: 14; } 
    #moon-9{ order: 13; } 
    #moon-10{ order: 12; } 
    #moon-11{ order: 9; } 
    #moon-12{ order: 5; } 
    #moon-13{ order: 6; } 
    #moon-14{ order: 7; }
    #display{ 
      order: 10;
      .center-me{
        top: 60%;
        left: 52%;
      }
    }
    
    .moonComponent{

      .top{
        .title{ 
          font-size: .8em; 
          line-height: 2.5;
          font-weight: 500;
          span{ 
            display: none 
          }
        }
      }

      .bottom{
        background-color: var(--yearloop-bg-color);
      }

      /* HOVER STATES */
      &:not(#moon-1){
        .left svg{ opacity: 0; }
        .dayColors{ opacity: 0; }
      }
      &#moon-1{
        .title{ opacity: 0; }
      }
      &:hover{
        .left svg{ opacity: 0.7!important; }
        .title{ opacity: 0!important;}
        .dayColors{ opacity: 1!important; }
      }
    }
  }
}


</style>
