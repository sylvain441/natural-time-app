<template>
  <div class="min-h-dvh bg-gray-50 dark:bg-[rgb(24,35,55)] bg-[url('@/assets/debut-light.png')] dark:bg-[url('@/assets/debut-dark.png')]">

    <!-- Language Switcher in top right corner -->
    <div class="fixed top-4 md:top-6 right-4 md:right-6 z-50">
      <LanguageSwitcher />
    </div>

    <div class="max-w-6xl mx-auto">
      <!-- Title Section (Gray) -->
      <section class="w-full flex flex-col items-center justify-center px-4 md:py-2 md:p-6 text-slate-800 dark:text-slate-100">
        <h1 class="w-full text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold pt-6 pb-2 sm:pt-12 md:pt-16 lg:pt-24 sm:pb-6 md:pb-10 lg:pb-16">
          <strong class="font-title underline decoration-nt-yellow-light transition-all duration-300">{{ $t('welcome.title') }}</strong>
          <br>
          <small class="text-xs sm:text-sm md:text-xl lg:text-2xl uppercase font-bold sm:mt-2 md:mt-3 block opacity-90">{{ $t('welcome.subtitle') }}</small>
        </h1>
      </section>

      <!-- Natural Clock Section (Yellow) -->
      <section class="max-w-[calc(100%-24px)] mx-auto sm:max-w-[480px] md:max-w-none md:mx-0 my-6 sm:my-8 md:my-0 rounded-2xl w-full md:px-6 md:mb-12 lg:mb-16 relative overflow-hidden transform transition-transform duration-500" ref="naturalClockRef">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 bg-gradient-to-r via-nt-yellow-light/5 via-75% from-nt-yellow-light/10 to-transparent"></div>
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr via-nt-yellow-light/8 via-75% from-nt-yellow-light/15 to-transparent rounded-full blur-3xl transform translate-x-[-30%]"></div>
        </div>
        <div class="relative">
          <div class="max-w-5xl mx-auto px-2 md:px-0 py-8 md:pt-16 md:pb-12">
            <div class="flex flex-col md:flex-row items-center justify-end md:gap-6 lg:gap-12 relative">
              <div class="w-full md:w-2/3 lg:w-[55%] flex flex-col justify-center px-4 md:px-8 pb-6 md:pb-0 z-10 md:order-2">
                <h2 class="text-3xl sm:text-4xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 font-title dark:text-nt-yellow-light/90">{{ $t('welcome.naturalClock.title') }}</h2>
                <p class="mb-4 sm:mb-6 text-black dark:text-slate-100 sm:text-base md:text-lg whitespace-pre-line">
                  {{ $t('welcome.naturalClock.description') }}
                </p>
                <div class="flex flex-col justify-center items-center mt-6 sm:mt-8 mb-4 gap-3 px-4">
                  <router-link :to="{ name: getLocalizedRouteName('time', locale) }" class="w-full md:w-3/4 lg:w-1/2 group bg-gradient-to-r from-nt-yellow-light/90 to-nt-yellow-light/80 text-black px-6 md:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-[4px_4px_0_0_rgba(251,191,36,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:scale-105">
                    <span class="flex items-center justify-center gap-2 whitespace-nowrap">
                      {{ contextStore.isEmpty ? $t('welcome.naturalClock.cta.discover') : $t('welcome.naturalClock.cta.open') }}
                      <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </router-link>
                  <button @click="openClockTutorial" class="w-full md:w-3/4 lg:w-1/2 group text-black dark:text-white/80 px-4 py-4 text-sm font-medium transition-all duration-300 hover:text-nt-yellow-darker dark:hover:text-nt-yellow-light/90">
                    <span class="flex items-center justify-center whitespace-nowrap">
                      {{ $t('welcome.naturalClock.cta.tutorial') }}
                    </span>
                  </button>
                </div>
              </div>
              <div class="max-md:absolute max-md:-right-16 max-md:top-[75%] transition-all duration-500 md:order-1">
                <div class="rounded-full bg-gradient-to-tl from-nt-yellow-light/40 to-nt-yellow-light/20 md:from-nt-yellow-light/90 md:to-nt-yellow-light/80 p-5 
                  shadow-[0_0_0_1px_rgba(251,191,36,0.1),0_0_0_10px_rgba(251,191,36,0.08),0_0_0_20px_rgba(251,191,36,0.05),0_0_0_30px_rgba(251,191,36,0.03)]
                  hover:shadow-[0_0_0_1px_rgba(251,191,36,0.2),0_0_0_15px_rgba(251,191,36,0.15),0_0_0_30px_rgba(251,191,36,0.1),0_0_0_45px_rgba(251,191,36,0.05)]
                  hover:bg-gradient-to-tl transition-all duration-500 max-md:rotate-[5deg] hover:rotate-0">
                  <ClockSVG @click="goToTimePage" class="w-36 h-36 md:w-52 md:h-52 max-md:transform max-md:transition-all max-md:duration-500 max-md:hover:scale-105 cursor-pointer max-md:opacity-50 max-md:hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hero Section (White) -->
      <section class="w-full flex flex-col items-center justify-center px-4 py-4 sm:py-6 md:py-8 lg:pb-16 text-slate-800 dark:text-slate-100">
        <div class="sm:text-center text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto py-2 px-6 md:px-0 sm:pt-3 md:pt-4 sm:pb-8 md:pb-12" v-html="heroTextWithLinks"></div>
        <!-- Hidden links for JavaScript click handlers -->
        <button data-router-link-to-time @click="goToTimePage" class="hidden"></button>
        <button data-router-link-to-spiral @click="goToSpiralPage" class="hidden"></button>
      </section>

      <!-- 13 Moons Section (Cyan) -->
      <section class="max-w-[calc(100%-24px)] mx-auto sm:max-w-[480px] md:max-w-none md:mx-0 my-6 sm:my-8 md:my-0 rounded-2xl w-full md:px-6 md:mb-12 lg:mb-16 relative overflow-hidden transform transition-transform duration-500" ref="thirteenMoonsRef">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 bg-gradient-to-l via-nt-cyan-light/5 via-75% from-nt-cyan-light/10 to-transparent"></div>
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr via-nt-cyan-light/8 via-75% from-nt-cyan-light/15 to-transparent rounded-full blur-3xl transform translate-x-1/3"></div>
        </div>
        <div class="relative">
          <div class="max-w-5xl mx-auto px-2 md:px-0 py-8 md:pt-16 md:pb-12">
            <div class="flex flex-col md:flex-row items-center justify-start md:gap-6 lg:gap-12 relative">
              <div class="w-full md:w-2/3 lg:w-[55%] flex flex-col justify-center px-6 md:px-8 md:pl-18 lg:pl-28 pb-6 md:pb-0 z-10">
                <h2 class="text-3xl sm:text-4xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 font-title dark:text-nt-cyan-light/90">
                  {{ $t('welcome.thirteenMoons.title') }}
                  <sup class="text-xs sm:text-sm font-normal text-nt-cyan-light/70 dark:text-nt-cyan-light/70 ml-1">(beta)</sup>
                </h2>
                <p class="mb-4 sm:mb-6 text-black dark:text-slate-100 sm:text-base md:text-lg whitespace-pre-line">
                  {{ $t('welcome.thirteenMoons.description') }}
                </p>
                <div class="flex flex-col justify-center items-center mt-6 sm:mt-8 mb-4 gap-3 px-4">
                  <router-link :to="{ name: getLocalizedRouteName('13moons', locale) }" class="w-full md:w-3/4 lg:w-3/5 group bg-gradient-to-r from-nt-cyan-light/90 to-nt-cyan-light/80 text-black px-6 md:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-[4px_4px_0_0_rgba(6,182,212,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                    <span class="flex items-center justify-center gap-2 whitespace-nowrap">
                      {{ contextStore.isEmpty ? $t('welcome.thirteenMoons.cta.discover') : $t('welcome.thirteenMoons.cta.open') }}
                      <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </router-link>
                  <button @click="openSpiralTutorial" class="w-full md:w-3/4 lg:w-1/2 group text-black dark:text-white/80 px-4 py-4 text-sm font-medium transition-all duration-300 hover:text-nt-cyan-darker dark:hover:text-nt-cyan-light/90">
                    <span class="flex items-center justify-center whitespace-nowrap">
                      {{ $t('welcome.thirteenMoons.cta.tutorial') }}
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
                  <YearSVG @click="goToSpiralPage" class="w-36 h-28 md:w-52 md:h-40 max-md:transform max-md:transition-all max-md:duration-500 max-md:hover:scale-105 cursor-pointer max-md:opacity-50 max-md:hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Understanding Natural Time Section -->
    <section class="w-full bg-black bg-[url('@/assets/debut-dark.png')] py-16 sm:py-20 md:py-24 mt-4 sm:mt-16 md:mt-28 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"></div>
      <div class="relative">
        <h2 class="text-4xl sm:text-5xl md:text-5xl my-4 font-title text-center text-white">
          <span class="">{{ $t('welcome.understanding.title') }}</span>
          <br class="hidden md:block">
          <span class="text-xl sm:text-2xl md:text-2xl text-slate-100 block mt-2 sm:mt-3 uppercase font-bold font-mono">{{ $t('welcome.understanding.subtitle') }}</span>
        </h2>

        <!-- Mission Statement and Video in Two Columns -->
        <div class="max-w-6xl mx-auto px-6 my-12 sm:my-16">
          <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            <!-- Video Column (now first) -->
            <div class="w-full md:w-1/2">
              <div class="w-full rounded-2xl overflow-hidden shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-[1.02]">
                <YouTubePlayer videoId="XP8XYidlgKA" />
              </div>
            </div>
            
            <!-- Mission Statement Column (now second) -->
            <div class="w-full md:w-1/2 mt-8 md:mt-0">
              <p class="text-lg sm:text-xl md:text-xl lg:text-2xl text-slate-100 font-extralight leading-snug whitespace-pre-line text-center">
                {{ $t('welcome.understanding.mission') }}
              </p>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="py-12 sm:py-16 md:py-20">
          <div class="max-w-4xl mx-auto px-6">
            <FAQAccordion class="pb-8" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer (Black) -->
    <footer class="w-full bg-gradient-to-b from-black to-slate-900 text-white">
      <!-- Closing Statement -->
      <div class="py-12 sm:py-16 md:py-20">
        <p class="text-center text-base sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-6">
          <span class="font-normal text-white">{{ $t('welcome.footer.closing.line1') }}</span> <br class="hidden md:block">
          <span class="font-light text-slate-300">{{ $t('welcome.footer.closing.line2') }}</span> <br class="hidden md:block">
          <span class="font-normal text-white">{{ $t('welcome.footer.closing.line3') }}</span> <br class="hidden md:block">
          <span class="font-light text-slate-300">{{ $t('welcome.footer.closing.line4') }}</span> <br class="hidden md:block">
          <span class="font-normal text-white">{{ $t('welcome.footer.closing.line5') }}</span><br><br>
          <span class="text-4xl sm:text-5xl md:text-6xl block mt-6 sm:mt-8">🌞</span>
        </p>
      </div>
      
      <div class="text-center py-4 text-sm border-t border-white/10">
        <p>
          Created by <a href="https://biquette.xyz" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-300">{{ $t('welcome.footer.author') }}</a> | 
          <a href="https://github.com/sylvain441/natural-time" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-300">{{ $t('welcome.footer.github') }}</a>
          <span class="ml-2 text-gray-500">
            <button 
              @click="contextStore.clearLocalStorageAndReload"
              class="ml-1 hover:text-gray-300"
              :title="$t('welcome.footer.resetData')"
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
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { ref, computed } from 'vue';
import { useHead } from '@unhead/vue';
import { useContextStore } from '@/stores/contextStore'; // Import the context store
import { useConfigStore } from '@/stores/configStore'; // Import the config store
import { version } from '../../package.json';
import { useI18n } from 'vue-i18n';
import { getLocalizedRouteName } from '../i18n/config';
import ClockSVG from '@/assets/icon/clock.svg';
import YearSVG from '@/assets/icon/year.svg';

