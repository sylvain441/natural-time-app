<script setup>

import { computed } from 'vue';
import { NaturalDate } from 'natural-time-js';

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
        isPast: props.today.toDateString() >= date.toDateString(),
        isRainbowDay: props.today.isRainbowDay
      },
      backgroundClasses: {}
    };
    allDays[i].backgroundClasses[`color-${date.dayOfWeek}`] = true;
  }
  return allDays;
})

</script>

<template>

<div class="moonComponent" :class="{passedMoon: today.moon > moon, currentMoon: today.moon == moon}">

  <div v-if="moon < 14" class="flex">

    <div class="left">
      <!--<ElementIcon v-for="element = 1 in 4" :element="element" :color="0"></ElementIcon>-->
    </div>

    <div class="right">

      <div class="top">
        <div class="title"><span>{{ $t("moon") }}</span> #{{moon}}</div>
        <div class="dayColors">
          <span class="color-1"></span>
          <span class="color-2"></span>
          <span class="color-3"></span>
          <span class="color-4"></span>
          <span class="color-5"></span>
          <span class="color-6"></span>
          <span class="color-7"></span>
        </div>
      </div>

      <div class="bottom">
        <div v-for="day in daysOfMoon" 
          class="dayOfMoon" 
          :class="day.dayClasses" 
          :title="$t('nt')+' => ' + day.date.toDateString() + '\n' + $t('at')+ ' => ' + new Date(day.date.unixTime).toLocaleDateString()"
          @mouseenter="$emit('hover-date', day.date)"
          @mouseleave="$emit('reset-hover')"
          v-touch:press="$emit('hover-date', day.date)"
          v-touch:release="$emit('reset-hover')">
          <div class="background" :class="day.backgroundClasses"></div>
          <div class="dayNumber">{{day.date.toDayOfMoonString()}}</div>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="moon-rainbow-day" :class="{isRainbowDay: today.isRainbowDay}"
    @mouseenter="$emit('hover-date', new NaturalDate(today.yearStart + NaturalDate.MILLISECONDS_PER_DAY * 364, today.longitude))"
    @mouseleave="$emit('reset-hover')">
    <div v-if="today.yearDuration == 365">
      <img src="@/assets/13moons/rainbow-day.png">
    </div>
    <div v-else>
      <img src="@/assets/13moons/rainbow-days.png">
    </div>
  </div>

</div>

</template>

<style lang="scss">
  
.moonComponent{
  position: relative;
  aspect-ratio: 1.618 / 1;
  
  .flex{ 
    position: relative;
    height: 100%;
    display: flex;
    align-items: flex-end;
  }

  .left{
    width: var(--left-column-width);
    height: calc(100% - var(--top-row-height));
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    text-align: left;
    svg{
      display: inline-block;
      opacity: .7;
      transform: scale(0.6) translateX(10%);
    }
  }
  .right{
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top{
      position: relative;
      width: 100%;
      height: var(--top-row-height);
      box-sizing: border-box;
      & > div{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        padding: 0 4%;
        box-sizing: border-box;
      }
      
      .title{
        font-family: "Radio Canada", sans-serif;
        font-weight: 500;
        font-size: 1.1em;
        text-align: center;
        opacity: .5;
      }

      .dayColors{
        span{
          display: inline-block;
          aspect-ratio: 1 / 1;
          opacity: .7;
          border-radius: 50%;
          width: calc(100% / 7);
          transform: scale(0.5) translateY(-10%);
        }
      }
    }

    .bottom{
      width: 100%;
      height: calc(100% - var(--top-row-height));
      padding: 0 4%;
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      box-sizing: border-box;
    }
  }

  .moon-rainbow-day{
    filter: saturate(50%);
    &,& > div{ height: 100% }
    img{
      position: absolute;
      display: block;
      width: 100%;
    }  
    &.isRainbowDay, &:hover{
      filter: saturate(100%);
    }
  }

  
  .dayOfMoon{
    position: relative;
    width: calc(100% / 7);
    aspect-ratio: 1 / 1;
    font-family: "Radio Canada", sans-serif;
    cursor: default;
    
      .background{
        position: absolute;
        height: 90%;
        aspect-ratio: 1 / 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        opacity: 0;
        transition: .1s all;
      }
      .dayNumber{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        opacity: 0.2;
        font-weight: 700;
        line-height: 1.9em;
      }
      &.isPast{
        .dayNumber{
          opacity: 1;
        }
      }

    &.isToday, &:hover{
      .background{
        opacity: .5;
      }
    }
    &.isRainbowDay{
      .dayNumber{
        opacity: 0;
      }
      .background{
        opacity: 1;
        height: 50%;
      }
    }
    
  }
  &.passedMoon, &.currentMoon {
    .title{
      opacity: 1;
    }
  }
}

</style>