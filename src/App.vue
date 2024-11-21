<template>
	<div class="z-10 h-min-screen relative">
		<router-view v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component"></component>
			</transition>
		</router-view>
	</div>
</template>

<script setup>

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
  @apply relative font-mono font-bold px-4 mt-4 mb-0 pb-2 text-base text-slate-800 dark:text-gray-100 border-b-4;
}

svg {
	transform-origin: center;
}

svg line {
	transform-origin: center;
}

</style>