<template>
  <div class="min-h-dvh bg-gray-50 dark:bg-[rgb(24,35,55)] bg-[url('@/assets/debut-light.png')] dark:bg-[url('@/assets/debut-dark.png')]">

    <div class="max-w-6xl mx-auto">
      <!-- Title Section (Gray) -->
      <section class="w-full flex flex-col items-center justify-center px-4 md:py-2 md:p-6 text-slate-800 dark:text-slate-100">
        <h1 class="w-full text-center text-3xl md:text-6xl font-bold pt-3 pb-4 md:pt-28 md:pb-10">
          <strong class="font-title underline decoration-nt-yellow-light transition-all duration-300 hover:decoration-4">Le Temps Naturel</strong>
          <br>
          <small class="text-xs md:text-2xl uppercase font-bold md:mt-3 block opacity-90">Une nouvelle convention du temps</small>
        </h1>
      </section>

      <!-- Natural Clock Section (Yellow) -->
      <section class="max-w-[calc(100%-24px)] mx-auto md:max-w-none md:mx-0 my-8 md:my-0 rounded-2xl w-full md:px-6 md:mb-16 relative overflow-hidden transform transition-transform duration-500" ref="naturalClockRef">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 bg-gradient-to-r via-nt-yellow-light/5 via-75% from-nt-yellow-light/10 to-transparent"></div>
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr via-nt-yellow-light/8 via-75% from-nt-yellow-light/15 to-transparent rounded-full blur-3xl transform translate-x-[-30%]"></div>
        </div>
        <div class="relative">
          <div class="max-w-5xl mx-auto px-2 md:px-0 py-8 md:py-16">
            <div class="flex flex-col md:flex-row items-center justify-end md:gap-6 lg:gap-12 relative">
              <div class="w-full md:w-2/3 lg:w-[55%] flex flex-col justify-center px-4 md:px-8 pb-6 md:pb-0 z-10 md:order-2">
                <h2 class="text-3xl md:text-5xl mb-4 font-title dark:text-nt-yellow-light/90">Horloge Naturelle</h2>
                <p class="mb-6 text-black dark:text-slate-100 md:text-lg">
                  Je suis une horloge inspirée du vivant.<br>
                  Mon aiguille tourne une fois par jour seulement...<br>
                  Je suis la course du soleil dans le ciel,<br>
                  tranquillement... selon un cadran de 360°.
                </p>
                <div class="flex flex-col justify-center items-center mt-8 mb-4 gap-3 px-4">
                  <router-link :to="{ name: 'time' }" class="w-full md:w-3/4 lg:w-1/2 group bg-gradient-to-r from-nt-yellow-light/90 to-nt-yellow-light/80 text-black px-6 md:px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-[4px_4px_0_0_rgba(251,191,36,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:scale-105">
                    <span class="flex items-center justify-center gap-2 whitespace-nowrap">
                      {{ contextStore.isEmpty ? 'Découvrir' : 'Ouvrir' }} l'horloge
                      <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </router-link>
                  <button @click="openClockTutorial" class="w-full md:w-3/4 lg:w-1/2 group text-black dark:text-white/80 px-4 py-4 text-sm font-medium transition-all duration-300 hover:text-nt-yellow-darker dark:hover:text-nt-yellow-light/90">
                    <span class="flex items-center justify-center whitespace-nowrap">
                      Voir le tutoriel
                    </span>
                  </button>
                </div>
              </div>
              <div class="max-md:absolute max-md:-right-16 max-md:top-[75%] transition-all duration-500 md:order-1">
                <div class="rounded-full bg-gradient-to-tl from-nt-yellow-light/40 to-nt-yellow-light/20 md:from-nt-yellow-light/90 md:to-nt-yellow-light/80 p-5 
                  shadow-[0_0_0_1px_rgba(251,191,36,0.1),0_0_0_10px_rgba(251,191,36,0.08),0_0_0_20px_rgba(251,191,36,0.05),0_0_0_30px_rgba(251,191,36,0.03)]
                  hover:shadow-[0_0_0_1px_rgba(251,191,36,0.2),0_0_0_15px_rgba(251,191,36,0.15),0_0_0_30px_rgba(251,191,36,0.1),0_0_0_45px_rgba(251,191,36,0.05)]
                  hover:bg-gradient-to-tl transition-all duration-500 max-md:rotate-[5deg] hover:rotate-0">
                  <ClockSVG @click="router.push({ name: 'time' })" class="w-36 h-36 md:w-52 md:h-52 max-md:transform max-md:transition-all max-md:duration-500 max-md:hover:scale-105 cursor-pointer max-md:opacity-50 max-md:hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 13 Moons Section (Cyan) -->
      <section class="max-w-[calc(100%-24px)] mx-auto md:max-w-none md:mx-0 my-8 md:my-0 rounded-2xl w-full md:px-6 md:mb-16 relative overflow-hidden transform transition-transform duration-500" ref="thirteenMoonsRef">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 bg-gradient-to-l via-nt-cyan-light/5 via-75% from-nt-cyan-light/10 to-transparent"></div>
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr via-nt-cyan-light/8 via-75% from-nt-cyan-light/15 to-transparent rounded-full blur-3xl transform translate-x-1/3"></div>
        </div>
        <div class="relative">
          <div class="max-w-5xl mx-auto px-2 md:px-0 py-8 md:py-16">
            <div class="flex flex-col md:flex-row items-center justify-start md:gap-6 lg:gap-12 relative">
              <div class="w-full md:w-2/3 lg:w-[55%] flex flex-col justify-center px-6 md:px-8 pb-6 md:pb-0 z-10">
                <h2 class="text-3xl md:text-5xl mb-4 font-title dark:text-nt-cyan-light/90 md:text-right">Spirale 13 Lunes</h2>
                <p class="mb-6 text-black dark:text-slate-100 md:text-lg md:text-right">
                  Inspirés des traditions du monde entier,<br>
                  mes 13 mois de 28 jours remplacent<br>
                  notre vieux calendrier tout tordu.<br>
                  Le jour arc-en-ciel clôture l'année.
                </p>
                <div class="flex flex-col justify-center items-center mt-8 mb-4 gap-3 px-4">
                  <router-link :to="{ name: '13moons' }" class="w-full md:w-3/4 lg:w-1/2 group bg-gradient-to-r from-nt-cyan-light/90 to-nt-cyan-light/80 text-black px-6 md:px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-[4px_4px_0_0_rgba(6,182,212,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                    <span class="flex items-center justify-center gap-2 whitespace-nowrap">
                      {{ contextStore.isEmpty ? 'Découvrir' : 'Ouvrir' }} les 13 lunes
                      <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </router-link>
                  <button @click="openSpiralTutorial" class="w-full md:w-3/4 lg:w-1/2 group text-black dark:text-white/80 px-4 py-4 text-sm font-medium transition-all duration-300 hover:text-nt-cyan-darker dark:hover:text-nt-cyan-light/90">
                    <span class="flex items-center justify-center whitespace-nowrap">
                      Voir le tutoriel
                    </span>
                  </button>
                </div>
              </div>
              <div class="max-md:absolute max-md:-right-16 max-md:top-[75%] transition-all duration-500">
                <div class="rounded-2xl bg-gradient-to-tl from-nt-cyan-light/30 to-nt-cyan-light/20 md:from-nt-cyan-light/90 md:to-nt-cyan-light/80 p-5
                  shadow-[0_0_0_1px_rgba(6,182,212,0.1),0_0_0_10px_rgba(6,182,212,0.08),0_0_0_20px_rgba(6,182,212,0.05),0_0_0_30px_rgba(6,182,212,0.03)]
                  hover:shadow-[0_0_0_1px_rgba(6,182,212,0.2),0_0_0_15px_rgba(6,182,212,0.15),0_0_0_30px_rgba(6,182,212,0.1),0_0_0_45px_rgba(6,182,212,0.05)]
                  hover:bg-gradient-to-tl
                  transition-all duration-500 max-md:rotate-[5deg] hover:rotate-0">
                  <YearSVG @click="router.push({ name: '13moons' })" class="w-36 h-28 md:w-52 md:h-40 max-md:transform max-md:transition-all max-md:duration-500 max-md:hover:scale-105 cursor-pointer max-md:opacity-50 max-md:hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </div>

    <!-- Understanding Natural Time Section -->
    <section class="w-full bg-slate-900 bg-[url('@/assets/debut-dark.png')] py-24 mt-4 md:mt-28 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"></div>
      <div class="relative">
        <h2 class="text-4xl md:text-5xl my-4 font-title text-center text-white">
          <span class="">Tout comprendre</span>
          <br class="hidden md:block">
          <span class="text-xl md:text-2xl text-slate-100 block mt-3 uppercase font-bold font-mono">sur le temps naturel</span>
        </h2>

        <!-- Mission Statement -->
        <div class="mb-24">
          <p class="text-center text-xl md:text-3xl max-w-4xl mx-auto my-16 text-slate-100 font-extralight leading-relaxed px-6">
            Le Temps Naturel est un système de mesure du temps<br class="hidden md:block">
            imaginé pour remplacer <i>(ou compléter)</i><br class="hidden md:block">
            l'horloge des 24 heures et le calendrier grégorien.
          </p>
        </div>
        
        <!-- Video Grid -->
        <div class="flex justify-center mb-24 px-6">
          <div class="w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-[1.02]">
            <YouTubePlayer videoId="XP8XYidlgKA" />
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="py-20">
          <h2 class="text-3xl md:text-4xl mb-16 font-mono uppercase text-center text-white">Foire aux questions</h2>
          <div class="max-w-4xl mx-auto px-6">
            <FAQAccordion class="pb-8" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer (Black) -->
    <footer class="w-full bg-gradient-to-b from-black to-slate-900 text-white">
      <!-- Closing Statement -->
      <div class="py-20">
        <p class="text-center text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-6">
          <span class="font-normal text-white">Nous avons créé des machines pour mesurer le temps.</span> <br class="hidden md:block">
          <span class="font-light text-slate-300">Puis nous sommes devenus esclaves de leur tic tac.</span> <br class="hidden md:block">
          <span class="font-normal text-white">Le Temps Naturel inverse cette tendance.</span> <br class="hidden md:block">
          <span class="font-light text-slate-300">La vie a déja prévu la plus belle des horloges...</span> <br class="hidden md:block">
          <span class="font-normal text-white">On l'appelle le soleil ! Maître du temps et chef d'orchestre du vivant.</span><br><br>
          <span class="text-5xl md:text-6xl block mt-8">🌞</span>
        </p>
      </div>
      
      <div class="text-center py-4 text-sm border-t border-white/10">
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
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import FAQAccordion from '@/components/FAQAccordion.vue';
import YouTubePlayer from '@/components/YouTubePlayer.vue';
import { ref } from 'vue';
import { useHead } from '@unhead/vue';
import { useContextStore } from '@/stores/contextStore'; // Import the context store
import { useConfigStore } from '@/stores/configStore'; // Import the config store
import { version } from '../../package.json';

const router = useRouter();
const contextStore = useContextStore();
const configStore = useConfigStore();

const naturalClockRef = ref(null);
const thirteenMoonsRef = ref(null);
const faqRef = ref(null);

// Functions to handle tutorial mode
const openClockTutorial = () => {
  configStore.clockTutorialMode = true;
  router.push({ name: 'time' });
};

const openSpiralTutorial = () => {
  configStore.spiralTutorialMode = true;
  router.push({ name: '13moons' });
};

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