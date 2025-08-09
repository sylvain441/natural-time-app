<template>
  <div class="language-switcher">
    <div class="relative">
      <button v-if="renderTrigger"
        @click="toggleDropdown"
        class="p-1 sm:p-2 flex items-center text-slate-800 dark:text-white"
        aria-haspopup="dialog"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-label="Change language"
      >
        <span class="text-xl sm:text-2xl leading-none">{{ getLanguageFlag(currentLocale) }}</span>
        <span class="ml-1 sm:ml-1.5 text-[10px] sm:text-xs opacity-70">▼</span>
      </button>

      <!-- Fullscreen overlay -->
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100]
               bg-gradient-to-br from-white/85 via-white/60 to-white/30
               dark:from-slate-950/85 dark:via-slate-900/70 dark:to-slate-800/60
               backdrop-blur-lg flex items-start sm:items-center justify-center pt-8 pb-4 px-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'lang-picker-title'"
        @keydown.esc.prevent.stop="closeDropdown"
        @click.self="closeDropdown"
        tabindex="-1"
        ref="overlayRef"
      >
        <!-- Close button (X) in top right corner -->
        <button
          @click="closeDropdown"
          class="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 p-2
                 text-slate-900 dark:text-slate-100
                 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200
                 focus:outline-none"
          aria-label="Close language picker"
        >
          <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Floating selectors only -->
        <div class="w-full max-w-md sm:max-w-4xl mx-auto px-6">
          <!-- Title only -->
          <h2 id="lang-picker-title" class="text-center text-base sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
            {{ t('common.selectLanguage') || 'Select language' }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-1.5 sm:gap-6 place-items-stretch sm:place-items-center">
            <button
              v-for="lang in availableLocales"
              :key="lang"
              @click="changeLanguage(lang)"
              :title="getLanguageTitle(lang)"
              :aria-current="currentLocale === lang ? 'true' : undefined"
              class="group flex items-center sm:flex-col sm:items-center px-2 py-2 sm:p-0 rounded-xl focus:outline-none transition"
            >
              <span class="text-4xl sm:text-6xl drop-shadow-sm select-none">{{ getLanguageFlag(lang) }}</span>
              <span
                class="ml-3 sm:ml-0 sm:mt-2 text-sm sm:text-xs text-left sm:text-center leading-snug"
                :class="getLabelClass(lang)"
              >
                <span :class="currentLocale === lang ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : 'text-slate-900 dark:text-slate-100'">
                  {{ getLanguageTitle(lang) }}
                </span>
              </span>
              <span v-if="currentLocale === lang" class="hidden sm:block h-0.5 w-6 bg-cyan-500 rounded-full mt-1"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useScrollLock } from '@vueuse/core';
import { getLocalizedRouteName } from '../i18n/config';
import { languageService } from '../i18n/i18n';

const router = useRouter();
const { locale, t } = useI18n();

const { renderTrigger = true, listenForOpenEvent = true } = defineProps({
  renderTrigger: { type: Boolean, default: true },
  listenForOpenEvent: { type: Boolean, default: true }
});

// Use language service for current locale and available locales
const currentLocale = computed(() => languageService.getCurrentLanguage());
const availableLocales = computed(() => languageService.AVAILABLE_LANGUAGES);
const isOpen = ref(false);
const overlayRef = ref(null);
const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null);

// Get the full language title for the title attribute
const getLanguageTitle = (lang) => {
  const titles = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    'es-419': 'Español (Latinoamérica)',
    pt: 'Português',
    'pt-BR': 'Português (Brasil)',
    de: 'Deutsch',
    it: 'Italiano',
    ru: 'Русский',
    el: 'Ελληνικά',
    zh: '中文（简体）',
    ja: '日本語',
    // Add other languages here
  };
  return titles[lang] || lang;
};

// Get the emoji flag for each language
const getLanguageFlag = (lang) => {
  const flags = {
    fr: '🇫🇷',
    en: '🇬🇧',
    es: '🇪🇸',
    'es-419': '🌎',
    pt: '🇵🇹',
    'pt-BR': '🇧🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    ru: '🇷🇺',
    el: '🇬🇷',
    zh: '🇨🇳',
    ja: '🇯🇵',
    // Add other languages here
  };
  return flags[lang] || lang.toUpperCase();
};

// Prevent label wrapping to two lines for specific long labels
const getLabelClass = (lang) => {
  if (lang === 'es-419') {
    return 'whitespace-nowrap';
  }
  return '';
};

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    overlayRef.value?.focus?.();
    isLocked && (isLocked.value = true);
  }
};

const openOverlay = async () => {
  if (!isOpen.value) {
    isOpen.value = true;
    await nextTick();
    overlayRef.value?.focus?.();
    isLocked && (isLocked.value = true);
  }
};

const closeDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false;
    isLocked && (isLocked.value = false);
  }
};

const changeLanguage = (lang) => {
  // Close the overlay first
  closeDropdown();
  
  // If it's already the current language, just close and return
  if (lang === currentLocale.value) return;
  
  // Only handle language change if this is the main trigger (has renderTrigger=true) or global listener (renderTrigger=false && listenForOpenEvent=true)
  if (!renderTrigger && !listenForOpenEvent) return;
  
  // Change the language using language service
  languageService.setLanguage(lang);
  
  // Update the locale reference for components using it
  locale.value = lang;
  
  // Redirect to the equivalent URL in the new language
  const currentRoute = router.currentRoute.value;
  const routeName = currentRoute.name;
  
  if (routeName) {
    // Extract the base route name (without language suffix)
    const baseRouteName = routeName.split('-')[0];
    
    // Build the new route name
    const newRouteName = getLocalizedRouteName(baseRouteName, lang);
    
    // Redirect to the new route
    router.push({ name: newRouteName });
  }
};

// Close on Escape key globally
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  if (listenForOpenEvent) {
    window.addEventListener('open-language-picker', openOverlay);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  if (listenForOpenEvent) {
    window.removeEventListener('open-language-picker', openOverlay);
  }
});
</script>

<style scoped>
.language-switcher {
  position: relative;
}
</style>