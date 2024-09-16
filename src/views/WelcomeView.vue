<template>
  <div class="min-h-screen bg-white" style="background-image: url('https://www.transparenttextures.com/patterns/debut-light.png');">
    
    <MetaTags
      :title="'Le temps Naturel MERDE titre'"
      :description="'Le temps Naturel TODO description'"
      image="/natural-time-social-sharing.jpg"
    />

    <div class="md:p-8 max-w-6xl mx-auto">
        <!-- Hero Section (White) -->
      <section class="w-full flex flex-col items-center justify-center p-4 md:py-2 md:p-6">
        <h1 class="w-full text-center text-3xl md:text-6xl font-bold pt-3 pb-5 md:py-10 bg-slate-700 text-white rounded-xl md:bg-transparent md:text-black">
          <strong class="font-title underline">Le Temps Naturel</strong>
          <br>
          <small class="text-xs md:text-xl uppercase font-bold mt-1" style="display: block;">Une nouvelle convention du temps</small>
        </h1>
        <p class="text-center text-sm md:text-2xl md:mb-8 max-w-3xl mx-auto py-2 px-6 md:px-0 md:pt-4 md:pb-8">
          Le <i>Temps Naturel</i> réinvente notre façon de mesurer le temps.<br/>
          En s'inspirant du vivant, l'<span class="font-medium underline decoration-ntyellow-dark cursor-pointer" @click="scrollToNaturalClock">horloge de 360°</span> et la <span class="font-medium underline decoration-ntcyan-dark cursor-pointer" @click="scrollToThirteenMoons">spirale de 13 lunes</span> <br class="hidden md:block">
          redéfinissent le soleil comme référence universelle du temps. <br><br>
          <span @click="scrollToVideo" class="text-sm mr-4 cursor-pointer font-mono hover:underline" v-if="isOnline">Comprendre en vidéo</span>
          <span @click="scrollToFAQ" class="text-sm cursor-pointer font-mono hover:underline">Lire la FAQ</span>
        </p>
      </section>

      <!-- Natural Clock Section (Yellow) -->
      <section class="w-full px-6" ref="naturalClockRef">
        <div class="max-w-6xl mx-auto bg-ntyellow-light rounded-3xl md:py-12" style="background-image: url('https://www.transparenttextures.com/patterns/debut-light.png');">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-2/5 flex items-center justify-center px-8 pt-8 pb-6">
              <img src="@/assets/icon/clock.svg" alt="Clock Icon" @click="router.push('time')" class="w-48 h-48 md:w-64 md:h-64 transform transition-all duration-300 hover:scale-105 cursor-pointer" />
            </div>
            <div class="w-full md:w-3/5 flex flex-col justify-center px-8 pb-10 md:pb-0">
              <h2 class="text-3xl md:text-5xl mb-2 font-title">Horloge Naturelle</h2>
              <p class="mb-6 text-black">
                Je suis une horloge naturelle. À chaque instant, <br class="hidden md:block" />
                <strong>J'indique la position du soleil</strong> dans le ciel. <br class="hidden md:block" />
                Mon unique aiguille tourne une seule fois par jour, <br class="hidden md:block" />
                Lentement... Sur un cadran de 360°.
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

      <section class="font-mono text-center text-sm font-bold p-1 mb-24 text-gray-600">
        <!--Au revoir les 24 heures, fuseaux horaires et changements d'heure !-->
      </section>

      <!-- 13 Moons Section (Cyan) -->
      <section class="w-full px-6" ref="thirteenMoonsRef">
        <div class="max-w-6xl mx-auto bg-ntcyan-light rounded-3xl md:py-12" style="background-image: url('https://www.transparenttextures.com/patterns/debut-light.png');">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-2/5 flex items-center justify-center px-8 pt-8 pb-6">
              <img src="@/assets/icon/year.svg" alt="13 Moons" @click="router.push('13moons')" class="w-48 h-48 md:w-64 md:h-64 transform transition-all duration-300 hover:scale-105 cursor-pointer" />
            </div>
            <div class="w-full md:w-3/5 flex flex-col justify-center px-8 pb-10 md:pb-0">
              <h2 class="text-3xl md:text-5xl mb-2 font-title">Spirale 13 Lunes</h2>
              <p class="mb-4 text-black">
                Je suis une alternative au calendrier grégorien <br class="hidden md:block" />
                Inspiré des traditions du monde entier. <br class="hidden md:block" />
                Je propose 13 mois (lunes) de 28 jours chacuns <br class="hidden md:block" />
                En ajoutant le jour arc-en-ciel, cela donne <br class="hidden md:block" />
                <strong>13 lunes x 28 jours + 1 = 365 🤩</strong>
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

      <section class="font-mono text-center text-sm font-bold p-1 mb-24 text-gray-600">
        <!--Et si les mois faisaient exactement tous la même durée ?-->
      </section>

      <!-- YouTube Video Section -->
      <section class=" max-w-xl mx-auto px-4" v-if="isOnline" ref="videoRef">
        <iframe
              class="w-full aspect-video rounded-lg"
              src="https://www.youtube.com/embed/210WCUx2FjY"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
      </section>

      <section class="font-mono text-center text-sm font-bold p-1 mt-4 mb-24">
        Comprendre le temps naturel en 10 minutes
      </section>


      <!-- FAQ Section -->
      <section class="w-full md:px-6" ref="faqRef">
        <div class="max-w-6xl mx-auto bg-gray-100 md:rounded-3xl p-4 md:p-12" style="background-image: url('https://www.transparenttextures.com/patterns/debut-light.png');">
          <div class="flex flex-col">
            <h2 class="text-3xl md:text-5xl mb-2 font-title text-center">Foire Aux Questions</h2>
            <p class="text-center text-sm md:text-lg md:mb-8 max-w-3xl mx-auto pb-4 md:py-6 px-4 md:px-0 italic text-gray-600">
              Nous avons créé des machines pour mesurer le temps.<br class="hidden md:block">
              Puis nous sommes devenus leurs esclaves...<br class="hidden md:block">
              Le Temps Naturel inverse cette tendance.<br class="hidden md:block">
              La vie a déja prévu une magnifique horloge en fait...<br class="hidden md:block">
              On l'appelle le soleil ! Maître du temps et chef d'orchestre du vivant.
            </p>
            <FAQAccordion class="pb-16" />
          </div>
        </div>
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
import MetaTags from '@/components/MetaTags.vue';
import { ref } from 'vue';

const router = useRouter();

import { useContextStore } from '@/stores/contextStore';
const contextStore = useContextStore();

const isOnline = ref(window.navigator.onLine);

const naturalClockRef = ref(null);
const thirteenMoonsRef = ref(null);
const faqRef = ref(null);
const videoRef = ref(null);

const scrollToNaturalClock = () => {
  naturalClockRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToThirteenMoons = () => {
  thirteenMoonsRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToFAQ = () => {
  faqRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToVideo = () => {
  videoRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const launchFAQ = (event) => {
  router.push('/about');
  // Prevent the event from bubbling up to parent elements
  event.stopPropagation();
};
</script>

<style scoped>

</style>