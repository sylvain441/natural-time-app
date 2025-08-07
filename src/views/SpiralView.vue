<template>
  <div id="moons-view" 
       :class="[
         'relative flex flex-row bg-slate-200 bg-[url(@/assets/debut-light.png)]',
         spiralVerticalMode ? 'min-h-dvh overflow-y-auto relative touch-pan-y' : 'min-h-dvh overflow-hidden relative'
       ]" 
       @touchmove.passive="handleTouchMove">
    
    <div :class="[
      'relative z-10 transition-all duration-300 ease-in-out ', 
      spiralActivePanel ? 'hidden md:block md:w-1/2 xl:w-2/3' : 'w-full',
      spiralVerticalMode ? 'h-full overflow-y-auto' : 'h-dvh'
    ]">
      
      <!-- MAIN MENU -->  
      <MainMenu />
      
      <div 
        class="z-10 w-full transition-all duration-300 ease-in-out"
        :class="[
          !spiralVerticalMode ? 'h-full px-3 pt-12 pb-48' : 'relative', 
          !spiralActivePanel && !spiralVerticalMode ? 'md:px-[14%] md:pt-10' : !spiralVerticalMode ? 'md:px-[5%]' : '', 
          spiralTimeTravelMode || spiralTutorialMode ? 'md:border-8 md:border-nt-cyan-light' : '', 
          (spiralTutorialMode ? 'pb-56' : ''), 
          (spiralTimeTravelMode ? 'pb-36' : ''), 
          spiralVerticalMode ? 'px-0 pb-0 pt-0' : '']">
        
        <!-- MOONS COMPONENT -->
        <div ref="yearWrapper" 
             :class="[
               'w-full flex items-center justify-center relative', !spiralSkin.singleMoonView ? 'drop-shadow-2xl' : '',
               spiralVerticalMode ? 'h-auto max-w-md mx-auto' : 'h-full'
             ]">
          
          <!-- Single Moon Overlay -->
          <Transition name="fade-zoom">
            <div v-if="spiralSkin.singleMoonView" 
                 class="absolute inset-0 z-20 flex items-center justify-center">
              <Moon 
                :id="`moon-${context.naturalDate.moon}`"
                :today="today"
                :moon="context.naturalDate.moon"
                :baseSize="containerSize * 3"
                :spacing="containerSize * 0.1"
                class="transition-transform duration-500 shadow-xl bg-white rounded-xl md:rounded-3xl"
                @open-time-travel="openTimeTravelAtDate"
              />
            </div>
          </Transition>

          <!-- Year container (original moons) -->
          <div id="year" 
               class="w-full h-fit flex flex-wrap items-center justify-center gap-0 mx-auto" 
               :class="[
                 {'vertical-mode': spiralVerticalMode},
                 {'blur-xs md:blur-sm opacity-80': spiralSkin.singleMoonView}
               ]"
               :style="{ maxWidth: `${4.01 * containerSize}px`}">
            <!-- Display component -->
            <DisplayComponent 
              :display-date="displayDate"
              :context="context"
              :container-size="containerSize"
              :style="{ 
                margin: spiralVerticalMode ? '0' : `0 ${containerSize/2}px`
              }"
            />
            
            <!-- All 13 Moons -->
            <Moon v-for="moon in 14" 
              :key="moon"
              :id="`moon-${moon}`"
              :class="{'current-moon': today.moon === moon}"
              :today="today" 
              :moon="moon" 
              :baseSize="containerSize"
              :spacing="containerSize * 0.035" 
              @open-time-travel="openTimeTravelAtDate"
            />
          </div>
        </div>
        
        <!-- FOOTER -->
        <footer class="z-20 fixed bottom-0 left-0 text-center flex flex-col items-center p-6 pb-6 md:pb-10 w-full">
          <Transition name="fade">
            <div v-if="!spiralTimeTravelMode">
              <!-- TITLE -->
              <h1 
                @click="openPanel(AVAILABLE_PANELS.locationPicker)"
                class="flex justify-center items-center font-extrabold text-base md:text-xl mt-1 mb-2 text-black cursor-pointer"
                title="Modifier l'emplacement">
                <span v-if="!spiralTutorialMode && (!spiralWelcomeMode || spiralActivePanel !== null) && context.location" class="bg-nt-cyan-lighter px-3 py-1">
                  {{ context.location }}
                  <span v-if="latitude && longitude" class="font-normal">
                    | {{ context.naturalDate.toLongitudeString(0) }}
                  </span>
                </span>
                <span v-else-if="spiralSkin.titleText" class="px-3 py-1 bg-nt-cyan-lighter">
                  {{ spiralSkin.titleText }}
                </span>
                <span v-else class="px-3 py-1 bg-nt-cyan-lighter">
                  {{  $t('spiral.title') }}
                </span>
              </h1>
              
              <!-- SUBTITLE -->
              <div v-if="!spiralTutorialMode && !spiralWelcomeMode && latitude && longitude">
                <h2 class="flex justify-evenly items-center text-slate-400 font-medium text-sm md:text-xl space-x-4">
                  <span 
                    @click="toggleTimeTravel"
                    class="font-extrabold text-lg bg-black text-nt-cyan-lighter font-mono px-2 py-0 mb-3 cursor-pointer hover:bg-nt-cyan-light hover:text-black transition-colors duration-300">
                    {{ context.naturalDate.toTimeString() }}
                  </span>
                </h2>
              </div>
              <div v-else>
                <h2 class="text-slate-500 text-md md:text-xl">
                  {{ spiralSkin.descriptionText || $t('spiral.subtitle') }}
                </h2>
              </div>
            </div>
          </Transition>
          
          <!-- TIME TRAVEL CONTROL PANEL -->
          <Transition name="fade">
            <div v-if="spiralTimeTravelMode">
              <div class="bg-nt-cyan-light max-w-md mx-auto font-extrabold py-3 px-8 rounded-full shadow-lg">
                <div class="flex items-center justify-center space-x-4">
                  <!-- Minus button -->
                  <button 
                    @click.stop.prevent="decrementTime" 
                    v-longclick="decrementTime" 
                    class="w-8 h-8 flex items-center justify-center bg-white rounded-full transition duration-300 ease-in-out transform hover:bg-nt-cyan-light cursor-pointer select-none"
                  >
                    <minusIcon class="w-4 h-4" fill="currentColor" />
                  </button>

                  <div class="flex flex-col items-center justify-center space-y-2">
                    <select 
                      id="speed-selector"
                      v-model="selectedSpeed"
                      class="bg-white border-none text-black text-sm rounded-lg focus:ring-nt-cyan-light focus:border-nt-cyan-light block w-full p-2.5 text-center">
                      <option value="" disabled>{{ $t('spiral.timeTravel.speedSelector') }}</option>
                      <option v-for="(speed, index) in travelSpeeds" :key="index" :value="index" class="text-center">
                        {{ speed.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Plus button -->
                  <button 
                    @click.stop.prevent="incrementTime" 
                    v-longclick="incrementTime" 
                    class="w-8 h-8 flex items-center justify-center bg-white rounded-full transition duration-300 ease-in-out transform hover:bg-nt-cyan-light cursor-pointer select-none"
                  >
                    <plusIcon class="w-4 h-4" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </Transition>
          
          <!-- TUTORIAL CONTROL PANEL -->
          <div v-if="spiralTutorialMode && spiralTutorialCurrentStep < spiralTutorialStepsTotal" 
            class="flex justify-center items-center bg-white space-x-4 mt-3 w-fit mx-auto font-mono text-sm font-extrabold px-6 py-2 rounded-full shadow-lg"
            :class="spiralVerticalMode ? 'fixed' : ''">
            
            <!-- Previous step -->
            <arrowsIcon 
              @click.stop.prevent="spiralTutorialCurrentStep > 0 ? spiralTutorialCurrentStep-- : null"
              fill="currentColor"
              class="w-8 h-8 rotate-180 p-1 bg-nt-cyan-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10 select-none"
              :class="spiralTutorialCurrentStep > 0 ? 'text-black hover:bg-nt-cyan-lighter cursor-pointer' : 'opacity-20'"  />
            
              <!-- Tutorial step -->
            <span v-if="spiralTutorialMode" class="text-md text-slate-600">{{ $t('spiral.tutorial.tutorialStep') }} <span class="">{{ String(spiralTutorialCurrentStep + 1).padStart(2, '0') }}/{{ String(spiralTutorialStepsTotal + 1).padStart(2, '0') }}</span></span>
            
            <!-- Next step -->
            <arrowsIcon 
              @click.stop.prevent="spiralTutorialCurrentStep < spiralTutorialStepsTotal ? spiralTutorialCurrentStep++ : null"
              fill="currentColor"
              class="w-8 h-8 p-1 bg-nt-cyan-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10 select-none"
              :class="spiralTutorialCurrentStep < spiralTutorialStepsTotal ? 'text-black hover:bg-nt-cyan-light cursor-pointer' : 'opacity-20'"  />
          </div>

          <!-- BOTTOM BUTTONS -->
          <div v-if="(spiralWelcomeMode && !spiralActivePanel) || (spiralTutorialMode && spiralTutorialCurrentStep == spiralTutorialStepsTotal)"
            class="flex flex-row items-center justify-center text-sm space-x-4 mt-3 mb-1">
            
            <!-- Start tutorial -->
            <button 
              v-if="!spiralTutorialMode" 
              @click="spiralTutorialMode = true" 
              class="flex item-center justify-center text-black bg-nt-cyan-light hover:bg-nt-cyan-lighter font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg">
              {{ $t('spiral.tutorial.startButton') }}
            </button>
            
            <!-- Configure -->
            <button 
              v-if="!spiralTutorialMode || spiralTutorialMode && spiralTutorialCurrentStep == spiralTutorialStepsTotal"
              @click="() => { spiralTutorialMode = false; openPanel(AVAILABLE_PANELS.locationPicker); }" 
              class="flex items-center text-black hover:bg-slate-300 font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg"
              :class="spiralTutorialMode && spiralTutorialCurrentStep == spiralTutorialStepsTotal ? 'bg-nt-cyan-light': 'bg-slate-200'">
              {{ spiralWelcomeMode && !spiralTutorialMode ? $t('spiral.tutorial.skipWelcomeButton') : $t('spiral.tutorial.configureButton') }}
            </button>
          </div>
        </footer>
      </div>
    </div>
    
    <!-- RIGHT MODAL PANELS -->
    <div v-if="spiralActivePanel !== null" class="z-30 transition-all duration-300 ease-in-out w-screen max-h-screen md:w-1/2 xl:w-1/3 md:fixed md:right-0 md:bottom-0 md:top-0 md:p-8">
      <div class="overflow-hidden w-full h-full bg-slate-800 md:rounded-2xl md:shadow-2xl">
        <button v-if="spiralActivePanel" @click="spiralActivePanel = null" 
        class="absolute z-50 top-2 right-3 md:top-4 md:right-4 md:p-2 p-1 rounded-full bg-slate-600 text-slate-50 focus:outline-none transition-all duration-300 hover:bg-slate-700">
        <closeIcon class="w-6 h-6" fill="currentColor" />
      </button>
      
      <div class="overflow-hidden h-full">
        <!-- LOCATION PICKER -->
        <LocationPicker viewType="spiral" v-if="spiralActivePanel === AVAILABLE_PANELS.locationPicker" @save="() => { spiralActivePanel = null; spiralWelcomeMode = false; }" />
        <!-- FAQ -->
        <div class="py-6 px-4 h-full overflow-auto touch-pan-y">
          <FAQAccordion v-if="spiralActivePanel === AVAILABLE_PANELS.faq" :categories="[3]" />
        </div>
      </div>
    </div>
  </div>
  
  <!-- TOP RIGHT MENU -->
  <div v-if="!spiralActivePanel && !spiralWelcomeMode && !spiralTutorialMode && !spiralTimeTravelMode" 
       class="fixed top-3 md:top-4 right-3 md:right-4 z-30">
    <div class="relative flex gap-2">
      <!-- Vertical mode button -->
      <button 
        @click="toggleVerticalMode" 
        class="group p-2 rounded-full focus:outline-none transition-all duration-300 bg-white text-black hover:bg-slate-100"
        :title="spiralVerticalMode ? $t('spiral.menu.viewMode.spiralTitle') : $t('spiral.menu.viewMode.verticalTitle')">
        <component 
          :is="spiralVerticalMode ? thirteenMoonIcon : verticalSpiralIcon" 
          class="w-6 h-6"
        />
      </button>

      <!-- Menu button -->
      <button @click="toggleMenu" class="p-2 rounded-full bg-nt-cyan-light text-black focus:outline-none transition-all duration-300 hover:bg-nt-cyan-lighter">
        <div class="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
          <span :class="['block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out', 
            isMenuOpen ? 'rotate-45 translate-y-2' : '']"></span>
          <span :class="['block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
            isMenuOpen ? 'opacity-0' : '']"></span>
          <span :class="['block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
            isMenuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
        </div>
      </button>
    </div>

    <!-- Menu Dropdown -->
    <div v-if="isMenuOpen"
      class="absolute right-0 mt-2 w-48 max-w-screen rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5">
      <div class="pt-1 pb-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <!-- SETTINGS -->
        <div class="px-4 pt-2 pb-0 text-sm text-nt-cyan-dark font-bold">{{ $t('spiral.menu.settings') }}</div>
        <!-- Location Picker -->
        <a 
          @click="openPanel(AVAILABLE_PANELS.locationPicker)" 
          class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-slate-700 flex items-center" 
          role="menuitem">
          <mapIcon class="w-6 h-6 mr-2" fill="currentColor"/>{{ $t('spiral.menu.locationPicker') }}
        </a>
        
        <!-- HELP SECTION -->
        <div class="px-4 pt-3 pb-0 text-sm text-nt-cyan-dark font-bold">{{ $t('spiral.menu.understanding') }}</div>
        <!-- Tutorial -->
        <a 
          @click="toggleTutorial" 
          class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-nt-cyan-darker hover:bg-opacity-30 flex items-center" 
          role="menuitem">
          <learnIcon class="w-6 h-6 mr-2" fill="currentColor"/>{{ $t('spiral.menu.startTutorial') }}
        </a>
        <!-- FAQ -->
        <a 
          @click="openPanel(AVAILABLE_PANELS.faq)" 
          class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-slate-700 flex items-center" 
          role="menuitem">
          <faqIcon class="w-6 h-6 mr-2" fill="currentColor"/>{{ $t('spiral.menu.faq') }}
        </a>
        
        <!-- SPECIAL MODES -->
        <div class="px-4 pt-3 pb-0 text-sm text-nt-cyan-dark font-bold">{{ $t('spiral.menu.specialMode') }}</div>
        <!-- Time Travel -->
        <a 
          @click="toggleTimeTravel" 
          class="px-4 py-2 cursor-pointer text-sm text-slate-300 hover:bg-nt-cyan-darker hover:bg-opacity-30 flex items-center" 
          :class="spiralTimeTravelMode ? 'bg-nt-cyan-ultralight' : ''"
          role="menuitem">
          <timeTravelIcon class="w-6 h-6 mr-2" fill="currentColor"/>{{ $t('spiral.menu.timeTravel') }}
        </a>
      </div>
    </div>
  </div>

  <!-- Add overlay -->
  <div v-if="isMenuOpen" 
    @click="toggleMenu"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]">
  </div>

  <!-- TUTORIAL CLOSE BUTTON -->
  <button 
    v-if="spiralTutorialMode"
    @click="spiralTutorialMode = false" 
    class=" absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-cyan-light text-black hover:bg-nt-cyan-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
    <span>{{ $t('spiral.tutorial.skipButton') }}</span>
    <closeIcon class="w-4 h-4 bg-black rounded-full text-nt-cyan-light" fill="currentColor" />
  </button>

  <!-- TIME TRAVEL CLOSE BUTTON -->
  <button 
    v-if="spiralTimeTravelMode"
    @click="closeTimeTravel" 
    class="fixed z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-cyan-light text-black hover:bg-nt-cyan-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
    <span>{{ $t('spiral.timeTravel.exitButton') }}</span>
    <closeIcon class="w-4 h-4 bg-black rounded-full text-white" fill="currentColor" />
  </button>

  <!-- TIME TRAVEL RESET BUTTON -->
  <button 
    v-if="spiralTimeTravelMode"
    :disabled="!timeDelta"
    @click="resetTime" 
    class="fixed z-40 top-14 right-4 bg-slate-200 hover:bg-slate-300 text-xs text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-0">
    {{ $t('spiral.timeTravel.resetButton') }}
  </button>

  <!-- Update the notification to use context.location -->
  <transition name="fade">
    <div v-if="showPositionChangedNotification && shouldShowNotification && spiralActivePanel !== AVAILABLE_PANELS.locationPicker" 
         class="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
      <div class="p-4">
        <p class="text-sm text-gray-700 mb-3">{{ $t('spiral.notifications.geolocation.title') }}</p>
        <div class="flex justify-between space-x-2">
          <button @click="preventNotificationForOneDay" class="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200">
            {{ $t('spiral.notifications.geolocation.ignoreButton') }}
          </button>
          <div class="flex space-x-2">
            <button @click="openPanel(AVAILABLE_PANELS.locationPicker)" 
                    class="bg-nt-cyan-light text-black text-xs py-1 px-3 rounded-md transition duration-200 ease-in-out hover:bg-nt-cyan-lighter">
              {{ $t('spiral.notifications.geolocation.updateButton') }}
            </button>
            <button @click="closeNotification" 
                    class="bg-slate-100 text-black text-xs py-1 px-3 rounded-md transition duration-200 ease-in-out hover:bg-slate-200">
              {{ $t('spiral.notifications.geolocation.dismissButton') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!-- DEFINE GLOBAL CSS VARS -->
  <component :is="'style'">
    :root {
    --hemisphere: {{ context.hemisphere }};
    }
  </component>
</div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useHead } from '@unhead/vue';
import { storeToRefs } from 'pinia'
import { NaturalDate } from 'natural-time-js';
import { NaturalSunAltitude, NaturalSunEvents } from 'natural-time-js';
import { useI18n } from 'vue-i18n'
import { createApp } from 'vue';
import { showModalNotification, hideModalNotification } from '@/utils/notificationManager';

// Store imports
import { useContextStore } from '@/stores/contextStore'
import { useConfigStore, AVAILABLE_PANELS } from '@/stores/configStore'

// Component imports
import Moon from '@/components/MoonComponent.vue';
import FAQAccordion from '@/components/FAQAccordion.vue';
import MainMenu from '@/components/MainMenu.vue';
import DisplayComponent from '@/components/DisplayComponent.vue';

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
import verticalSpiralIcon from '@/assets/icon/vertical-spiral-icon.svg';
import thirteenMoonIcon from '@/assets/icon/13-moon-icon.svg';
import plusIcon from '@/assets/icon/plus-icon.svg';
import minusIcon from '@/assets/icon/minus-icon.svg';

// Store setup
const contextStore = useContextStore()
contextStore.init();

const configStore = useConfigStore()
const { spiralSkin: rawSpiralSkin, spiralWelcomeMode, spiralTutorialMode, spiralTutorialStepsTotal, spiralTutorialCurrentStep, spiralTimeTravelMode, spiralActivePanel, spiralVerticalMode } = storeToRefs(configStore);

// I18n setup
const i18n = useI18n();

// Computed property to get the translated skin
const spiralSkin = computed(() => {
  return configStore.getTranslatedSpiralSkin(i18n.t);
});

// SEO Meta tags
const metaTitle = i18n.t('spiral.meta.title');
const metaDescription = i18n.t('spiral.meta.description');
const metaOgImage = i18n.t('spiral.meta.ogImage');
const metaOgUrl = i18n.t('spiral.meta.ogUrl');

useHead({
  title: metaTitle,
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

// Refs and computed properties
let { latitude, longitude, location, currentTime, geolocationNotificationDismissedAt, positionChanged, enableGeolocation } = storeToRefs(contextStore);
let showPositionChangedNotification = ref(false);
const isMenuOpen = ref(false);
const containerSize = ref(333);

// Time travel setup
const travelSpeeds = computed(() => [
  { value: 1000 * 60 * 60 * 24, label: i18n.t('spiral.timeTravel.speeds[0].label') },
  { value: 1000 * 60 * 60 * 24 * 7, label: i18n.t('spiral.timeTravel.speeds[1].label') },
  { value: 1000 * 60 * 60 * 24 * 28, label: i18n.t('spiral.timeTravel.speeds[2].label') },
]);
const selectedSpeed = ref(0);
const timeDelta = ref(0);

// Computed properties
const context = computed(() => {
  let theCurrentTime = spiralSkin.value.context?.currentTime ? spiralSkin.value.context.currentTime : currentTime.value + timeDelta.value;
  let theLongitude = spiralSkin.value.context?.longitude != null ? spiralSkin.value.context.longitude : longitude.value;
	let theLatitude = spiralSkin.value.context?.latitude != null ? spiralSkin.value.context.latitude : latitude.value;
  
  const naturalDate = new NaturalDate(new Date(theCurrentTime), theLongitude);
	
  // Compute Sun data
	let sun = {
		...NaturalSunAltitude(naturalDate, theLatitude),
		...NaturalSunEvents(naturalDate, theLatitude)
	};

  let hemisphere = theLatitude >= 0 ? 1 : -1;

  return {
    naturalDate: new NaturalDate(new Date(theCurrentTime), theLongitude),
    location: location.value,
    hemisphere: hemisphere,
  };
});

const today = computed(() => context.value.naturalDate);

const shouldShowNotification = computed(() => {
  if (!geolocationNotificationDismissedAt.value) return true;
  const oneDay = 24 * 60 * 60 * 1000;
  return (new Date() - new Date(geolocationNotificationDismissedAt.value)) > oneDay;
});

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleTutorial = async () => {
  spiralTutorialMode.value = !spiralTutorialMode.value;
  isMenuOpen.value = false;
  closeTimeTravel();
  spiralVerticalMode.value = false;
  // Wait for DOM update before recalculating scale
  await nextTick();
  updateScale();
};

const toggleTimeTravel = () => {
  spiralTimeTravelMode.value = !spiralTimeTravelMode.value;
  isMenuOpen.value = false;
  if (spiralTimeTravelMode.value) {
    spiralActivePanel.value = null;
    spiralTutorialMode.value = false;
    
      // Show time travel welcome notification through manager
      showModalNotification({
        title: i18n.t('tutorials.timeTravel.notification.title'),
        message: i18n.t('tutorials.timeTravel.notification.message'),
        type: 'spiral'
      }, i18n);
  }
};

const openPanel = (panel) => {
  spiralActivePanel.value = panel;
  isMenuOpen.value = false;
  spiralTutorialMode.value = false;
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
  spiralTimeTravelMode.value = false;
  timeDelta.value = 0;
    hideModalNotification();
};

const incrementTime = () => timeDelta.value += travelSpeeds.value[selectedSpeed.value].value;	
const decrementTime = () => timeDelta.value -= travelSpeeds.value[selectedSpeed.value].value;
const resetTime = () => timeDelta.value = 0;

// Lifecycle hooks
onMounted(() => {
  // Deactivate time travel mode on launch
  spiralTimeTravelMode.value = false;
  timeDelta.value = 0;

  if (enableGeolocation.value) {
    // Wait 10 seconds before calculating whether to show the notification
    setTimeout(() => {
      if (enableGeolocation.value && positionChanged.value && shouldShowNotification.value) {
        showPositionChangedNotification.value = true;
      }
    }, 10000);
  }
  
  // Show tutorial welcome notification if tutorial mode is active
  if (spiralTutorialMode.value && spiralTutorialCurrentStep.value === 0) {
    showModalNotification({
      title: i18n.t('tutorials.spiral.notification.title'),
      message: i18n.t('tutorials.spiral.notification.message'),
      type: 'spiral'
    }, i18n);
  }
  
  // Watchers
  watch([() => spiralSkin.value.animationSpeed, () => spiralTimeTravelMode.value], ([newSpeed, newTimeTravelMode]) => {
    document.documentElement.style.setProperty('--nt-animation-speed', newSpeed && !newTimeTravelMode ? `${newSpeed}s` : '0s');
  }, { immediate: true });
  
  // Watch for tutorial mode changes to show welcome notification
  watch(() => spiralTutorialMode.value, (newValue) => {
    if (newValue && spiralTutorialCurrentStep.value === 0) {
      showModalNotification({
        title: i18n.t('tutorials.spiral.notification.title'),
        message: i18n.t('tutorials.spiral.notification.message'),
        type: 'spiral'
      }, i18n);
    }
  });
});

// Spiral Sizing
const yearWrapper = ref(null);
let resizeObserver = null;

const updateScale = () => {
	const maxWidth = yearWrapper.value.offsetWidth;
	const maxHeight = yearWrapper.value.offsetHeight;

  containerSize.value = !spiralVerticalMode.value ? Math.min(maxWidth / 4.01, maxHeight / 4.01 * 7 / 4) : maxWidth * 0.75 ; // 4.01 is the magic number to avoid problems with large aspect ratio screens
};

onMounted(() => {
  updateScale();

  resizeObserver = new ResizeObserver(updateScale);
  if (yearWrapper.value) {
    resizeObserver.observe(yearWrapper.value);
  }

  // Add scroll to current moon if starting in vertical mode
  if (spiralVerticalMode.value) {
    nextTick(() => {
      scrollToCurrentMoon();
    });
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const openTimeTravelAtDate = (date) => {
  if(spiralWelcomeMode.value === true) 
    return;

  spiralTimeTravelMode.value = true;
  timeDelta.value = date.unixTime - currentTime.value;
  spiralActivePanel.value = null;
  spiralTutorialMode.value = false;
};

const displayDate = computed(() => context.value.naturalDate);

const scrollToCurrentMoon = () => {
  if (spiralVerticalMode.value) {
    setTimeout(() => {
      const currentMoonElement = document.getElementById(`moon-${today.value.moon}`);
      if (currentMoonElement) {
        currentMoonElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 888); 
  }
};

const toggleVerticalMode = async () => {
  spiralVerticalMode.value = !spiralVerticalMode.value;
  isMenuOpen.value = false;
  await nextTick();
  updateScale();

  if (spiralVerticalMode.value) {
    await nextTick(); // Wait for DOM to update with vertical layout
    scrollToCurrentMoon();
  }
};

// Also add a watch for tutorial step changes
watch([spiralTutorialCurrentStep], async () => {
  await nextTick();
  updateScale();
});

// Add this method to handle touch events
const handleTouchMove = (event) => {
  // Allow scrolling if we're in the FAQ panel or in vertical mode
  if (spiralVerticalMode.value || event.target.closest('.overflow-auto')) {
    return;
  }
  // Prevent default behavior for the rest of the app
  event.preventDefault();
};

</script>


<style lang="scss">

#year {
	#moon-1 { 
    order: 10; 
    .moon-left { @apply rounded-tl-sm md:rounded-tl-xl rounded-bl-sm md:rounded-bl-xl; }
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-2 { 
    order: 20; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-3 { 
    order: 30; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-4 { 
    order: 40; 
    .moon-center { @apply rounded-tr-sm md:rounded-tr-xl; }
    .moon-top, .moon-right { @apply hidden; }
  }
	#moon-5 { 
    order: 80; 
    .moon-left, .moon-right { @apply hidden; }
  }
	#moon-6 { 
    order: 110; 
    .moon-left, .moon-right { @apply hidden; }
  }
	#moon-7 { 
    order: 150; 
    .moon-center { @apply rounded-br-sm md:rounded-br-xl; }
    .moon-bottom, .moon-right { @apply hidden; }
  }
	#moon-8 { 
    order: 140; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-9 { 
    order: 130; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-10 { 
    order: 120; 
    .moon-center { @apply rounded-bl-sm md:rounded-bl-xl; }
    .moon-bottom, .moon-left { @apply hidden; }
  }
	#moon-11 { 
    order: 90; 
   .moon-left, .moon-right { @apply hidden; }
  }
	#moon-12 { 
    order: 50; 
    .moon-center { @apply rounded-tl-sm md:rounded-tl-xl; }
    .moon-top, .moon-left { @apply hidden; }
  }
	#moon-13 { 
    order: 60; 
    .moon-right { @apply rounded-tr-sm md:rounded-tr-xl rounded-br-sm md:rounded-br-xl; }
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-14 { 
    order: 70; 
    .moon-top, .moon-bottom, .moon-left, .moon-right { @apply hidden; }
  }

	#display {
		order: 100;
		.center-me {
			top: 60%;
			left: 52%;
		}
	}
}

#legend {
  @apply absolute z-[3000] bottom-6 left-1/2 -translate-x-1/2 font-mono text-center text-[#7B7A8B] opacity-65 text-[1.1em] uppercase break-normal w-full cursor-pointer;
  
  &:hover {
    @apply underline;
  }
}

#year {
  &.vertical-mode {
    @apply flex-col items-center gap-4 pt-20 pb-20;
    min-height: 100%;
    
    #moon-1 { order: 10; }
    #moon-2 { order: 20; }
    #moon-3 { order: 30; }
    #moon-4 { order: 40; }
    #moon-5 { order: 50; }
    #moon-6 { order: 60; }
    #moon-7 { order: 70; }
    #moon-8 { order: 80; }
    #moon-9 { order: 90; }
    #moon-10 { order: 100; }
    #moon-11 { order: 110; }
    #moon-12 { order: 120; }
    #moon-13 { order: 130; }
    #moon-14 { order: 140; background-color: transparent; &::after { display: none; } }

    .moon-left, .moon-right, .moon-top, .moon-bottom {
      @apply hidden !important;
    }

    [id^="moon-"] {
      @apply w-full flex justify-center p-6 my-4 bg-white rounded-xl relative;

      .moon-center {
        @apply rounded-md;
      }
      
      // Add transform to create curve effect
      &:nth-child(odd) {
        transform: translateX(5%);
      }
      
      &:nth-child(even) {
        transform: translateX(-5%);
      }

      // Add subtle rotation
      &:nth-child(4n+1) { transform: translateX(7%) rotate(1deg); }
      &:nth-child(4n+2) { transform: translateX(-5%) rotate(-1deg); }
      &:nth-child(4n+3) { transform: translateX(3%) rotate(0.5deg); }
      &:nth-child(4n+4) { transform: translateX(-7%) rotate(-0.5deg); }

      // Add transition for smooth hover effect
      transition: all 0.3s ease-in-out;

      // Hover effect to emphasize curve
      &:not(#moon-14):hover {
        @apply shadow-lg;
      }

      // Rest of existing moon styles...
      .moon-center {
        @apply bg-opacity-0;
      }
      .day-of-moon.isFuture {
        @apply opacity-50;
      }
      &:not(#moon-14)::after {
        opacity: 1;
      }
    }

    // Adjust display component position
    #display {
      order: 150;
      @apply w-full pt-8 pb-48 -translate-y-4;
      transform: translateX(0) !important; // Ensure display stays centered
      .digit { @apply text-3xl; }
      .label { @apply text-xl; }
      .absolute { @apply top-[20%]; }
    }

  }
}

#moons-view {
  &:not(.vertical-mode) {
    overscroll-behavior: none;
    -webkit-overflow-scrolling: none;
    &:not(.overflow-auto) {
      touch-action: none;
    }
  }

  &.vertical-mode {
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }
}

.overflow-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior-y: contain;
  touch-action: pan-y !important;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: var(--nt-animation-speed);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-zoom-enter-to,
.fade-zoom-leave-from {
  opacity: 1;
  transform: scale(1);
}

</style>
