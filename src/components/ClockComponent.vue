<template>
	<div class="clock-wrapper flex items-center justify-center" ref="clockWrapper">
		<div class="clock-box relative" :style="clockBoxStyle">
			
			<!-- DAY / NIGHT -->
			<div class="clock-day-night nt-box-outer rotate-180">
				<Transition name="fade">
				<div v-if="configStore.clockShowAnimations" 
					 class="nt-box-outer hidden md:block opacity-50" 
					 :style="`filter: blur(${BASESIZE * 0.12}px)`">
					<svg class="w-full h-full" :viewBox="`0 0 ${BASESIZE} ${BASESIZE}`">
						<path :d="dayPeriodPath(context.sun.sunrise, context.sun.sunset)" fill="#AFE0FF" />
						<path :d="dayPeriodPath(context.sun.sunset, context.sun.sunrise)" fill="#1C1241" />
					</svg>
				</div>
				</Transition>
				<Transition name="scale-with-delay">
				<div class="nt-box-outer" :class="clockSkin.dayNightRing"
					 :style="{
						 transform: `scale(${95 + (context.dayProgression * 5)}%)`,
						 opacity: !clockSkin.dayNightRingDisplay ? 0 : 0.6 + (context.dayProgression * 0.4)
					 }">
					<svg class="w-full h-full" :viewBox="`0 0 ${BASESIZE} ${BASESIZE}`">
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
						<div class="nt-box-outer text-center nt-animate" 
							 :style="{
								 transform: `rotate(${context.naturalDate.time * context.hemisphere}deg) translateY(${-3 - context.sun.altitude * 0.32}%)`
							 }">
							<div class="inline-block" :style="`width: ${BASESIZE * 0.13}px; height: ${BASESIZE * 0.13}px;`">
								<div class="w-full h-full rounded-full bg-nt-yellow-dark" 
									 :style="`
										 box-shadow: 0 0 ${BASESIZE * 0.05}px 0 rgba(255, 205, 0, var(--day-progression));
										 ${configStore.clockShowAnimations ? `filter: blur(${BASESIZE * 0.001}px);` : ''}
									 `">
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>

			<!-- MOON -->
			<Transition name="fade">
				<div v-if="clockSkin.moonDisplay" class="clock-moon nt-box-outer rotate-180">
					<div class="nt-box-outer flex justify-center nt-animate" :style="{transform: `rotate(${(context.naturalDate.time - context.moon.phase) * context.hemisphere}deg) translateY(${-3 - context.moon.altitude * 0.32}%)`}"> 
						<div :style="`width: ${BASESIZE * 0.13}px; height: ${BASESIZE * 0.13}px; 
									  box-shadow: 0 0 ${BASESIZE * 0.01875}px 0 rgba(0, 0, 100, 0.3), 
												  0 0 ${BASESIZE * 0.035}px rgba(255, 255, 255, 0.5);
									  ${configStore.clockShowAnimations ? `filter: blur(${BASESIZE * 0.001 * context.dayProgression}px);` : ''}`" 
							 class="relative rounded-full overflow-hidden flex align-center">
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
					<div class="nt-box-outer nt-animate" :style="{ transform: `rotate(${(context.naturalDate.time - context.naturalDate.longitude) * context.hemisphere}deg) scaleX(${context.hemisphere}) translateZ(0)`}">
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
				<div v-if="!clockSimplifiedMode" 
					 class="clock-title nt-box-outer text-center font-bold" 
					 :style="{ fontSize: `${BASESIZE * 0.03}px` }"
					 :class="clockSkin.title">
					<div class="nt-box-inner">
						<h1 :style="`padding-top: ${BASESIZE * 0.61}px;`">{{ $t('clock.component.title') }}</h1>
					</div>
				</div>
				<div v-else
					 class="clock-title nt-box-outer text-center" 
					 :style="{ fontSize: `${BASESIZE * 0.025}px` }"
					 :class="clockSkin.title">
					<div class="nt-box-inner text-sm">
						<h1 :style="`padding-top: ${BASESIZE * 0.61}px;`">
							<span v-if="location" class="font-bold">{{ location }}<br></span>
							<span class="font-normal">{{ context.naturalDate.toTimeString(0) }}&nbsp;{{ context.naturalDate.toLongitudeString(0) }}</span>
						</h1>
					</div>
				</div>
			</Transition>

			<!-- NUMBERS -->
			<Transition name="fade">
				<div v-if="clockSkin.numbersDisplay" class="clock-numbers nt-box-outer">
					<div class="nt-box-outer rotate-180">
						<div class="nt-box-inner absolute text-center"
							v-for="n in 36" 
							:key="`dial-number-${(n - 1) * 10}`" 
							:data-time="(n - 1) * 10" 
							:style="{ 
								transform: `rotate(${((n - 1) * 10 * context.hemisphere)}deg)`,
								padding: `${BASESIZE * 0.03}px`,
								fontSize: (n - 1) % 9 === 0 
									? `${BASESIZE * 0.04}px` 
									: (n - 1) % 3 === 0 
										? `${BASESIZE * 0.025}px` 
										: `${BASESIZE * 0.02}px`,
								lineHeight: 0
							}">
							<span class="nt-animate inline-block align-baseline" :class="[
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
					<div class="nt-box-inner absolute flex justify-center"
						v-for="n in 36" 
						:key="`dot-${(n - 1) * 10}`" 
						:style="{ 
							transform: `rotate(${((n - 1) * 10 * context.hemisphere)}deg)`,
							padding: `${BASESIZE * 0.05}px`
						}">
						<div class="rounded-full" 
							 :style="[
								 (n - 1) % 9 === 0 
									 ? { width: `${BASESIZE * 0.02}px`,
										 height: `${BASESIZE * 0.02}px`,		
										 marginTop: `${BASESIZE * 0.005}px`,
									   } 
									 : (n - 1) % 3 === 0
										 ? { width: `${BASESIZE * 0.015}px`,
											 height: `${BASESIZE * 0.015}px`,
											 marginTop: `${BASESIZE * 0.005}px`,
										   }
										 : { width: `${BASESIZE * 0.005}px`,
											 height: `${BASESIZE * 0.005}px`,
											 marginTop: `${BASESIZE * 0.005}px`,
										   }
							 ]"
							 :class="[
								 (n - 1) % 9 === 0 ? clockSkin.dotsMultipleOf90 : 
								 (n - 1) % 3 === 0 ? clockSkin.dotsMultipleOf30 : 
								 clockSkin.dotsMultipleOf10
							 ]">
						</div>
					</div>
				</div>
			</Transition>

			<!-- HAND -->
			<Transition name="fade">
				<div v-if="clockSkin.handDisplay" class="clock-hand nt-box-outer rotate-180" :class="clockSkin.hand">
					<div class="nt-box-inner nt-animate" :style="{ transform: `rotate(${context.naturalDate.time * context.hemisphere}deg) translateZ(0)` }">
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
import { useContextStore } from '@/stores/contextStore';
import { useI18n } from 'vue-i18n';

// Props
const props = defineProps({
	context: {
		type: Object,
		required: true
	}
});

// Store
const configStore = useConfigStore();
const { clockSkin: rawClockSkin, clockSimplifiedMode } = storeToRefs(configStore);
const contextStore = useContextStore();
const { location } = storeToRefs(contextStore);
const { t } = useI18n();

// Computed property to get the translated skin
const clockSkin = computed(() => {
	return configStore.getTranslatedClockSkin(t);
});

// Refs
const clockWrapper = ref(null);
let resizeObserver = null;
const BASESIZE = ref(555); // This is our reference size

// Update computed
const clockBoxStyle = computed(() => ({
	width: `${BASESIZE.value}px`,
	height: `${BASESIZE.value}px`,
	minWidth: `${BASESIZE.value}px`,
	minHeight: `${BASESIZE.value}px`,
}));

// Methods
const updateScale = () => {
	if (!clockWrapper.value) return;
	const wrapperWidth = clockWrapper.value.offsetWidth;
	const wrapperHeight = clockWrapper.value.offsetHeight;
	const maxWidth = wrapperWidth * 0.85;
	const maxHeight = wrapperHeight * 0.55;
	BASESIZE.value = Math.min(maxWidth, maxHeight);
};

// Update dayPeriodPath method
const dayPeriodPath = (start, end) => {
	const radius = BASESIZE.value / 2;
	const center = radius;
	const adjustedEnd = end < start ? end + 360 : end;
	const largeArcFlag = adjustedEnd - start <= 180 ? 0 : 1;  
	const startX = center + radius * Math.cos((start - 90) * Math.PI / 180);
	const startY = center + radius * Math.sin((start - 90) * Math.PI / 180);
	const endX = center + radius * Math.cos((end - 90) * Math.PI / 180);
	const endY = center + radius * Math.sin((end - 90) * Math.PI / 180);
	return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
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
		--inner-size: calc(0.9 * v-bind(BASESIZE) * 1px);
		--margin-size: calc(0.05 * v-bind(BASESIZE) * 1px);
		width: var(--inner-size);
		height: var(--inner-size);
		margin: var(--margin-size);
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
	transition-property: transform, opacity;
	transition-duration: var(--nt-animation-speed);
	transition-timing-function: ease;
	transform: translateZ(0);
	backface-visibility: hidden;
	will-change: transform;
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
	transform: scale(0.7);
}

.scale-with-delay-enter-to,
.scale-with-delay-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>
