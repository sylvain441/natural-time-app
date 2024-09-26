import { createI18n } from "vue-i18n";

const translations = {
    'en': {
        
    },
    'fr': {

    }
}
  
const i18n = createI18n({
    locale: navigator.language || navigator.userLanguage,
    fallbackLocale: 'fr',
    missingWarn: false,
    fallbackWarn: false,
    messages: translations,
    legacy: false,
})

export default i18n;