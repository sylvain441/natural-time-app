<template>
  <div class="language-switcher">
    <div class="relative">
      <button 
        @click="toggleDropdown" 
        class="dropdown-toggle p-1 sm:p-2 rounded-md flex items-center bg-white/40 hover:bg-white/50 dark:bg-slate-700/60 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white"
      >
        <span class="text-xs sm:text-sm font-medium uppercase">{{ currentLocale }}</span>
        <span class="ml-0.5 sm:ml-1 text-[10px] sm:text-xs opacity-70">▼</span>
      </button>
      
      <div 
        v-if="isOpen" 
        class="dropdown-menu absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden z-50 border border-gray-200 dark:border-slate-600"
      >
        <button 
          v-for="lang in availableLocales" 
          :key="lang" 
          @click="changeLanguage(lang)"
          class="lang-option w-full p-1.5 sm:p-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white"
          :class="{ 'bg-gray-100 dark:bg-slate-700': currentLocale === lang }"
          :title="getLanguageTitle(lang)"
        >
          <span class="text-base sm:text-lg mr-1.5 sm:mr-2">{{ getLanguageFlag(lang) }}</span>
          <span class="text-xs sm:text-sm">{{ getLanguageTitle(lang) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { getLocalizedRouteName } from '../i18n/config';
import { languageService } from '../i18n/i18n';

const router = useRouter();
const { locale, t } = useI18n();

// Use language service for current locale and available locales
const currentLocale = computed(() => languageService.getCurrentLanguage());
const availableLocales = computed(() => languageService.AVAILABLE_LANGUAGES);
const isOpen = ref(false);

// Get the full language title for the title attribute
const getLanguageTitle = (lang) => {
  const titles = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    'es-419': 'Español (LatAm)',
    pt: 'Português',
    'pt-BR': 'Português (Brasil)',
      de: 'Deutsch',
      it: 'Italiano',
      ru: 'Русский',
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
    'es-419': '🇲🇽🇦🇷',
    pt: '🇵🇹',
    'pt-BR': '🇧🇷',
      de: '🇩🇪',
      it: '🇮🇹',
      ru: '🇷🇺',
    // Add other languages here
  };
  return flags[lang] || lang.toUpperCase();
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (event) => {
  // Close dropdown when clicking outside
  if (isOpen.value && !event.target.closest('.language-switcher')) {
    isOpen.value = false;
  }
};

const changeLanguage = (lang) => {
  // Do nothing if it's already the current language
  if (lang === currentLocale.value) return;
  
  // Change the language using language service
  languageService.setLanguage(lang);
  
  // Update the locale reference for components using it
  locale.value = lang;
  
  // Close the dropdown
  isOpen.value = false;
  
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

// Add event listener to close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.language-switcher {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
  min-width: 120px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1);
}

.lang-option {
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.lang-option:last-child {
  border-bottom: none;
}

/* Dark mode specific styles are handled with Tailwind classes */
:global(.dark) .dropdown-toggle {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

:global(.dark) .dropdown-menu {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
}

:global(.dark) .lang-option {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}
</style> 