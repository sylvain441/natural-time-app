<template>
  <div id="display" class="relative" :style="{ width: `${containerSize}px` }">
    <!-- DISPLAY: PLACEHOLDER -->
    <div v-if="!spiralSkin.showDisplay && spiralWelcomeMode" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div class="flex items-center font-extrabold display-container">
        <div class="text-center" :style="displayStyle">
          <div class="digit">xxx</div>
          <div class="label uppercase">{{ $t('display.year') }}</div>
        </div>
        <div class="mx-3 separator font-normal" :style="displayStyle">)</div>
        <div class="text-center" :style="displayStyle">
          <div class="digit">xx</div>
          <div class="label uppercase">{{ $t('display.moon') }}</div>
        </div>
        <div class="mx-3 separator font-normal" :style="displayStyle">)</div>
        <div class="text-center" :style="displayStyle">
          <div class="digit">xx</div>
          <div class="label uppercase">{{ $t('display.day') }}</div>
        </div>
      </div>
    </div>

    <!-- DISPLAY: YEAR ) MOON ) DAY -->
    <div v-else-if="!displayDate.isRainbowDay" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-x-2 space-y-4">
      <div class="flex items-center font-extrabold display-container text-white/95">
        <div class="text-center" :style="displayStyle">
          <div class="digit">{{displayDate.toYearString()}}</div>
          <div class="label uppercase">{{ $t('display.year') }}</div>
        </div>
        <div class="mx-3 separator font-normal" :style="displayStyle">)</div>
        <div class="text-center" :style="displayStyle">
          <div class="digit">{{displayDate.toMoonString()}}</div>
          <div class="label uppercase">{{ $t('display.moon') }}</div>
        </div>
        <div class="mx-3 separator font-normal" :style="displayStyle">)</div>
        <div class="text-center" :style="displayStyle">
          <div class="digit">{{displayDate.toDayOfMoonString()}}</div>
          <div class="label uppercase">{{ $t('display.day') }}</div>
        </div>
      </div>
      <div v-if="spiralTimeTravelMode" :style="displayStyle" class="text-slate-800 italic gregorian-date">
        ({{ new Date(context.naturalDate.unixTime).toLocaleDateString($t('display.dateFormat'), { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) }})
      </div>
    </div>

    <!-- DISPLAY: RAINBOW DAY -->
    <div v-else class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div class="flex items-center font-extrabold display-container">
        <div class="text-center" :style="displayStyle">
          <div class="digit">&nbsp;</div>
          <div class="label uppercase">{{ $t('display.rainbow.arc') }}</div>
        </div>
        <div class="text-center" :style="displayStyle">
          <div class="digit">{{ $t('display.rainbow.day') }}</div>
          <div class="label uppercase">{{ $t('display.rainbow.sky') }}</div>
        </div>
        <div class="text-center" :style="displayStyle">
          <div class="digit">&nbsp;</div>
          <div class="label uppercase">{{ $t('display.rainbow.sky') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/configStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  displayDate: {
    type: Object,
    required: true
  },
  context: {
    type: Object,
    required: true
  },
  containerSize: {
    type: Number,
    default: 800
  }
});

const configStore = useConfigStore();
const { spiralSkin, spiralTimeTravelMode, spiralWelcomeMode } = storeToRefs(configStore);

const displayStyle = computed(() => ({
  color: `var(--color-dark-${props.displayDate.dayOfWeek})`,
  opacity: '0.95'
}));
</script>

<style scoped>
.display-container {
  font-size: v-bind('`${props.containerSize * 0.2}px`');
  line-height: 1.1;
}

.label {
  font-size: v-bind('`${props.containerSize * 0.08}px`');
}

.separator {
  font-size: v-bind('`${props.containerSize * 0.17}px`');
}

.gregorian-date {
  font-size: v-bind('`${props.containerSize * 0.06}px`');
}
</style>
