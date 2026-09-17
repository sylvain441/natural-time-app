<template>
  <section class="clock-hero" ref="heroEl">
    <div class="clock-hero__sky"></div>
    <div class="clock-hero__stars" ref="starsEl"></div>

    <div class="clock-hero__content">
      <div class="clock-hero__dial clock-hero__dial-back">
        <svg ref="svgBackEl" viewBox="-120 -120 240 240" aria-hidden="true"></svg>
      </div>
    </div>
    <PaperTexture class="clock-hero__paper" />
    <div class="clock-hero__content">
      <div class="clock-hero__dial clock-hero__dial-front">
        <svg ref="svgFrontEl" viewBox="-120 -120 240 240" aria-hidden="true"></svg>
      </div>

      <div class="clock-hero__stage">
        <div class="clock-hero__copy">
          <h1><span>{{ $t('welcome.clockHero.titleLine1') }}</span> <span>{{ $t('welcome.clockHero.titleLine2') }}</span></h1>
          <p>{{ $t('welcome.clockHero.subtitle') }}</p>
          <div class="clock-hero__cta">
            <router-link :to="{ name: getLocalizedRouteName('time', locale) }" class="clock-hero__cta-main">
              <span>{{ contextStore.isEmpty ? $t('welcome.naturalClock.cta.discover') : $t('welcome.naturalClock.cta.open') }}</span>
              <span class="clock-hero__arrow">→</span>
            </router-link>
            <router-link :to="{ name: getLocalizedRouteName('time', locale), query: { tutorial: '1' } }" class="clock-hero__cta-sub">
              <span>{{ $t('welcome.clockHero.cta.howToRead') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContextStore } from '@/stores/contextStore';
import '@fontsource/playfair-display/900.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import { getLocalizedRouteName } from '@/i18n/config';
import PaperTexture from '@/components/PaperTexture.vue';
import { hexToRgb, interpolateNumber, mixHexColors, rgbToHex, smoothstep } from '@/utils/color';

const { locale } = useI18n();
const contextStore = useContextStore();

const heroEl = ref(null);
const starsEl = ref(null);
const svgBackEl = ref(null);
const svgFrontEl = ref(null);

const DEMO_LATITUDE_DEGREES = 45, DEMO_MUSTACHE_ANGLE_DEGREES = 25.7, DEMO_SOLAR_DECLINATION_DEGREES = 14.5;
const ANIMATION_TIMELINE_UNITS = 18.65;
const SUN_ANGLE_KEYFRAMES = [
  [-3.1667, 145], [0, 180], [3, 215], [6, 252], [8.5, 285],
  [8.9583, 304], [9.7833, 416], [10.15, 435],
  [12.65, 468], [15.65, 505], [18.65, 540], [21.65, 575],
];

function getSunAngle(timelinePosition) {
  const position = (
    (timelinePosition % ANIMATION_TIMELINE_UNITS) + ANIMATION_TIMELINE_UNITS
  ) % ANIMATION_TIMELINE_UNITS;

  let keyframeIndex = 1;
  while (
    keyframeIndex < SUN_ANGLE_KEYFRAMES.length - 2
    && SUN_ANGLE_KEYFRAMES[keyframeIndex + 1][0] <= position
  ) {
    keyframeIndex += 1;
  }

  const previous = SUN_ANGLE_KEYFRAMES[keyframeIndex - 1];
  const start = SUN_ANGLE_KEYFRAMES[keyframeIndex];
  const end = SUN_ANGLE_KEYFRAMES[keyframeIndex + 1];
  const next = SUN_ANGLE_KEYFRAMES[keyframeIndex + 2];
  const duration = end[0] - start[0];
  const progress = (position - start[0]) / duration;
  const progressSquared = progress * progress;
  const progressCubed = progressSquared * progress;
  const startTangent = (end[1] - previous[1]) / (end[0] - previous[0]);
  const endTangent = (next[1] - start[1]) / (next[0] - start[0]);
  const angle = (2 * progressCubed - 3 * progressSquared + 1) * start[1]
    + (progressCubed - 2 * progressSquared + progress) * duration * startTangent
    + (-2 * progressCubed + 3 * progressSquared) * end[1]
    + (progressCubed - progressSquared) * duration * endTangent;

  return ((angle % 360) + 360) % 360;
}

const DEGREES_TO_RADIANS = Math.PI / 180;
const solarAltitudeOffset = Math.sin(DEMO_LATITUDE_DEGREES * DEGREES_TO_RADIANS)
  * Math.sin(DEMO_SOLAR_DECLINATION_DEGREES * DEGREES_TO_RADIANS);
const solarAltitudeAmplitude = Math.cos(DEMO_LATITUDE_DEGREES * DEGREES_TO_RADIANS)
  * Math.cos(DEMO_SOLAR_DECLINATION_DEGREES * DEGREES_TO_RADIANS);
const getSineSolarAltitude = angle => solarAltitudeOffset
  + solarAltitudeAmplitude * Math.cos((angle - 180) * DEGREES_TO_RADIANS);
const getPolarX = (angle, radius) => -radius * Math.sin(angle * DEGREES_TO_RADIANS);
const getPolarY = (angle, radius) => radius * Math.cos(angle * DEGREES_TO_RADIANS);

const SKY_COLOR_STOPS = [
  { alt: -0.55, skyTop: '#010410', skyMid: '#03222E', skyBot: '#0E4C5C' },
  { alt: -0.22, skyTop: '#070C22', skyMid: '#16214A', skyBot: '#3A4F86' },
  { alt: -0.07, skyTop: '#232D54', skyMid: '#8A6862', skyBot: '#D3835A' },
  { alt: 0.02, skyTop: '#7E96C6', skyMid: '#DA9E76', skyBot: '#FFB65C' },
  { alt: 0.12, skyTop: '#A8BCD8', skyMid: '#EBC894', skyBot: '#FFD98E' },
  { alt: 0.35, skyTop: '#7FAED8', skyMid: '#D3E2ED', skyBot: '#FCF8EC' },
  { alt: 0.86, skyTop: '#63A4DC', skyMid: '#CBE2F3', skyBot: '#FAFAF4' },
];
const SUN_DISC_COLOR = '#FFCC3D';
const DAY_TEXT_COLOR = '#1A1917';
const DAY_MARKER_COLOR = '#4A3D29';
const NIGHT_MARKER_COLOR = '#6D80AE';
const NIGHT_TEXT_COLOR = '#C8C5BC';
const SUN_DROP_DISTANCE = 230;
const INITIAL_TIMELINE_POSITION = 2.5816;

function getSkyPalette(solarAltitude) {
  let stopIndex = 0;
  while (
    stopIndex < SKY_COLOR_STOPS.length - 2
    && SKY_COLOR_STOPS[stopIndex + 1].alt < solarAltitude
  ) {
    stopIndex += 1;
  }

  const start = SKY_COLOR_STOPS[stopIndex];
  const end = SKY_COLOR_STOPS[stopIndex + 1];
  const amount = Math.max(0, Math.min(1,
    (solarAltitude - start.alt) / (end.alt - start.alt)));
  const mixChannel = key => rgbToHex(hexToRgb(start[key]).map((channel, index) =>
    interpolateNumber(channel, hexToRgb(end[key])[index], amount)));

  return {
    skyTop: mixChannel('skyTop'),
    skyMid: mixChannel('skyMid'),
    skyBot: mixChannel('skyBot'),
  };
}

const TARGET_LOOP_SECONDS = 24;
const SLOW_TIMELINE_RATE = 0.5;

const ACCELERATION_START_PHASE = 9.2 - INITIAL_TIMELINE_POSITION;
const PEAK_SPEED_PHASE = 12.0 - INITIAL_TIMELINE_POSITION;

const getLoopPhase = timelinePosition => (
  (timelinePosition - INITIAL_TIMELINE_POSITION) % ANIMATION_TIMELINE_UNITS
  + ANIMATION_TIMELINE_UNITS
) % ANIMATION_TIMELINE_UNITS;

const getSlowness = timelinePosition => {
  const phase = getLoopPhase(timelinePosition);
  return phase < PEAK_SPEED_PHASE
    ? 1 - smoothstep(ACCELERATION_START_PHASE, PEAK_SPEED_PHASE, phase)
    : smoothstep(PEAK_SPEED_PHASE, ANIMATION_TIMELINE_UNITS, phase);
};

const NIGHT_SPEED_MULTIPLIER = 1.235;
const NIGHT_START_POSITION = 8.5;
const NIGHT_END_POSITION = 10.15;
const NIGHT_TRANSITION_WIDTH = 0.25;
const getNightSpeedMultiplier = timelinePosition => 1 + (NIGHT_SPEED_MULTIPLIER - 1)
  * smoothstep(NIGHT_START_POSITION, NIGHT_START_POSITION + NIGHT_TRANSITION_WIDTH, timelinePosition)
  * (1 - smoothstep(NIGHT_END_POSITION - NIGHT_TRANSITION_WIDTH, NIGHT_END_POSITION, timelinePosition));

const FAST_TIMELINE_RATE = (() => {
  const INTEGRATION_STEPS = 2000;
  const stepSize = ANIMATION_TIMELINE_UNITS / INTEGRATION_STEPS;
  const getLoopDuration = fastRate => {
    let duration = 0;
    for (let step = 0; step < INTEGRATION_STEPS; step += 1) {
      const position = (step + 0.5) * stepSize;
      const rate = fastRate + (SLOW_TIMELINE_RATE - fastRate) * getSlowness(position);
      duration += stepSize / rate;
    }
    return duration;
  };

  let lowerBound = SLOW_TIMELINE_RATE;
  let upperBound = 200;
  if (getLoopDuration(upperBound) > TARGET_LOOP_SECONDS) return upperBound;

  for (let iteration = 0; iteration < 60; iteration += 1) {
    const candidate = (lowerBound + upperBound) / 2;
    if (getLoopDuration(candidate) > TARGET_LOOP_SECONDS) lowerBound = candidate;
    else upperBound = candidate;
  }
  return (lowerBound + upperBound) / 2;
})();

const getTimelineRate = timelinePosition => (
  FAST_TIMELINE_RATE
  + (SLOW_TIMELINE_RATE - FAST_TIMELINE_RATE) * getSlowness(timelinePosition)
) * getNightSpeedMultiplier(timelinePosition);

const SUN_DISC_MIN_SCALE = 0.72, SUN_DISC_MAX_SCALE = 0.92;
const HAND_TIP_Y = 112, HAND_TAIL_Y = -28, HAND_HUB_RADIUS = 8.4;
const HAND_TAIL_HALF_WIDTH = 4.2, HAND_TIP_HALF_WIDTH = 1.6;

const HAND_PATH_DATA = (() => {
  const edgeSlope = (HAND_TAIL_HALF_WIDTH - HAND_TIP_HALF_WIDTH)
    / ((HAND_TIP_Y - 4) - HAND_TAIL_Y);
  const leftEdgeIntercept = -HAND_TAIL_HALF_WIDTH - edgeSlope * HAND_TAIL_Y;
  const quadraticA = 1 + edgeSlope * edgeSlope;
  const quadraticB = 2 * leftEdgeIntercept * edgeSlope;
  const quadraticC = leftEdgeIntercept * leftEdgeIntercept
    - HAND_HUB_RADIUS * HAND_HUB_RADIUS;
  const discriminant = Math.sqrt(quadraticB * quadraticB - 4 * quadraticA * quadraticC);
  const entryY = (-quadraticB - discriminant) / (2 * quadraticA);
  const exitY = (-quadraticB + discriminant) / (2 * quadraticA);
  const getLeftEdgeX = y => leftEdgeIntercept + edgeSlope * y;
  const formatCoordinate = value => value.toFixed(4);

  return `M ${-HAND_TAIL_HALF_WIDTH},${HAND_TAIL_Y}`
    + ` L ${formatCoordinate(getLeftEdgeX(entryY))},${formatCoordinate(entryY)}`
    + ` A ${HAND_HUB_RADIUS},${HAND_HUB_RADIUS} 0 0,0 ${formatCoordinate(getLeftEdgeX(exitY))},${formatCoordinate(exitY)}`
    + ` L ${-HAND_TIP_HALF_WIDTH},${HAND_TIP_Y - 4}`
    + ` Q 0,${HAND_TIP_Y} ${HAND_TIP_HALF_WIDTH},${HAND_TIP_Y - 4}`
    + ` L ${formatCoordinate(-getLeftEdgeX(exitY))},${formatCoordinate(exitY)}`
    + ` A ${HAND_HUB_RADIUS},${HAND_HUB_RADIUS} 0 0,0 ${formatCoordinate(-getLeftEdgeX(entryY))},${formatCoordinate(entryY)}`
    + ` L ${HAND_TAIL_HALF_WIDTH},${HAND_TAIL_Y}`
    + ` Q 0,${HAND_TAIL_Y - 4} ${-HAND_TAIL_HALF_WIDTH},${HAND_TAIL_Y} Z`;
})();
const MUSTACHE_RADIUS_START = 18, MUSTACHE_RADIUS_END = 62, MUSTACHE_DOT_COUNT = 8;

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const createSvgElement = (tagName, attributes) => {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
};

let clockElements = null;
let animationFrameId = null;
let intersectionObserver = null;
let timelinePosition = INITIAL_TIMELINE_POSITION;
let lastFrameTime = 0;
let frameAccumulator = 0;
let pageVisible = true;
let heroVisible = true;
let starAnimationsPaused = false;
const FRAME_INTERVAL_MS = 1000 / 30;
const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function createClockIllustration() {
  const backLayer = svgBackEl.value;
  const frontLayer = svgFrontEl.value;

  const sunDisc = createSvgElement('circle', { cx: 0, cy: 0, r: 100, fill: SUN_DISC_COLOR });
  backLayer.appendChild(sunDisc);

  const MUSTACHE_DOT_SPACING = (MUSTACHE_RADIUS_END - MUSTACHE_RADIUS_START) / (MUSTACHE_DOT_COUNT - 1);
  const mustaches = createSvgElement('g', {
    stroke: DAY_MARKER_COLOR, 'stroke-width': 3.5, 'stroke-linecap': 'round',
    'stroke-dasharray': `0.1 ${(MUSTACHE_DOT_SPACING - 0.1).toFixed(3)}`,
  });
  [90 - DEMO_MUSTACHE_ANGLE_DEGREES, 90 + DEMO_MUSTACHE_ANGLE_DEGREES,
   270 - DEMO_MUSTACHE_ANGLE_DEGREES, 270 + DEMO_MUSTACHE_ANGLE_DEGREES].forEach(angle => {
    mustaches.appendChild(createSvgElement('line', {
      x1: getPolarX(angle, MUSTACHE_RADIUS_START),
      y1: getPolarY(angle, MUSTACHE_RADIUS_START),
      x2: getPolarX(angle, MUSTACHE_RADIUS_END),
      y2: getPolarY(angle, MUSTACHE_RADIUS_END),
    }));
  });
  backLayer.appendChild(mustaches);

  const equinoxLine = createSvgElement('line', {
    x1: getPolarX(90, 36), y1: getPolarY(90, 36), x2: getPolarX(270, 36), y2: getPolarY(270, 36),
    stroke: DAY_MARKER_COLOR, 'stroke-width': 2.8, 'stroke-linecap': 'round',
  });
  backLayer.appendChild(equinoxLine);

  const defs = createSvgElement('defs', {});
  const metal = createSvgElement('linearGradient', {
    id: 'clock-hero-metal', gradientUnits: 'userSpaceOnUse',
    x1: -HAND_HUB_RADIUS, y1: 0, x2: HAND_HUB_RADIUS, y2: 0,
  });
  [['0%', '#131211'], ['32%', '#242220'], ['58%', '#1A1917'], ['100%', '#0F0E0D']]
    .forEach(([offset, color]) => metal.appendChild(createSvgElement('stop', { offset, 'stop-color': color })));
  defs.appendChild(metal);

  const edgeGrad = createSvgElement('linearGradient', {
    id: 'clock-hero-metal-edge', gradientUnits: 'userSpaceOnUse',
    x1: -4.2, y1: 0, x2: 4.2, y2: 0,
  });
  [['0%', '#A49C8C', 0.3], ['30%', '#A49C8C', 0],
   ['70%', '#857D6E', 0], ['100%', '#857D6E', 0.17]]
    .forEach(([offset, color, op]) => edgeGrad.appendChild(
      createSvgElement('stop', { offset, 'stop-color': color, 'stop-opacity': op })));
  defs.appendChild(edgeGrad);

  const clip = createSvgElement('clipPath', { id: 'clock-hero-hand-clip' });
  clip.appendChild(createSvgElement('path', { d: HAND_PATH_DATA }));
  defs.appendChild(clip);
  frontLayer.appendChild(defs);

  const hand = createSvgElement('g', {});
  hand.appendChild(createSvgElement('path', { fill: 'url(#clock-hero-metal)', d: HAND_PATH_DATA }));
  hand.appendChild(createSvgElement('path', {
    d: HAND_PATH_DATA, fill: 'none',
    stroke: 'url(#clock-hero-metal-edge)', 'stroke-width': 0.6,
    'clip-path': 'url(#clock-hero-hand-clip)',
  }));
  frontLayer.appendChild(hand);

  return { sunDisc, mustaches, equinoxLine, hand };
}

function createStars() {
  let seed = 1337;
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 46; index += 1) {
    const star = document.createElement('div');
    const size = 1 + random() * 1.8;
    star.className = 'clock-hero__star';
    star.style.left = `${(random() * 100).toFixed(2)}%`;
    star.style.top = `${(random() * 38).toFixed(2)}%`;
    star.style.width = star.style.height = `${size.toFixed(2)}px`;
    star.style.animationDelay = `${(random() * 4.5).toFixed(2)}s`;
    star.style.opacity = (0.6 + random() * 0.4).toFixed(2);
    fragment.appendChild(star);
  }
  starsEl.value.appendChild(fragment);
}

