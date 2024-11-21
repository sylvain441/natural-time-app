<template>
   <a href="/" 
       class="group fixed top-3 md:top-4 left-3 md:left-4 z-30 p-2 rounded-full bg-white/30 hover:bg-white/50 focus:outline-none transition-all duration-300 hover:bg-slate-400">
        <homeIcon class="w-6 h-6" fill="currentColor" />
        <span class="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Accueil naturaltime.app
        </span>
    </a>
</template>

<script setup>
  import homeIcon from '@/assets/icon/home-icon.svg';
</script>

<style lang="scss" scoped>

</style>