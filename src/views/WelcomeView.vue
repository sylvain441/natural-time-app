<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed bg-clouds p-6">
    <h1 class="text-center text-4xl md:text-6xl font-bold mt-24 mb-12"><strong class="font-title" style="text-decoration: underline; text-decoration-color: yellow; text-decoration-thickness: 6px;">Le Temps Naturel</strong><br><small class="text-lg md:text-xl uppercase font-bold mt-1" style="display: block;">Une nouvelle convention du temps</small></h1>
    <p class="md:text-center text-base md:text-xl mb-24 max-w-2xl italic">
        Nous avons créé des machines pour mesurer le temps.<br class="hidden md:block">
        Puis nous sommes devenus leurs esclaves...<br class="hidden md:block">
        Le Temps Naturel inverse cette tendance.<br class="hidden md:block">
        Le Vivant a déja prévu la plus magnifique des horloges !<br class="hidden md:block">
        On l'appelle le Soleil... Maître du temps, chef d'orchestre de la vie.
    </p>
    <!-- NATURAL CLOCK-->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
      <div class="bg-white bg-opacity-80 rounded-xl p-6 flex flex-col items-center text-center drop-shadow-xl hover:drop-shadow-2xl hover:bg-opacity-100 transition duration-500 cursor-pointer" @click="gotoTimeView">
        <img src="@/assets/icon/clock.svg" alt="Clock Icon" class="w-48 h-48 mb-4" />
        <h2 class="text-3xl mb-2"><strong class="font-title">Horloge</strong><br><small class="text-xl uppercase font-bold mt-1" style="display: block;">du temps naturel</small></h2>
        <p class="mb-4">Au revoir les 24h x 60min x 60sec !<br class="hidden md:block"> Bye bye fuseaux horaires et changements d'heure arbitraires !</p>
        <p class="mb-6">L'horloge naturelle tourne lentement...<br class="hidden md:block">au rythme du Soleil...<br class="hidden md:block">selon un cadran de 360°</p>
        <div class="mt-auto space-y-2">
          <button @click="gotoTimeView" class="w-full bg-yellow-300 text-black px-4 py-2 rounded-full text-lg font-semibold hover:bg-yellow-400 transition duration-300">
            Démarrer l'horloge
          </button>
          <button @click="launchFAQ" class="w-full bg-transparent border-2 border-black text-black px-4 py-2 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition duration-300">
            FAQ
          </button>
        </div>
      </div>
      <!-- 13 MOONS -->
      <div class="bg-white bg-opacity-80 rounded-xl p-6 flex flex-col items-center text-center drop-shadow-xl hover:drop-shadow-2xl hover:bg-opacity-100 transition duration-500 cursor-pointer" @click="launch13Moons">
        <img src="@/assets/icon/year.svg" alt="13 Moons" class="w-48 h-48 mb-4" />
        <h2 class="text-3xl mb-2"><strong class="font-title">Spirale</strong><br><small class="text-xl uppercase font-bold mt-1" style="display: block;">des 13 Lunes</small></h2>
        <p class="mb-4">12 mois de 31-30-29-28 jours ?<br class="hidden md:block">Le calendrier gregorien est inutilement complexe. Il impose un rythme artificiel.</p>
        <p class="mb-6">Alors que... 13 mois de 28 jours<br class="hidden md:block">+ le jour arc-en-ciel<br class="hidden md:block">Ça donne : 13 x 28 + 1 = 365 🤩</p>
        <div class="mt-auto space-y-2">
          <button @click="goto13Moons" class="w-full bg-yellow-300 text-black px-4 py-2 rounded-full text-lg font-semibold hover:bg-yellow-400 transition duration-300">
            Voir les 13 lunes
          </button>
          <button @click="launchFAQ" class="w-full bg-transparent border-2 border-black text-black px-4 py-2 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition duration-300">
            FAQ
          </button>
        </div>
      </div>
    </div>

    <h2 class="text-center text-4xl md:text-6xl font-bold mt-24 mb-6"><strong class="font-title" style="text-decoration: underline; text-decoration-color: yellow; text-decoration-thickness: 6px;">Questions / Réponses</strong><br><small class="text-lg md:text-xl uppercase font-bold mt-1" style="display: block;">Pourquoi le temps naturel ?</small></h2>
    <FAQAccordion />

    <footer class="mt-12 w-full text-center py-4 text-sm text-blue-700">
      <p>
        Created by <a href="https://biquette.xyz" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-900">Sylvain</a> | 
        <a href="https://github.com/sylvain441/natural-time" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-900">Open sourced on GitHub</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import FAQAccordion from '@/components/FAQAccordion.vue';
const router = useRouter();

import { useContextStore } from '@/stores/contextStore';
const contextStore = useContextStore();

const gotoTimeView = (event) => {
  router.push( contextStore.isEmpty ? '/settings' : '/time');
  // Prevent the event from bubbling up to parent elements
  event.stopPropagation();
};

const goto13Moons = () => {
  router.push( contextStore.isEmpty ? '/settings' : '/13moons');
};

const launchFAQ = (event) => {
  router.push('/about');
  // Prevent the event from bubbling up to parent elements
  event.stopPropagation();
};
</script>

<style scoped>

</style>