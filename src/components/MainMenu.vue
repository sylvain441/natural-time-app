<template>
    <div>
      <!-- Full-screen navigation menu -->
      <transition name="menu-fade">
        <nav v-if="isMenuOpen" class="fixed inset-0 bg-white bg-texture flex items-center justify-center z-40">
          <div class="flex flex-col items-stretch space-y-4">
            <router-link 
              :to="{ name: 'welcome' }" 
              @click="closeMenu"
              class="text-4xl md:text-6xl font-title text-black transition-all duration-300 transform px-4 py-2 underline decoration-nt-yellow-light mb-4 text-center">
              <span>Temps Naturel</span>
            </router-link>
            <router-link 
              :to="{ name: 'time' }" 
              class="flex flex-row items-center justify-center text-4xl font-black text-black transition-all duration-300 transform bg-nt-yellow-lighter hover:bg-nt-yellow-light uppercase px-4 py-2 rounded-full">
              <ClockIcon class="w-16 h-16 mr-2"/>
              <span>Horloge</span>
            </router-link>
            <router-link 
              :to="{ name: '13moons' }" 
              class="flex flex-row items-center justify-center text-4xl font-black text-black transition-all duration-300 transform bg-nt-cyan-lighter hover:bg-nt-cyan-light uppercase px-4 py-2 rounded-full">
              <SpiralIcon class="w-16 h-16 mr-2"/>
              <span>13 Lunes</span>
            </router-link>
            <router-link 
              :to="{ name: 'welcome' }" 
              @click="closeMenu"
              class="nav-link flex flex-row items-center justify-center text-2xl font-normal text-slate-700 transition-all duration-300 transform hover:bg-slate-200  px-4 py-2 rounded-full" >
              <span>← Acceuil</span>
            </router-link>
          </div>
        </nav>
      </transition>
  
      <!-- Menu toggle button -->
      <button 
        @click="toggleMenu" 
        :class="['fixed top-3 md:top-4 left-3 md:left-4 p-2 rounded-full bg-slate-800 text-white focus:outline-none transition-all duration-300 hover:bg-slate-700 hover:shadow-lg', isMenuOpen ? 'z-50' : 'z-30']"
        :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        :aria-expanded="isMenuOpen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 md:h-6 w-5 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" class="transition-transform duration-300" :class="{ 'rotate-45 translate-y-0': isMenuOpen, '-translate-y-2': !isMenuOpen }" />
          <line x1="3" y1="12" x2="21" y2="12" class="transition-opacity duration-300" :class="{ 'opacity-0': isMenuOpen }" />
          <line x1="3" y1="12" x2="21" y2="12" class="transition-transform duration-300" :class="{ '-rotate-45 translate-y-0': isMenuOpen, 'translate-y-2': !isMenuOpen }" />
        </svg>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ClockIcon from "@/assets/icon/clock-icon.svg";
  import SpiralIcon from "@/assets/icon/spiral-icon.svg";

  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };
  </script>
  
  <style lang="scss" scoped>
  .menu-fade-enter-active,
  .menu-fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .menu-fade-enter-from,
  .menu-fade-leave-to {
    opacity: 0;
  }
  
  svg {
    transform-origin: center;
  }
  
  svg line {
    transform-origin: center;
  }
  </style>