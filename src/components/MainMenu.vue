<template>
  <button
    v-show="!isOpen"
    type="button"
    class="burger"
    :aria-expanded="isOpen ? 'true' : 'false'"
    aria-haspopup="dialog"
    aria-controls="main-navigation-overlay"
    :aria-label="t('navigation.openMenu')"
    @click="openMenu"
  >
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
  </button>

  <!-- Teleported: the views nest the menu inside stacking contexts of their own -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        id="main-navigation-overlay"
        ref="overlayRef"
        class="overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="t('navigation.mainMenu')"
        tabindex="-1"
        @click.self="closeMenu"
      >
        <button type="button" class="close" :aria-label="t('navigation.closeMenu')" @click="closeMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <nav>
          <button type="button" class="link" @click="goHome">
            <span class="link__arrow" aria-hidden="true">&larr;</span>{{ t('navigation.home') }}
          </button>

          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="item"
            :class="{ 'is-current': item.current }"
            :data-accent="item.id"
            :aria-current="item.current ? 'page' : undefined"
            @click="item.action"
          >
            <span>{{ item.label }}</span>
          </button>

          <button type="button" class="link" @click="openFaq">{{ t('faq.title') }}</button>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useScrollLock } from '@vueuse/core';
import { useConfigStore } from '@/stores/configStore';
import { getLocalizedRouteName } from '@/i18n/config';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const configStore = useConfigStore();

const isOpen = ref(false);
const overlayRef = ref(null);
const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null);

// Route names are suffixed with the locale (e.g. "time-fr"), so we match on the base name
const isRoute = (name) => route.name?.toString().startsWith(`${name}-`);

const closeMenu = () => {
  if (!isOpen.value) return;
  isOpen.value = false;
  isLocked.value = false;
};

const openMenu = async () => {
  isOpen.value = true;
  await nextTick();
  overlayRef.value?.focus?.();
  isLocked.value = true;
};

const navigateTo = (name, hash) => {
  closeMenu();
  return router.push({ name: getLocalizedRouteName(name, locale.value), ...(hash ? { hash } : {}) });
};

const goHome = () => navigateTo('welcome');

// The FAQ lives on the welcome page. Its markdown is fetched per locale, so the
// anchor only exists once that content has rendered — wait for it before scrolling.
const scrollToWhenReady = (id, timeout = 4000) => {
  const deadline = Date.now() + timeout;
  const tick = () => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (Date.now() < deadline) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const openFaq = async () => {
  // Leaving the view with its FAQ panel still open would bring it back on return
  configStore.clockActivePanel = null;
  configStore.spiralActivePanel = null;
  await navigateTo('welcome', '#FAQ');
  scrollToWhenReady('FAQ');
};

const items = computed(() => [
  {
    id: 'clock',
    label: t('welcome.naturalClock.title'),
    current: isRoute('time'),
    action: () => navigateTo('time')
  },
  {
    id: 'spiral',
    label: t('welcome.thirteenMoons.title'),
    current: isRoute('13moons'),
    action: () => navigateTo('13moons')
  }
]);

const handleKeydown = (event) => {
  if (event.key === 'Escape') closeMenu();
};

onMounted(() => document.addEventListener('keydown', handleKeydown));

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  isLocked.value = false;
});
</script>

<style scoped>
/* A dark translucent pill keeps the bars readable whatever the clock or the
   spiral draws underneath, and mirrors the settings button on the other side. */
.burger {
  position: fixed;
  top: .75rem;
  left: .75rem;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgb(7 8 10 / .45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background .3s ease;
}
.burger:hover,
.burger:focus-visible { background: rgb(7 8 10 / .7); }
.burger span {
  width: 1.15rem;
  height: 2px;
  border-radius: 1px;
  background: #FFFFFF;
}
@media (min-width: 768px) {
  .burger { top: 1rem; left: 1rem; }
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 4rem 1.5rem;
  background: rgb(7 8 10 / .8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: .5rem;
  color: rgb(255 255 255 / .55);
  transition: color .2s ease;
}
.close svg { width: 1.6rem; height: 1.6rem; }
.close:hover, .close:focus-visible { color: #FFFFFF; }

nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.6rem, 5vw, 2.4rem);
  text-align: center;
}

.item {
  font-family: "DM Serif Display", ui-serif, Georgia, serif;
  font-size: clamp(2rem, 9vw, 3.5rem);
  line-height: 1.1;
}
.item[data-accent="clock"]  { --hl: 255 242 0; }
.item[data-accent="spiral"] { --hl: 0 242 255; }

/* The highlighter of the FAQ headings: it sweeps in under the pointer, and stays
   drawn on the page you are already reading. */
.item span {
  display: inline-block;
  padding: .04em .28em;
  margin: 0 -.28em;
  color: rgb(var(--hl));
  background-image: linear-gradient(101deg,
    rgb(var(--hl) / 0) 0.5%,
    rgb(var(--hl) / .95) 2.2%,
    rgb(var(--hl) / .8) 5.5%,
    rgb(var(--hl) / .8) 92%,
    rgb(var(--hl) / .95) 96%,
    rgb(var(--hl) / 0) 99%);
  background-repeat: no-repeat;
  background-size: 0 100%;
  border-radius: .7em .25em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  transition: background-size .35s ease, color .2s ease;
}
.item:hover span,
.item:focus-visible span,
.item.is-current span {
  background-size: 100% 100%;
  color: #16140F;
}

.link {
  font-family: "Poppins", ui-sans-serif, system-ui, sans-serif;
  font-size: .9rem;
  color: rgb(255 255 255 / .45);
  transition: color .25s ease;
}
.link__arrow {
  display: inline-block;
  margin-right: .45em;
  transition: transform .25s ease;
}
.link:hover,
.link:focus-visible { color: #FFFFFF; }
.link:hover .link__arrow,
.link:focus-visible .link__arrow { transform: translateX(-.2em); }

.item:focus-visible,
.link:focus-visible { outline: 1px solid currentColor; outline-offset: .6rem; }

.fade-enter-active,
.fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .item span, .link, .link__arrow, .close, .burger,
  .fade-enter-active, .fade-leave-active { transition: none; }
}
</style>
