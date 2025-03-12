import { createI18n } from "vue-i18n";
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from './config';

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

// Use browser language in client-side, default in SSR
const locale = typeof navigator !== 'undefined' ? detectBrowserLanguage() : DEFAULT_LANGUAGE;

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

export default i18n;