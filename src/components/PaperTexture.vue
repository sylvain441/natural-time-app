<template>

  <div class="paper-texture" ref="rootEl" :style="{ opacity, mixBlendMode: blend }"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { getPaperTexture, DEFAULT_PAPER, DEFAULT_MIN_PIXEL_RATIO } from '@/utils/paperTexture';

const props = defineProps({
  contrast: { type: Number, default: DEFAULT_PAPER.contrast },
  roughness: { type: Number, default: DEFAULT_PAPER.roughness },
  fiber: { type: Number, default: DEFAULT_PAPER.fiber },
  fiberSize: { type: Number, default: DEFAULT_PAPER.fiberSize },
  crumples: { type: Number, default: DEFAULT_PAPER.crumples },
  crumpleSize: { type: Number, default: DEFAULT_PAPER.crumpleSize },
  folds: { type: Number, default: DEFAULT_PAPER.folds },
  foldCount: { type: Number, default: DEFAULT_PAPER.foldCount },
  drops: { type: Number, default: DEFAULT_PAPER.drops },
  fade: { type: Number, default: DEFAULT_PAPER.fade },
  seed: { type: Number, default: DEFAULT_PAPER.seed },
  scale: { type: Number, default: DEFAULT_PAPER.scale },
  fit: { type: String, default: DEFAULT_PAPER.fit },
  colorFront: { type: String, default: DEFAULT_PAPER.colorFront },
  colorBack: { type: String, default: DEFAULT_PAPER.colorBack },

  opacity: { type: [Number, String], default: 0.85 },
  blend: { type: String, default: 'multiply' },

  minPixelRatio: { type: Number, default: DEFAULT_MIN_PIXEL_RATIO },

  resizeThreshold: { type: Number, default: 1.15 },
});

const rootEl = ref(null);
const shaderParams = () => Object.fromEntries(Object.keys(DEFAULT_PAPER).map(k => [k, props[k]]));

let busy = false;
let resizeTimer = null;
let sizeObserver = null;
const rendered = { w: 0, h: 0 };

async function build() {
  const root = rootEl.value;
  if (busy || !root) return;
  const w = root.clientWidth, h = root.clientHeight;
  if (!w || !h) return;
  busy = true;

  if (!root.querySelector('canvas')) root.classList.add('fallback');

  try {
    const source = await getPaperTexture(shaderParams(), w, h, props.minPixelRatio);
    if (!rootEl.value) return; // unmounted in the meantime
    const still = document.createElement('canvas');
    still.width = source.width;
    still.height = source.height;
    const ctx = still.getContext('2d');
    if (!ctx) throw new Error('2d context unavailable');
    ctx.drawImage(source, 0, 0);
    root.querySelector('canvas')?.remove();
    root.appendChild(still);
    rendered.w = w;
    rendered.h = h;
    root.classList.remove('fallback');
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[PaperTexture]', err);
    if (rootEl.value && !root.querySelector('canvas')) root.classList.add('fallback');
  } finally {
    busy = false;
  }
}

function onResize() {
  const root = rootEl.value;
  if (!root || !rendered.w) return;
  const ratio = Math.max(
    root.clientWidth / rendered.w, rendered.w / root.clientWidth,
    root.clientHeight / rendered.h, rendered.h / root.clientHeight,
  );
  if (ratio < props.resizeThreshold) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(build, 400); // once only, after 400 ms of quiet
}

onMounted(() => {
  build();
  if ('ResizeObserver' in window) {
    sizeObserver = new ResizeObserver(onResize);
    sizeObserver.observe(rootEl.value);
  } else {
    window.addEventListener('resize', onResize);
  }
});

onBeforeUnmount(() => {
  clearTimeout(resizeTimer);
  if (sizeObserver) sizeObserver.disconnect();
  else window.removeEventListener('resize', onResize);
});

watch([shaderParams, () => props.minPixelRatio], build, { deep: true });

defineExpose({ refresh: build });
</script>

<style scoped>
.paper-texture {
  position: absolute;
  inset: 0;
  pointer-events: none;

  contain: layout paint style;
}
.paper-texture :deep(canvas) { display: block; width: 100%; height: 100%; }

.paper-texture.fallback {
  opacity: .10 !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
