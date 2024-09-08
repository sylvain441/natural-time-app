<template>
<div>
  <div class="z-10 relative">
    <router-view v-slot="{Component}">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
      </transition>
    </router-view>
  </div>

  <!-- Burger menu button -->
  <button @click.stop="toggleMenu" class="fixed top-6 left-6 z-50 p-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <!-- Navigation menu -->
  <nav class="UI fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
       :class="{ '-translate-x-full': !isMenuOpen, 'translate-x-0': isMenuOpen }"
       @click="handleNavClick">
    <div class="flex flex-col p-4 space-y-4">
      <router-link :to="{ name: 'welcome' }" class="nav-link">
        {{ $t('nav.welcome') }}
      </router-link>
      <router-link to="/time" class="nav-link">
        {{ $t('nav.clock') }}
      </router-link>
      <router-link to="/13moons" class="nav-link">
        {{ $t('nav.moons') }}
      </router-link>
      <router-link :to="{ name: 'about' }" class="nav-link">
        {{ $t('nav.about') }}
      </router-link>
      <router-link to="/settings" class="nav-link">
        {{ $t('settings.title') }}
      </router-link>
    </div>
  </nav>

  <div id="backgrounds" class="z-0 fixed top-0 left-0 w-screen h-screen">
    <div id="stars" class="absolute top-0 left-0 w-full h-full"></div>
    <div id="clouds" class="absolute top-0 left-0 w-full h-full"></div>
  </div>
  
</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue';

const route = useRoute();
const i18n = useI18n();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleNavClick = (event) => {
  if (event.target.closest('a')) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});

const meta = document.getElementsByTagName('meta');
if(meta.description)
  meta.description.content = i18n.t("meta.description");

// CONTEXT STORE
import { useContextStore } from '@/stores/contextStore'
const contextStore = useContextStore()
contextStore.init();

</script>

<style lang="scss">

:root{
  --color-0: #444;
  --color-1: #d74d40;
  --color-2: #eaa945;
  --color-3: #dfdd45;
  --color-4: #7fc663;
  --color-5: #49a2f0;
  --color-6: #443cea;
  --color-7: #8047eb;

  --top-row-height: 18%;
  --left-column-width: 14%;

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

.color-1{ color: var(--color-1)!important; fill: var(--color-1)!important; background-color: var(--color-1)!important; }
.color-2{ color: var(--color-2)!important; fill: var(--color-2)!important; background-color: var(--color-2)!important; }
.color-3{ color: var(--color-3)!important; fill: var(--color-3)!important; background-color: var(--color-3)!important; }
.color-4{ color: var(--color-4)!important; fill: var(--color-4)!important; background-color: var(--color-4)!important; }
.color-5{ color: var(--color-5)!important; fill: var(--color-5)!important; background-color: var(--color-5)!important; }
.color-6{ color: var(--color-6)!important; fill: var(--color-6)!important; background-color: var(--color-6)!important; }
.color-7{ color: var(--color-7)!important; fill: var(--color-7)!important; background-color: var(--color-7)!important; }



.fade-enter-active, .fade-leave-active{
  transition: .8s;
}
.fade-enter-from, .fade-leave-to{
  opacity: 0;
}

nav{
  position: absolute;
  z-index: 10000;
  top: 1.5em;
  left:50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  transform: translateX(-50%);
  a{
    margin: .5em;
    transition: .4s;
    font-size: .75em;
    font-weight: 500;
    font-family: "Radio Canada", sans-serif;
    color: #597A82;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    img{
      width: 2em;
      aspect-ratio: 1 / 1;
    }
    &:hover, &.router-link-active{
      color: #597A82;
      text-decoration: underline;
      text-decoration-thickness: 3px;
    }
  }
  span{
    text-align: center;
    color: #7B7A8B;
    font-family: "Radio Canada", sans-serif;
    font-weight: 500;
    margin: .5em;
    text-transform: uppercase;
  }
}

#menu-icon{
  position: absolute;
  z-index: 11000;
  top: 1.5em;
  right: 1.5em;
  width: 2em;
  transform: scale(.9);
  transition: 0.4s;
  cursor: pointer;
  &:hover{
    transform: scale(1);
  }
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

</style>