<template>
   <div class="fixed top-3 md:top-4 left-3 md:left-4 z-30 flex items-center">
     <router-link :to="{ name: getLocalizedRouteName('welcome', locale) }" 
         class="group p-2 rounded-full bg-white/30 hover:bg-white/50 focus:outline-none transition-all duration-300 hover:bg-slate-400 mr-2">
          <homeIcon class="w-6 h-6" fill="currentColor" />
          <span class="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {{ t('mainMenu.homeTooltip') }}
          </span>
      </router-link>
   </div>
</template>

<script setup>
  import homeIcon from '@/assets/icon/home-icon.svg';
  import { useI18n } from 'vue-i18n';
  import { getLocalizedRouteName } from '../i18n/config';
  
  const { t, locale } = useI18n();
</script>

<style lang="scss" scoped>

</style>