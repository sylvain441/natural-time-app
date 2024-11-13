<template>
	<div class="clock-wrapper flex items-center justify-center" ref="clockWrapper">
		<div class="clock-box relative" :style="clockBoxStyle">
			
			<!-- DAY / NIGHT -->
			<div class="clock-day-night nt-box-outer rotate-180">
				<Transition name="fade">
				<div v-if="clockSkin.dayNightBlurDisplay" class="nt-box-outer blur-2xl" :class="clockSkin.dayNightBlur">
					<svg class="w-full h-full" viewBox="0 0 800 800">
						<path :d="dayPeriodPath(context.sun.sunrise, context.sun.sunset)" fill="#AFE0FF" />
						<path :d="dayPeriodPath(context.sun.sunset, context.sun.sunrise)" fill="#1C1241" style="opacity: 0.5" />
					</svg>
				</div>
				</Transition>
				<Transition name="scale-with-delay">
				<div v-if="clockSkin.dayNightRingDisplay" class="nt-box-outer" :class="clockSkin.dayNightRing">
					<svg class="w-full h-full" viewBox="0 0 800 800">
						<path :d="dayPeriodPath(0.001, 359.999)" fill="currentColor" class="text-slate-800" /> 
						<path :d="dayPeriodPath(Math.max(context.sun.sunrise, 0.001), Math.min(context.sun.sunset, 359.999))" fill="currentColor" class="text-nt-cyan-dark" />  
						<path v-if="context.sun.sunrise % 180 != 0" :d="dayPeriodPath(context.sun.sunrise - 3, context.sun.sunrise + 3)" fill="currentColor" class="text-nt-yellow-light" />  
						<path v-if="context.sun.sunrise % 180 != 0"  :d="dayPeriodPath(context.sun.sunset - 3, context.sun.sunset + 3)" fill="currentColor" class="text-nt-yellow-light" /> 
					</svg>
				</div>
				</Transition>
			</div>

			<!-- SUN -->
			<Transition name="scale-with-delay">
				<div v-if="clockSkin.sunDisplay" class="clock-sun nt-box-outer">
					<div class="nt-box-outer rotate-180">
						<div class="nt-box-outer text-center nt-animate" :style="{transform: `scale(${context.sun.altitude*0.50 + 100}%) rotate(${context.naturalDate.time * context.hemisphere}deg)`}">
							<div class="inline-block" style="width: 72px; height: 72px;">
								<div class="w-full h-full rounded-full bg-nt-yellow-dark" style="box-shadow: 0 0 40px 0 rgba(255, 205, 0, var(--day-progression)); filter: blur(calc(var(--day-progression) * 5px));"></div>
							</div>
						</div>
					</div>
				</div>
			</Transition>

			<!-- MOON -->
			<Transition name="fade">
				<div v-if="clockSkin.moonDisplay" class="clock-moon nt-box-outer rotate-180">
					<div class="nt-box-outer flex justify-center nt-animate" :style="{transform: `scale(${context.moon.altitude*0.50 + 100}%) rotate(${(context.naturalDate.time - context.moon.phase) * context.hemisphere}deg)`}"> 
						<div style="width: 72px; height: 72px; box-shadow: 0 0 15px 0 rgba(0, 80, 0, 0.15), 0 0 60px rgba(255, 255, 255, 1);" class="relative rounded-full overflow-hidden flex align-center">
							<!-- LIGHT SIDE-->
							<div class="w-1/2 h-full bg-slate-100" :class="{ 'order-1': context.moon.phase < 180 }"></div>
							<!-- DARK SIDE -->
							<div class="w-1/2 h-full bg-slate-800"></div>
							<!-- 3D FLIPPER-->
							<div class="moon-divider bg-slate-800 after:bg-slate-100"
								:style="{transform: `rotate3d(0, 1, 0, ${context.moon.phase}deg)`}"></div>
						</div>
					</div>
				</div>
			</Transition>

			<!-- HAND NTZ-->
			<Transition name="fade">
				<div v-if="clockSkin.ntzDisplay" class="clock-hand-ntz nt-box-outer rotate-180" :class="clockSkin.ntzHand">
					<div class="nt-box-outer nt-animate" :style="{ transform: `rotate(${(context.naturalDate.time - context.naturalDate.longitude) * context.hemisphere}deg) scaleX(${context.hemisphere})`}">
						<HandNtzSVG fill="currentColor"/>
					</div>
				</div>
			</Transition>

			<!-- DIAL -->
			<Transition name="fade">
				<div v-if="clockSkin.dialDisplay" class="nt-box-outer">
					<div class="nt-box-inner rounded-full" :class="clockSkin.dial"></div>
				</div>
			</Transition>

			<!-- MUSTACHES -->
			<Transition name="fade">
				<div v-if="clockSkin.mustachesDisplay">
					<div v-if="clockSkin.mustachesDisplay" class="clock-mustache-equinox nt-box-outer rotate-180" :class="clockSkin.mustachesEquinox">
						<div class="nt-box-inner nt-animate">
							<MustacheEquinoxSVG fill="currentColor" />
						</div>
					</div>
					<div v-if="clockSkin.mustachesDisplay" class="clock-mustache-winter-sunrise nt-box-outer rotate-180" :class="clockSkin.mustachesWinterSunrise">
						<div class="nt-box-inner nt-animate" :style="{transform: `rotate(${90 + context.mustaches.averageMustacheAngle}deg)`}">
							<MustacheSVG fill="currentColor" />
						</div>
					</div>
					<div v-if="clockSkin.mustachesDisplay" class="clock-mustache-summer-sunrise nt-box-outer rotate-180" :class="clockSkin.mustachesSummerSunrise">
						<div class="nt-box-inner nt-animate" :style="{transform: `rotate(${90 - context.mustaches.averageMustacheAngle}deg)`}">
							<MustacheSVG fill="currentColor" />
						</div>
					</div>
					<div v-if="clockSkin.mustachesDisplay" class="clock-mustache-winter-sunset nt-box-outer rotate-180" :class="clockSkin.mustachesWinterSunset">
						<div class="nt-box-inner nt-animate" :style="{transform: `rotate(${270 - context.mustaches.averageMustacheAngle}deg)`}">
							<MustacheSVG fill="currentColor" />
						</div>
					</div>
					<div v-if="clockSkin.mustachesDisplay" class="clock-mustache-summer-sunset nt-box-outer 		rotate-180" :class="clockSkin.mustachesSummerSunset">
						<div class="nt-box-inner nt-animate" :style="{transform: `rotate(${270 + context.mustaches.averageMustacheAngle}deg)`}">
							<MustacheSVG fill="currentColor" />
						</div>
					</div>
				</div>
			</Transition>

			<!-- TITLE  -->
			<Transition name="fade">
				<div v-if="clockSkin.titleDisplay" class="clock-title nt-box-outer text-2xl text-center font-bold" :class="clockSkin.title">
					<div class="nt-box-inner">
						<h1 style="padding-top: 67%;">Temps Naturel</h1>
					</div>
				</div>
			</Transition>

			<!-- NUMBERS -->
			<Transition name="fade">
				<div v-if="clockSkin.numbersDisplay" class="clock-numbers nt-box-outer">
					<div class="nt-box-outer rotate-180">
						<div class="nt-box-inner absolute text-center p-1"
							v-for="n in 36" 
							:key="`dial-number-${(n - 1) * 10}`" 
							:data-time="(n - 1) * 10" 
							:style="{ transform: `rotate(${((n - 1) * 10 * context.hemisphere)}deg)` }">
							<span class="nt-animate" :class="[
								(n - 1) % 9 === 0 ? clockSkin.numbersMultipleOf90 : 
								(n - 1) % 3 === 0 ? clockSkin.numbersMultipleOf30 : 
								clockSkin.numbersMultipleOf10
							]">{{ (n - 1) * 10 }}</span>
						</div>
					</div>
				</div>
			</Transition>

			<!-- DOTS -->
			<Transition name="fade">
				<div v-if="clockSkin.dotsDisplay" class="clock-dots nt-box-outer rotate-180">
					<div class="nt-box-inner absolute flex justify-center p-10"
						v-for="n in 36" 
						:key="`dot-${(n - 1) * 10}`" 
						:style="{ transform: `rotate(${((n - 1) * 10 * context.hemisphere)}deg)` }">
						<div class="rounded-full" :class="[
							(n - 1) % 9 === 0 ? clockSkin.dotsMultipleOf90 : 
							(n - 1) % 3 === 0 ? clockSkin.dotsMultipleOf30 : 
							clockSkin.dotsMultipleOf10
						]"></div>
					</div>
				</div>
			</Transition>

			<!-- HAND -->
			<Transition name="fade">
				<div v-if="clockSkin.handDisplay" class="clock-hand nt-box-outer rotate-180" :class="clockSkin.hand">
					<div class="nt-box-inner nt-animate" :style="{ transform: `rotate(${context.naturalDate.time * context.hemisphere}deg)` }">
						<HandSVG fill="currentColor" />
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useConfigStore } from '@/stores/configStore';
import { storeToRefs } from 'pinia';
import HandSVG from '@/assets/clock/hand-default.svg';
import HandNtzSVG from '@/assets/clock/hand-ntz-default.svg';
import MustacheEquinoxSVG from '@/assets/clock/mustache-equinox-default.svg';
import MustacheSVG from '@/assets/clock/mustache-default.svg';

