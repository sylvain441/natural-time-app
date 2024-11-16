<template>
  <div id="moons-view" class="flex flex-row h-dvh relative overflow-hidden bg-white dark:bg-slate-300 bg-[url('@/assets/debut-light.png')]">
    
    <div :class="['relative h-full transition-all duration-300 ease-in-out', (spiralActivePanel) ? 'md:block md:w-1/2 xl:w-2/3' : 'w-full']">
      
      <!-- MAIN MENU -->  
      <MainMenu />
      
      <div 
        class="fixed z-10 inset-0 h-full px-2 pt-8 transition-all duration-300 ease-in-out"
        :class="[
          !spiralActivePanel ? 'md:px-[14%]' : 'md:px-[3%]', 
          spiralTimeTravelMode || spiralTutorialMode ? 'md:border-8 md:border-nt-cyan-light' : '', 
          (spiralShowTitle ? 'pb-40' : 'pb-10'), 
          (spiralTutorialMode ? 'pb-48' : ''), 
          (spiralTimeTravelMode ? 'pb-36' : ''), 
          spiralSkin.singleMoonView ? 'px-4 md-px-12' : '']"
        style="width: inherit;">
        
        <!-- MOONS COMPONENT -->
        <div ref="yearWrapper" class="w-full h-full relative drop-shadow-2xl">
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Transition name="scale-with-delay">
              <div id="year" :style="yearStyle" class="flex flex-wrap items-center" :class="{'single-moon-mode': spiralSkin.singleMoonView}">
                <!-- Display component -->
                <DisplayComponent 
                  :display-date="displayDate"
                  :context="context"
                  class="relative"
                  :class="{'w-1/2 h-1/4': !spiralSkin.singleMoonView}"
                />
                
                <!-- 13 Moons -->
                <template v-if="!spiralSkin.singleMoonView">
                  <Moon v-for="moon in 14" 
                    :key="moon"
                    :id="`moon-${moon}`"
                    :today="today" 
                    :moon="moon" 
                    @open-time-travel="openTimeTravelAtDate"
                    class="w-1/4 h-1/4"
                  />
                </template>
                <!-- Current Moon -->
                <template v-else>
                  <div class="rounded-3xl mx-auto h-fit" :class="{'bg-white': today.moon != 14}">
                    <Moon 
                      :id="`moon-${today.moon}`"
                      :today="today" 
                      :moon="today.moon"
                      :baseSize="60"
                      :spacing="12" 
                      @open-time-travel="openTimeTravelAtDate"
                      class="current-moon-component"
                    />
                  </div>
                </template>
              </div>
            </Transition>
          </div>
        </div>
        
        <!-- FOOTER -->
        <footer class="z-20 absolute bottom-0 left-0 text-center flex flex-col items-center p-6 pb-6 md:pb-12 w-full">
          <Transition name="fade">
            <div v-if="!spiralTimeTravelMode && spiralShowTitle">
              <!-- TITLE -->
              <h1 
                @click="openPanel(AVAILABLE_PANELS.locationPicker)"
                class="font-extrabold text-base md:text-xl mt-1 mb-2 text-black cursor-pointer"
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
                  {{  "Spirale des 13 lunes" }}
                </span>
              </h1>
              
              <!-- SUBTITLE -->
              <div v-if="!spiralTutorialMode && !spiralWelcomeMode && latitude && longitude">
                <h2 class="flex justify-evenly items-center text-slate-400 font-medium text-sm md:text-xl space-x-4">
                  <span class="font-extrabold text-lg bg-black text-nt-cyan-lighter font-mono px-2 py-0 mb-3">
                    {{ context.naturalDate.toTimeString() }}
                  </span>
                </h2>
              </div>
              <div v-else>
                <h2 class="text-slate-500 text-md md:text-xl">
                  {{ spiralSkin.descriptionText }}
                </h2>
              </div>
            </div>
          </Transition>
          
          <!-- TIME TRAVEL CONTROL PANEL -->
          <Transition name="fade">
            <div v-if="spiralTimeTravelMode" 
              class="bg-white max-w-md mx-auto font-extrabold py-3 px-8 rounded-full shadow-lg relative">
              <div class="flex items-center justify-center space-x-2">
                <arrowsIcon 
                  @click.stop.prevent="decrementTime" 
                  v-longclick="decrementTime" 
                  fill="currentColor"
                  class="w-8 h-8 rotate-180 p-1 bg-nt-cyan-lighter rounded-full transition duration-300 ease-in-out transform hover:bg-nt-cyan-light cursor-pointer select-none"
                />

                <div class="flex flex-col items-center justify-center space-y-2">
                  <select 
                    id="speed-selector"
                    v-model="selectedSpeed"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="" disabled>Vitesse de voyage</option>
                    <option v-for="(speed, index) in travelSpeeds" :key="index" :value="index">
                      {{ speed.label }}
                    </option>
                  </select>
                </div>

                <arrowsIcon 
                  @click.stop.prevent="incrementTime" 
                  v-longclick="incrementTime" 
                  fill="currentColor"
                  class="w-8 h-8 p-1 bg-nt-cyan-lighter rounded-full transition duration-300 ease-in-out transform hover:bg-nt-cyan-light cursor-pointer select-none"
                />
              </div>
            </div>
          </Transition>
          
          <!-- TUTORIAL CONTROL PANEL -->
          <div v-if="spiralTutorialMode && spiralTutorialCurrentStep < spiralTutorialStepsTotal" 
            class="flex justify-center items-center bg-white space-x-4 mt-3 w-fit mx-auto font-mono text-sm font-extrabold px-6 py-2 rounded-full shadow-lg relative">
            
            <!-- Previous step -->
            <arrowsIcon 
              @click.stop.prevent="spiralTutorialCurrentStep > 0 ? spiralTutorialCurrentStep-- : null"
              fill="currentColor"
              class="w-8 h-8 rotate-180 p-1 bg-nt-cyan-lighter rounded-full transition duration-300 ease-in-out transform disabled:opacity-10 select-none"
              :class="spiralTutorialCurrentStep > 0 ? 'text-black hover:bg-nt-cyan-lighter cursor-pointer' : 'opacity-20'"  />
            
              <!-- Tutorial step -->
            <span v-if="spiralTutorialMode" class="text-md text-slate-600">Tutoriel <span class="">{{ String(spiralTutorialCurrentStep + 1).padStart(2, '0') }}/{{ String(spiralTutorialStepsTotal + 1).padStart(2, '0') }}</span></span>
            
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
              Commencer ici
            </button>
            
            <!-- Configure -->
            <button 
              v-if="!spiralTutorialMode || spiralTutorialMode && spiralTutorialCurrentStep == spiralTutorialStepsTotal"
              @click="() => { spiralTutorialMode = false; openPanel(AVAILABLE_PANELS.locationPicker); }" 
              class="flex items-center text-black hover:bg-slate-300 font-bold py-2 px-4 transition duration-300 ease-in-out transform rounded-lg"
              :class="spiralTutorialMode && spiralTutorialCurrentStep == spiralTutorialStepsTotal ? 'bg-nt-cyan-light': 'bg-slate-200'">
              Configurer
            </button>
          </div>
        </footer>
      </div>
    </div>
    
    <!-- RIGHT MODAL PANELS -->
    <div v-if="spiralActivePanel !== null" class="z-30 transition-all duration-300 ease-in-out w-screen md:w-1/2 xl:w-1/3 md:relative md:p-8">
      <div class="overflow-hidden w-full h-full bg-white dark:bg-slate-800 md:rounded-2xl md:shadow-2xl">
        <button v-if="spiralActivePanel" @click="spiralActivePanel = null" 
        class="absolute z-50 top-4 right-3 md:top-4 md:right-4 md:p-2 p-1 rounded-full bg-slate-400 dark:bg-slate-600 text-slate-50 focus:outline-none transition-all duration-300 hover:bg-slate-600 dark:hover:bg-slate-700">
        <closeIcon class="w-6 h-6" fill="currentColor" />
      </button>
      
      <div class="overflow-hidden h-full">
        <!-- LOCATION PICKER -->
        <LocationPicker viewType="spiral" v-if="spiralActivePanel === AVAILABLE_PANELS.locationPicker" @save="() => { spiralActivePanel = null; spiralWelcomeMode = false; }" />
        <!-- SPIRAL SETTINGS -->
        <SpiralSettings v-if="spiralActivePanel === AVAILABLE_PANELS.spiralSettings" />
        <!-- FAQ -->
        <div class="py-6 px-4 h-full overflow-auto">
          <FAQAccordion v-if="spiralActivePanel === AVAILABLE_PANELS.faq" :categories="[3]" />
        </div>
      </div>
    </div>
  </div>
  
  <!-- TOP RIGHT MENU -->
  <div v-if="!spiralActivePanel && !spiralWelcomeMode && !spiralTutorialMode && !spiralTimeTravelMode" class="fixed top-3 md:top-4 right-3 md:right-4 z-30">
    <div class="relative flex flex-col gap-2">

      <!-- Settings button -->
      <button @click="toggleMenu" class="p-2 rounded-full bg-nt-cyan-lighter text-black focus:outline-none transition-all duration-300 hover:bg-nt-cyan-light">
        <settingsIcon class="w-6 h-6" />
      </button>

      <!-- Single Moon Toggle -->
      <button 
        @click="toggleSingleMoonMode" 
        class="p-2 rounded-full focus:outline-none transition-all duration-300 bg-slate-200 text-black hover:bg-slate-300"
        :title="spiralSingleMoonMode ? 'Afficher toutes les lunes' : 'Afficher la lune courante'">
        <component 
          :is="spiralSingleMoonMode ? thirteenMoonIcon : oneMoonIcon" 
          class="w-6 h-6"
        />
      </button>
      
      <Transition name="fade">
        <div v-if="isMenuOpen" class="absolute right-0 mt-12 w-48 max-w-screen rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
          <div class="pt-1 pb-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <!-- SETTINGS -->
            <div class="px-4 pt-2 pb-0 text-sm text-slate-400 dark:text-nt-cyan-dark font-bold">Paramètres</div>
            <!-- Location Picker -->
            <a 
              @click="openPanel(AVAILABLE_PANELS.locationPicker)" 
              class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center" 
              role="menuitem">
              <mapIcon class="w-6 h-6 mr-2" fill="currentColor"/>Emplacement
            </a>
            <!-- Spiral Settings -->
            <a 
              @click="openPanel(AVAILABLE_PANELS.spiralSettings)" 
              class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center" 
              role="menuitem">
              <brushIcon class="w-6 h-6 mr-2" fill="currentColor"/>Affichage
            </a>
            
            <!-- SPECIAL MODES -->
            <div class="px-4 pt-3 pb-0 text-sm text-slate-400 dark:text-nt-cyan-dark font-bold">Mode spéciaux</div>
            <!-- Tutorial -->
            <a 
              @click="toggleTutorial" 
              class="px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-nt-cyan-lighter dark:hover:bg-slate-700 flex items-center" 
              role="menuitem">
              <learnIcon class="w-6 h-6 mr-2" fill="currentColor"/>Tutoriel
            </a>
            <!-- Time Travel -->
            <a 
              @click="toggleTimeTravel" 
              class=" px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-nt-cyan-lighter dark:hover:bg-slate-700 flex items-center" 
              :class="spiralTimeTravelMode ? 'bg-nt-cyan-ultralight' : ''"
              role="menuitem">
              <timeTravelIcon class="w-6 h-6 mr-2" fill="currentColor"/>Voyage temporel
            </a>
            
            <!-- UNDERSTAND -->
            <div class="px-4 pt-3 pb-0 text-sm text-slate-400 dark:text-nt-cyan-dark font-bold">Aide</div>
            <!-- FAQ -->
            <a 
              @click="openPanel(AVAILABLE_PANELS.faq)" 
              class=" px-4 py-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center" 
              role="menuitem">
              <faqIcon class="w-6 h-6 mr-2" fill="currentColor"/>FAQ
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </div>

  <!-- TUTORIAL CLOSE BUTTON -->
  <button 
    v-if="spiralTutorialMode"
    @click="spiralTutorialMode = false" 
    class=" absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-cyan-light text-black hover:bg-nt-cyan-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
    <span>Passer le tutoriel</span>
    <closeIcon class="w-4 h-4 bg-black rounded-full text-nt-cyan-light" fill="currentColor" />
  </button>

  <!-- TIME TRAVEL CLOSE BUTTON -->
  <button 
    v-if="spiralTimeTravelMode"
    @click="closeTimeTravel" 
    class=" absolute z-40 top-4 right-4 flex items-center justify-center space-x-2 bg-nt-cyan-light text-black hover:bg-nt-cyan-lighter text-xs md:text-sm py-2 pl-4 pr-2 rounded transition duration-300 ease-in-out transform">
    <span>Quitter le voyage temporel</span>
    <closeIcon class="w-4 h-4 bg-black rounded-full text-white" fill="currentColor" />
  </button>

  <!-- TIME TRAVEL RESET BUTTON -->
  <button 
    v-if="spiralTimeTravelMode"
    :disabled="!timeDelta"
    @click="resetTime" 
    class="block absolute z-40 top-16 right-4 bg-slate-200 hover:bg-slate-300 text-xs text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-0">
    Remettre à zéro
  </button>

  <!-- Update the notification to use context.location -->
  <transition name="fade">
    <div v-if="showPositionChangedNotification && shouldShowNotification && spiralActivePanel !== AVAILABLE_PANELS.locationPicker" 
         class="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden max-w-sm">
      <div class="p-4">
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">Position GPS modifiée. Mettre à jour ?</p>
        <div class="flex justify-between space-x-2">
          <button @click="preventNotificationForOneDay" class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
            Ignorer aujourd'hui
          </button>
          <div class="flex space-x-2">
            <button @click="openPanel(AVAILABLE_PANELS.locationPicker)" 
                    class="bg-nt-cyan-light text-black text-xs py-1 px-3 rounded transition duration-200 ease-in-out hover:bg-nt-cyan-lighter">
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
</div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useHead } from '@unhead/vue';
import { storeToRefs } from 'pinia'
import { NaturalDate } from 'natural-time-js';

