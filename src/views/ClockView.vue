<template>
	<div id="day-view"
		class="flex flex-row min-h-dvh overflow-hidden bg-slate-200 bg-[url('@/assets/debut-light.png')]" @touchmove="handleTouchMove">

		<div
			:class="['relative h-full transition-all duration-300 ease-in-out', (clockActivePanel) ? 'md:block md:w-1/2 xl:w-2/3' : 'w-full']">

      <!-- MAIN MENU -->
      <MainMenu />










			<div class="fixed z-10 inset-0 h-full flex flex-col items-center justify-end transition-all duration-300 ease-in-out"
				:class="clockTimeTravelMode || clockTutorialMode || clockDiyMode ? 'md:border-8 md:border-nt-yellow-light' : ''"
				style="width: inherit;">

				<!-- CLOCK COMPONENT -->
				<ClockComponent class="absolute w-full h-full min-w-72"
					:class="(clockWelcomeMode && !clockActivePanel) || clockTutorialMode || clockTimeTravelMode || clockDiyMode ? '-translate-y-8 md:-translate-y-14' : !clockSimplifiedMode ? '-translate-y-4 md:-translate-y-8' : '-translate-y-0 md:-translate-y-0'"
					:context="context"
					:diy-mode="clockDiyMode">
				</ClockComponent>

				<!-- FOOTER -->
				<footer v-if="!clockSimplifiedMode || clockTimeTravelMode || clockTutorialMode || clockWelcomeMode || clockDiyMode"
					class="z-20 text-center flex flex-col items-center p-6 pb-6 md:pb-10 w-full max-w-screen-sm">

					<!-- TITLE -->
					<Transition name="fade">
					<div v-if="!clockTimeTravelMode">
                        <h1 class="flex justify-center items-center font-extrabold text-base md:text-xl mt-1 mb-2 text-black">
							<!-- Refresh geolocation button (left) - opacity 0 when geolocation disabled to keep title centered -->
							<button
								v-if="!clockTutorialMode && latitude && longitude && clockActivePanel !== AVAILABLE_PANELS.locationPicker"
								@click.stop="enableGeolocation ? handleRefreshGeolocation() : null"
								:disabled="isRefreshingGeolocation || !enableGeolocation"
								:class="[
									'p-1 mr-1 transition-opacity duration-500',
									!enableGeolocation ? 'opacity-0 cursor-default' :
									clockDiyMode || showLocationIcons ? 'opacity-100 hover:opacity-70' : 'opacity-0'
								]"
								:title="enableGeolocation ? $t('locationPicker.geolocation.refresh') : ''">
								<component
									:is="isRefreshingGeolocation ? spinIcon : refreshIcon"
									:class="['w-5 h-5', locationIconColor, isRefreshingGeolocation ? 'animate-spin' : '']"
								/>
							</button>

							<!-- Title -->
							<div
								v-if="clockActivePanel === AVAILABLE_PANELS.locationPicker && contextStore.tempLongitude === null"
                                class="px-3 py-1 bg-nt-yellow-light">
                                {{ $t('locationPicker.title') }}
							</div>
                            <div v-else-if="!clockTutorialMode && clockActivePanel === AVAILABLE_PANELS.locationPicker && contextStore.tempLongitude !== null" class="bg-nt-yellow-light px-3 py-1">
								{{ getTempLongitudeString() }}
							</div>
                            <div v-else-if="!clockTutorialMode" class="bg-nt-yellow-light px-3 py-1">
								<span>{{ location || $t('welcome.title') }}</span>
								<span v-if="latitude && longitude" class="font-normal">
									| {{ context.naturalDate.toLongitudeString() }}
								</span>
							</div>
							<div v-else-if="clockSkin.titleText" class="px-3 py-1 bg-nt-yellow-light">
								{{ clockSkin.titleText }}
							</div>

							<!-- Edit location button (right) -->
							<button
								v-if="!clockTutorialMode && latitude && longitude && clockActivePanel !== AVAILABLE_PANELS.locationPicker"
								@click.stop="openPanel(AVAILABLE_PANELS.locationPicker)"
								:class="[
									'p-1 ml-1 transition-opacity duration-500',
									clockDiyMode || showLocationIcons ? 'opacity-100 hover:opacity-70' : 'opacity-0'
								]"
								:title="$t('locationPicker.title')">
								<component :is="editIcon" :class="['w-5 h-5', locationIconColor]" />
							</button>
						</h1>

						<!-- SUBTITLE -->
						<div
							v-if="clockActivePanel === AVAILABLE_PANELS.locationPicker && contextStore.tempLongitude === null">
                            <h2 class="text-slate-500 text-md md:text-xl">
                                {{ $t('locationPicker.explanation') }}
                            </h2>
						</div>
						<div v-else-if="clockDiyMode">
							<h2 class="text-slate-500 font-medium text-sm md:text-xl">
								{{ $t('clock.diy.subtitle') }}
							</h2>
						</div>
						<div v-else-if="!clockTutorialMode && latitude && longitude">
							<h2
								class="flex justify-evenly items-center text-slate-400 font-medium text-sm md:text-xl space-x-4">
                                <span
                                    @click="toggleTimeTravel"
                                    class="font-extrabold text-xl bg-black text-nt-yellow-light font-mono px-2 py-1 mb-3 cursor-pointer hover:bg-slate-900 transition-colors duration-200"
                                    :title="$t('clock.timeTravel.title')">
									{{ context.naturalDate.toTimeString() }}
								</span>
							</h2>
						</div>
						<div v-else>
							<h2 class="text-slate-500 text-md md:text-xl">
								{{ clockSkin.descriptionText }}
							</h2>
						</div>
					</div>
					</Transition>

					<!-- TIME TRAVEL CONTROL PANEL -->
					<Transition name="fade">
					<div v-if="clockTimeTravelMode">
						<div class="bg-white/80 w-fit mx-auto mb-2 py-1 px-4 rounded-lg shadow-lg">
                            <p class="text-center text-gray-500 font-mono text-xs">
                                <span class=" ">{{ new Date(context.naturalDate.unixTime).toLocaleDateString($t('display.dateFormat')) }}</span>&nbsp;
                                <span class="font-extrabold text-lg">{{ new Date(context.naturalDate.unixTime).toLocaleTimeString($t('display.dateFormat'), {hour: '2-digit', minute: '2-digit'}) }}</span>&nbsp;
								<span class="">UTC{{ new Date(context.naturalDate.unixTime).getTimezoneOffset() > 0 ? '-' : '+' }}{{ Math.abs(new Date(context.naturalDate.unixTime).getTimezoneOffset() / 60) }}</span>&nbsp;&nbsp;
							</p>
							<p class="text-center text-gray-900 font-mono text-xs">
								<span class="">{{ context.naturalDate.toDateString() }}</span>&nbsp;
								<span class="font-extrabold text-xl">{{ context.naturalDate.toTimeString(0) }}</span>&nbsp;
								<span class="">{{ context.naturalDate.toLongitudeString() }}</span>&nbsp;&nbsp;
							</p>
						</div>

						<div class="bg-nt-yellow-light max-w-md mx-auto font-extrabold py-3 px-8 rounded-full shadow-lg">
							<div class="flex items-center justify-center space-x-4">
								<button
									@click.stop.prevent="decrementTime"
									v-longclick="decrementTime"
									class="w-8 h-8 flex items-center justify-center bg-white rounded-full transition duration-300 ease-in-out transform hover:bg-nt-yellow-lighter cursor-pointer select-none"
								>
									<minusIcon class="w-4 h-4" fill="currentColor" />
								</button>

								<div class="flex flex-col items-center justify-center space-y-2">
									<select
										id="speed-selector"
										v-model="selectedSpeed"
										class="bg-white border-none text-black text-sm rounded-lg focus:ring-nt-yellow-light focus:border-nt-yellow-light block w-full p-2.5 text-center"
									>
										<option value="" disabled>{{ $t('clock.timeTravel.speedSelector') }}</option>
										<option v-for="(speed, index) in travelSpeeds" :key="index" :value="index" class="text-center">
											{{ speed.label }} {{ speed.equivalentTo ? `(${speed.equivalentTo})` : '' }}
										</option>
									</select>
								</div>

								<button
									@click.stop.prevent="incrementTime"
									v-longclick="incrementTime"
									class="w-8 h-8 flex items-center justify-center bg-white rounded-full transition duration-300 ease-in-out transform hover:bg-nt-yellow-lighter cursor-pointer select-none"
								>
									<plusIcon class="w-4 h-4" fill="currentColor" />
								</button>
							</div>
						</div>
					</div>
					</Transition>

					<!-- TUTORIAL CONTROL PANEL -->
					<Transition name="fade">
					<div v-if="clockTutorialMode && clockTutorialCurrentStep < clockTutorialStepsTotal"
						class="flex justify-center items-center bg-white space-x-4 mt-3 w-fit mx-auto font-mono text-sm font-extrabold px-6 py-2 rounded-full shadow-lg relative">

						<!-- Previous step -->
						<arrowsIcon
							@click.stop.prevent="clockTutorialCurrentStep > 0 ? clockTutorialCurrentStep-- : null"
							fill="currentColor"
							class="w-8 h-8 rotate-180 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10 select-none"
							:class="clockTutorialCurrentStep > 0 ? 'text-black hover:bg-nt-yellow-lighter cursor-pointer' : 'opacity-20'" />

						<!-- Tutorial step -->
						<span v-if="clockTutorialMode" class="text-md text-slate-600">{{ $t('clock.tutorial.tutorialStep') }} <span class="">{{
							String(clockTutorialCurrentStep + 1).padStart(2, '0') }}/{{
									String(clockTutorialStepsTotal + 1).padStart(2, '0') }}</span></span>

						<!-- Next step -->
						<arrowsIcon
							@click.stop.prevent="clockTutorialCurrentStep < clockTutorialStepsTotal ? clockTutorialCurrentStep++ : null"
							fill="currentColor"
							class="w-8 h-8 p-1 bg-nt-yellow-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10 select-none"
							:class="clockTutorialCurrentStep < clockTutorialStepsTotal ? 'text-black hover:bg-nt-yellow-light cursor-pointer' : 'opacity-20'" />
					</div>
					</Transition>
					<!-- BOTTOM BUTTONS -->
					<div v-if="(clockWelcomeMode && !clockActivePanel) || (clockTutorialMode && clockTutorialCurrentStep == clockTutorialStepsTotal)"
						class="flex flex-row items-center justify-center text-sm space-x-4 mt-3 mb-1">

						<!-- Start tutorial -->
						<button v-if="!clockTutorialMode" @click="clockTutorialMode = true"
							class="flex item-center justify-center text-black bg-nt-yellow-light hover:bg-nt-yellow-lighter font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg">
							{{ $t('clock.tutorial.startButton') }}
						</button>

						<!-- Configure -->
						<button
							v-if="!clockTutorialMode || clockTutorialMode && clockTutorialCurrentStep == clockTutorialStepsTotal"
							@click="() => { clockTutorialMode = false; openPanel(AVAILABLE_PANELS.locationPicker); }"
							class="flex items-center text-black hover:bg-slate-300 font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg"
							:class="clockTutorialMode && clockTutorialCurrentStep == clockTutorialStepsTotal ? 'bg-nt-yellow-light' : 'bg-slate-200'">
							{{ clockWelcomeMode && !clockTutorialMode ? $t('clock.tutorial.skipWelcomeButton') : $t('clock.tutorial.configureButton') }}
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
				class="overflow-hidden w-full h-[calc(100dvh-0px)] md:h-full bg-slate-800 md:rounded-2xl md:shadow-2xl">
				<button v-if="clockActivePanel" @click="clockActivePanel = null"
					class="absolute z-50 top-2 right-3 md:top-4 md:right-4 md:p-2 p-1 rounded-full bg-slate-600 text-slate-50 focus:outline-none transition-all duration-300 hover:bg-slate-700">
					<closeIcon class="w-6 h-6" fill="currentColor" />
				</button>

				<div class="overflow-hidden h-full">
					<!-- LOCATION PICKER -->
					<LocationPicker viewType="clock" v-if="clockActivePanel === AVAILABLE_PANELS.locationPicker"
						@save="() => { clockActivePanel = null; clockWelcomeMode = false; }" />
					<!-- FAQ -->
					<div class="py-6 px-4 h-full overflow-auto touch-pan-y">
						<FAQAccordion v-if="clockActivePanel === AVAILABLE_PANELS.faq" :categories="[2]" />
					</div>
				</div>
			</div>
		</div>

		<!-- TOP RIGHT MENU -->
		<div v-if="!clockActivePanel && !clockWelcomeMode && !clockTutorialMode && !clockTimeTravelMode && !clockDiyMode"
			class="fixed top-3 md:top-4 right-3 md:right-4 z-30">
			<div class="relative flex gap-2">
				<!-- Menu button -->
				<button @click="toggleMenu"
					class="p-2 rounded-full bg-nt-yellow-light text-black focus:outline-none transition-all duration-300 hover:bg-nt-yellow-lighter">
					<div class="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
						<span :class="['block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
							isMenuOpen ? 'rotate-45 translate-y-2' : '']"></span>
						<span :class="['block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
							isMenuOpen ? 'opacity-0' : '']"></span>
						<span :class="['block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
							isMenuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
					</div>
				</button>
				<div v-if="isMenuOpen"
					class="absolute right-0 mt-12 w-[212px] max-w-screen rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5">
					<div class="pt-1 pb-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
						<!-- SETTINGS -->
						<div class="px-4 pt-2 pb-0 text-sm text-nt-yellow-dark font-bold">{{ $t('clock.menu.settings') }}
						</div>
                        <!-- Location Picker -->
                        <a @click="openPanel(AVAILABLE_PANELS.locationPicker)"
                            class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-slate-700 flex items-center"
                            role="menuitem">
                            <mapIcon class="w-6 h-6 mr-2" fill="currentColor" />{{ $t('clock.menu.locationPicker') }}
                        </a>
                        <!-- Language Picker (just after location) -->
                        <a @click="openLanguagePicker"
                            class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-slate-700 flex items-center"
                            role="menuitem">
                            <span class="text-xl mr-2">{{ getCurrentLanguageFlag() }}</span>{{ $t('common.selectLanguage') }}
                        </a>

						<!-- HELP SECTION -->
						<div class="px-4 pt-3 pb-0 text-sm text-nt-yellow-dark font-bold">{{ $t('clock.menu.understanding') }}</div>
						<!-- Tutorial -->
						<a @click="toggleTutorial"
							class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-nt-yellow-darker hover:bg-opacity-30 flex items-center"
							role="menuitem">
							<learnIcon class="w-6 h-6 mr-2" fill="currentColor" />{{ $t('clock.menu.startTutorial') }}
						</a>
                        <!-- FAQ -->
                        <a @click="openPanel(AVAILABLE_PANELS.faq)"
                            class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-slate-700 flex items-center"
                            role="menuitem">
                            <faqIcon class="w-6 h-6 mr-2" fill="currentColor" />{{ $t('clock.menu.faq') }}
                        </a>


						<!-- SPECIAL MODES -->
						<div class="px-4 pt-3 pb-0 text-sm text-nt-yellow-dark font-bold">{{ $t('clock.menu.specialMode') }}</div>
						<!-- Time Travel -->
							<a @click="toggleTimeTravel"
								class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-nt-yellow-darker hover:bg-opacity-30 flex items-center"
								:class="clockTimeTravelMode ? 'bg-nt-yellow-ultralight' : ''" role="menuitem">
								<timeTravelIcon class="w-6 h-6 mr-2" fill="currentColor" />{{ $t('clock.menu.timeTravel') }}
							</a>
							<!-- DIY mode -->
							<a @click="toggleDiyMode"
								class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-nt-yellow-darker hover:bg-opacity-30 flex items-center"
								:class="clockDiyMode ? 'bg-nt-yellow-ultralight' : ''" role="menuitem">
								<compassIcon class="w-6 h-6 mr-2 text-white" fill="currentColor" />{{ $t('clock.menu.diyMode') }}
							</a>
						<!-- Simplified mode -->
						<a @click="toggleSimplifiedMode"
							class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-slate-700 flex items-center"
							:class="clockSimplifiedMode ? 'bg-slate-700 bg-opacity-50' : ''"
							role="menuitem">
							<component
								:is="clockSimplifiedMode ? advancedClockIcon : simpleClockIcon"
								class="w-6 h-6 mr-2 bg-white/90 p-0.5 rounded-full text-black"
								fill="currentColor"
							/>
							{{ clockSimplifiedMode ? $t('clock.menu.simplifiedMode.fullMode') : $t('clock.menu.simplifiedMode.title') }}
						</a>
					</div>
				</div>
			</div>
			<!-- Add overlay -->
			<div v-if="isMenuOpen"
				@click="toggleMenu"
				class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]">
			</div>
		</div>

		<!-- TUTORIAL CLOSE BUTTON -->
		<button v-if="clockTutorialMode" @click="clockTutorialMode = false"
			class="absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-yellow-light text-black hover:bg-nt-yellow-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
			<span>{{ $t('clock.tutorial.skipButton') }}</span>
			<closeIcon class="w-4 h-4 bg-black rounded-full text-nt-yellow-light" fill="currentColor" />
		</button>

		<!-- TIME TRAVEL CLOSE BUTTON -->
		<button v-if="clockTimeTravelMode" @click="closeTimeTravel"
			class="absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-yellow-light text-black hover:bg-nt-yellow-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
			<span>{{ $t('clock.timeTravel.exitButton') }}</span>
			<closeIcon class="w-4 h-4 bg-black rounded-full text-nt-yellow-light" fill="currentColor" />
		</button>

		<!-- DIY MODE CLOSE BUTTON -->
		<button v-if="clockDiyMode && !clockActivePanel" @click="closeDiyMode"
			class="absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-yellow-light text-black hover:bg-nt-yellow-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
			<span>{{ $t('clock.diy.exitButton') }}</span>
			<closeIcon class="w-4 h-4 bg-black rounded-full text-nt-yellow-light" fill="currentColor" />
		</button>

		<!-- TIME TRAVEL RESET BUTTON -->
		<button v-if="clockTimeTravelMode" :disabled="!timeDelta" @click="resetTime"
			class="block absolute z-40 top-16 right-4 bg-slate-200 hover:bg-slate-300 text-xs text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-0">
			{{ $t('clock.timeTravel.resetButton') }}
		</button>

		<!-- NOTIFICATION: Geolocation refresh result -->
		<transition name="fade">
			<div v-if="geolocationNotification"
				:class="[
					'fixed top-20 left-1/2 -translate-x-1/2 z-50 shadow-lg rounded-lg overflow-hidden max-w-sm px-4 py-3',
					geolocationNotification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
				]">
				<p class="text-sm font-medium flex items-center gap-2">
					<span v-if="geolocationNotification.type === 'success'">✓</span>
					<span v-else>✗</span>
					{{ geolocationNotification.message }}
				</p>
			</div>
		</transition>

		<!-- MODAL: URL location differs from saved location -->
		<RouteLocationModal i18n-namespace="clock.notifications.routeLocation" />

		<!-- NOTIFICATION: Geolocation changed -->
		<transition name="fade">
			<div v-if="contextStore.newPlaceName && contextStore.positionChanged && clockActivePanel !== AVAILABLE_PANELS.locationPicker"
				class="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
				<div class="p-4">
					<p class="text-sm text-gray-700 mb-3">
						{{ $t('clock.notifications.geolocation.title') }}: <span class="font-semibold">{{ contextStore.newPlaceName }}</span>
						<span class="text-slate-500 ml-1">({{ new NaturalDate(Date.now(), contextStore.geolocationLongitude).toLongitudeString() }})</span>
					</p>
					<div class="flex justify-end space-x-2">
						<button @click="contextStore.dismissGeolocationChange"
							class="bg-slate-100 text-black text-xs py-1 px-3 rounded transition duration-200 ease-in-out hover:bg-slate-200">
							{{ $t('clock.notifications.geolocation.ignoreButton') }}
						</button>
						<button @click="contextStore.acceptNewGeolocation"
							class="bg-nt-yellow-light text-black text-xs py-1 px-3 rounded transition duration-200 ease-in-out hover:bg-nt-yellow-lighter">
							{{ $t('clock.notifications.geolocation.updateButton') }}
						</button>
					</div>
				</div>
			</div>
		</transition>

		<!-- NOTIFICATION: Southern Hemisphere -->
		<transition name="fade">
			<div v-if="context.hemisphere === -1 && (!hemisphereNotificationDismissed || shouldShowHemisphereNotification)"
				class="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto z-20 bg-white shadow-lg rounded-lg overflow-hidden max-w-sm mx-auto md:mx-0">
				<div class="p-4">
					<p class="text-sm text-gray-700 mb-3">
						🔄 <strong>{{ $t('clock.notifications.southernHemisphere.title') }}:</strong> {{ $t('clock.notifications.southernHemisphere.description') }}
					</p>
					<div class="flex justify-end">
						<button @click="dismissHemisphereNotification"
							class="bg-slate-100 text-black text-xs py-1 px-3 rounded transition duration-200 ease-in-out hover:bg-slate-200">
							{{ $t('clock.notifications.southernHemisphere.dismissButton') }}
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
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
import { NaturalDate } from 'natural-time-js';
import { NaturalSunAltitude, NaturalSunEvents, NaturalMoonPosition, NaturalMoonEvents, MustachesRange } from 'natural-time-js';
import { useI18n } from 'vue-i18n'
import { createApp } from 'vue';
import { showModalNotification, hideModalNotification } from '@/utils/notificationManager';

