import {
  ShaderMount,
  paperTextureFragmentShader,
  getShaderColorFromString,
  getShaderNoiseTexture,
  emptyPixel,
  ShaderFitOptions,
} from '@paper-design/shaders';

export const DEFAULT_MIN_PIXEL_RATIO = 1;

export const DEFAULT_PAPER = {
  contrast: 0.28, roughness: 0.37, fiber: 0.12, fiberSize: 0.16,
  crumples: 0, crumpleSize: 0.3, folds: 0, foldCount: 0,
  drops: 0, fade: 0.67, seed: 744.8, scale: 0.6, fit: 'cover',
  colorFront: '#FFFFFF', colorBack: '#AFA695',
};

const PARAM_KEYS = Object.keys(DEFAULT_PAPER);

const cache = new Map();

const nextFrame = () => new Promise(res => requestAnimationFrame(() => res()));
const imageReady = img => new Promise(res => {
  if (img.complete && img.naturalWidth) return res(true);
  img.addEventListener('load', () => res(true), { once: true });
  img.addEventListener('error', () => res(false), { once: true });
});

async function render(params, w, h, minPixelRatio) {
  const noise = getShaderNoiseTexture();
  if (!noise) throw new Error('noise texture unavailable');
  const blank = new Image();
  blank.src = emptyPixel;
  const [okNoise, okBlank] = await Promise.all([imageReady(noise), imageReady(blank)]);
  if (!okNoise || !okBlank) throw new Error('shader assets failed to load');

  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:-99999px;top:0;pointer-events:none;width:${w}px;height:${h}px;`;
  document.body.appendChild(host);

  let mount = null;
  try {
    mount = new ShaderMount(host, paperTextureFragmentShader, {
      u_fit: ShaderFitOptions[params.fit],
      u_scale: params.scale,
      u_rotation: 0, u_originX: 0.5, u_originY: 0.5,
      u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0,
      u_image: blank,
      u_imageAspectRatio: 1,
      u_noiseTexture: noise,
      u_colorFront: getShaderColorFromString(params.colorFront),
      u_colorBack: getShaderColorFromString(params.colorBack),
      u_contrast: params.contrast, u_roughness: params.roughness,
      u_fiber: params.fiber, u_fiberSize: params.fiberSize,
      u_crumples: params.crumples, u_crumpleSize: params.crumpleSize,
      u_folds: params.folds, u_foldCount: params.foldCount,
      u_drops: params.drops, u_fade: params.fade, u_seed: params.seed,
    }, { antialias: false, depth: false, powerPreference: 'low-power' }, 0, 0, minPixelRatio);

    const canvas = mount.canvasElement;
    for (let i = 0; i < 20 && !(mount.parentWidth > 0 && canvas.width >= Math.round(mount.parentWidth)); i++) await nextFrame();
    if (!(mount.parentWidth > 0)) throw new Error('paper canvas never sized');
    mount.render(performance.now());

    const still = document.createElement('canvas');
    still.width = canvas.width;
    still.height = canvas.height;
    const ctx = still.getContext('2d');
    if (!ctx) throw new Error('2d context unavailable');
    ctx.drawImage(canvas, 0, 0);
    return still;
  } finally {
    mount?.dispose();
    host.remove();
  }
}

export function getPaperTexture(params, w, h, minPixelRatio = DEFAULT_MIN_PIXEL_RATIO) {
  const merged = { ...DEFAULT_PAPER, ...params };
  const key = JSON.stringify([...PARAM_KEYS.map(k => merged[k]), w, h, minPixelRatio]);
  if (!cache.has(key)) {
    cache.set(key, render(merged, w, h, minPixelRatio).catch(err => { cache.delete(key); throw err; }));
  }
  return cache.get(key);
}
