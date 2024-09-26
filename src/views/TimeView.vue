<template>
	<div id="day-view" class="flex flex-row h-screen relative overflow-hidden bg-texture">
		
		<div :class="['relative h-full transition-all duration-300 ease-in-out', (uiActivePanel) ? 'md:block md:w-1/2 xl:w-2/3' : 'w-full']">
			
			<!-- MAIN MENU -->  
			<MainMenu />
			
			<div 
				class="fixed z-10 inset-0 h-full flex flex-col items-center justify-end transition-all duration-300 ease-in-out"
				:class="timeTravelMode || tutorialMode ? 'border-8 border-nt-yellow-light' : ''"
				style="width: inherit;">
				
				<!-- CLOCK COMPONENT -->
				<ClockComponent 
					class="absolute w-full h-full min-w-72" 
					:class="(welcomeMode && !uiActivePanel) || tutorialMode || timeTravelMode ? '-translate-y-8 md:-translate-y-14' : ''" 
					:context="context">
				</ClockComponent>
				
				<!-- FOOTER -->
				<footer class="z-20 text-center flex flex-col items-center p-6 pb-6 md:pb-10 w-full max-w-screen-sm">
					
					<!-- TITLE -->
					<div v-if="!timeTravelMode && uiShowClockTitle">
						<h1 
							v-on:click="openPanel(AVAILABLE_PANELS.locationPicker)"
							class="font-extrabold text-base md:text-xl mt-1 mb-2 text-black cursor-pointer"
							title="Modifier l'emplacement">
							<span v-if="!tutorialMode" class="bg-nt-yellow-light px-3 py-1">
								{{ location || "Temps Naturel" }}
								<span v-if="latitude && longitude" class="font-normal">
									| {{ context.naturalDate.toLongitudeString(0) }}
								</span>
							</span>
							<span v-else-if="skin.titleText" class="px-3 py-1 bg-nt-yellow-light">
								{{ skin.titleText }}
							</span>
						</h1>
						
						<!-- SUBTITLE -->
						<div v-if="!tutorialMode && latitude && longitude">
							<h2 class="flex justify-evenly items-center text-slate-400 font-medium text-sm md:text-xl space-x-4">
								<span class="font-extrabold text-lg bg-black text-nt-yellow-light font-mono px-2 py-0">
									{{ context.naturalDate.toTimeString() }}
								</span>
							</h2>
						</div>
						<div v-else>
							<h2 class="text-slate-500 text-md md:text-xl">
								{{ skin.descriptionText }}
							</h2>
						</div>
					</div>
					
					<!-- TIME TRAVEL CONTROL PANEL -->
					<div v-if="timeTravelMode" 
						class="bg-white max-w-md mx-auto font-extrabold p-4 rounded-lg shadow-lg relative">
						<div class="text-center flex flex-row items-center justify-center space-x-2">
							<span>{{ context.naturalDate.toDateString() }}</span>
							<span class="text-slate-500 font-normal">{{ context.naturalDate.toTimeString(0) }} {{ context.naturalDate.toLongitudeString(0) }}</span>
						</div>
						<div class="text-center flex flex-row items-center justify-center space-x-2">
							<span>{{ new Date(context.naturalDate.unixTime).toLocaleDateString() }}</span>
							<span class="text-slate-500 font-normal">{{ new Date(context.naturalDate.unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) }}</span>
						</div>
						<div class="flex items-center justify-center space-x-2 mt-2">
							<button @click="decrementTime" v-longclick="decrementTime" class="flex items-center space-x-4 bg-nt-yellow-light hover:bg-nt-yellow-lighter text-sm text-black font-bold py-1 px-4 rounded-lg transition duration-300 ease-in-out">
								<rewindIcon class="w-6 h-6" fill="currentColor"/>
							</button>

							<div class="flex flex-col items-center justify-center space-y-2">
								<select 
									id="speed-selector"
									v-model="selectedSpeed"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
									<option v-for="(speed, index) in travelSpeeds" :key="index" :value="index">
										{{ speed.label }} ({{ speed.equivalentTo }})
									</option>
								</select>
							</div>

							<button @click="incrementTime" v-longclick="incrementTime" class="flex items-center space-x-4 bg-nt-yellow-light hover:bg-nt-yellow-lighter text-sm text-black font-bold py-1 px-4 rounded-lg transition duration-300 ease-in-out">
								<rewindIcon class="w-6 h-6 rotate-180" fill="currentColor"/>
							</button>
						</div>
					</div>
					
					<!-- TUTORIAL CONTROL PANEL -->
					<div v-if="tutorialMode && uiTutorialCurrentStep < uiTutorialStepsTotal" 
						class="flex justify-center items-center bg-white space-x-4 mt-3 w-fit mx-auto font-mono text-sm font-extrabold px-6 py-2 rounded-full shadow-lg relative">
						
						<!-- Previous step -->
						<arrowsIcon 
							@click="uiTutorialCurrentStep > 0 ? uiTutorialCurrentStep-- : null"
							fill="currentColor"
							class="w-8 h-8 rotate-180 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10"
							:class="uiTutorialCurrentStep > 0 ? 'text-black hover:bg-nt-yellow-lighter cursor-pointer' : 'opacity-20'"  />
						
							<!-- Tutorial step -->
						<span v-if="tutorialMode" class="text-md text-slate-600">Tutoriel <span class="">{{ String(uiTutorialCurrentStep + 1).padStart(2, '0') }}/{{ String(uiTutorialStepsTotal + 1).padStart(2, '0') }}</span></span>
						
						<!-- Next step -->
						<arrowsIcon 
							@click="uiTutorialCurrentStep < uiTutorialStepsTotal ? uiTutorialCurrentStep++ : null"
							fill="currentColor"
							class="w-8 h-8 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10"
							:class="uiTutorialCurrentStep < uiTutorialStepsTotal ? 'text-black hover:bg-nt-yellow-light cursor-pointer' : 'opacity-20'"  />
					</div>

					<!-- BOTTOM BUTTONS -->
					<div v-if="(welcomeMode && !uiActivePanel) || (tutorialMode && uiTutorialCurrentStep == uiTutorialStepsTotal)"
						class="flex flex-row items-center justify-center text-sm space-x-4 mt-6">
						
						<!-- Start tutorial -->
						<button 
							v-if="!tutorialMode" 
							@click="tutorialMode = true" 
							class="flex item-center justify-center bg-nt-yellow-light text-black bg-nt-yellow-light hover:bg-nt-yellow-lighter font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg">
							Lancer tutoriel
						</button>
						
						<!-- Configure -->
						<button 
							v-if="!tutorialMode || tutorialMode && uiTutorialCurrentStep == uiTutorialStepsTotal"
							@click="() => { tutorialMode = false; openPanel(AVAILABLE_PANELS.locationPicker); }" 
							class="flex items-center text-black hover:bg-slate-300 font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg"
							:class="tutorialMode && uiTutorialCurrentStep == uiTutorialStepsTotal ? 'bg-nt-yellow-light': 'bg-slate-200'">
							Configurer
						</button>
					</div>
				</footer>
			</div>
		</div>
		
		<!-- RIGHT MODAL PANELS -->
		<div v-if="uiActivePanel !== null" class="z-30 transition-all duration-300 ease-in-out w-screen md:w-1/2 xl:w-1/3 md:relative md:p-8">
			
			<!-- Close button -->
			<div class="overflow-hidden w-full h-full bg-white md:rounded-2xl md:shadow-2xl">
				<button v-if="uiActivePanel" @click="uiActivePanel = null" 
				class="absolute z-50 top-2 right-2 md:top-4 md:right-4 md:p-2 p-1 rounded-full bg-slate-400 text-slate-50 focus:outline-none transition-all duration-300 hover:bg-slate-600">
				<closeIcon class="w-6 h-6" fill="currentColor" />
			</button>
			
			<div class="overflow-hidden h-full">
				<!-- LOCATION PICKER -->
				<LocationPicker v-if="uiActivePanel === AVAILABLE_PANELS.locationPicker" />
				<!-- CLOCK SETTINGS -->
				<ClockSettings v-if="uiActivePanel === AVAILABLE_PANELS.clockSettings" />
				<!-- FAQ -->
				<div class="py-6 px-4 h-full overflow-auto">
					<FAQAccordion v-if="uiActivePanel === AVAILABLE_PANELS.faq" :categories="[2]" />
				</div>
			</div>
		</div>
	</div>
	
	<!-- TOP RIGHT MENU -->
	<div v-if="!uiActivePanel && !welcomeMode && !tutorialMode && !timeTravelMode" class="fixed top-4 right-4 z-30">
		<div class="relative">
			<!-- Close button -->
			<button @click="toggleMenu" class="p-2 rounded-full bg-nt-yellow-light text-black focus:outline-none transition-all duration-300 hover:bg-nt-yellow-lighter">
				<settingsIcon class="w-6 h-6" />
			</button>
			<div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 max-w-screen rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
				<div class="pt-1 pb-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
					<!-- SETTINGS -->
					<div class="px-4 pt-2 pb-0 text-sm text-slate-400 font-bold">Paramètres</div>
					<!-- Location Picker -->
					<a 
						@click="openPanel(AVAILABLE_PANELS.locationPicker)" 
						class="block px-4 py-2 cursor-pointer text-sm text-slate-700 hover:bg-slate-100 flex items-center" 
						role="menuitem">
						<mapIcon class="w-6 h-6 mr-2"/>Emplacement
					</a>
					<!-- Clock Settings -->
					<a 
						@click="openPanel(AVAILABLE_PANELS.clockSettings)" 
						class="block px-4 py-2 cursor-pointer text-sm text-slate-700 hover:bg-slate-100 flex items-center" 
						role="menuitem">
						<brushIcon class="w-6 h-6 mr-2"/>Affichage
					</a>
					
					<!-- SPECIAL MODES -->
					<div class="px-4 pt-3 pb-0 text-sm text-slate-400 font-bold">Mode spéciaux</div>
					<!-- Tutorial -->
					<a 
						@click="toggleTutorial" 
						class="block px-4 py-2 cursor-pointer text-sm text-slate-700 hover:bg-nt-yellow-lighter flex items-center" 
						role="menuitem">
						<learnIcon class="w-6 h-6 mr-2"/>Tutoriel Horloge
					</a>
					<!-- Time Travel -->
					<a 
						@click="toggleTimeTravel" 
						class="block px-4 py-2 cursor-pointer text-sm text-slate-700 hover:bg-nt-yellow-lighter flex items-center" 
						:class="timeTravelMode ? 'bg-nt-yellow-ultralight' : ''"
						role="menuitem">
						<timeTravelIcon class="w-6 h-6 mr-2"/>Voyage temporel
					</a>
					
					<!-- UNDERSTAND -->
					<div class="px-4 pt-3 pb-0 text-sm text-slate-400 font-bold">Aide</div>
					<!-- FAQ -->
					<a 
						@click="openPanel(AVAILABLE_PANELS.faq)" 
						class="block px-4 py-2 cursor-pointer text-sm text-slate-700 hover:bg-slate-100 flex items-center" 
						role="menuitem">
						<faqIcon class="w-6 h-6 mr-2"/>FAQ
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- TUTORIAL CLOSE BUTTON -->
	<button 
		v-if="tutorialMode"
		@click="tutorialMode = false" 
		class="block absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-yellow-light text-black hover:bg-nt-yellow-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
		<span>Passer le tutoriel</span>
		<closeIcon class="w-4 h-4 bg-black rounded-full text-nt-yellow-light" fill="currentColor" />
	</button>

	<!-- TIME TRAVEL CLOSE BUTTON -->
	<button 
		v-if="timeTravelMode"
		@click="closeTimeTravel" 
		class="block absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-yellow-light text-black hover:bg-nt-yellow-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
		<span>Quitter le  voyage temporel</span>
		<closeIcon class="w-4 h-4 bg-black rounded-full text-nt-yellow-light" fill="currentColor" />
	</button>

	<!-- TIME TRAVEL RESET BUTTON -->
	<button 
		v-if="timeTravelMode"
		:disabled="!timeDelta"
		@click="resetTime" 
		class="block absolute z-40 top-16 right-4 bg-slate-200 hover:bg-slate-300 text-xs text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-0">
		Remettre à zéro
	</button>

	<!-- NOTIFICATION: Geolocation changed -->
	<transition name="fade">
		<div v-if="showPositionChangedNotification && shouldShowNotification && uiActivePanel !== AVAILABLE_PANELS.locationPicker" 
				class="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
			<div class="p-4">
				<p class="text-sm text-gray-700 mb-3">Position GPS modifiée. Mettre à jour ?</p>
				<div class="flex justify-between space-x-2">
					<button @click="preventNotificationForOneDay" class="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200">
						Ignorer aujourd'hui
					</button>
					<div class="flex space-x-2">
						<button @click="openPanel(AVAILABLE_PANELS.locationPicker)" 
								class="bg-nt-yellow-light text-black text-xs py-1 px-3 rounded transition duration-200 ease-in-out hover:bg-nt-yellow-lighter">
							Oui
						</button>
						<button @click="closeNotification" 
								class="bg-slate-100 text-black text-xs py-1 px-3 rounded transition duration-200 ease-in-out hover:bg-slate-200">
							Non
						</button>
					</div>
				</div>
			</div>
		</div>
	</transition>

	<!-- DEFINE GLOBAL CSS VARS -->
	<component :is="'style'">
		:root {
			--hemisphere: {{context.hemisphere}};
			--day-progression: {{context.dayProgression}};
			--abs-day-progression: {{Math.abs(context.dayProgression * 2 - 1)}}; /* close to sunrise and sunset */
		}
	</component>
