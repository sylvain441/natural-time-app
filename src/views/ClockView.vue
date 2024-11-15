<template>
	<div id="day-view"
		class="flex flex-row h-dvh relative overflow-hidden bg-white dark:bg-slate-800 bg-[url('@/assets/debut-light.png')] dark:bg-[url('@/assets/debut-dark.png')]">

		<div
			:class="['relative h-full transition-all duration-300 ease-in-out', (clockActivePanel) ? 'md:block md:w-1/2 xl:w-2/3' : 'w-full']">

			<!-- MAIN MENU -->
			<MainMenu />

			<div class="fixed z-10 inset-0 h-full flex flex-col items-center justify-end transition-all duration-300 ease-in-out"
				:class="clockTimeTravelMode || clockTutorialMode ? 'border-8 border-nt-yellow-light' : ''"
				style="width: inherit;">

				<!-- CLOCK COMPONENT -->
				<ClockComponent class="absolute w-full h-full min-w-72"
					:class="(clockWelcomeMode && !clockActivePanel) || clockTutorialMode || clockTimeTravelMode ? '-translate-y-8 md:-translate-y-14' : clockShowTitle ? '-translate-y-4 md:-translate-y-6' : '-translate-y-0 md:-translate-y-0'"
					:context="context">
				</ClockComponent>

				<!-- FOOTER -->
				<footer class="z-20 text-center flex flex-col items-center p-6 pb-6 md:pb-12 w-full max-w-screen-sm">

					<!-- TITLE -->
					<div v-if="!clockTimeTravelMode && clockShowTitle">
						<h1 v-on:click="openPanel(AVAILABLE_PANELS.locationPicker)"
							class="font-extrabold text-base md:text-xl mt-1 mb-2 text-black cursor-pointer"
							title="Modifier l'emplacement">
							<span
								v-if="clockActivePanel === AVAILABLE_PANELS.locationPicker && contextStore.tempLongitude === null"
								class="px-3 py-1 bg-nt-yellow-light">
								Choisir un emplacement
							</span>
							<span v-else-if="!clockTutorialMode" class="bg-nt-yellow-light px-3 py-1">
								{{ location || "Horloge du Temps Naturel" }}
								<span v-if="latitude && longitude" class="font-normal">
									| {{ context.naturalDate.toLongitudeString(0) }}
								</span>
							</span>
							<span v-else-if="clockSkin.titleText" class="px-3 py-1 bg-nt-yellow-light">
								{{ clockSkin.titleText }}
							</span>
						</h1>

						<!-- SUBTITLE -->
						<div
							v-if="clockActivePanel === AVAILABLE_PANELS.locationPicker && contextStore.tempLongitude === null">
							<h2 class="text-slate-500 text-md md:text-xl">
								L'application a besoin d'une position géographique pour fonctionner
							</h2>
						</div>
						<div v-else-if="!clockTutorialMode && latitude && longitude">
							<h2
								class="flex justify-evenly items-center text-slate-400 font-medium text-sm md:text-xl space-x-4">
								<span
									class="font-extrabold text-lg bg-black text-nt-yellow-light font-mono px-2 py-0 mb-3">
									{{ context.naturalDate.toTimeString() }}
								</span>
							</h2>
						</div>
						<div v-else>
							<h2 class="text-slate-500 dark:text-slate-200 text-md md:text-xl">
								{{ clockSkin.descriptionText }}
							</h2>
						</div>
					</div>

					<!-- TIME TRAVEL CONTROL PANEL -->
					<div v-if="clockTimeTravelMode"
						class="bg-white max-w-md mx-auto font-extrabold p-4 rounded-lg shadow-lg relative">
						<div class="text-center flex flex-row items-center justify-center space-x-2">
							<span>{{ context.naturalDate.toDateString() }}</span>
							<span class="text-slate-500 font-normal">{{ context.naturalDate.toTimeString(0) }} {{
								context.naturalDate.toLongitudeString(0) }}</span>
						</div>
						<div class="text-center flex flex-row items-center justify-center space-x-2">
							<span>{{ new Date(context.naturalDate.unixTime).toLocaleDateString() }}</span>
							<span class="text-slate-500 font-normal">{{ new
								Date(context.naturalDate.unixTime).toLocaleTimeString([], {
									hour: '2-digit', minute:
										'2-digit', timeZoneName: 'short' }) }}</span>
						</div>
						<div class="flex items-center justify-center space-x-2 mt-2">
							<arrowsIcon @click.stop.prevent="decrementTime" v-longclick="decrementTime"
								fill="currentColor"
								class="w-8 h-8 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform select-none hover:bg-nt-yellow-light cursor-pointer rotate-180" />

							<div class="flex flex-col items-center justify-center space-y-2">
								<select id="speed-selector" v-model="selectedSpeed"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
									<option value="" disabled>Vitesse de voyage</option>
									<option v-for="(speed, index) in travelSpeeds" :key="index" :value="index">
										{{ speed.label }} {{ speed.equivalentTo ? `(${speed.equivalentTo})` : '' }}
									</option>
								</select>
							</div>

							<arrowsIcon @click.stop.prevent="incrementTime" v-longclick="incrementTime"
								fill="currentColor"
								class="w-8 h-8 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform select-none hover:bg-nt-yellow-light cursor-pointer" />
						</div>
					</div>

					<!-- TUTORIAL CONTROL PANEL -->
					<div v-if="clockTutorialMode && clockTutorialCurrentStep < clockTutorialStepsTotal"
						class="flex justify-center items-center bg-white space-x-4 mt-3 w-fit mx-auto font-mono text-sm font-extrabold px-6 py-2 rounded-full shadow-lg relative">

						<!-- Previous step -->
						<arrowsIcon
							@click.stop.prevent="clockTutorialCurrentStep > 0 ? clockTutorialCurrentStep-- : null"
							fill="currentColor"
							class="w-8 h-8 rotate-180 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10 select-none"
							:class="clockTutorialCurrentStep > 0 ? 'text-black hover:bg-nt-yellow-lighter cursor-pointer' : 'opacity-20'" />

						<!-- Tutorial step -->
						<span v-if="clockTutorialMode" class="text-md text-slate-600">Tutoriel <span class="">{{
							String(clockTutorialCurrentStep + 1).padStart(2, '0') }}/{{
									String(clockTutorialStepsTotal + 1).padStart(2, '0') }}</span></span>

						<!-- Next step -->
						<arrowsIcon
							@click.stop.prevent="clockTutorialCurrentStep < clockTutorialStepsTotal ? clockTutorialCurrentStep++ : null"
							fill="currentColor"
							class="w-8 h-8 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10 select-none"
							:class="clockTutorialCurrentStep < clockTutorialStepsTotal ? 'text-black hover:bg-nt-yellow-light cursor-pointer' : 'opacity-20'" />
					</div>

					<!-- BOTTOM BUTTONS -->
					<div v-if="(clockWelcomeMode && !clockActivePanel) || (clockTutorialMode && clockTutorialCurrentStep == clockTutorialStepsTotal)"
						class="flex flex-row items-center justify-center text-sm space-x-4 mt-3 mb-1">

						<!-- Start tutorial -->
						<button v-if="!clockTutorialMode" @click="clockTutorialMode = true"
							class="flex item-center justify-center text-black bg-nt-yellow-light hover:bg-nt-yellow-lighter font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg">
							Lancer tutoriel
						</button>

						<!-- Configure -->
						<button
							v-if="!clockTutorialMode || clockTutorialMode && clockTutorialCurrentStep == clockTutorialStepsTotal"
							@click="() => { clockTutorialMode = false; openPanel(AVAILABLE_PANELS.locationPicker); }"
							class="flex items-center text-black hover:bg-slate-300 font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg"
							:class="clockTutorialMode && clockTutorialCurrentStep == clockTutorialStepsTotal ? 'bg-nt-yellow-light' : 'bg-slate-200'">
							Configurer
						</button>
					</div>
				</footer>
			</div>
		</div>

		<!-- RIGHT MODAL PANELS -->
		<div v-if="clockActivePanel !== null"
			class="z-30 transition-all duration-300 ease-in-out w-screen md:w-1/2 xl:w-1/3 md:relative md:p-8">

			<!-- Close button -->
			<div
				class="overflow-hidden w-full h-[calc(100dvh-0px)] md:h-full bg-white dark:bg-slate-800 md:rounded-2xl md:shadow-2xl">
				<button v-if="clockActivePanel" @click="clockActivePanel = null"
					class="absolute z-50 top-2 right-2 md:top-4 md:right-4 md:p-2 p-1 rounded-full bg-slate-400 dark:bg-slate-600 text-slate-50 focus:outline-none transition-all duration-300 hover:bg-slate-600 dark:hover:bg-slate-700">
					<closeIcon class="w-6 h-6" fill="currentColor" />
				</button>

				<div class="overflow-hidden h-full">
					<!-- LOCATION PICKER -->
					<LocationPicker viewType="clock" v-if="clockActivePanel === AVAILABLE_PANELS.locationPicker"
						@save="() => { clockActivePanel = null; clockWelcomeMode = false; }" />
					<!-- CLOCK SETTINGS -->
					<ClockSettings v-if="clockActivePanel === AVAILABLE_PANELS.clockSettings" />
					<!-- FAQ -->
					<div class="py-6 px-4 h-full overflow-auto">
						<FAQAccordion v-if="clockActivePanel === AVAILABLE_PANELS.faq" :categories="[2]" />
					</div>
				</div>
			</div>
		</div>

		<!-- TOP RIGHT MENU -->
		<div v-if="!clockActivePanel && !clockWelcomeMode && !clockTutorialMode && !clockTimeTravelMode"
			class="fixed top-3 md:top-4 right-3 md:right-4 z-30">
			<div class="relative">
				<!-- Settings button -->
				<button @click="toggleMenu"
					class="p-2 rounded-full bg-nt-yellow-light text-black focus:outline-none transition-all duration-300 hover:bg-nt-yellow-lighter">
					<settingsIcon class="w-6 h-6" fill="currentColor" />
				</button>
				<div v-if="isMenuOpen"
					class="absolute right-0 mt-2 w-48 max-w-screen rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
					<div class="pt-1 pb-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
						<!-- SETTINGS -->
						<div class="px-4 pt-2 pb-0 text-sm text-slate-400 dark:text-nt-yellow-dark font-bold">Paramètres
						</div>
						<!-- Location Picker -->
						<a @click="openPanel(AVAILABLE_PANELS.locationPicker)"
							class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
							role="menuitem">
							<mapIcon class="w-6 h-6 mr-2" fill="currentColor" />Emplacement
						</a>
						<!-- Clock Settings -->
						<a @click="openPanel(AVAILABLE_PANELS.clockSettings)"
							class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
							role="menuitem">
							<brushIcon class="w-6 h-6 mr-2" fill="currentColor" />Affichage
						</a>

						<!-- SPECIAL MODES -->
						<div class="px-4 pt-3 pb-0 text-sm text-slate-400 dark:text-nt-yellow-dark font-bold">Mode
							spéciaux</div>
						<!-- Tutorial -->
						<a @click="toggleTutorial"
							class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-nt-yellow-lighter dark:hover:bg-nt-yellow-darker dark:hover:bg-opacity-30 flex items-center"
							role="menuitem">
							<learnIcon class="w-6 h-6 mr-2" fill="currentColor" />Tutoriel Horloge
						</a>
						<!-- Time Travel -->
						<a @click="toggleTimeTravel"
							class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-nt-yellow-lighter dark:hover:bg-nt-yellow-darker dark:hover:bg-opacity-30 flex items-center"
							:class="clockTimeTravelMode ? 'bg-nt-yellow-ultralight' : ''" role="menuitem">
							<timeTravelIcon class="w-6 h-6 mr-2" fill="currentColor" />Voyage temporel
						</a>

						<!-- UNDERSTAND -->
						<div class="px-4 pt-3 pb-0 text-sm text-slate-400 dark:text-nt-yellow-dark font-bold">Aide</div>
						<!-- FAQ -->
						<a @click="openPanel(AVAILABLE_PANELS.faq)"
							class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
							role="menuitem">
							<faqIcon class="w-6 h-6 mr-2" fill="currentColor" />FAQ
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- TUTORIAL CLOSE BUTTON -->
		<button v-if="clockTutorialMode" @click="clockTutorialMode = false"
			class="absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-yellow-light text-black hover:bg-nt-yellow-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
			<span>Passer le tutoriel</span>
			<closeIcon class="w-4 h-4 bg-black rounded-full text-nt-yellow-light" fill="currentColor" />
		</button>

		<!-- TIME TRAVEL CLOSE BUTTON -->
		<button v-if="clockTimeTravelMode" @click="closeTimeTravel"
			class="absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-yellow-light text-black hover:bg-nt-yellow-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
			<span>Quitter le voyage temporel</span>
			<closeIcon class="w-4 h-4 bg-black rounded-full text-nt-yellow-light" fill="currentColor" />
		</button>

		<!-- TIME TRAVEL RESET BUTTON -->
		<button v-if="clockTimeTravelMode" :disabled="!timeDelta" @click="resetTime"
			class="block absolute z-40 top-16 right-4 bg-slate-200 hover:bg-slate-300 text-xs text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-0">
			Remettre à zéro
		</button>

		<!-- NOTIFICATION: Geolocation changed -->
		<transition name="fade">
			<div v-if="showPositionChangedNotification && shouldShowNotification && clockActivePanel !== AVAILABLE_PANELS.locationPicker"
				class="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden max-w-sm">
				<div class="p-4">
					<p class="text-sm text-gray-700 dark:text-gray-300 mb-3">Position GPS modifiée. Mettre à jour ?</p>
					<div class="flex justify-between space-x-2">
						<button @click="preventNotificationForOneDay"
							class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
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

		<!-- NOTIFICATION: Southern Hemisphere -->
		<transition name="fade">
			<div v-if="context.hemisphere === -1 && (!hemisphereNotificationDismissed || shouldShowHemisphereNotification)"
				class="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto z-20 bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden max-w-sm mx-auto md:mx-0">
				<div class="p-4">
					<p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
						🔄 <strong>Hémisphère Sud :</strong> l'horloge tourne dans le sens inverse (de droite à gauche)
						car c'est ainsi que se déplace le soleil dans cet hémisphère.
					</p>
					<div class="flex justify-end">
						<button @click="dismissHemisphereNotification"
							class="bg-slate-100 text-black text-xs py-1 px-3 rounded transition duration-200 ease-in-out hover:bg-slate-200">
							Okay, compris
						</button>
					</div>
				</div>
			</div>
		</transition>

		<!-- DEFINE GLOBAL CSS VARS -->
		<component :is="'style'">
			:root {
			--hemisphere: {{ context.hemisphere }};
			--day-progression: {{ context.dayProgression }};
			--abs-day-progression: {{ Math.abs(context.dayProgression * 2 - 1) }}; /* close to sunrise and sunset */
			}
		</component>
	</div>