const lastWrittenValues = new Map();
function setCssVariableIfChanged(name, value) {
  if (lastWrittenValues.get(name) === value) return;
  lastWrittenValues.set(name, value);
  heroEl.value.style.setProperty(name, value);
}
function setAttributeIfChanged(element, name, value, cacheKey) {
  if (lastWrittenValues.get(cacheKey) === value) return;
  lastWrittenValues.set(cacheKey, value);
  element.setAttribute(name, value);
}

const ALTITUDE_QUANTIZATION_STEP = 0.0005;
let lastQuantizedAltitude = NaN;

function renderClock(timelinePositionToRender) {
  const sunAngle = getSunAngle(timelinePositionToRender);

  clockElements.hand.setAttribute('transform', `rotate(${sunAngle})`);

  const midnightOffset = ((sunAngle + 180) % 360) - 180;
  const distanceFromMidnight = Math.abs(midnightOffset);
  const sunDropFactor = midnightOffset > 0
    ? smoothstep(40, 90, distanceFromMidnight)
    : smoothstep(0, 90, distanceFromMidnight);
  setAttributeIfChanged(
    clockElements.sunDisc,
    'cy',
    (SUN_DROP_DISTANCE * (1 - sunDropFactor)).toFixed(2),
    'sun.cy',
  );

  const solarAltitude = getSineSolarAltitude(sunAngle);
  const quantizedAltitude = Math.round(solarAltitude / ALTITUDE_QUANTIZATION_STEP);
  if (quantizedAltitude === lastQuantizedAltitude) return;
  lastQuantizedAltitude = quantizedAltitude;

  const palette = getSkyPalette(solarAltitude);
  setCssVariableIfChanged('--sky-top', palette.skyTop);
  setCssVariableIfChanged('--sky-mid', palette.skyMid);
  setCssVariableIfChanged('--sky-bot', palette.skyBot);

  const normalizedAltitude = Math.max(0, Math.min(1, (solarAltitude + 0.51) / 1.37));
  const sunDiscScale = SUN_DISC_MIN_SCALE
    + (SUN_DISC_MAX_SCALE - SUN_DISC_MIN_SCALE) * normalizedAltitude;
  setAttributeIfChanged(
    clockElements.sunDisc,
    'r',
    (Math.round(1000 * sunDiscScale) / 10).toFixed(1),
    'sun.r',
  );

  const nightFactor = 1 - smoothstep(-0.075, 0.075, solarAltitude);

  setCssVariableIfChanged('--title-ink', mixHexColors(DAY_TEXT_COLOR, NIGHT_TEXT_COLOR, nightFactor));
  setCssVariableIfChanged('--title-soft', mixHexColors(DAY_MARKER_COLOR, NIGHT_TEXT_COLOR, nightFactor));

  const markStroke = mixHexColors(DAY_MARKER_COLOR, NIGHT_MARKER_COLOR, nightFactor);
  setAttributeIfChanged(clockElements.mustaches, 'stroke', markStroke, 'mustaches.stroke');
  setAttributeIfChanged(clockElements.equinoxLine, 'stroke', markStroke, 'equinox.stroke');

  const starFactor = 1 - smoothstep(-0.42, 0.02, solarAltitude);
  const starOpacity = starFactor.toFixed(3);
  if (lastWrittenValues.get('stars.opacity') !== starOpacity) {
    lastWrittenValues.set('stars.opacity', starOpacity);
    starsEl.value.style.opacity = starOpacity;
  }
  setCssVariableIfChanged('--sky-mid-pos', `${(54 + 24 * starFactor).toFixed(1)}%`);
  const pauseStars = starFactor === 0;
  if (pauseStars !== starAnimationsPaused) {
    starAnimationsPaused = pauseStars;
    starsEl.value.classList.toggle('paused', pauseStars);
  }
}