// Store imports
import { useContextStore } from '@/stores/contextStore'
import { useConfigStore, AVAILABLE_PANELS } from '@/stores/configStore'

// Component imports
import Moon from '@/components/MoonComponent.vue';
import FAQAccordion from '@/components/FAQAccordion.vue';
import MainMenu from '@/components/MainMenu.vue';
import SpiralSettings from '@/components/SpiralSettings.vue';
import DisplayComponent from '@/components/DisplayComponent.vue';

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
import oneMoonIcon from '@/assets/icon/1-moon-icon.svg';
import thirteenMoonIcon from '@/assets/icon/13-moon-icon.svg';

// Store setup
const contextStore = useContextStore()
contextStore.init();

const configStore = useConfigStore()
const { spiralSkin, spiralWelcomeMode, spiralTutorialMode, spiralTutorialStepsTotal, spiralTutorialCurrentStep, spiralTimeTravelMode, spiralActivePanel, spiralShowTitle, spiralSingleMoonMode } = storeToRefs(configStore);

// SEO Meta tags
const metaTitle = "Spirale des 13 lunes - Temps naturel - Une alternative au calendrier Grégorien";
const metaDescription = "Découvrir la spirale des 13 lunes de 28 jours qui remplace avec élégance nos 12 mois tout tordus";

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
  { value: 1000 * 60 * 60 * 24, label: '+/- 1 jour'},
  { value: 1000 * 60 * 60 * 24 * 7, label: '+/- 1 semaine'},
  { value: 1000 * 60 * 60 * 24 * 28, label: '+/- 1 lune'},
];
const selectedSpeed = ref(0);
const timeDelta = ref(0);