</template>

<script setup>
// Imports
import { ref, computed, defineAsyncComponent, onMounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
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
const { clockSkin, clockWelcomeMode, clockTutorialMode, clockTutorialStepsTotal, clockTutorialCurrentStep, clockTimeTravelMode, clockActivePanel, clockShowTitle, hemisphereNotificationDismissed, hemisphereNotificationDismissedAt } = storeToRefs(configStore);

// I18n setup
const i18n = useI18n();

// SEO Meta tags
const metaTitle = "Horloge du Temps Naturel - Une seule aiguille synchro avec le soleil";
const metaDescription = "Découvrir l'horloge naturelle de 360° qui tourne lentement en suivant exactement la course du soleil dans le ciel";

useHead({
	title: metaTitle,
	meta: [
		{ name: 'description', content: metaDescription },
		{ property: 'og:title', content: metaTitle },
		{ property: 'og:description', content: metaDescription },
		{ property: 'og:image', content: '/public/natural-time-social.jpg' },
		{ property: 'og:url', content: 'https://naturaltime.app' },
		{ property: 'og:type', content: 'website' },
		{ name: 'twitter:card', content: 'summary_large_image' },
	],
});

// Refs and computed properties
let { latitude, longitude, location, currentTime, geolocationNotificationDismissedAt, positionChanged, enableGeolocation } = storeToRefs(contextStore);
let showPositionChangedNotification = ref(false);
const isMenuOpen = ref(false);

// Time travel setup
const travelSpeeds = [
	{ value: 1000 * 60 * 4, label: '+/- 001°', equivalentTo: '4min' },
	{ value: 1000 * 60 * 8, label: '+/- 002°', equivalentTo: '8min' },
	{ value: 1000 * 60 * 20, label: '+/- 005°', equivalentTo: '20min' },
	{ value: 1000 * 60 * 60 * 24, label: '+/- 360°', equivalentTo: '1j' },
	{ value: 1000 * 60 * 60 * 24 * 7, label: '+/- 7 jours' },
	{ value: 1000 * 60 * 60 * 24 * 28, label: '+/- 28 jours' },
];
const selectedSpeed = ref(0);
const timeDelta = ref(0);

// Computed properties
let context = computed(() => {
	let theCurrentTime = clockSkin.value.context?.currentTime ? clockSkin.value.context.currentTime : currentTime.value + timeDelta.value;
	let theLatitude = clockSkin.value.context?.latitude != null ? clockSkin.value.context.latitude : latitude.value;
	let theLongitude = clockSkin.value.context?.longitude != null ? clockSkin.value.context.longitude : longitude.value;

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
		{ rangeStart: sun.morningGoldenHour, rangeStop: sun.eveningGoldenHour, start: 1, stop: 1 },
		{ rangeStart: sun.nightEnd, rangeStop: sun.morningGoldenHour, start: 0, stop: 1 },
		{ rangeStart: sun.eveningGoldenHour, rangeStop: sun.nightStart, start: 1, stop: 0 },
	];

	for (let step of dayPeriods) {
		if (naturalDate.time >= step.rangeStart & naturalDate.time < step.rangeStop) {
			dayProgression = step.start + (step.stop - step.start) * ((naturalDate.time - step.rangeStart) / (step.rangeStop - step.rangeStart));
		}
	}

	return {
		naturalDate: naturalDate,
		sun: sun,
		moon: moon,
		mustaches: mustaches,
		hemisphere: hemisphere,
		dayProgression: dayProgression,
	};
});