</div>
</template>

<script setup>
// Imports
import { ref, computed, defineAsyncComponent, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { NaturalDate } from 'natural-time-js';
import { NaturalSunAltitude, NaturalSunEvents, NaturalMoonPosition, NaturalMoonEvents, MustachesRange } from 'natural-time-js/context';
import { useI18n } from 'vue-i18n'

// Store imports
import { useContextStore } from '@/stores/contextStore'
import { useConfigStore, AVAILABLE_PANELS } from '@/stores/configStore'

// Component imports
import ClockComponent from '@/components/ClockComponent.vue';
import ClockSettings from '@/components/ClockSettings.vue';
import FAQAccordion from '@/components/FAQAccordion.vue';
import MainMenu from '@/components/MainMenu.vue';

// Lazy loaded components
const LocationPicker = defineAsyncComponent(() => import('@/components/LocationPicker.vue'));

// Icon imports
import mapIcon from '@/assets/icon/map-icon.svg';
import brushIcon from '@/assets/icon/brush-icon.svg';
import faqIcon from '@/assets/icon/faq-icon.svg';
import learnIcon from '@/assets/icon/learn-icon.svg';
import settingsIcon from '@/assets/icon/settings-icon.svg';
import arrowsIcon from '@/assets/icon/arrows-icon.svg';
import closeIcon from '@/assets/icon/close-icon.svg';
import rewindIcon from '@/assets/icon/rewind-icon.svg';
import timeTravelIcon from '@/assets/icon/time-travel-icon.svg';

// Store setup
const contextStore = useContextStore()
contextStore.init();

const configStore = useConfigStore()
const { skin, welcomeMode, tutorialMode, uiTutorialStepsTotal, uiTutorialCurrentStep, timeTravelMode, uiActivePanel, uiShowClockTitle } = storeToRefs(configStore);

// I18n setup
const i18n = useI18n();

// Refs and computed properties
let { latitude, longitude, location, currentTime, geolocationNotificationDismissedAt, positionChanged, enableGeolocation } = storeToRefs(contextStore);
let showPositionChangedNotification = ref(false);
const isMenuOpen = ref(false);

// Time travel setup
const travelSpeeds = [
	{ value: 1000 * 60 * 4, label: '1°', equivalentTo: '4min' },
	{ value: 1000 * 60 * 8, label: '2°', equivalentTo: '8min' },
	{ value: 1000 * 60 * 20, label: '5°', equivalentTo: '20min' },
	{ value: 1000 * 60 * 60 * 24, label: '1 jour', equivalentTo: '1j' },
	{ value: 1000 * 60 * 60 * 24 * 7, label: '1 semaine', equivalentTo: '7j' },
	{ value: 1000 * 60 * 60 * 24 * 28, label: '1 lune', equivalentTo: '28j' },
	{ value: 1000 * 60 * 60 * 24 * 365, label: '1 an', equivalentTo: '365j' },
];
const selectedSpeed = ref(0);
const timeDelta = ref(0);

// Computed properties
let context = computed(() => {
	let theCurrentTime = skin.value.context?.currentTime ? skin.value.context.currentTime : currentTime.value + timeDelta.value;
	let theLatitude = skin.value.context?.latitude != null ? skin.value.context.latitude : latitude.value;
	let theLongitude = skin.value.context?.longitude != null ? skin.value.context.longitude : longitude.value;
	
	const naturalDate = new NaturalDate(new Date(theCurrentTime), theLongitude);
	
	// Compute Sun data
	let sun = { 
		...NaturalSunAltitude(naturalDate, theLatitude),
		...NaturalSunEvents(naturalDate, theLatitude)
	};
	
	// Compute Moon data
	let moon = {
		...NaturalMoonPosition(naturalDate, theLatitude),
		...NaturalMoonEvents(naturalDate, theLatitude)
	};
	
	let mustaches = MustachesRange(naturalDate, theLatitude);
	
	let hemisphere = theLatitude >= 0 ? 1 : -1;
	
	// Calculate luminosity progression for day/night mode
	let dayProgression = 0;
	
	let dayPeriods = [
	{rangeStart: sun.morningGoldenHour, rangeStop: sun.eveningGoldenHour, start: 1, stop: 1},
	{rangeStart: sun.nightEnd, rangeStop: sun.morningGoldenHour, start: 0, stop: 1},
	{rangeStart: sun.eveningGoldenHour, rangeStop: sun.nightStart, start: 1, stop: 0},
	];
	
	for(let step of dayPeriods) {
		if(naturalDate.time >= step.rangeStart & naturalDate.time < step.rangeStop) {
			dayProgression = step.start + (step.stop - step.start) * ((naturalDate.time - step.rangeStart) / (step.rangeStop - step.rangeStart));
		}
	}
	
	// UPDATE PAGE TITLE TODO: make this reactive
	document.title = `${naturalDate.toTimeString(2, 5)} ${naturalDate.toLongitudeString(0)} ${location.value ? " | " + location.value : ""} | ${naturalDate.toDateString()} | ${i18n.t('nt')}`;
	
	return {
		naturalDate: naturalDate,
		sun: sun,
		moon: moon,
		mustaches: mustaches,
		hemisphere: hemisphere,
		dayProgression: dayProgression,
	};
});

const shouldShowNotification = computed(() => {
	if (!geolocationNotificationDismissedAt.value) return true;
	const oneDay = 24 * 60 * 60 * 1000;
	return (new Date() - new Date(geolocationNotificationDismissedAt.value)) > oneDay;
});

// Methods
const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};

