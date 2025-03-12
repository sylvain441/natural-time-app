import { createI18n } from "vue-i18n";
import fr from './lang/fr.js';
import en from './lang/en.js';

const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    missingWarn: false,
    fallbackWarn: false,
    messages: {
        fr,
        en
    },
    legacy: false,
})

export default i18n;