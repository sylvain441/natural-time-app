<template>
<!-- This component doesn't render anything -->
</template>

<script setup>
    import { watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';

    const props = defineProps({
        title: String,
        description: String,
        image: String,
    });

    const route = useRoute();
    const { t, locale } = useI18n();

    const updateMetaTags = () => {
        document.title = props.title || t('meta.defaultTitle');
        document.querySelector('meta[name="description"]').setAttribute('content', props.description || t('meta.defaultDescription'));

        // Open Graph
        document.querySelector('meta[property="og:title"]').setAttribute('content', props.title || t('meta.defaultTitle'));
        document.querySelector('meta[property="og:description"]').setAttribute('content', props.description || t('meta.defaultDescription'));
        document.querySelector('meta[property="og:image"]').setAttribute('content', props.image || t('meta.defaultImage'));
        document.querySelector('meta[property="og:url"]').setAttribute('content', `https://naturaltime.app${route.path}`);
        document.querySelector('meta[property="og:locale"]').setAttribute('content', locale.value);

        // Twitter Card
        //document.querySelector('meta[name="twitter:title"]').setAttribute('content', props.title || t('meta.defaultTitle'));
        //document.querySelector('meta[name="twitter:description"]').setAttribute('content', props.description || t('meta.defaultDescription'));
        //document.querySelector('meta[name="twitter:image"]').setAttribute('content', props.image || t('meta.defaultImage'));
    };

    watch(() => [props.title, props.description, props.image, route.path, locale.value], updateMetaTags, { immediate: true });
</script>