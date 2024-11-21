import { createI18n } from "vue-i18n";

const fr = {
    
};
  
const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    missingWarn: false,
    fallbackWarn: false,
    messages: fr,
    legacy: false,
})

export default i18n;