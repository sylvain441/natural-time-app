<template>
  <section class="spiral-hero" ref="heroEl">
    <div class="spiral-hero__ground"></div>
    <PaperTexture class="spiral-hero__paper" :opacity=".6" />

    <div class="spiral-hero__content">

      <div class="spiral-hero__spiral" ref="spiralEl" :style="spiralStyle">

        <div class="spiral-hero__burst" ref="burstEl" :style="burstStyle">
          <div class="spiral-hero__bloom"></div>
          <div class="spiral-hero__ring"></div>
        </div>

        <div class="spiral-hero__tilt" :style="tiltStyle">
          <svg ref="svgEl" :viewBox="viewBox" aria-hidden="true">

            <g ref="daysEl">
              <circle v-for="(day, index) in days" :key="index"
                      :cx="day.x" :cy="day.y" :r="dayDotRadius" :fill="baseDotColor" />
            </g>

            <g ref="rainbowEl" :transform="`translate(${rainbowDayPosition.x} ${rainbowDayPosition.y})`" opacity="0">
              <g ref="rainbowSpinEl">
                <path v-for="(wedge, index) in rainbowWedges" :key="index" :d="wedge.path" :fill="wedge.fill" />
              </g>
              <circle :r="rainbowRadius * 0.3" :fill="PAPER_COLOR" />
            </g>
          </svg>

          <div class="spiral-hero__fly" ref="flyEl" :style="{ '--spiral-hero-dotd': flyingDayDiameter }" aria-hidden="true">
            <div class="spiral-hero__flydot" v-for="i in FLYING_DAY_POOL_SIZE" :key="i"></div>
          </div>

        </div>
      </div>

      <div class="spiral-hero__stage">
        <div class="spiral-hero__copy">

          <h2>
            <span>{{ $t('welcome.moonsHero.titleLine1') }}</span>{{ ' ' }}
            <span>{{ $t('welcome.moonsHero.titleLine2') }}</span>
          </h2>
          <p>{{ $t('welcome.moonsHero.subtitle') }}</p>
          <div class="spiral-hero__cta">
            <router-link :to="{ name: getLocalizedRouteName('13moons', locale) }" class="spiral-hero__cta-main">
              <span>{{ $t('welcome.thirteenMoons.cta.open') }}</span>
              <span class="spiral-hero__arrow">→</span>
            </router-link>
            <router-link :to="{ name: getLocalizedRouteName('13moons', locale), query: { tutorial: '1' } }" class="spiral-hero__cta-sub">
              <span>{{ $t('welcome.moonsHero.cta.howToRead') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import '@fontsource/playfair-display/900.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import { getLocalizedRouteName } from '@/i18n/config';
import PaperTexture from '@/components/PaperTexture.vue';
import { mixHexColors, smoothstep } from '@/utils/color';

const { locale } = useI18n();

const lapSeconds = 34;
const trailDays = 84;
const rainbowHoldDays = 26;
const paletteName = 'ink';
const dotScale = 0.99;
const moonGap = 0.3;
const tiltX = 0;
const tiltY = -21.5;
const tiltZ = 0;
const perspective = 850;
const portraitTiltX = 11;
const bleed = 0;
const zoom = 1.18;
const latticeInk = 0.3;
const depositHeight = 0.06;
const settleDays = 7;
const blurStrength = 4;
const clearAheadDays = 15;
const burstStrength = 0.75;

const DAY_CELL_SIZE = 12;
const VIEWBOX_PADDING = 12;

const geometry = computed(() => {
  const gutter = moonGap * DAY_CELL_SIZE;
  const cellWidth = 7 * DAY_CELL_SIZE + 2 * gutter;
  const cellHeight = 4 * DAY_CELL_SIZE + 2 * gutter;
  return {
    gutter,
    cellWidth,
    cellHeight,
    width: 4 * cellWidth,
    height: 4 * cellHeight,
  };
});

const MOON_CELLS = [
  [0, 0], [1, 0], [2, 0], [3, 0],
  [3, 1], [3, 2], [3, 3],
  [2, 3], [1, 3], [0, 3],
  [0, 2], [0, 1],
  [1, 1],
];
const RAINBOW_CELL = [2, 1];

const DAYS_PER_MOON = 28;
const TOTAL_DAYS = MOON_CELLS.length * DAYS_PER_MOON;
const RAINBOW_INDEX = TOTAL_DAYS;

const viewBox = computed(() => {
  const { width, height } = geometry.value;
  return `${-VIEWBOX_PADDING} ${-VIEWBOX_PADDING} ${width + 2 * VIEWBOX_PADDING} ${height + 2 * VIEWBOX_PADDING}`;
});
const aspect = computed(() => {
  const { width, height } = geometry.value;
  return `${width + 2 * VIEWBOX_PADDING} / ${height + 2 * VIEWBOX_PADDING}`;
});

const days = computed(() => {
  const { gutter, cellWidth, cellHeight } = geometry.value;
  const dayPositions = [];
  for (const [moonColumn, moonRow] of MOON_CELLS) {
    for (let dayIndex = 0; dayIndex < DAYS_PER_MOON; dayIndex += 1) {
      const weekday = dayIndex % 7;
      const week = Math.floor(dayIndex / 7);
      const x = moonColumn * cellWidth + gutter + (weekday + 0.5) * DAY_CELL_SIZE;
      const y = moonRow * cellHeight + gutter + (week + 0.5) * DAY_CELL_SIZE;
      dayPositions.push({
        x: +x.toFixed(2),
        y: +y.toFixed(2),
        weekday,
        left: ((x + VIEWBOX_PADDING) / (4 * cellWidth + 2 * VIEWBOX_PADDING) * 100).toFixed(3) + '%',
        top: ((y + VIEWBOX_PADDING) / (4 * cellHeight + 2 * VIEWBOX_PADDING) * 100).toFixed(3) + '%',
      });
    }
  }
  return dayPositions;
});

const rainbowDayPosition = computed(() => {
  const { cellWidth, cellHeight } = geometry.value;
  return {
    x: +(RAINBOW_CELL[0] * cellWidth + cellWidth / 2).toFixed(2),
    y: +(RAINBOW_CELL[1] * cellHeight + cellHeight / 2).toFixed(2),
  };
});
const rainbowRadius = DAY_CELL_SIZE * 1.85;

const dayDotRadius = computed(() => +(DAY_CELL_SIZE * 0.40 * dotScale).toFixed(3));

const PAPER_COLOR = '#91C8DA';
const INK_COLOR = '#1A1917';

const COLOR_PALETTES = {
  vivid: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#0EA5E9', '#6366F1', '#8B5CF6'],
  ink: ['#D8453C', '#E07A2E', '#D9A520', '#4E9E52', '#2E86B8', '#4C5BA8', '#7A54A0'],
};
const rainbowColors = computed(() => COLOR_PALETTES[paletteName]);

const baseDotColor = computed(() => mixHexColors(PAPER_COLOR, INK_COLOR, latticeInk));

const COLOR_LEVEL_COUNT = 24;
const OPACITY_LEVEL_COUNT = 24;
const colorRamp = computed(() => {
  const baseColor = baseDotColor.value;
  return rainbowColors.value.map(color => {
    const levels = new Array(COLOR_LEVEL_COUNT + 1);
    for (let level = 0; level <= COLOR_LEVEL_COUNT; level += 1) {
      levels[level] = mixHexColors(baseColor, color, level / COLOR_LEVEL_COUNT);
    }
    return levels;
  });
});

const FLYING_DAY_POOL_SIZE = 20;

const flyingDayDiameter = computed(() => {
  const { width } = geometry.value;
  return (2 * dayDotRadius.value / (width + 2 * VIEWBOX_PADDING) * 100).toFixed(3) + '%';
});

const RAINBOW_WEDGE_COUNT = 84;
const rainbowWedges = computed(() => {
  const wedges = [];
  for (let index = 0; index < RAINBOW_WEDGE_COUNT; index += 1) {
    const startAngle = (index / RAINBOW_WEDGE_COUNT) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((index + 1.04) / RAINBOW_WEDGE_COUNT) * 2 * Math.PI - Math.PI / 2;
    const colorPosition = (index / RAINBOW_WEDGE_COUNT) * rainbowColors.value.length;
    const colorIndex = Math.floor(colorPosition) % rainbowColors.value.length;
    wedges.push({
      path: `M 0,0 L ${(rainbowRadius * Math.cos(startAngle)).toFixed(3)},${(rainbowRadius * Math.sin(startAngle)).toFixed(3)}`
        + ` A ${rainbowRadius},${rainbowRadius} 0 0,1 ${(rainbowRadius * Math.cos(endAngle)).toFixed(3)},${(rainbowRadius * Math.sin(endAngle)).toFixed(3)} Z`,
      fill: mixHexColors(
        rainbowColors.value[colorIndex],
        rainbowColors.value[(colorIndex + 1) % rainbowColors.value.length],
        colorPosition - Math.floor(colorPosition),
      ),
    });
  }
  return wedges;
});

const spiralStyle = computed(() => ({
  '--spiral-hero-zoom': zoom,
  '--spiral-hero-bleed': bleed,
  '--spiral-hero-aspect': aspect.value,
  '--spiral-hero-shift': `${-perspectiveCorrection.value.x}px`,
  '--spiral-hero-shift-y': `${-perspectiveCorrection.value.y}px`,
}));
const tiltStyle = computed(() => ({
  '--spiral-hero-persp': `${perspective}px`,
  '--spiral-hero-rx': `${tiltX}deg`,
  '--spiral-hero-ry': `${tiltY}deg`,
  '--spiral-hero-rz': `${tiltZ}deg`,
  '--spiral-hero-rx-stacked': `${portraitTiltX}deg`,
}));

const TRAIL_FALLOFF_POWER = 1.8;
const LANDING_COLOR_DURATION = 0.55;
const EMPTY_SLOT_DURATION = 2.2;

function getDayIntensity(age, clearAheadDuration, trailDuration) {
  if (age < 0) {
    if (age <= -clearAheadDuration) return 0;
    if (age >= -EMPTY_SLOT_DURATION) return -1;
    return -smoothstep(-clearAheadDuration, -EMPTY_SLOT_DURATION, age);
  }
  if (age < LANDING_COLOR_DURATION) return -1 + 2 * smoothstep(0, LANDING_COLOR_DURATION, age);
  const trailProgress = (age - LANDING_COLOR_DURATION)
    / Math.max(trailDuration - LANDING_COLOR_DURATION, 1);
  return trailProgress >= 1 ? 0 : Math.pow(1 - trailProgress, TRAIL_FALLOFF_POWER);
}

function getDepositProgress(age, settlingDuration) {
  if (age < 0 || age > settlingDuration) return 0;
  const progress = age / settlingDuration;
  return (1 - progress) ** 3;
}

const animationCycleDays = computed(() => RAINBOW_INDEX + 1 + rainbowHoldDays);

const burstStyle = computed(() => {
  const { cellWidth, cellHeight, width, height } = geometry.value;
  return {
    left: `${(((RAINBOW_CELL[0] + 0.5) * cellWidth + VIEWBOX_PADDING) / (width + 2 * VIEWBOX_PADDING) * 100).toFixed(3)}%`,
    top: `${(((RAINBOW_CELL[1] + 0.5) * cellHeight + VIEWBOX_PADDING) / (height + 2 * VIEWBOX_PADDING) * 100).toFixed(3)}%`,
  };
});

const perspectiveCorrection = ref({ x: 0, y: 0 });
let sizeObserver = null;

function measurePerspectiveCorrection() {
  const container = spiralEl.value;
  const spiral = svgEl.value;
  if (!container || !spiral) return;
  const containerBounds = container.getBoundingClientRect();
  const spiralBounds = spiral.getBoundingClientRect();
  if (!containerBounds.width || !spiralBounds.width) return;
  perspectiveCorrection.value = {
    x: Math.round(
      ((spiralBounds.left + spiralBounds.right) - (containerBounds.left + containerBounds.right)) / 2,
    ),
    y: Math.round(spiralBounds.bottom - containerBounds.bottom),
  };
}

const heroEl = ref(null);
const flyEl = ref(null);
const spiralEl = ref(null);
const svgEl = ref(null);
const burstEl = ref(null);
const daysEl = ref(null);
const rainbowEl = ref(null);
const rainbowSpinEl = ref(null);

let dayDots = null;
let lastColorLevels = null;
let lastOpacityLevels = null;
let animationFrameId = null;
let intersectionObserver = null;
let onVisibilityChange = null;
let pageVisible = true;
let heroVisible = true;
let animationDay = 0;
let lastFrameTime = 0;
let frameAccumulator = 0;
let rainbowRotation = 0;
const FRAME_INTERVAL_MS = 1000 / 30;
const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderSpiral(position) {
  const cycleLength = animationCycleDays.value;
  const colorsByWeekday = colorRamp.value;
  const dayPositions = days.value;
  const flyingDays = flyEl.value?.children;
  let flyingDayCount = 0;

  for (let dayIndex = 0; dayIndex < TOTAL_DAYS; dayIndex += 1) {
    let age = position - dayIndex;
    if (age < 0) age += cycleLength;
    if (age > cycleLength - clearAheadDays) age -= cycleLength;

    const intensity = getDayIntensity(age, clearAheadDays, trailDays);
    const depositProgress = getDepositProgress(age, settleDays);
    const dot = dayDots[dayIndex];
    const day = dayPositions[dayIndex];

    const colorLevel = intensity > 0 ? Math.round(intensity * COLOR_LEVEL_COUNT) : 0;
    if (colorLevel !== lastColorLevels[dayIndex]) {
      lastColorLevels[dayIndex] = colorLevel;
      dot.setAttribute('fill', colorsByWeekday[day.weekday][colorLevel]);
    }

    const opacityLevel = depositProgress > 0 ? 0
      : intensity < 0 ? Math.round((1 + intensity) * OPACITY_LEVEL_COUNT)
      : OPACITY_LEVEL_COUNT;
    if (opacityLevel !== lastOpacityLevels[dayIndex]) {
      lastOpacityLevels[dayIndex] = opacityLevel;
      if (opacityLevel === OPACITY_LEVEL_COUNT) dot.removeAttribute('fill-opacity');
      else dot.setAttribute('fill-opacity', (opacityLevel / OPACITY_LEVEL_COUNT).toFixed(3));
    }

    if (depositProgress > 0 && flyingDays && flyingDayCount < FLYING_DAY_POOL_SIZE) {
      const style = flyingDays[flyingDayCount].style;
      flyingDayCount += 1;
      style.left = day.left;
      style.top = day.top;
      style.background = colorsByWeekday[day.weekday][colorLevel];
      style.opacity = intensity < 0 ? (1 + intensity).toFixed(3) : '1';
      style.setProperty('--spiral-hero-lift', (depositHeight * depositProgress).toFixed(5));
      style.setProperty('--spiral-hero-soft', (blurStrength * depositProgress).toFixed(3));
    }
  }
  for (let index = flyingDayCount; index < FLYING_DAY_POOL_SIZE; index += 1) {
    flyingDays[index].style.opacity = '0';
  }

  let rainbowAge = position - RAINBOW_INDEX;
  if (rainbowAge < 0) rainbowAge += cycleLength;
  if (rainbowAge > cycleLength - clearAheadDays) rainbowAge -= cycleLength;
  const rainbowIntensity = Math.max(0, getDayIntensity(rainbowAge, clearAheadDays, trailDays));
  rainbowEl.value.setAttribute('opacity', rainbowIntensity.toFixed(3));
  const rainbowScale = (0.55 + 0.45 * rainbowIntensity).toFixed(3);
  rainbowSpinEl.value.setAttribute(
    'transform',
    `scale(${rainbowScale}) rotate(${rainbowRotation.toFixed(1)})`,
  );

  if (burstEl.value) renderBurst(position, cycleLength);
}

const RING_START_PROGRESS = 0.22;
const RING_MAX_SCALE = 5.5;

function renderBurst(position, cycleLength) {
  let rainbowAge = position - RAINBOW_INDEX;
  if (rainbowAge < 0) rainbowAge += cycleLength;
  const holdDuration = rainbowHoldDays + 1;
  const progress = Math.min(rainbowAge / holdDuration, 1);
  const [bloom, ring] = burstEl.value.children;

  setStyleVariableIfChanged(
    bloom.style,
    '--spiral-hero-k',
    (0.25 + 1.5 * Math.pow(progress, 0.55)).toFixed(3),
    'bloom.scale',
  );
  const bloomOpacity = smoothstep(0, 0.05, progress)
    * (1 - smoothstep(0.2, 0.62, progress))
    * burstStrength;
  setStyleVariableIfChanged(
    bloom.style,
    '--spiral-hero-o',
    bloomOpacity.toFixed(3),
    'bloom.opacity',
  );

  const ringProgress = (progress - RING_START_PROGRESS) / (1 - RING_START_PROGRESS);
  if (ringProgress <= 0 || ringProgress >= 1) {
    setStyleVariableIfChanged(ring.style, '--spiral-hero-o', '0', 'ring.opacity');
    return;
  }
  setStyleVariableIfChanged(
    ring.style,
    '--spiral-hero-k',
    (0.5 + RING_MAX_SCALE * Math.pow(ringProgress, 0.68)).toFixed(3),
    'ring.scale',
  );
  const ringOpacity = smoothstep(0, 0.1, ringProgress)
    * (1 - Math.pow(ringProgress, 4))
    * burstStrength;
  setStyleVariableIfChanged(
    ring.style,
    '--spiral-hero-o',
    ringOpacity.toFixed(3),
    'ring.opacity',
  );
}

const lastWrittenStyleVariables = new Map();
function setStyleVariableIfChanged(style, name, value, cacheKey) {
  if (lastWrittenStyleVariables.get(cacheKey) === value) return;
  lastWrittenStyleVariables.set(cacheKey, value);
  style.setProperty(name, value);
}

function renderStaticSpiral() {
  const colorsByWeekday = colorRamp.value;
  const dayPositions = days.value;
  for (let dayIndex = 0; dayIndex < TOTAL_DAYS; dayIndex += 1) {
    lastColorLevels[dayIndex] = COLOR_LEVEL_COUNT;
    lastOpacityLevels[dayIndex] = OPACITY_LEVEL_COUNT;
    dayDots[dayIndex].setAttribute(
      'fill',
      colorsByWeekday[dayPositions[dayIndex].weekday][COLOR_LEVEL_COUNT],
    );
  }
  for (const flyingDay of flyEl.value.children) flyingDay.style.opacity = '0';
  rainbowEl.value.setAttribute('opacity', '1');
  rainbowSpinEl.value.setAttribute('transform', 'scale(1) rotate(0)');
}

function frame(now) {
  animationFrameId = requestAnimationFrame(frame);
  const elapsedMilliseconds = Math.min(now - lastFrameTime, 120);
  lastFrameTime = now;
  animationDay = (
    animationDay + (animationCycleDays.value / lapSeconds) * elapsedMilliseconds / 1000
  ) % animationCycleDays.value;
  rainbowRotation = (rainbowRotation + 9 * elapsedMilliseconds / 1000) % 360;
  frameAccumulator += elapsedMilliseconds;
  if (frameAccumulator < FRAME_INTERVAL_MS) return;
  frameAccumulator %= FRAME_INTERVAL_MS;
  renderSpiral(animationDay);
}

function syncLoop() {
  const shouldRun = pageVisible && heroVisible;
  if (shouldRun && animationFrameId === null) {
    lastFrameTime = performance.now();
    frameAccumulator = 0;
    animationFrameId = requestAnimationFrame(frame);
  } else if (!shouldRun && animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

onMounted(() => {
  measurePerspectiveCorrection();
  if ('ResizeObserver' in window) {
    sizeObserver = new ResizeObserver(measurePerspectiveCorrection);
    sizeObserver.observe(spiralEl.value);
  }

  dayDots = daysEl.value.children;
  lastColorLevels = new Int16Array(TOTAL_DAYS).fill(-1);
  lastOpacityLevels = new Int16Array(TOTAL_DAYS).fill(-1);

  if (reducedMotion) {
    renderStaticSpiral();
    return;
  }

  renderSpiral(animationDay);
  onVisibilityChange = () => {
    pageVisible = !document.hidden;
    syncLoop();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  if ('IntersectionObserver' in window) {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncLoop();
    }, { threshold: 0 });
    intersectionObserver.observe(heroEl.value);
  }
  syncLoop();
});

onBeforeUnmount(() => {
  if (sizeObserver) sizeObserver.disconnect();
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  if (onVisibilityChange) document.removeEventListener('visibilitychange', onVisibilityChange);
  if (intersectionObserver) intersectionObserver.disconnect();
});
</script>

<style>
.spiral-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 520px;
  overflow: hidden;
  font-family: "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  --spiral-hero-paper: #bcdae4;
  --spiral-hero-ink: #1A1917;

  --spiral-hero-soft: #234A58;
}
.spiral-hero * { box-sizing: border-box; }

.spiral-hero__ground {
  position: absolute; inset: 0; z-index: 0;

  background:
    radial-gradient(120% 95% at 50% 0%, #FFFEF9 0%, var(--spiral-hero-paper) 52%, #82BACD 100%);
}
.spiral-hero__paper { z-index: 1; }

.spiral-hero__content {
  position: absolute; inset: 0; z-index: 2;
  max-width: 1900px;
  margin: 0 auto;
}

.spiral-hero__spiral {
  --spiral-hero-box-size: calc(min(50vw, 94vh) * var(--spiral-hero-zoom, 1));
  position: absolute; top: 50%;

  width: var(--spiral-hero-box-size);
  aspect-ratio: var(--spiral-hero-aspect, 8 / 5);

  transform: translate(var(--spiral-hero-shift, 0px), -50%);
  pointer-events: none;
  right: calc(5vw - var(--spiral-hero-box-size) * var(--spiral-hero-bleed, 0));
}

.spiral-hero__tilt {
  position: absolute; inset: 0; z-index: 1;
  transform-style: preserve-3d;
  transform: perspective(var(--spiral-hero-persp))
    rotateX(var(--spiral-hero-rx)) rotateY(var(--spiral-hero-ry)) rotateZ(var(--spiral-hero-rz));
}
.spiral-hero__tilt svg { width: 100%; height: 100%; display: block; overflow: visible; }

.spiral-hero__burst {
  position: absolute; z-index: 0;
  width: 130%; aspect-ratio: 1;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.spiral-hero__bloom, .spiral-hero__ring {
  position: absolute; inset: 0; border-radius: 50%;
  transform: scale(var(--spiral-hero-k, 0));
  opacity: var(--spiral-hero-o, 0);
  mix-blend-mode: multiply;
  background: conic-gradient(from -90deg,
    #D8453C, #E07A2E, #D9A520, #4E9E52, #2E86B8, #4C5BA8, #7A54A0, #D8453C);
  will-change: transform, opacity;
}

.spiral-hero__bloom {
  -webkit-mask-image: radial-gradient(circle closest-side, #000 8%, rgba(0,0,0,.35) 42%, transparent 72%);
  mask-image: radial-gradient(circle closest-side, #000 8%, rgba(0,0,0,.35) 42%, transparent 72%);
}

.spiral-hero__ring {
  -webkit-mask-image: radial-gradient(circle closest-side,
    transparent 0 44%, rgba(0,0,0,.8) 60%, #000 70%, rgba(0,0,0,.55) 81%, transparent 96%);
  mask-image: radial-gradient(circle closest-side,
    transparent 0 44%, rgba(0,0,0,.8) 60%, #000 70%, rgba(0,0,0,.55) 81%, transparent 96%);
}

.spiral-hero__fly {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
  pointer-events: none;
}
.spiral-hero__flydot {
  position: absolute;
  width: var(--spiral-hero-dotd, 2%); aspect-ratio: 1;
  border-radius: 50%;
  opacity: 0;

  transform: translate(-50%, -50%) translateZ(calc(var(--spiral-hero-box-size) * var(--spiral-hero-lift, 0)));
  filter: blur(calc(var(--spiral-hero-box-size) * var(--spiral-hero-soft, 0) / 1000));
  will-change: transform, opacity;
}

.spiral-hero__stage { position: absolute; inset: 0; z-index: 3; }

.spiral-hero__copy {
  position: absolute; z-index: 2; top: 50%; transform: translateY(-50%);
  left: 6.5vw;
  max-width: min(38vw, 34rem);
}

.spiral-hero__copy h2 {
  font-family: "Playfair Display", Georgia, serif; font-weight: 900;
  font-size: clamp(2.1rem, 4.6vw, 4rem); line-height: 1.02;
  letter-spacing: -.022em; text-wrap: balance;
  color: var(--spiral-hero-ink);
  margin: 0;
}
.spiral-hero__copy h2 span { display: block; }

.spiral-hero__copy p {
  margin: .6em 0 0; font-weight: 400; color: var(--spiral-hero-soft);
  font-size: clamp(1.05rem, 1.5vw, 1.45rem); line-height: 1.45;
  max-width: 32ch;
}

.spiral-hero__cta {
  margin-top: clamp(1rem, 2.5vh, 1.8rem);
  --spiral-hero-cta-pad-x: 2.04rem;
  display: flex; flex-direction: column; align-items: flex-start; gap: .9rem;
}
.spiral-hero__cta-main {
  display: inline-flex; align-items: center; gap: .6em;
  background: var(--spiral-hero-ink); color: #FBF9F0;
  font-family: inherit; font-weight: 500; font-size: clamp(1rem, 1.38vw, 1.2rem);
  letter-spacing: .02em; text-decoration: none;
  padding: .85em var(--spiral-hero-cta-pad-x); border-radius: 999px; white-space: nowrap;
  transition: transform .25s ease, background .25s ease;
}
.spiral-hero__cta-main:hover, .spiral-hero__cta-main:focus-visible { transform: translateY(-2px); background: #000; }
.spiral-hero__arrow { transition: transform .25s ease; }
.spiral-hero__cta-main:hover .spiral-hero__arrow { transform: translateX(3px); }
.spiral-hero__cta-sub {
  padding: 0 var(--spiral-hero-cta-pad-x);
  color: var(--spiral-hero-ink); font-size: clamp(.66rem, .92vw, .8rem); font-weight: 500;
  text-transform: uppercase; letter-spacing: .2em; text-decoration: none;
  opacity: .75; transition: opacity .25s ease;
}
.spiral-hero__cta-sub span { border-bottom: 1px solid rgba(0,0,0,.3); padding-bottom: .25em; }
.spiral-hero__cta-sub:hover, .spiral-hero__cta-sub:focus-visible { opacity: 1; }

@media (max-aspect-ratio: 5/4) {
  .spiral-hero__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 0 7vw;
  }

  .spiral-hero__spiral {
    --spiral-hero-box-size: calc(min(76vw, 72vh) * var(--spiral-hero-zoom, 1));
    position: relative;
    order: 2;
    top: auto; right: auto; bottom: auto; left: auto;
    flex: none;
    margin: clamp(2rem, 5vh, 3.5rem) auto 0;
    transform: translate(var(--spiral-hero-shift, 0px), var(--spiral-hero-shift-y, 0px));
  }

  .spiral-hero__stage {
    position: relative;
    inset: auto;
    order: 1;
  }

  .spiral-hero__copy {
    position: relative;
    top: auto; right: auto; left: auto;
    transform: none;
    max-width: none; text-align: left;
  }

  .spiral-hero__tilt {
    transform: perspective(var(--spiral-hero-persp))
      rotateX(var(--spiral-hero-rx-stacked)) rotateY(0deg) rotateZ(var(--spiral-hero-rz));
  }
  .spiral-hero__copy h2 { font-size: clamp(2.1rem, 9.4vw, 4.8rem); line-height: .98; }
  .spiral-hero__copy p { font-size: clamp(.95rem, 3.7vw, 1.45rem); }
  .spiral-hero__cta { --spiral-hero-cta-pad-x: 1.07rem; margin-top: clamp(.55rem, 1.6vh, .95rem); gap: .7rem; }
  .spiral-hero__cta-main { font-size: clamp(.82rem, 3.2vw, .95rem); padding: .65em var(--spiral-hero-cta-pad-x); }
}

@media (max-width: 480px) and (max-aspect-ratio: 5/4) {
  .spiral-hero { max-height: 700px; }
}
</style>
