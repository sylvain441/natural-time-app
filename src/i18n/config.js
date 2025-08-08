/**
 * Configuration of languages supported by the application
 */

// List of available languages
export const AVAILABLE_LANGUAGES = ['fr', 'en', 'es'];

// Default language
export const DEFAULT_LANGUAGE = 'fr';

// URL path configuration by language
export const ROUTE_PATHS = {
  // Paths for the clock page
  time: {
    fr: 'horloge-temps-naturel',
    en: 'natural-time-clock',
    es: 'reloj-tiempo-natural',
    // Add other languages here
  },
  // Paths for the spiral page
  '13moons': {
    fr: 'spirale-13-lunes',
    en: '13-moons-spiral',
    es: 'espiral-13-lunas',
    // Add other languages here
  },
  // Add other pages here if needed
};

/**
 * Gets the URL path for a given route in a specific language
 * @param {string} routeName - Base route name (without language suffix)
 * @param {string} lang - Language code
 * @returns {string} - Translated URL path
 */
export function getLocalizedPath(routeName, lang) {
  if (ROUTE_PATHS[routeName] && ROUTE_PATHS[routeName][lang]) {
    return ROUTE_PATHS[routeName][lang];
  }
  
  // Fallback to English path or route name if no translation is available
  return ROUTE_PATHS[routeName]?.en || routeName;
}

/**
 * Gets the localized route name
 * @param {string} baseRouteName - Base route name (without language suffix)
 * @param {string} lang - Language code
 * @returns {string} - Localized route name
 */
export function getLocalizedRouteName(baseRouteName, lang) {
  return `${baseRouteName}-${lang}`;
} 