useHead({
	title: `${context.value.naturalDate.toTimeString(2, 5)} ${context.value.naturalDate.toLongitudeString(0)} ${location.value ? " | " + location.value : ""} | ${context.value.naturalDate.toDateString()} | Temps Naturel`,
});

const shouldShowNotification = computed(() => {
	if (!geolocationNotificationDismissedAt.value) return true;
	const oneDay = 24 * 60 * 60 * 1000;
	return (new Date() - new Date(geolocationNotificationDismissedAt.value)) > oneDay;
});

// Computed property to check if notification should be shown
const shouldShowHemisphereNotification = computed(() => {
	// Don't show notification during welcome mode
	if (clockWelcomeMode.value) return false;

	if (!hemisphereNotificationDismissedAt.value) return true;

	// Show notification again after 1 day
	const delay = 24 * 60 * 60 * 1000;
	return (new Date() - new Date(hemisphereNotificationDismissedAt.value)) > delay;
});

// Methods
const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};

const toggleTutorial = () => {
	clockTutorialMode.value = !clockTutorialMode.value;
	isMenuOpen.value = false;
	closeTimeTravel();
};

const toggleTimeTravel = () => {
	clockTimeTravelMode.value = !clockTimeTravelMode.value;
	isMenuOpen.value = false;
	if (clockTimeTravelMode.value) {
		clockActivePanel.value = null;
		clockTutorialMode.value = false;
	}
};

const openPanel = (panel) => {
	clockActivePanel.value = panel;
	isMenuOpen.value = false;
	clockTutorialMode.value = false;
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
	clockTimeTravelMode.value = false;
	timeDelta.value = 0;
};

const incrementTime = () => timeDelta.value += travelSpeeds[selectedSpeed.value].value;
const decrementTime = () => timeDelta.value -= travelSpeeds[selectedSpeed.value].value;
const resetTime = () => timeDelta.value = 0;

// Method to dismiss notification
const dismissHemisphereNotification = () => {
	hemisphereNotificationDismissed.value = true;
	hemisphereNotificationDismissedAt.value = new Date().toISOString();
};

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
	// Watchers
	watch([() => clockSkin.value.animationSpeed, () => clockTimeTravelMode.value], ([newSpeed, newTimeTravelMode]) => {
		document.documentElement.style.setProperty('--nt-animation-speed', newSpeed && !newTimeTravelMode ? `${newSpeed}s` : '0s');
	}, { immediate: true });
});


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

#faq {
	.faq-question {
		@apply text-sm;
	}

	.faq-answer {
		@apply text-sm;
	}
}
</style>