<template>
	<div class="z-10 h-min-screen relative">
		<router-view v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component"></component>
			</transition>
		</router-view>
		
		<!-- Notification container -->
		<div id="notification-container"></div>
	</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { languageService } from './i18n/i18n';

const route = useRoute();
const { locale } = useI18n();

// During SSG, use language service to determine language from route path
if (import.meta.env.SSR) {
  // Use language service to determine language from route path
  const pathLang = languageService.determineAndSetLanguage({
    isSSR: true,
    pathname: route.path
  });
  
  // Set the i18n locale value (language service already does this, but we set locale.value for components using it)
  locale.value = pathLang;
}

let keydownHandler = null;

// In client, use language service to ensure URL-based language is set correctly

onMounted(() => {
  // Use language service to determine and set language based on URL
  const detectedLang = languageService.determineAndSetLanguage({
    pathname: window.location.pathname
  });
  
  // Update the locale reference for components using it
  locale.value = detectedLang;

  // Global keyboard shortcut (CMD/CTRL + K) once at app level
  keydownHandler = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      if (confirm('Es-tu sûr de vouloir effacer toutes les données enregistrées ?')) {
        localStorage?.clear();
        window.location.reload();
      }
    }
  };
  window.addEventListener('keydown', keydownHandler);
});

onUnmounted(() => {
  if (keydownHandler) window.removeEventListener('keydown', keydownHandler);
});
</script>

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
	--color-1: theme('colors.red.500');
	--color-2: theme('colors.orange.500');
	--color-3: theme('colors.yellow.500');
	--color-4: theme('colors.green.500');
	--color-5: theme('colors.sky.500');
	--color-6: theme('colors.indigo.500');
	--color-7: theme('colors.violet.500');
	--color-light-1: theme('colors.red.400');
	--color-light-2: theme('colors.orange.400');
	--color-light-3: theme('colors.yellow.400');
	--color-light-4: theme('colors.green.400');
	--color-light-5: theme('colors.sky.400');
	--color-light-6: theme('colors.indigo.400');
	--color-light-7: theme('colors.violet.400');
	--color-dark-1: theme('colors.red.900 / 75%');
	--color-dark-2: theme('colors.orange.900 / 75%');
	--color-dark-3: theme('colors.yellow.900 / 75%');
	--color-dark-4: theme('colors.green.900 / 75%');
	--color-dark-5: theme('colors.sky.900 / 75%');
	--color-dark-6: theme('colors.indigo.900 / 75%');
	--color-dark-7: theme('colors.violet.900 / 75%');
}

@font-face {
	font-family: 'DM Serif Display';
	src: url('@/assets/fonts/DMSerifDisplay-Regular.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
	font-display: swap;
}

.fade-enter-active, .fade-leave-active{
	transition: .8s;
}
.fade-enter-from, .fade-leave-to{
	opacity: 0;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
	transition: opacity 0.5s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
	opacity: 0;
}

.bg-texture{
	background-color: #fff;
	background-image: url('@/assets/debut-light.png');
	background-repeat: repeat;
}

.bg-texture-dark{
	background-color: #000;
	background-image: url('@/assets/debut-dark.png');
	background-repeat: repeat;
}

.section-header {
  @apply relative font-mono font-bold px-4 mt-4 mb-0 pb-2 text-base text-gray-100 border-b-4;
}

svg {
	transform-origin: center;
}

svg line {
	transform-origin: center;
}

</style>