const router = useRouter();
const contextStore = useContextStore();
const configStore = useConfigStore();
const { t, locale } = useI18n();

const naturalClockRef = ref(null);
const thirteenMoonsRef = ref(null);
const faqRef = ref(null);

// Computed property for hero text with HTML links
const heroTextWithLinks = computed(() => {
  return t('welcome.hero.description', {
    clock: `<span class="font-medium underline decoration-3 md:decoration-5 decoration-nt-yellow-light cursor-pointer font-title" onclick="document.querySelector('[data-router-link-to-time]').click()">${t('welcome.hero.clockLink')}</span>`,
    spiral: `<span class="font-medium underline decoration-3 md:decoration-5 decoration-nt-cyan-light cursor-pointer font-title" onclick="document.querySelector('[data-router-link-to-spiral]').click()">${t('welcome.hero.spiralLink')}</span>`
  });
});

// Hidden router links for the hero section
const goToTimePage = () => router.push({ name: getLocalizedRouteName('time', locale.value) });
const goToSpiralPage = () => router.push({ name: getLocalizedRouteName('13moons', locale.value) });

// Functions to handle tutorial mode
const openClockTutorial = () => {
  configStore.clockTutorialMode = true;
  router.push({ name: getLocalizedRouteName('time', locale.value) });
};

const openSpiralTutorial = () => {
  configStore.spiralTutorialMode = true;
  router.push({ name: getLocalizedRouteName('13moons', locale.value) });
};

useHead({
  title: t('welcome.meta.title'),
  meta: [
    { name: 'description', content: t('welcome.meta.description') },
    { property: 'og:title', content: t('welcome.meta.title') },
    { property: 'og:description', content: t('welcome.meta.description') },
    { property: 'og:image', content: 'https://naturaltime.app/natural-time-social.jpg' },
    { property: 'og:url', content: 'https://naturaltime.app' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
});

</script>

<style scoped>

</style>