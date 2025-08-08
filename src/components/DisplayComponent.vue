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

    <!-- DISPLAY: RAINBOW DAY (simplified, larger text) -->
    <div v-else class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div 
        class="font-extrabold rainbow-display text-center"
        :style="{ color: displayStyle.color, opacity: displayStyle.opacity, fontSize: `${props.containerSize * 0.13}px`, lineHeight: 1 }"
      >
        <div class="rainbow-digit">{{ $t('moon.title.rainbowDay') }}</div>
        <div class="rainbow-indicator text-gray-600" :style="{ fontSize: `${props.containerSize * 0.1}px` }">
          <span v-if="displayDate.yearDuration === 365">🌈</span>
          <span v-else-if="displayDate.yearDuration === 366">
            <span v-if="displayDate.dayOfYear === 365">1/2</span>
            <span v-else-if="displayDate.dayOfYear === 366">2/2</span>
          </span>
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
import { NaturalDate } from 'natural-time-js';

const { t } = useI18n();

const props = defineProps({
  displayDate: {
    type: NaturalDate,
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

/* Rainbow day specific: allow larger, single-line label */
.rainbow-display {
  max-width: 100%;
}

.rainbow-digit {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.02em;
}

.rainbow-indicator {
  margin-top: 0.5em;
}
</style>
