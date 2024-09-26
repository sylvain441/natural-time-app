import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { skins } from './skins.js';

const TUTORIAL_STEPS_COUNT = Object.keys(skins.full.tutorial).length;
export const AVAILABLE_PANELS = {
  locationPicker: 'locationPicker',
  clockSettings: 'clockSettings',
  faq: 'faq'
}

export const useConfigStore = defineStore('appConfig', () => {
  
  const askForGeolocation = ref(false);

  const welcomeMode = ref(true);
  const tutorialMode = ref(false);
  const timeTravelMode = ref(false);

  const uiTutorialStepsTotal = computed(() => TUTORIAL_STEPS_COUNT - 1);
  const uiTutorialCurrentStep = ref(0);
  
	const uiActivePanel = ref(null); // Can be 'locationPicker', 'clockSettings', or 'faq'

  const uiShowClockGraduations = ref(true);
  const uiShowClockAnimations = ref(true);
  const uiShowClockTitle = ref(true);

  const skin = computed(() => ({
		// Default skin
    ...skins.full.default,
    // Remove graduations
    ...((!welcomeMode.value && !uiShowClockGraduations.value) && skins.full.hideClockGraduations),
    // Reduce animations
    ...((!welcomeMode.value && !uiShowClockAnimations.value) && skins.full.hideClockAnimations),
		// Welcome skin
    ...(!uiActivePanel.value && welcomeMode.value ? skins.full.welcome : {}),
    // Tutorial skin
    ...(tutorialMode.value ? skins.full.tutorial[uiTutorialCurrentStep.value] : {}),
  }));

  // When closing tutorial, rewind to step #1
  watch(tutorialMode, (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
      uiTutorialCurrentStep.value = 0;
    } else {
      uiActivePanel.value = null;
    }
  });

  return {
    AVAILABLE_PANELS,
    askForGeolocation,
    uiShowClockGraduations,
    uiShowClockAnimations,
    uiShowClockTitle,
    skin,
    uiTutorialStepsTotal,
    uiTutorialCurrentStep,
    welcomeMode,
    tutorialMode,
    timeTravelMode,
    uiActivePanel
  };
}, {
  persist: {
    key: 'configStore',
    storage: localStorage,
  },
});