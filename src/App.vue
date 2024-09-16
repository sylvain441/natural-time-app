<template>
  <MetaTags />
  <div>
    <div class="z-10 h-min-screen relative">
      <router-view v-slot="{ Component }" @panel-open-change="updatePanelOpenStatus">
        <transition name="fade" mode="out-in">
          <component :is="Component" ref="currentView"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import MetaTags from '@/components/MetaTags.vue';
import { useContextStore } from '@/stores/contextStore';

const route = useRoute();
const contextStore = useContextStore();
contextStore.init();

const currentView = ref(null);
const isPanelOpenInTimeView = ref(false);

const updatePanelOpenStatus = () => {
  if (currentView.value && currentView.value.isPanelOpen) {
    isPanelOpenInTimeView.value = currentView.value.isPanelOpen;
  } else {
    isPanelOpenInTimeView.value = false;
  }
};

watch(() => route.name, () => {
  // Reset panel open status when route changes
  isPanelOpenInTimeView.value = false;
});
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