// Props
const props = defineProps({
	context: {
		type: Object,
		required: true
	}
});

// Store
const configStore = useConfigStore();
const { clockSkin } = storeToRefs(configStore);

// Refs
const clockWrapper = ref(null);
const scale = ref(1);
let resizeObserver = null;

const clockBoxStyle = computed(() => ({
	width: '800px',
	height: '800px',
	minWidth: '800px',
	minHeight: '800px',
	transform: `scale(${scale.value})`,
}));

// Methods
const updateScale = () => {
	if (!clockWrapper.value) return;
	const wrapperWidth = clockWrapper.value.offsetWidth;
	const wrapperHeight = clockWrapper.value.offsetHeight;
	const scaleX = (wrapperWidth * 0.85) / 800;
	const scaleY = (wrapperHeight * 0.55) / 800;
	scale.value = Math.min(scaleX, scaleY, 1);
};

const dayPeriodPath = (start, end) => {
	const adjustedEnd = end < start ? end + 360 : end;
	const largeArcFlag = adjustedEnd - start <= 180 ? 0 : 1;  
	const startX = 400 + 400 * Math.cos((start - 90) * Math.PI / 180);
	const startY = 400 + 400 * Math.sin((start - 90) * Math.PI / 180);
	const endX = 400 + 400 * Math.cos((end - 90) * Math.PI / 180);
	const endY = 400 + 400 * Math.sin((end - 90) * Math.PI / 180);
	return `M 400 400 L ${startX} ${startY} A 400 400 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
};

// Lifecycle hooks
onMounted(() => {
	updateScale();
	
	resizeObserver = new ResizeObserver(updateScale);
	if (clockWrapper.value) {
		resizeObserver.observe(clockWrapper.value);
	}
});

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect();
	}
});
</script>

<style lang="scss" scoped>
	.nt-box-outer {
		@apply absolute inset-0 w-full h-full bg-cover bg-center;
	}
	.nt-box-inner {
		@apply w-[720px] h-[720px] m-[40px];
	}


.moon-divider {
	&,
	&:after {
		@apply absolute top-0 left-0 w-full h-full rounded-full;
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}

	&:after {
		content: '';
		transform: rotateY(180deg);
	}
}

.nt-animate {
	transition-property: all;
	transition-duration: var(--nt-animation-speed);
	transition-timing-function: ease;
}

.fade-enter-active,
.fade-leave-active {
	transition-duration: var(--nt-animation-speed);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.scale-with-delay-enter-active,
.scale-with-delay-leave-active {
	transition: opacity var(--nt-animation-speed),
							transform 1s cubic-bezier(0.25, 0.1, 0.25, 2) 1s;
}

.scale-with-delay-enter-from,
.scale-with-delay-leave-to {
	opacity: 0;
	transform: scale(0.5);
}

.scale-with-delay-enter-to,
.scale-with-delay-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>