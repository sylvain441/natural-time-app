<template>
  <MetaTags />
  <div>
    <!-- Full-screen navigation menu -->
    <transition name="menu-fade">
      <nav v-if="isMenuOpen" class="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-40">
        <div class="flex flex-col items-center space-y-8">
          <router-link :to="{ name: 'welcome' }" class="nav-link text-4xl font-semibold text-gray-800 hover:text-gray-600 transition-all duration-300 transform hover:scale-110" @click="closeMenu">
            {{ $t('nav.welcome') }}
          </router-link>
          <router-link to="/time" class="nav-link text-4xl font-semibold text-gray-800 hover:text-gray-600 transition-all duration-300 transform hover:scale-110" @click="closeMenu">
            {{ $t('nav.clock') }}
          </router-link>
          <router-link to="/13moons" class="nav-link text-4xl font-semibold text-gray-800 hover:text-gray-600 transition-all duration-300 transform hover:scale-110" @click="closeMenu">
            {{ $t('nav.moons') }}
          </router-link>
        </div>
      </nav>
    </transition>

    <!-- Menu toggle button -->
    <button @click="toggleMenu" class="fixed top-4 left-4 z-50 p-2 rounded-full bg-slate-500 text-slate-200 focus:outline-none transition-all duration-300 hover:bg-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" class="transition-transform duration-300" :class="{ 'rotate-45 translate-y-0': isMenuOpen, '-translate-y-2': !isMenuOpen }" />
        <line x1="3" y1="12" x2="21" y2="12" class="transition-opacity duration-300" :class="{ 'opacity-0': isMenuOpen }" />
        <line x1="3" y1="12" x2="21" y2="12" class="transition-transform duration-300" :class="{ '-rotate-45 translate-y-0': isMenuOpen, 'translate-y-2': !isMenuOpen }" />
      </svg>
    </button>

    <div class="z-10 relative">
      <router-view v-slot="{Component}">
      <transition name="fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue';
import MetaTags from '@/components/MetaTags.vue';

const route = useRoute();
const i18n = useI18n();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// CONTEXT STORE
import { useContextStore } from '@/stores/contextStore'
const contextStore = useContextStore()
contextStore.init();

</script>

<style lang="scss">

@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
  --color-0: #444;
  --color-1: #d74d40;
  --color-2: #eaa945;
  --color-3: #dfdd45;
  --color-4: #7fc663;
  --color-5: #49a2f0;
  --color-6: #443cea;
  --color-7: #8047eb;

  //--color-yellow: #fff200;
  //--color-cyan: #00F2FF;
  //--color-magenta: #de3252;

  --yearloop-bg-color: #FFF;
  --yearloop-radius: 6px
}

/* Radio Canada 300 latin  */
@font-face {
  font-family: 'Radio Canada';
  font-style: normal;
  font-weight: 300;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/radio-canada-300.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* Radio Canada 400 latin */
@font-face {
  font-family: 'Radio Canada';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/radio-canada-400.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* Radio Canada 500 latin */
@font-face {
  font-family: 'Radio Canada';
  font-style: normal;
  font-weight: 500;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/radio-canada-500.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* Radio Canada 600 latin */
@font-face {
  font-family: 'Radio Canada';
  font-style: normal;
  font-weight: 600;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/radio-canada-600.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* Radio Canada 700 latin */
@font-face {
  font-family: 'Radio Canada';
  font-style: normal;
  font-weight: 700;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/radio-canada-700.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'DM Serif Display';
  src: url('@/assets/fonts/DMSerifDisplay-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}


.color-1{ color: var(--color-1)!important; fill: var(--color-1)!important; background-color: var(--color-1)!important; }
.color-2{ color: var(--color-2)!important; fill: var(--color-2)!important; background-color: var(--color-2)!important; }
.color-3{ color: var(--color-3)!important; fill: var(--color-3)!important; background-color: var(--color-3)!important; }
.color-4{ color: var(--color-4)!important; fill: var(--color-4)!important; background-color: var(--color-4)!important; }
.color-5{ color: var(--color-5)!important; fill: var(--color-5)!important; background-color: var(--color-5)!important; }
.color-6{ color: var(--color-6)!important; fill: var(--color-6)!important; background-color: var(--color-6)!important; }
.color-7{ color: var(--color-7)!important; fill: var(--color-7)!important; background-color: var(--color-7)!important; }

.underlined {
  text-decoration: underline;
  text-decoration-thickness: 4px;
}

.underline-gray {
  @extend .underlined;
  text-decoration-color: lightgray;
}

.underline-yellow {
  @extend .underlined;
  text-decoration-color: var(--color-yellow);
}

.underline-cyan {
  @extend .underlined;
  text-decoration-color: var(--color-cyan);
}

.underline-magenta {
  @extend .underlined;
  text-decoration-color: var(--color-magenta);
}

.fade-enter-active, .fade-leave-active{
  transition: .8s;
}
.fade-enter-from, .fade-leave-to{
  opacity: 0;
}

#backgrounds {
  background-color: rgba(0, 3, 13, calc(1 - var(--day-progression)));
  #stars { 
    z-index: 10; 
    background: url("@/assets/background/stars.jpg") center center; 
    background-size: cover;
  }
  #clouds {
    z-index: 40; 
    background: url("@/assets/background/clouds.jpg") center center; 
    background-size: cover;
    opacity: var(--day-progression);
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.5s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

// Underline animation
.nav-link {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 50%;
    background-color: #4a5568; // A darker shade for the underline
    transition: all 0.3s ease;
  }
  &:hover::after {
    width: 100%;
    left: 0;
  }
}

svg {
  transform-origin: center;
}

svg line {
  transform-origin: center;
}

</style>