<template>
  <div class="min-h-dvh bg-gray-50 dark:bg-slate-800 bg-[url('@/assets/debut-light.png')] dark:bg-[url('@/assets/debut-dark.png')]">

    <div class="max-w-6xl mx-auto">
      <!-- Title Section (Gray) -->
      <section class="w-full flex flex-col items-center justify-center px-4 md:py-2 md:p-6 text-slate-800 dark:text-slate-100 bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 md:bg-none">
        <h1 class="w-full text-center text-3xl md:text-6xl font-bold pt-3 pb-4 md:pt-20 md:pb-10">
          <strong class="font-title underline decoration-nt-yellow-light">Le Temps Naturel</strong>
          <br>
          <small class="text-xs md:text-xl uppercase font-bold mt-1 block">Une nouvelle convention du temps</small>
        </h1>
      </section>
      <!-- Hero Section (White) -->
      <section class="w-full flex flex-col items-center justify-center px-4 py-6 md:py-2 md:p-6 text-slate-800 dark:text-slate-100">
        <p class="md:text-center text-lg md:text-2xl max-w-3xl mx-auto py-2 px-6 md:px-0 md:pt-4 md:pb-12">
          Le Temps Naturel réinvente notre façon de mesurer le temps.<br/>
          Avec <span class="font-medium underline decoration-3 md:decoration-5 decoration-nt-yellow-light cursor-pointer font-title" @click="router.push({ name: 'time' })">l'horloge de 360°</span> et <span class="font-medium underline decoration-3 md:decoration-5 decoration-nt-cyan-light cursor-pointer font-title" @click="router.push({ name: '13moons' })">la spirale de 13 lunes</span>,<br class="hidden md:block">
          le soleil retrouve sa place comme référence universelle<br class="hidden md:block">
          du temps qui passe...
        </p>
      </section>

      <!-- Natural Clock Section (Yellow) -->
      <section class="w-full md:px-6 md:mb-16" ref="naturalClockRef">
        <div class="max-w-4xl mx-auto bg-gradient-to-r from-nt-yellow-dark/70 to-nt-yellow-darker/70 max-md:mx-2 max-md:my-4 max-md:rounded-xl md:rounded-3xl md:py-12">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-2/5 flex items-center justify-center px-8 pt-8 pb-6">
              <ClockSVG @click="router.push('time')" class="w-48 h-48 md:w-64 md:h-64 transform transition-all duration-300 hover:scale-105 cursor-pointer" />
            </div>
            <div class="w-full md:w-3/5 flex flex-col justify-center px-8 pb-10 md:pb-0">
              <h2 class="text-3xl md:text-5xl mb-2 font-title">Horloge Naturelle</h2>
              <p class="mb-6 text-black md:text-lg">
                Je suis une horloge inspirée du vivant. <br class="hidden md:block" />
                Mon aiguille tourne une fois par jour seulement... <br class="hidden md:block" />
                Je suis la course du soleil dans le ciel, <br class="hidden md:block" />
                tranquillement... selon un cadran de 360°.
              </p>
              <div class="flex justify-center md:justify-start mt-1">
                <router-link :to="{ name: 'time' }" class="bg-black dark:bg-white text-white dark:text-black px-10 py-2 rounded-2xl text-lg font-semibold transition duration-300 hover:shadow-[4px_4px_0_0_#ffffff] dark:hover:shadow-[4px_4px_0_0_#000000]">
                  {{ contextStore.isEmpty ? 'Découvrir' : 'Ouvrir' }} l'horloge
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 13 Moons Section (Cyan) -->
      <section class="w-full md:px-6 md:mb-10" ref="thirteenMoonsRef">
        <div class="max-w-4xl mx-auto bg-gradient-to-r from-nt-cyan-dark/70 to-nt-cyan-darker/70 max-md:m-2 max-md:rounded-xl md:rounded-3xl md:py-12">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-2/5 flex items-center justify-center px-8 pt-8 pb-6">
              <YearSVG @click="router.push('13moons')" class="w-48 h-48 md:w-64 md:h-64 transform transition-all duration-300 hover:scale-105 cursor-pointer" />
            </div>
            <div class="w-full md:w-3/5 flex flex-col justify-center px-8 pb-10 md:pb-0">
              <h2 class="text-3xl md:text-5xl mb-2 font-title">Spirale 13 Lunes</h2>
              <p class="mb-4 text-black md:text-lg">
                Je suis une alternative au calendrier grégorien <br class="hidden md:block" />
                Inspiré des traditions du monde entier. <br class="hidden md:block" />
                Je propose 13 lunes (mois) de 28 jours <br class="hidden md:block" />
                + le jour arc-en-ciel : <br class="hidden md:block" />
                13 lunes x 28 jours + 1 = 365 🤩
              </p>
              <div class="flex justify-center md:justify-start mt-1">
                <router-link :to="{ name: '13moons' }" class="bg-black dark:bg-white text-white dark:text-black px-10 py-2 rounded-2xl text-lg font-semibold transition duration-300 hover:shadow-[4px_4px_0_0_#ffffff] dark:hover:shadow-[4px_4px_0_0_#000000]">
                  {{ contextStore.isEmpty ? 'Découvrir' : 'Ouvrir' }} les 13 lunes
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission Statement -->
      <section class="w-full flex flex-col items-center justify-center px-4 py-6 md:py-8 md:mb-10">
        <p class="text-center text-lg md:text-2xl max-w-3xl mx-auto font-thin italic text-slate-800 dark:text-slate-100">
          Le Temps Naturel est un système de mesure du temps<br class="hidden md:block">
          imaginé pour pouvoir remplacer ou compléter<br class="hidden md:block">
          l'horloge des 24 heures et le calendrier grégorien.
        </p>
      </section>

      <!-- FAQ Section -->
      <section class="w-full md:px-6 md:mb-12" ref="faqRef">
        <div class="max-w-4xl mx-auto bg-white/70 dark:bg-slate-800/70 md:rounded-3xl p-4 md:p-12">
          <div class="flex flex-col">
            <h2 class="text-5xl my-8 font-title text-center dark:text-white">FAQ</h2>
            <FAQAccordion class="pb-16" />
          </div>
        </div>
      </section>

      <section class="w-full md:px-6 md:mb-12">
        <p class="text-center text-sm md:text-lg md:mb-8 max-w-3xl mx-auto pb-4 md:py-6 py-4 px-4 md:px-0 italic text-gray-600 dark:text-gray-300">
            Nous avons créé des machines pour mesurer le temps.<br class="hidden md:block">
            Puis nous sommes devenus leurs esclaves...<br class="hidden md:block">
            Le Temps Naturel inverse cette tendance.<br class="hidden md:block">
            La vie a déja prévu la plus belle des horloges...<br class="hidden md:block">
            On l'appelle le soleil ! Maître du temps et chef d'orchestre du vivant.<br><br>
            <span class="text-2xl not-italic md:text-4xl">🌞</span>
          </p>
      </section>
    </div>

    <!-- Footer (Black) -->
    <footer class="md:mt-12 w-full text-center py-4 text-sm bg-black text-white">
      <p>
        Created by <a href="https://biquette.xyz" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-300">Sylvain</a> | 
        <a href="https://github.com/sylvain441/natural-time" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-300">Open sourced on GitHub</a>
        <span class="ml-2 text-gray-500">
          <button 
            @click="contextStore.clearLocalStorageAndReload"
            class="ml-1 hover:text-gray-300"
            title="Réinitialiser les données"
          >
            v{{ version }}
          </button>
        </span>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import FAQAccordion from '@/components/FAQAccordion.vue';
import { ref } from 'vue';
import { useHead } from '@unhead/vue';
import { useContextStore } from '@/stores/contextStore'; // Import the store
import { version } from '../../package.json';

const router = useRouter();
const contextStore = useContextStore();

const naturalClockRef = ref(null);
const thirteenMoonsRef = ref(null);
const faqRef = ref(null);

import ClockSVG from '@/assets/icon/clock.svg';
import YearSVG from '@/assets/icon/year.svg';

const metaTitle = "Temps Naturel - Une nouvelle façon de mesurer le temps, inspirée du vivant";
const metaDescription = "Découvrir et comprendre l'horloge naturelle de 360° synchro avec le soleil et la spirale des 13 lunes de 28 jours";

useHead({
  title: metaTitle,
  meta: [
    { name: 'description', content: metaDescription },
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:image', content: 'https://naturaltime.app/natural-time-social.jpg' },
    { property: 'og:url', content: 'https://naturaltime.app' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
});

</script>

<style scoped>

</style>