const toggleTutorial = () => {
	tutorialMode.value = !tutorialMode.value;
	isMenuOpen.value = false;
	closeTimeTravel();
};

const toggleTimeTravel = () => {
	timeTravelMode.value = !timeTravelMode.value;
	isMenuOpen.value = false;
	if (timeTravelMode.value) {
		uiActivePanel.value = null;
		tutorialMode.value = false;
	}
};

const openPanel = (panel) => {
	uiActivePanel.value = panel;
	isMenuOpen.value = false;
	tutorialMode.value = false;
	closeNotification();
	closeTimeTravel();
};

const preventNotificationForOneDay = () => {
	geolocationNotificationDismissedAt.value = new Date().toISOString();
	closeNotification();
};

const closeNotification = () => {
	showPositionChangedNotification.value = false;
};

const closeTimeTravel = () => {
	timeTravelMode.value = false;
	timeDelta.value = 0;
};

const incrementTime = () => timeDelta.value += travelSpeeds[selectedSpeed.value].value;	
const decrementTime = () => timeDelta.value -= travelSpeeds[selectedSpeed.value].value;
const resetTime = () => timeDelta.value = 0;

// Lifecycle hooks
onMounted(() => {
	if (enableGeolocation.value) {
		// Wait 10 seconds before calculating whether to show the notification
		setTimeout(() => {
			if (enableGeolocation.value && positionChanged.value && shouldShowNotification.value) {
				showPositionChangedNotification.value = true;
			}
		}, 10000);
	}  
});

// Watchers
watch([() => skin.value.animationSpeed, () => timeTravelMode.value], ([newSpeed, newTimeTravelMode]) => {
	document.documentElement.style.setProperty('--nt-animation-speed', newSpeed && !newTimeTravelMode ? `${newSpeed}s` : '0s');
}, { immediate: true });
</script>

<style lang="scss">
#day-view {
	&::before,
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		transition: var(--nt-animation-speed) ease-out;
	}
	
	// Night gradient
	&::before {
		background: radial-gradient(circle at center, #071135, #000000);
		opacity: calc((1 - var(--day-progression)) * 0.95);
	}
	
	// Day gradient
	&::after {
		background: radial-gradient(circle at center, #ffffff, #d5f7fd);
		opacity: calc(var(--day-progression) *0.5);
	}
}

#faq{
	.faq-question{
		@apply text-sm;
	}
	.faq-answer{
		@apply text-sm;
	}
}
</style>