// Computed properties
const context = computed(() => {
  let theCurrentTime = spiralSkin.value.context?.currentTime ? spiralSkin.value.context.currentTime : currentTime.value + timeDelta.value;
  let theLongitude = spiralSkin.value.context?.longitude != null ? spiralSkin.value.context.longitude : longitude.value;
  return {
    naturalDate: new NaturalDate(new Date(theCurrentTime), theLongitude),
    location: location.value
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
    spiralSingleMoonMode.value = false;
  }
};

const openPanel = (panel) => {
  spiralActivePanel.value = panel;
  isMenuOpen.value = false;
  spiralTutorialMode.value = false;
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
  spiralTimeTravelMode.value = false;
  timeDelta.value = 0;
};

const incrementTime = () => timeDelta.value += travelSpeeds[selectedSpeed.value].value;	
const decrementTime = () => timeDelta.value -= travelSpeeds[selectedSpeed.value].value;
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
  // Watchers
  watch([() => spiralSkin.value.animationSpeed, () => spiralTimeTravelMode.value], ([newSpeed, newTimeTravelMode]) => {
    document.documentElement.style.setProperty('--nt-animation-speed', newSpeed && !newTimeTravelMode ? `${newSpeed}s` : '0s');
  }, { immediate: true });
});

// Spiral Sizing
const yearWrapper = ref(null);
const yearStyle = ref({});
let resizeObserver = null;