// Store imports
import { useContextStore } from '@/stores/contextStore'
import { useConfigStore, AVAILABLE_PANELS } from '@/stores/configStore'

// Component imports
import ClockComponent from '@/components/ClockComponent.vue';
import FAQAccordion from '@/components/FAQAccordion.vue';
import MainMenu from '@/components/MainMenu.vue';
import RouteLocationModal from '@/components/RouteLocationModal.vue';

// Lazy loaded components
const LocationPicker = defineAsyncComponent(() => import('@/components/LocationPicker.vue'));
const ModalNotification = defineAsyncComponent(() => import('@/components/ModalNotification.vue'));

// Icon imports
import mapIcon from '@/assets/icon/map-icon.svg';
import faqIcon from '@/assets/icon/faq-icon.svg';
import learnIcon from '@/assets/icon/learn-icon.svg';
import arrowsIcon from '@/assets/icon/arrows-icon.svg';
import closeIcon from '@/assets/icon/close-icon.svg';
import timeTravelIcon from '@/assets/icon/time-travel-icon.svg';
import minusIcon from '@/assets/icon/minus-icon.svg';
import plusIcon from '@/assets/icon/plus-icon.svg';
import simpleClockIcon from '@/assets/icon/simple-clock-icon.svg';
import advancedClockIcon from '@/assets/icon/advanced-clock-icon.svg';
import compassIcon from '@/assets/icon/compass-icon.svg';
import refreshIcon from '@/assets/icon/refresh-icon.svg';
import spinIcon from '@/assets/icon/spin-icon.svg';
import editIcon from '@/assets/icon/edit-icon.svg';