function frame(now) {
  animationFrameId = requestAnimationFrame(frame);
  const elapsedMilliseconds = Math.min(now - lastFrameTime, 120);
  lastFrameTime = now;
  timelinePosition = (
    timelinePosition + getTimelineRate(timelinePosition) * elapsedMilliseconds / 1000
  ) % ANIMATION_TIMELINE_UNITS;
  frameAccumulator += elapsedMilliseconds;
  if (frameAccumulator < FRAME_INTERVAL_MS) return;
  frameAccumulator %= FRAME_INTERVAL_MS;
  renderClock(timelinePosition);
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

let onVisibility = null;

onMounted(() => {
  clockElements = createClockIllustration();
  createStars();
  renderClock(INITIAL_TIMELINE_POSITION);

  if (reducedMotion) return;

  onVisibility = () => { pageVisible = !document.hidden; syncLoop(); };
  document.addEventListener('visibilitychange', onVisibility);

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
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  if (onVisibility) document.removeEventListener('visibilitychange', onVisibility);
  if (intersectionObserver) intersectionObserver.disconnect();
});
</script>

<style>
.clock-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 520px;
  overflow: hidden;
  background: var(--clock-hero-sky-bot);
  font-family: "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;

  --clock-hero-sky-top: #70A9DA;
  --clock-hero-sky-mid: #CFE2F0;
  --clock-hero-sky-bot: #FBF9F0;
  --clock-hero-sky-mid-pos: 54%;
  --clock-hero-title-ink: #1A1917;
  --clock-hero-title-soft: #463F35;
}
.clock-hero * { box-sizing: border-box; }

