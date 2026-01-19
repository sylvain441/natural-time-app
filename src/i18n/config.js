/**
 * Configuration of languages supported by the application
 */

// List of available languages
export const AVAILABLE_LANGUAGES = [
  'fr', 'en', 'es', 'es-419', 'pt', 'pt-BR', 'de', 'it', 'ru', 'el', 'zh', 'ja',
  // New languages (2025)
  'sq', // Albanian
  'pl', // Polish
  'nl', // Dutch
  'tr', // Turkish
  'ko', // Korean
  'id', // Indonesian
  'vi', // Vietnamese
  'sv', // Swedish
  'fi', // Finnish
  'no', // Norwegian
  'da', // Danish
  'is', // Icelandic
  'hi', // Hindi
  'th', // Thai
];

// Default language
export const DEFAULT_LANGUAGE = 'en';

// URL path configuration by language
export const ROUTE_PATHS = {
  // Paths for the clock page
  time: {
    fr: 'horloge-temps-naturel',
    en: 'natural-time-clock',
    es: 'reloj-tiempo-natural',
    'es-419': 'reloj-tiempo-natural',
    pt: 'relogio-tempo-natural',
    'pt-BR': 'relogio-tempo-natural',
    de: 'uhr-natuerliche-zeit',
    it: 'orologio-tempo-naturale',
    ru: 'chasy-estestvennogo-vremeni',
    el: 'roloi-fysikou-chronou',
    zh: 'ziran-shijian-shizhong',
    ja: 'shizen-jikan-no-tokei',
    // New languages (2025)
    sq: 'ora-e-kohes-natyrale',
    pl: 'zegar-czasu-naturalnego',
    nl: 'natuurlijke-tijd-klok',
    tr: 'dogal-zaman-saati',
    ko: 'jayeon-sigan-sigye',
    id: 'jam-waktu-alami',
    vi: 'dong-ho-thoi-gian-tu-nhien',
    sv: 'naturlig-tid-klocka',
    fi: 'luonnollinen-aika-kello',
    no: 'naturlig-tid-klokke',
    da: 'naturlig-tid-ur',
    is: 'natturulegt-tima-klukka',
    hi: 'prakritik-samay-ghadi',
    th: 'nalika-wela-thammachat',
  },
  // Paths for the spiral page
  '13moons': {
    fr: 'spirale-13-lunes',
    en: '13-moons-spiral',
    es: 'espiral-13-lunas',
    'es-419': 'espiral-13-lunas',
    pt: 'espiral-13-luas',
    'pt-BR': 'espiral-13-luas',
    de: 'spirale-13-monde',
    it: 'spirale-13-lune',
    ru: 'spiral-13-lun',
    el: 'speira-13-selinon',
    zh: '13-yue-luoxuan',
    ja: '13-tsuki-no-supairaru',
    // New languages (2025)
    sq: 'spirale-13-hena',
    pl: 'spirala-13-ksiezycow',
    nl: '13-manen-spiraal',
    tr: '13-ay-spirali',
    ko: '13-dal-napaseon',
    id: 'spiral-13-bulan',
    vi: 'xoan-oc-13-trang',
    sv: '13-manar-spiral',
    fi: '13-kuun-spiraali',
    no: '13-maner-spiral',
    da: '13-mane-spiral',
    is: '13-tungla-spírall',
    hi: '13-chandrama-spiral',
    th: 'kankong-13-duean',
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