// Store setup
const contextStore = useContextStore()
contextStore.init();

const configStore = useConfigStore()
const { clockSkin: rawClockSkin, clockWelcomeMode, clockTutorialMode, clockTutorialStepsTotal, clockTutorialCurrentStep, clockTimeTravelMode, clockDiyMode, clockActivePanel, clockSimplifiedMode, hemisphereNotificationDismissed, hemisphereNotificationDismissedAt } = storeToRefs(configStore);

// I18n setup
const i18n = useI18n();
import { languageService } from '../i18n/i18n';
const route = useRoute();
const router = useRouter();

// Get current language flag
const getCurrentLanguageFlag = () => {
  const flags = {
    fr: '🇫🇷',
    en: '🇬🇧',
    es: '🇪🇸',
    'es-419': '🌎',
    pt: '🇵🇹',
    'pt-BR': '🇧🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    ru: '🇷🇺',
    el: '🇬🇷',
    zh: '🇨🇳',
    ja: '🇯🇵'
  };
  const currentLang = languageService.getCurrentLanguage();
  return flags[currentLang] || currentLang.toUpperCase();
};

// Refs and computed properties first
let { latitude, longitude, location, currentTime, geolocationNotificationDismissedAt, positionChanged, enableGeolocation, geolocationStatus } = storeToRefs(contextStore);
let showPositionChangedNotification = ref(false);
const isMenuOpen = ref(false);
const isRefreshingGeolocation = ref(false);

