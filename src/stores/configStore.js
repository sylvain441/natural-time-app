import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { clockSkins } from './clockSkins.js';
import { spiralSkins } from './spiralSkins.js';

export const AVAILABLE_PANELS = {
  locationPicker: 'locationPicker',
  faq: 'faq',
}

export const useConfigStore = defineStore('appConfig', () => {
  
  // CLOCK
  const clockWelcomeMode = ref(true);
  const clockTutorialMode = ref(false);
  const clockTimeTravelMode = ref(false);
  const clockSimplifiedMode = ref(false);

  const clockTutorialStepsTotal = computed(() => Object.keys(clockSkins.full.tutorial).length - 1);
  const clockTutorialCurrentStep = ref(0);
  
	const clockActivePanel = ref(null);

  const clockSkin = computed(() => ({
		// Default clockSkin
    ...clockSkins.full.default,
    // Remove graduations and animations in simplified mode
    ...(!clockWelcomeMode.value && !clockTutorialMode.value && clockSimplifiedMode.value && clockSkins.full.simplifiedMode),
    // Welcome clockSkin
    ...(!clockActivePanel.value && clockWelcomeMode.value ? clockSkins.full.welcome : {}),
    // Tutorial clockSkin
    ...(clockTutorialMode.value ? clockSkins.full.tutorial[clockTutorialCurrentStep.value] : {}),
  }));

  // When closing tutorial, rewind to step #1
  watch(clockTutorialMode, (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
      clockTutorialCurrentStep.value = 0;
    } else {
      clockActivePanel.value = null;
    }
  });


  const spiralWelcomeMode = ref(true);
  const spiralTutorialMode = ref(false);
  const spiralTimeTravelMode = ref(false);
  const spiralVerticalMode = ref(false);
  const spiralTutorialStepsTotal = computed(() => Object.keys(spiralSkins.full.tutorial).length - 1);
  const spiralTutorialCurrentStep = ref(0);
  
	const spiralActivePanel = ref(null); // Can be 'locationPicker', or 'faq'

  const spiralShowTitle = ref(true);

  const spiralSkin = computed(() => ({
		// Default clockSkin
    ...spiralSkins.full.default,
    // Hide title
    ...((!spiralWelcomeMode.value && spiralShowTitle.value === false) && spiralSkins.full.hideTitle),
    // Welcome spiralSkin
    ...(!spiralActivePanel.value && spiralWelcomeMode.value ? spiralSkins.full.welcome : {}),
    // Tutorial spiralSkin
    ...(spiralTutorialMode.value ? spiralSkins.full.tutorial[spiralTutorialCurrentStep.value] : {}),
  }));

  // When closing spiral tutorial, rewind to step #1
  watch(spiralTutorialMode, (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
      spiralTutorialCurrentStep.value = 0;
    } else {
      spiralActivePanel.value = null;
    }
  });

  const hemisphereNotificationDismissed = ref(false);
  const hemisphereNotificationDismissedAt = ref(null);

  return {
    AVAILABLE_PANELS,
    clockWelcomeMode,
    clockTutorialMode,
    clockTimeTravelMode,
    clockTutorialStepsTotal,
    clockTutorialCurrentStep,
    clockActivePanel,
    clockSimplifiedMode,
    spiralWelcomeMode,
    spiralTutorialMode,
    spiralTimeTravelMode,
    spiralTutorialStepsTotal,
    spiralTutorialCurrentStep,
    spiralActivePanel,
    spiralShowTitle,
    spiralVerticalMode,
    clockSkin,
    spiralSkin,
    hemisphereNotificationDismissed,
    hemisphereNotificationDismissedAt,
  };
}, {
  persist: {
    key: 'configStore',
  },
});