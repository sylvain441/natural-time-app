import { createI18n } from "vue-i18n";
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from './config';
import { watch } from 'vue';

// Import JSON files
import fr from './lang/fr.json';
import en from './lang/en.json';
import es from './lang/es.json';
import es419 from './lang/es-419.json';
import pt from './lang/pt.json';
import ptBR from './lang/pt-BR.json';

// Language detection and management methods
// -------------------------------------

/**
 * Detects the browser language and checks if it's supported
 * @returns {string} The detected language code or the default language
 */
function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
  
  // Get browser language (e.g., 'en-US' -> 'en')
  const browserLang = navigator.language.split('-')[0];
  
  // Check if browser language is supported
  if (AVAILABLE_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }
  
  // Fall back to default language
  return DEFAULT_LANGUAGE;
}

/**
 * Retrieves the saved language preference from localStorage
 * @returns {string|null} The saved language or null if not found
 */
function getSavedLanguage() {
  if (typeof localStorage === 'undefined') return null;
  
  const savedLang = localStorage.getItem('user-language');
  if (savedLang && AVAILABLE_LANGUAGES.includes(savedLang)) {
    return savedLang;
  }
  return null;
}

/**
 * Extracts language from the current URL path
 * @param {string} pathname - Optional pathname to check (defaults to window.location.pathname)
 * @returns {string|null} The language code from URL or null if not found
 */
function getLanguageFromURL(pathname) {
  // Use provided pathname or get from window if available
  const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  
  // Check if pathname starts with a language code (e.g., /fr/ or /en/)
  for (const lang of AVAILABLE_LANGUAGES) {
    if (path.startsWith(`/${lang}/`)) {
      return lang;
    }
  }
  return null;
}

/**
 * Saves the language preference to localStorage
 * @param {string} lang - The language code to save
 */
function saveLanguagePreference(lang) {
  if (typeof localStorage !== 'undefined' && lang) {
    localStorage.setItem('user-language', lang);
  }
}

/**
 * Sets the HTML lang attribute for SEO
 * @param {string} lang - The language code to set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

// Language determination with proper priorities
// -------------------------------------

/**
 * Determines the language based on the environment and available information
 * @param {object} options - Options for language determination
 * @param {boolean} options.isSSR - Whether we're in SSR mode
 * @param {string} options.pathname - Optional pathname to use for URL-based detection
 * @returns {string} The determined language code
 */
function determineLanguage(options = {}) {
  const { isSSR = false, pathname = null } = options;
  
  let detectedLang;
  
  // SSR/SSG mode prioritizes URL-based language
  if (isSSR) {
    detectedLang = getLanguageFromURL(pathname);
    return detectedLang || DEFAULT_LANGUAGE;
  }
  
  // Client-side prioritization:
  // 1. URL path (for SEO and direct navigation)
  // 2. Saved preference (for returning users)
  // 3. Browser preference (for first-time users)
  // 4. Default fallback
  detectedLang = getLanguageFromURL(pathname) || getSavedLanguage() || detectBrowserLanguage();
  
  return detectedLang;
}

// Create i18n instance with initial language
// -------------------------------------

// Initial language determination based on environment
const initialLocale = import.meta.env.SSR 
  ? DEFAULT_LANGUAGE  // For SSR, we'll set this later based on route
  : determineLanguage({ isSSR: false });

// Create and configure the i18n instance
const i18n = createI18n({
  locale: initialLocale,
  fallbackLocale: DEFAULT_LANGUAGE,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    fr,
    en,
    es,
    'es-419': es419,
    pt,
    'pt-BR': ptBR
  },
  legacy: false,
  allowComposition: true
});

// Export language service methods
// -------------------------------------

export const languageService = {
  /**
   * Sets the active language
   * @param {string} lang - The language code to set
   * @param {boolean} persistPreference - Whether to save to localStorage
   */
  setLanguage(lang, persistPreference = true) {
    if (!AVAILABLE_LANGUAGES.includes(lang)) {
      console.warn(`Language ${lang} is not supported`);
      return;
    }
    
    if (i18n.global.locale.value !== lang) {
      i18n.global.locale.value = lang;
      
      // Save preference if requested
      if (persistPreference) {
        saveLanguagePreference(lang);
      }
      
      // Update HTML lang attribute
      setHtmlLangAttribute(lang);
    }
  },
  
  /**
   * Gets the current active language
   * @returns {string} The current language code
   */
  getCurrentLanguage() {
    return i18n.global.locale.value || DEFAULT_LANGUAGE;
  },
  
  /**
   * Determines and sets the language based on the current context
   * @param {object} options - Options for language determination
   * @param {boolean} options.isSSR - Whether we're in SSR mode
   * @param {string} options.pathname - Optional pathname for URL detection
   * @returns {string} The determined language code
   */
  determineAndSetLanguage(options = {}) {
    const lang = determineLanguage(options);
    this.setLanguage(lang, !options.isSSR); // Don't persist during SSR
    return lang;
  },
  
  /**
   * Gets language from URL path
   * @param {string} pathname - The URL path to check
   * @returns {string|null} The detected language or null
   */
  getLanguageFromURL,
  
  /**
   * Available languages
   */
  AVAILABLE_LANGUAGES,
  
  /**
   * Default language
   */
  DEFAULT_LANGUAGE
};

export default i18n;