// Location icons visibility (show on mouse move / touch, hide after delay)
const showLocationIcons = ref(false);
let hideIconsTimeout = null;
const ICONS_HIDE_DELAY = 5000; // 5 seconds

const showIcons = () => {
	showLocationIcons.value = true;
	if (hideIconsTimeout) {
		clearTimeout(hideIconsTimeout);
	}
	hideIconsTimeout = setTimeout(() => {
		showLocationIcons.value = false;
	}, ICONS_HIDE_DELAY);
};

const handleMouseMove = () => {
	showIcons();
};

const handleTouchStart = () => {
	showIcons();
};

// Geolocation notification
const geolocationNotification = ref(null); // { type: 'success' | 'error', message: string }
let geolocationNotificationTimeout = null;

const showGeolocationNotification = (type, message) => {
	geolocationNotification.value = { type, message };
	if (geolocationNotificationTimeout) {
		clearTimeout(geolocationNotificationTimeout);
	}
	geolocationNotificationTimeout = setTimeout(() => {
		geolocationNotification.value = null;
	}, 4000);
};

// Get temp longitude string for LocationPicker display
const getTempLongitudeString = () => {
	if (contextStore.tempLongitude !== null) {
		return `Longitude ${new NaturalDate(Date.now(), contextStore.tempLongitude).toLongitudeString()}`;
	}
	return '';
};

