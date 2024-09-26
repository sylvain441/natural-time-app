<template>
	<MetaTags />
	<div class="z-10 h-min-screen relative">
		<router-view v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component"></component>
			</transition>
		</router-view>
	</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import MetaTags from '@/components/MetaTags.vue';

const route = useRoute();

</script>

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
	--color-0: #444;
	--color-1: #d74d40;
	--color-2: #eaa945;
	--color-3: #dfdd45;
	--color-4: #7fc663;
	--color-5: #49a2f0;
	--color-6: #443cea;
	--color-7: #8047eb;

	--yearloop-bg-color: #FFF;
	--yearloop-radius: 6px
}

@font-face {
	font-family: 'DM Serif Display';
	src: url('@/assets/fonts/DMSerifDisplay-Regular.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
	font-display: swap;
}


.color-1{ color: var(--color-1)!important; fill: var(--color-1)!important; background-color: var(--color-1)!important; }
.color-2{ color: var(--color-2)!important; fill: var(--color-2)!important; background-color: var(--color-2)!important; }
.color-3{ color: var(--color-3)!important; fill: var(--color-3)!important; background-color: var(--color-3)!important; }
.color-4{ color: var(--color-4)!important; fill: var(--color-4)!important; background-color: var(--color-4)!important; }
.color-5{ color: var(--color-5)!important; fill: var(--color-5)!important; background-color: var(--color-5)!important; }
.color-6{ color: var(--color-6)!important; fill: var(--color-6)!important; background-color: var(--color-6)!important; }
.color-7{ color: var(--color-7)!important; fill: var(--color-7)!important; background-color: var(--color-7)!important; }

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
	background-image: url('@/assets/debut-light.png');
	background-repeat: repeat;
}

.section-header {
  @apply relative font-mono font-bold px-4 mt-4 mb-0 pb-1 text-base text-slate-800 border-b-4;
}

svg {
	transform-origin: center;
}

svg line {
	transform-origin: center;
}

</style>