<template>

  <div
    v-if="!dismissed"
    class="announcement__bar"
    :class="{ 'is-in': shown }"
  >
    <a
      class="announcement__say"
      href="https://apps.repebble.com/ec836faa1fdf48b294e94560"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="announcement__mark" aria-hidden="true">🏆</span>
      <span class="announcement__text">
        {{ $t('welcome.topbar.before') }}<span class="announcement__long">{{ $t('welcome.topbar.long') }}</span>{{ $t('welcome.topbar.after') }}
      </span>
      <span class="announcement__cta">{{ $t('welcome.topbar.cta') }}<span class="announcement__arrow" aria-hidden="true">&rarr;</span></span>
    </a>

    <button type="button" class="announcement__close" :aria-label="$t('welcome.topbar.close')" @click="dismiss">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';

const STORAGE_KEY = 'nt.topbar.pebble-contest';

const TRIGGER = 80;

const shown = ref(false);
const dismissed = ref(false);

const onScroll = () => { shown.value = window.scrollY > TRIGGER; };

function dismiss() {
  dismissed.value = true;
  try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {  }
}

onMounted(() => {
  try { dismissed.value = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.announcement__bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  height: 2.5rem;
  padding: 0 1rem;
  background: #1A1917;
  color: #F0C43F;
  font-family: "Poppins", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(.72rem, 1.6vw, .84rem);
  line-height: 1;
  letter-spacing: .01em;
  white-space: nowrap;

  transform: translateY(-100%);
  transition: transform .4s cubic-bezier(.32, .72, .3, 1);
}
.announcement__bar.is-in { transform: translateY(0); }

.announcement__say {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  min-width: 0;
  color: inherit;
}

.announcement__mark { font-size: 1.05em; }

.announcement__text {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 639px) {
  .announcement__bar {
    height: auto;
    min-height: 3.25rem;
    padding: .45rem 2.75rem .45rem .75rem;
    white-space: normal;
  }

  .announcement__say {
    width: 100%;
    justify-content: center;
  }

  .announcement__text {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.25;
  }

  .announcement__close {
    top: 50%;
    transform: translateY(-50%);
  }
}

.announcement__cta {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  color: rgb(240 196 63 / .72);
  border-bottom: 1px solid rgb(240 196 63 / .3);
  padding-bottom: .15em;
  transition: color .25s ease;
}
.announcement__arrow { transition: transform .3s ease; display: inline-block; }
.announcement__say:hover .announcement__cta, .announcement__say:focus-visible .announcement__cta { color: #F0C43F; }
.announcement__say:hover .announcement__arrow { transform: translateX(2px); }

.announcement__close {
  position: absolute;
  right: .35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem; height: 2rem;
  font-size: 1.15rem;
  line-height: 1;
  color: rgb(240 196 63 / .55);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color .25s ease;
}
.announcement__close:hover, .announcement__close:focus-visible { color: #F0C43F; }

@media (prefers-reduced-motion: reduce) {
  .announcement__bar, .announcement__cta, .announcement__arrow, .announcement__close { transition: none; }
}
</style>