// Refresh geolocation handler
const handleRefreshGeolocation = async () => {
	isRefreshingGeolocation.value = true;
	await contextStore.refreshGeolocation();
	isRefreshingGeolocation.value = false;

	// Show notification based on result
	if (geolocationStatus.value === 'success') {
		const placeName = location.value || i18n.t('welcome.title');
		showGeolocationNotification('success', `${i18n.t('locationPicker.geolocation.updated')}: ${placeName}`);
	} else if (geolocationStatus.value === 'permission denied') {
		showGeolocationNotification('error', i18n.t('locationPicker.geolocation.errors.denied'));
	} else if (geolocationStatus.value === 'position unavailable') {
		showGeolocationNotification('error', i18n.t('locationPicker.geolocation.errors.unavailable'));
	} else if (geolocationStatus.value === 'timeout') {
		showGeolocationNotification('error', i18n.t('locationPicker.geolocation.errors.timeout'));
	} else if (geolocationStatus.value === 'error') {
		showGeolocationNotification('error', i18n.t('locationPicker.geolocation.errors.error'));
	}
};

// Time travel setup
const travelSpeeds = computed(() => [
	{ value: 1000 * 60 * 4, label: i18n.t('clock.timeTravel.speeds[0].value'), equivalentTo: i18n.t('clock.timeTravel.speeds[0].equivalentTo') },
	{ value: 1000 * 60 * 20, label: i18n.t('clock.timeTravel.speeds[1].value'), equivalentTo: i18n.t('clock.timeTravel.speeds[1].equivalentTo') },
	{ value: 1000 * 60 * 40, label: i18n.t('clock.timeTravel.speeds[2].value'), equivalentTo: i18n.t('clock.timeTravel.speeds[2].equivalentTo') },
	{ value: 1000 * 60 * 60 * 24, label: i18n.t('clock.timeTravel.speeds[3].value'), equivalentTo: i18n.t('clock.timeTravel.speeds[3].equivalentTo') },
	{ value: 1000 * 60 * 60 * 24 * 7, label: i18n.t('clock.timeTravel.speeds[4].value'), equivalentTo: i18n.t('clock.timeTravel.speeds[4].equivalentTo') },
	{ value: 1000 * 60 * 60 * 24 * 28, label: i18n.t('clock.timeTravel.speeds[5].value'), equivalentTo: i18n.t('clock.timeTravel.speeds[5].equivalentTo') },
]);
const selectedSpeed = ref(1);
const timeDelta = ref(0);

