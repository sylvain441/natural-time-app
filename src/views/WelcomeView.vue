<template>
  <div class="min-h-screen bg-white bg-texture">
    
    <!-- APP menu -->  
    <MainMenu />

    <div class="max-w-6xl mx-auto">
        <!-- Hero Section (White) -->
      <section class="w-full flex flex-col items-center justify-center px-4 py-4 md:py-2 md:p-6 text-slate-800">
        <h1 class="w-full text-center text-3xl md:text-6xl font-bold pt-3 pb-4 md:py-10">
          <strong class="font-title underline">Le Temps Naturel</strong>
          <br>
          <small class="text-xs md:text-xl uppercase font-bold mt-1 block">Une nouvelle convention du temps</small>
        </h1>
        <p class="md:text-center text-md md:text-2xl max-w-3xl mx-auto py-2 px-6 md:px-0 md:pt-4 md:pb-12">
          Le Temps Naturel réinvente notre façon de mesurer le temps.<br/>
          Avec <span class="font-medium underline decoration-3 md:decoration-5 decoration-nt-yellow-light cursor-pointer font-title" @click="scrollToNaturalClock">l'horloge de 360°</span> et <span class="font-medium underline decoration-3 md:decoration-5 decoration-nt-cyan-light cursor-pointer font-title" @click="scrollToThirteenMoons">la spirale de 13 lunes</span>,<br class="hidden md:block">
          le soleil retrouve sa place de référence universelle du temps.
        </p>
      </section>

      <!-- Natural Clock Section (Yellow) -->
      <section class="w-full md:px-6 md:mb-12" ref="naturalClockRef">
        <div class="max-w-4xl mx-auto bg-nt-yellow-light md:rounded-3xl md:py-12 bg-texture">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-2/5 flex items-center justify-center px-8 pt-8 pb-6">
              <ClockSVG @click="router.push('time')" class="w-48 h-48 md:w-64 md:h-64 transform transition-all duration-300 hover:scale-105 cursor-pointer" />
            </div>
            <div class="w-full md:w-3/5 flex flex-col justify-center px-8 pb-10 md:pb-0">
              <h2 class="text-3xl md:text-5xl mb-2 font-title">Horloge Naturelle</h2>
              <p class="mb-6 text-black md:text-lg">
                Je suis une horloge inspirée du vivant. <br class="hidden md:block" />
                Mon aiguille tourne une fois par jour seulement... <br class="hidden md:block" />
                Elle suit la course du soleil dans le ciel, <br class="hidden md:block" />
                lentement... selon un cadran de 360°.
              </p>
              <div class="flex justify-center md:justify-start mt-1">
                <router-link :to="{ name: 'time' }" class="bg-black text-white px-10 py-2 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition duration-300">
                  {{ contextStore.isEmpty ? 'Découvrir' : 'Ouvrir' }} l'horloge
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 13 Moons Section (Cyan) -->
      <section class="w-full md:px-6 md:mb-12" ref="thirteenMoonsRef">
        <div class="max-w-4xl mx-auto bg-nt-cyan-light md:rounded-3xl md:py-12 bg-texture">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-2/5 flex items-center justify-center px-8 pt-8 pb-6">
              <YearSVG @click="router.push('13moons')" class="w-48 h-48 md:w-64 md:h-64 transform transition-all duration-300 hover:scale-105 cursor-pointer" />
            </div>
            <div class="w-full md:w-3/5 flex flex-col justify-center px-8 pb-10 md:pb-0">
              <h2 class="text-3xl md:text-5xl mb-2 font-title">Spirale 13 Lunes</h2>
              <p class="mb-4 text-black md:text-lg">
                Je suis une alternative au calendrier grégorien <br class="hidden md:block" />
                Inspiré des traditions du monde entier. <br class="hidden md:block" />
                Je propose 13 lunes (mois) de 28 jours chacunes <br class="hidden md:block" />
                En ajoutant le jour arc-en-ciel, cela donne <br class="hidden md:block" />
                13 lunes x 28 jours + 1 = 365 🤩
              </p>
              <div class="flex justify-center md:justify-start mt-1">
                <router-link :to="{ name: '13moons' }" class="bg-black text-white px-10 py-2 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition duration-300">
                  {{ contextStore.isEmpty ? 'Découvrir' : 'Ouvrir' }} les 13 lunes
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="w-full md:px-6 md:mb-12" ref="faqRef">
        <div class="max-w-4xl mx-auto bg-white md:rounded-3xl p-4 md:p-12">
          <div class="flex flex-col">
            <h2 class="text-3xl md:text-5xl mb-8 font-title text-center">Foire Aux Questions</h2>
            <FAQAccordion class="pb-16" />
          </div>
        </div>
      </section>

      <section class="w-full md:px-6 md:mb-12">
        <p class="text-center text-sm md:text-lg md:mb-8 max-w-3xl mx-auto pb-4 md:py-6 px-4 md:px-0 italic text-gray-600">
            Nous avons créé des machines pour mesurer le temps.<br class="hidden md:block">
            Puis nous sommes devenus leurs esclaves...<br class="hidden md:block">
            Le Temps Naturel inverse cette tendance.<br class="hidden md:block">
            La vie a déja prévu une magnifique horloge en fait...<br class="hidden md:block">
            On l'appelle le soleil ! Maître du temps et chef d'orchestre du vivant.
          </p>
      </section>
    </div>

    <!-- Footer (Black) -->
    <footer class="md:mt-12 w-full text-center py-4 text-sm bg-black text-white">
      <p>
        Created by <a href="https://biquette.xyz" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-300">Sylvain</a> | 
        <a href="https://github.com/sylvain441/natural-time" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-300">Open sourced on GitHub</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import FAQAccordion from '@/components/FAQAccordion.vue';
import { ref, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useContextStore } from '@/stores/contextStore'; // Import the store

const router = useRouter();
const contextStore = useContextStore();

const naturalClockRef = ref(null);
const thirteenMoonsRef = ref(null);
const faqRef = ref(null);

import MainMenu from '@/components/MainMenu.vue';

import ClockSVG from '@/assets/icon/clock.svg';
import YearSVG from '@/assets/icon/year.svg';


useHead({
  title: 'Le temps Naturel TODO',
  meta: [
    { name: 'description', content: 'Le temps Naturel TODO description' },
    { property: 'og:image', content: '/natural-time-social-sharing.jpg' },
  ],
});

onMounted(() => {
  
});

const scrollToNaturalClock = () => {
  naturalClockRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToThirteenMoons = () => {
  thirteenMoonsRef.value?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>

</style>