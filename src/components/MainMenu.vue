<template>
    <div>
      <!-- Full-screen navigation menu -->
      <transition name="menu-fade">
        <nav v-if="isMenuOpen" class="fixed inset-0 bg-white bg-texture flex items-center justify-center z-40">
          <div class="flex flex-col items-center space-y-8">
            <router-link 
              :to="{ name: 'welcome' }" 
              class="nav-link text-4xl font-semibold text-slate-400 hover:text-slate-800 transition-all duration-300 transform hover:scale-110" 
              @click="closeMenu">
              À propos
            </router-link>
            <router-link 
              :to="{ name: 'time' }" 
              class="nav-link text-4xl font-semibold text-slate-800 hover:text-slate-600 transition-all duration-300 transform hover:scale-110 underline decoration-3 md:decoration-5 decoration-nt-yellow-light uppercase" 
              @click="closeMenu">
              Horloge
            </router-link>
            <router-link 
              :to="{ name: '13moons' }" 
              class="nav-link text-4xl font-semibold text-slate-800 hover:text-slate-600 transition-all duration-300 transform hover:scale-110 underline decoration-3 md:decoration-5 decoration-nt-cyan-light uppercase" 
              @click="closeMenu">
              13 Lunes
            </router-link>
          </div>
        </nav>
      </transition>
  
      <!-- Menu toggle button -->
      <button @click="toggleMenu" :class="['fixed top-4 left-4 p-2 rounded-full bg-slate-800 text-white focus:outline-none transition-all duration-300 hover:bg-slate-700 hover:shadow-lg', isMenuOpen ? 'z-50' : 'z-30']">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" class="transition-transform duration-300" :class="{ 'rotate-45 translate-y-0': isMenuOpen, '-translate-y-2': !isMenuOpen }" />
          <line x1="3" y1="12" x2="21" y2="12" class="transition-opacity duration-300" :class="{ 'opacity-0': isMenuOpen }" />
          <line x1="3" y1="12" x2="21" y2="12" class="transition-transform duration-300" :class="{ '-rotate-45 translate-y-0': isMenuOpen, 'translate-y-2': !isMenuOpen }" />
        </svg>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';

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