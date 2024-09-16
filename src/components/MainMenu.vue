<template>
    <div>
      <!-- Full-screen navigation menu -->
      <transition name="menu-fade">
        <nav v-if="isMenuOpen" class="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-40">
          <div class="flex flex-col items-center space-y-8">
            <router-link v-for="item in menuItems" :key="item.route" 
                         :to="item.route" 
                         class="nav-link text-4xl font-semibold text-gray-800 hover:text-gray-600 transition-all duration-300 transform hover:scale-110" 
                         @click="closeMenu">
              {{ $t(item.label) }}
            </router-link>
          </div>
        </nav>
      </transition>
  
      <!-- Menu toggle button -->
      <button @click="toggleMenu" :class="['fixed top-4 left-4 p-2 rounded-full bg-slate-500 text-slate-200 focus:outline-none transition-all duration-300 hover:bg-slate-600', isMenuOpen ? 'z-50' : 'z-30']">
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
  import { useI18n } from 'vue-i18n';
  
  const i18n = useI18n();
  const isMenuOpen = ref(false);
  
  const menuItems = [
    { route: { name: 'welcome' }, label: 'nav.welcome' },
    { route: '/time', label: 'nav.clock' },
    { route: '/13moons', label: 'nav.moons' }
  ];
  
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