// Computed property to get the translated skin
const clockSkin = computed(() => {
	return configStore.getTranslatedClockSkin(i18n.t);
});

// Context computed property
const context = computed(() => {
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

// Icon color based on day/night mode
const locationIconColor = computed(() => {
	// dayProgression > 0.5 means it's day, use dark color; otherwise use yellow
	return context.value.dayProgression > 0.5 ? 'text-slate-700' : 'text-nt-yellow-dark';
});

// SEO Meta tags - MOVED AFTER context is defined
const metaTitle = i18n.t('clock.meta.title');
const metaDescription = i18n.t('clock.meta.description');
const metaOgImage = i18n.t('clock.meta.ogImage');
const metaOgUrl = i18n.t('clock.meta.ogUrl');

const pageTitle = computed(() => {
	if (clockWelcomeMode.value || clockTutorialMode.value || clockTimeTravelMode.value || clockDiyMode.value) {
		return metaTitle;
	}
	return `${context.value.naturalDate.toTimeString(2, 1)} ${context.value.naturalDate.toLongitudeString()} ${location.value ? " | " + location.value : ""} | ${context.value.naturalDate.toDateString()} | ${i18n.t('welcome.title')}`;
});

useHead({
	title: pageTitle,
	meta: [
		{ name: 'description', content: metaDescription },
		{ property: 'og:title', content: metaTitle },
		{ property: 'og:description', content: metaDescription },
		{ property: 'og:image', content: metaOgImage },
		{ property: 'og:url', content: metaOgUrl },
		{ property: 'og:type', content: 'website' },
		{ name: 'twitter:card', content: 'summary_large_image' },
	],
});

// Computed properties
const shouldShowNotification = computed(() => {
	if (!geolocationNotificationDismissedAt.value) return true;
	const oneDay = 24 * 60 * 60 * 1000;
	return (new Date() - new Date(geolocationNotificationDismissedAt.value)) > oneDay;
});

const hasConfiguredLocation = computed(() =>
	contextStore.hasRouteLocation ||
	(contextStore.storedLatitude != null && contextStore.storedLongitude != null)
);

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
	clockDiyMode.value = false;
	closeTimeTravel();
};

const toggleTimeTravel = () => {
	clockTimeTravelMode.value = !clockTimeTravelMode.value;
	isMenuOpen.value = false;
    if (clockTimeTravelMode.value) {
		clockActivePanel.value = null;
		clockTutorialMode.value = false;
		clockDiyMode.value = false;

      // Show time travel welcome notification through manager
      showModalNotification({
        title: i18n.t('tutorials.timeTravel.notification.title'),
        message: i18n.t('tutorials.timeTravel.notification.message'),
        type: 'clock'
      }, i18n);
	}
};

const openPanel = (panel) => {
	clockActivePanel.value = panel;
	isMenuOpen.value = false;
	clockTutorialMode.value = false;
    closeNotification();
	closeTimeTravel();
    hideModalNotification();
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
    hideModalNotification();
};

// Sync the URL with DIY mode state so the link is shareable.
// When entering DIY: write ?mode=diy&lat=...&lng=...
// When leaving DIY: strip those params (only if they're present, never touch other queries)
const setDiyQuery = (enabled) => {
	const query = { ...route.query };
	if (enabled) {
		query.mode = 'diy';
		query.lat = Number(latitude.value).toFixed(5);
		query.lng = Number(longitude.value).toFixed(5);
		delete query.lon;
	} else if (query.mode === 'diy') {
		delete query.mode;
		delete query.lat;
		delete query.lng;
		delete query.lon;
	} else {
		return; // nothing to update
	}
	router.replace({ query });
};

const toggleDiyMode = () => {
	isMenuOpen.value = false;
	if (clockDiyMode.value) {
		closeDiyMode();
		return;
	}
	if (!hasConfiguredLocation.value) {
		openPanel(AVAILABLE_PANELS.locationPicker);
		return;
	}

	clockDiyMode.value = true;
	clockWelcomeMode.value = false;
	clockTutorialMode.value = false;
	closeTimeTravel();
	hideModalNotification();
	setDiyQuery(true);
};

const closeDiyMode = () => {
	clockDiyMode.value = false;
	clockActivePanel.value = null;
	setDiyQuery(false);
};

const incrementTime = () => timeDelta.value += travelSpeeds.value[selectedSpeed.value].value;
const decrementTime = () => timeDelta.value -= travelSpeeds.value[selectedSpeed.value].value;
const resetTime = () => timeDelta.value = 0;

// Method to dismiss notification
const dismissHemisphereNotification = () => {
	hemisphereNotificationDismissed.value = true;
	hemisphereNotificationDismissedAt.value = new Date().toISOString();
};

// Add new method
const toggleSimplifiedMode = () => {
	clockSimplifiedMode.value = !clockSimplifiedMode.value;
	isMenuOpen.value = false;
};

// Open global language picker overlay
const openLanguagePicker = () => {
  isMenuOpen.value = false;
  window.dispatchEvent(new CustomEvent('open-language-picker'));
};

// Add touch event handler
const handleTouchMove = (event) => {
  // Allow scrolling if we're in the FAQ panel
  if (event.target.closest('.overflow-auto')) {
    return;
  }
  // Prevent default behavior for the rest of the app
  event.preventDefault();
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

	// Show tutorial welcome notification if tutorial mode is active
	if (clockTutorialMode.value && clockTutorialCurrentStep.value === 0) {
		showModalNotification({
			title: i18n.t('tutorials.clock.notification.title'),
			message: i18n.t('tutorials.clock.notification.message'),
			type: 'clock'
		}, i18n);
	}

	// Add event listeners for location icons visibility
	document.addEventListener('mousemove', handleMouseMove);
	document.addEventListener('touchstart', handleTouchStart);

	// Watchers
	watch([() => clockSkin.value.animationSpeed, () => clockTimeTravelMode.value], ([newSpeed, newTimeTravelMode]) => {
		document.documentElement.style.setProperty('--nt-animation-speed', newSpeed && !newTimeTravelMode ? `${newSpeed}s` : '0s');
	}, { immediate: true });

	// Watch for tutorial mode changes to show welcome notification
	watch(() => clockTutorialMode.value, (newValue) => {
		if (newValue && clockTutorialCurrentStep.value === 0) {
			showModalNotification({
				title: i18n.t('tutorials.clock.notification.title'),
				message: i18n.t('tutorials.clock.notification.message'),
				type: 'clock'
			}, i18n);
		}
	});
});

onUnmounted(() => {
	// Remove event listeners
	document.removeEventListener('mousemove', handleMouseMove);
	document.removeEventListener('touchstart', handleTouchStart);
	if (hideIconsTimeout) {
		clearTimeout(hideIconsTimeout);
	}
});


</script>

<style lang="scss">
#day-view {
	position: fixed;
	width: 100%;
	height: 100%;
	overscroll-behavior: none;
	-webkit-overflow-scrolling: none;
	touch-action: none;

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
		background: radial-gradient(circle at center, #171a26, #01000a);
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

// Location icons fade transition
.fade-icon-enter-active,
.fade-icon-leave-active {
	transition: opacity 0.5s ease;
}

.fade-icon-enter-from,
.fade-icon-leave-to {
	opacity: 0;
}
</style>
