<template>
    <div class="flex flex-col items-center justify-center min-h-dvh bg-gray-100">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">{{ $t('notFound.title') }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ $t('notFound.message') }}</p>
      <button
        @click="goToMenu"
        class="px-6 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors duration-300"
      >
        {{ $t('notFound.button') }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { getLocalizedRouteName } from '../i18n/config';
  
  const router = useRouter();
  const { t, locale } = useI18n();
  
  const goToMenu = () => {
    // Use the current language to build the route name
    const localizedRouteName = getLocalizedRouteName('welcome', locale.value);
    router.push({ name: localizedRouteName });
  };
  </script>