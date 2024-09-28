import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

export function useFaq() {
    const { locale } = useI18n();
    const faqContent = ref({});

    watchEffect(async () => {
        try {
            const module = await import(`@/i18n/faq/${locale.value}.md`);
            faqContent.value = module.html;
        } catch (error) {
            console.warn(`FAQ for locale ${locale.value} not found, falling back to English`, error);
            const fallbackModule = await import('./faq/en.md');
            faqContent.value = fallbackModule.html;
        }
    });

    return faqContent;
}