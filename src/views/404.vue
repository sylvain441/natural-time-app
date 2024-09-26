<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Oops! Page non trouvée.</p>
      <button
        @click="goToMenu"
        class="px-6 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors duration-300"
      >
        Retour à l'accueil
      </button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToMenu = () => {
    router.push({ name: 'welcome' });
  };
  </script>