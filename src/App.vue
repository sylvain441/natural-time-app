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
	--color-0: 68, 68, 68;
	--color-1: 215, 77, 64;
	--color-2: 234, 169, 69;
	--color-3: 223, 221, 69;
	--color-4: 76, 175, 80;
	--color-5: 73, 162, 240;
	--color-6: 72, 52, 234;
	--color-7: 128, 71, 235;
}

@font-face {
	font-family: 'DM Serif Display';
	src: url('@/assets/fonts/DMSerifDisplay-Regular.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
	font-display: swap;
}


.color-1{ color: rgb(var(--color-1))!important; fill: rgb(var(--color-1))!important; background-color: rgb(var(--color-1))!important; }
.color-2{ color: rgb(var(--color-2))!important; fill: rgb(var(--color-2))!important; background-color: rgb(var(--color-2))!important; }
.color-3{ color: rgb(var(--color-3))!important; fill: rgb(var(--color-3))!important; background-color: rgb(var(--color-3))!important; }
.color-4{ color: rgb(var(--color-4))!important; fill: rgb(var(--color-4))!important; background-color: rgb(var(--color-4))!important; }
.color-5{ color: rgb(var(--color-5))!important; fill: rgb(var(--color-5))!important; background-color: rgb(var(--color-5))!important; }
.color-6{ color: rgb(var(--color-6))!important; fill: rgb(var(--color-6))!important; background-color: rgb(var(--color-6))!important; }
.color-7{ color: rgb(var(--color-7))!important; fill: rgb(var(--color-7))!important; background-color: rgb(var(--color-7))!important; }

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
  @apply relative font-mono font-bold px-4 mt-6 mb-0 pb-3 text-base text-slate-800 border-b-4;
}

svg {
	transform-origin: center;
}

svg line {
	transform-origin: center;
}

</style>