.clock-hero__sky {
  position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(180deg,
    var(--sky-top, var(--clock-hero-sky-top)) 0%,
    var(--sky-mid, var(--clock-hero-sky-mid)) var(--sky-mid-pos, var(--clock-hero-sky-mid-pos)),
    var(--sky-bot, var(--clock-hero-sky-bot)) 100%);
}

.clock-hero__paper { z-index: 2; }

.clock-hero__stars { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0; }
.clock-hero__star {
  position: absolute; border-radius: 50%; background: #FBF3D9;
  animation: clock-hero__twinkle 4.5s ease-in-out infinite;
}
@keyframes clock-hero__twinkle { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
.clock-hero__stars.paused .clock-hero__star { animation-play-state: paused; }

.clock-hero__content {

  position: absolute; inset: 0;
  max-width: 1900px;
  margin: 0 auto;
}

.clock-hero__dial {

  --clock-hero-box-size: min(108vh, 76vw);
  position: absolute; top: 68%;
  left: calc(100% + 6vw - var(--clock-hero-box-size) / 2);
  transform: translate(-50%, -50%);
  width: calc(var(--clock-hero-box-size) * 1.2); height: calc(var(--clock-hero-box-size) * 1.2);
  pointer-events: none;
}
.clock-hero__dial-back { z-index: 1; }
.clock-hero__dial-front { z-index: 3; }
.clock-hero__dial svg { width: 100%; height: 100%; display: block; }

.clock-hero__stage { position: absolute; inset: 0; z-index: 4; }

.clock-hero__copy {
  position: absolute; z-index: 2;
  left: 6.5vw; top: 50%; transform: translateY(-50%);
  max-width: min(60vw, 46rem);
}
.clock-hero__copy h1 {
  font-family: "Playfair Display", Georgia, serif; font-weight: 900;
  font-size: clamp(2.34rem, 5.88vw, 4.8rem); line-height: 1.02;
  letter-spacing: -.022em; text-wrap: balance;
  color: var(--title-ink, var(--clock-hero-title-ink));
  margin: 0;
}
.clock-hero__copy h1 span { display: block; }
.clock-hero__copy h1 span + span { transform: translateY(2px); }
.clock-hero__copy p {
  margin: .6em 0 0; font-weight: 400; color: var(--title-soft, var(--clock-hero-title-soft));
  font-size: clamp(1.14rem, 1.62vw, 1.54rem); line-height: 1.45;
  max-width: 32ch;
}

@media (max-aspect-ratio: 5/4) {
  .clock-hero__dial {
    left: 50%; right: auto; top: 76%;
    transform: translate(-50%, -50%);
    width: min(148.8vw, 93.6vh); height: min(148.8vw, 93.6vh);
  }
  .clock-hero__copy {
    left: 7vw; right: 7vw; top: 11%; transform: none;
    max-width: none; text-align: left;
  }
  .clock-hero__copy h1 { font-size: clamp(2.3rem, 10.4vw, 5.2rem); line-height: .96; }
  .clock-hero__copy p { font-size: clamp(.95rem, 3.7vw, 1.45rem); margin-top: .6em; }
}

@media (max-width: 480px) and (max-aspect-ratio: 5/4) {
  .clock-hero {

    max-height: 700px;
  }
  .clock-hero__dial { top: calc(76% + 6px); }
}

.clock-hero__cta {
  margin-top: clamp(1rem, 2.5vh, 1.8rem);

  --clock-hero-cta-pad-x: 2.04rem;
  display: flex; flex-direction: column; align-items: flex-start; gap: .9rem;
}
.clock-hero__cta-main {
  display: inline-flex; align-items: center; gap: .6em;

  background: #1A1917; color: #F0C43F;
  font-family: inherit; font-weight: 500; font-size: clamp(1rem, 1.38vw, 1.2rem);
  letter-spacing: .02em; text-decoration: none;
  padding: .85em var(--clock-hero-cta-pad-x); border-radius: 999px; white-space: nowrap;
  transition: transform .25s ease, background .25s ease;
}
.clock-hero__cta-main:hover, .clock-hero__cta-main:focus-visible { transform: translateY(-2px); background: #000; }
.clock-hero__arrow { transition: transform .25s ease; }
.clock-hero__cta-main:hover .clock-hero__arrow { transform: translateX(3px); }
.clock-hero__cta-sub {

  padding-left: var(--clock-hero-cta-pad-x);
  color: var(--title-ink, var(--clock-hero-title-ink)); font-size: clamp(.66rem, .92vw, .8rem); font-weight: 500;
  text-transform: uppercase; letter-spacing: .2em; text-decoration: none;
  opacity: .75; transition: opacity .25s ease;
}
.clock-hero__cta-sub span { border-bottom: 1px solid rgba(0,0,0,.3); padding-bottom: .25em; }
.clock-hero__cta-sub:hover, .clock-hero__cta-sub:focus-visible { opacity: 1; }
@media (max-aspect-ratio: 5/4) {

  .clock-hero__cta { margin-top: clamp(.55rem, 1.6vh, .95rem); gap: .7rem; --clock-hero-cta-pad-x: 1.07rem; }
  .clock-hero__cta-main { font-size: clamp(.82rem, 3.2vw, .95rem); padding: .65em var(--clock-hero-cta-pad-x); }
}

@media (min-aspect-ratio: 5/4) and (max-height: 520px) {
  .clock-hero { min-height: 0; }
  .clock-hero__dial {
    --clock-hero-box-size: min(160vh, 58vw);
    top: 66%;
  }
  .clock-hero__copy { top: calc(45%); }
  .clock-hero__cta { margin-top: clamp(.7rem, 2vh, 1.2rem); gap: .5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .clock-hero__star { animation: none; }
}
</style>
