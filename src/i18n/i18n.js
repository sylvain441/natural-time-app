import { createI18n } from "vue-i18n";
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from './config';
import { watch } from 'vue';

// Import JSON files
import fr from './lang/fr.json';
import en from './lang/en.json';

// Function to detect browser language and check if it's supported
function detectBrowserLanguage() {
  // Get browser language (e.g., 'en-US' -> 'en')
  const browserLang = navigator.language.split('-')[0];
  
  // Check if browser language is supported
  if (AVAILABLE_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }
  
  // Fall back to default language
  return DEFAULT_LANGUAGE;
}

// Check if there's a saved language preference in localStorage
function getSavedLanguage() {
  if (typeof localStorage !== 'undefined') {
    const savedLang = localStorage.getItem('user-language');
    if (savedLang && AVAILABLE_LANGUAGES.includes(savedLang)) {
      return savedLang;
    }
  }
  return null;
}

// Use saved language if available, otherwise use browser language in client-side, default in SSR
const locale = typeof navigator !== 'undefined' 
  ? (getSavedLanguage() || detectBrowserLanguage()) 
  : DEFAULT_LANGUAGE;

const i18n = createI18n({
    locale,
    fallbackLocale: DEFAULT_LANGUAGE,
    missingWarn: false,
    fallbackWarn: false,
    messages: {
        fr,
        en
    },
    legacy: false,
})

// We'll set up the watcher after the app is mounted in the main.js file
// since we need access to the app instance

export default i18n;