const updateScale = () => {
  const wrapperWidth = yearWrapper.value.offsetWidth;
  const wrapperHeight = yearWrapper.value.offsetHeight;
  const divWidth = spiralSkin.value.singleMoonView ? 471 : 1472;
  const divHeight = spiralSkin.value.singleMoonView ? 471 : 896;

  const scaleX = wrapperWidth / divWidth;
  const scaleY = wrapperHeight / divHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  yearStyle.value = {
    width: `${divWidth}px`,
    height: `${divHeight}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'center center'
  };
};

onMounted(() => {
  updateScale();

  resizeObserver = new ResizeObserver(updateScale);
  if (yearWrapper.value) {
    resizeObserver.observe(yearWrapper.value);
  }

  const currentMoon = document.querySelector('.currentMoon');
  if (currentMoon) {
    currentMoon.scrollIntoView({ behavior: 'smooth' });
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

const toggleSingleMoonMode = async () => {
  spiralSingleMoonMode.value = !spiralSingleMoonMode.value;
  // Wait for DOM update before recalculating scale
  await nextTick();
  updateScale();
};

// Also add a watch for tutorial step changes
watch([spiralTutorialCurrentStep], async () => {
  await nextTick();
  updateScale();
});

</script>


<style lang="scss">

#year {
  transform: scale(0.4);

	#moon-1 { 
    order: 1; 
    .moon-left { @apply rounded-tl-xl rounded-bl-xl; }
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-2 { 
    order: 2; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-3 { 
    order: 3; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-4 { 
    order: 4; 
    .moon-center { @apply rounded-tr-xl; }
    .moon-top, .moon-right { @apply hidden; }
  }
	#moon-5 { 
    order: 8; 
    .moon-left, .moon-right { @apply hidden; }
  }
	#moon-6 { 
    order: 11; 
    .moon-left, .moon-right { @apply hidden; }
  }
	#moon-7 { 
    order: 15; 
    .moon-center { @apply rounded-br-xl; }
    .moon-bottom, .moon-right { @apply hidden; }
  }
	#moon-8 { 
    order: 14; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-9 { 
    order: 13; 
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-10 { 
    order: 12; 
    .moon-center { @apply rounded-bl-xl; }
    .moon-bottom, .moon-left { @apply hidden; }
  }
	#moon-11 { 
    order: 9; 
   .moon-left, .moon-right { @apply hidden; }
  }
	#moon-12 { 
    order: 5; 
    .moon-center { @apply rounded-tl-xl; }
    .moon-top, .moon-left { @apply hidden; }
  }
	#moon-13 { 
    order: 6; 
    .moon-right { @apply rounded-tr-xl rounded-br-xl; }
    .moon-top, .moon-bottom { @apply hidden; }
  }
	#moon-14 { 
    order: 7; 
    .moon-top, .moon-bottom, .moon-left, .moon-right { @apply hidden; }
  }

	#display {
		order: 10;
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
  &.single-moon-mode {
    #display {
      order: 16;
      @apply w-full h-32;
      .digit{
        @apply text-5xl;
      }
      .label{
        @apply text-2xl;
      }
    }
  }

  .current-moon-component {
    transition: all 0.3s ease-in-out;
    .moon-top, .moon-bottom, .moon-left, .moon-right { @apply hidden; }
  }
}

.view-transition-enter-active,
.view-transition-leave-active {
  transition: all 0.5s ease-in-out;
}

.view-transition-enter-from,
.view-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
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

#year {
  &, .current-moon-component {
    transition: all var(--nt-animation-speed) ease-in-out;
  }
}

.view-transition-enter-active,
.view-transition-leave-active {
  transition: all var(--nt-animation-speed) ease-in-out;
}
</style>
