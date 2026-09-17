<template>
  <div class="home-page min-h-dvh bg-gray-50 dark:bg-[rgb(24,35,55)] bg-[url('@/assets/debut-light.png')] dark:bg-[url('@/assets/debut-dark.png')]">

    <PebbleAnnouncement />

    <div class="home-switcher">
      <LanguageSwitcher />
    </div>

    <NaturalClockHero />

    <ClockIntroduction />

    <SpiralHero />

    <SpiralIntroduction />

    <ProjectStatement />

    <FAQAccordion />

    <footer class="w-full text-white bg-[linear-gradient(180deg,#000_0%,#000_55%,#05080F_100%)]">

      <div class="py-12 sm:py-16 md:py-20 max-w-7xl xl:max-w-screen-2xl mx-auto">
        <p class="font-title text-center text-base sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-6">
          <span class="text-white">{{ $t('welcome.footer.closing.line1') }}</span> <br class="hidden md:block">
          <span class="text-slate-400">{{ $t('welcome.footer.closing.line2') }}</span> <br class="hidden md:block">
          <span class="text-white">{{ $t('welcome.footer.closing.line3') }}</span> <br class="hidden md:block">
          <span class="text-slate-400">{{ $t('welcome.footer.closing.line4') }}</span> <br class="hidden md:block">
          <span class="text-white">{{ $t('welcome.footer.closing.line5') }}</span><br><br>
          <span class="text-4xl sm:text-5xl md:text-6xl block mt-6 sm:mt-8">🌞</span>
        </p>
      </div>

      <div class="text-center py-4 text-sm border-t border-white/10">
        <p>
          <i18n-t keypath="welcome.footer.credits" tag="span" scope="global">
            <template #author>
              <a href="https://biquette.xyz" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-300">{{ $t('welcome.footer.author') }}</a>
            </template>
          </i18n-t> |
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
import FAQAccordion from '@/components/FAQAccordion.vue';
import PebbleAnnouncement from '@/components/PebbleAnnouncement.vue';
import ClockIntroduction from '@/components/ClockIntroduction.vue';
import SpiralIntroduction from '@/components/SpiralIntroduction.vue';
import ProjectStatement from '@/components/ProjectStatement.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import NaturalClockHero from '@/components/NaturalClockHero.vue';
import SpiralHero from '@/components/SpiralHero.vue';
import { useHead } from '@unhead/vue';
import { useContextStore } from '@/stores/contextStore';
import { version } from '../../package.json';
import { useI18n } from 'vue-i18n';

const contextStore = useContextStore();
const { t } = useI18n();

useHead({
  title: t('welcome.meta.title'),
  meta: [
    { name: 'description', content: t('welcome.meta.description') },
    { property: 'og:title', content: t('welcome.meta.title') },
    { property: 'og:description', content: t('welcome.meta.description') },
    { property: 'og:image', content: t('welcome.meta.ogImage') },
    { property: 'og:url', content: t('welcome.meta.ogUrl') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
});
</script>

<style scoped>

.home-switcher {
  position: fixed;
  z-index: 50;
  right: 1rem;
  top: 1rem;
  transition: top .4s cubic-bezier(.32, .72, .3, 1);
}
.home-page:has(.announcement__bar.is-in) .home-switcher { top: 4rem; }

@media (min-width: 768px) {
  .home-switcher { right: 1.5rem; top: 1.5rem; }
  .home-page:has(.announcement__bar.is-in) .home-switcher { top: 4rem; }
}

@media (prefers-reduced-motion: reduce) {
  .home-switcher { transition: none; }
}
</style>
