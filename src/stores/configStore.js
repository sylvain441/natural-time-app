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

  // Translates clock skin texts
  const getTranslatedClockSkin = (t) => {
    // Base skin with default properties
    let skin = {
      ...clockSkins.full.default,
    };
    
    // Apply simplified mode if needed
    if (!clockWelcomeMode.value && !clockTutorialMode.value && clockSimplifiedMode.value) {
      skin = {
        ...skin,
        ...clockSkins.full.simplifiedMode
      };
    }
    
    // Apply welcome skin if in welcome mode
    if (!clockActivePanel.value && clockWelcomeMode.value) {
      const welcomeSkin = { ...clockSkins.full.welcome };
      
      // Translate welcome description if key exists
      if (welcomeSkin.descriptionTextKey) {
        welcomeSkin.descriptionText = t(welcomeSkin.descriptionTextKey);
      }
      
      skin = {
        ...skin,
        ...welcomeSkin
      };
    }
    
    // Apply tutorial skin if in tutorial mode
    if (clockTutorialMode.value) {
      const tutorialStep = { ...clockSkins.full.tutorial[clockTutorialCurrentStep.value] };
      
      // Translate tutorial texts if keys exist
      if (tutorialStep.titleTextKey) {
        tutorialStep.titleText = t(tutorialStep.titleTextKey);
      }
      
      if (tutorialStep.descriptionTextKey) {
        tutorialStep.descriptionText = t(tutorialStep.descriptionTextKey);
      }
      
      skin = {
        ...skin,
        ...tutorialStep
      };
    }
    
    return skin;
  };

  // Computed property that will be used by components
  const clockSkin = computed(() => {
    // Returns an object without translation, components will use getTranslatedClockSkin
    // Base skin with default properties
    let skin = {
      ...clockSkins.full.default,
    };
    
    // Apply simplified mode if needed
    if (!clockWelcomeMode.value && !clockTutorialMode.value && clockSimplifiedMode.value) {
      skin = {
        ...skin,
        ...clockSkins.full.simplifiedMode
      };
    }
    
    // Apply welcome skin if in welcome mode
    if (!clockActivePanel.value && clockWelcomeMode.value) {
      skin = {
        ...skin,
        ...clockSkins.full.welcome
      };
    }
    
    // Apply tutorial skin if in tutorial mode
    if (clockTutorialMode.value) {
      skin = {
        ...skin,
        ...clockSkins.full.tutorial[clockTutorialCurrentStep.value]
      };
    }
    
    return skin;
  });

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

  // Translate spiral skin texts
  const getTranslatedSpiralSkin = (t) => {
    // Base skin with default properties
    let skin = {
      ...spiralSkins.full.default,
    };
    
    // Hide title if needed
    if (!spiralWelcomeMode.value && spiralShowTitle.value === false) {
      skin = {
        ...skin,
        ...spiralSkins.full.hideTitle
      };
    }
    
    // Apply welcome skin if in welcome mode
    if (!spiralActivePanel.value && spiralWelcomeMode.value) {
      const welcomeSkin = { ...spiralSkins.full.welcome };
      
      // Translate welcome description if key exists
      if (welcomeSkin.descriptionTextKey) {
        welcomeSkin.descriptionText = t(welcomeSkin.descriptionTextKey);
      }
      
      skin = {
        ...skin,
        ...welcomeSkin
      };
    }
    
    // Apply tutorial skin if in tutorial mode
    if (spiralTutorialMode.value) {
      const tutorialStep = { ...spiralSkins.full.tutorial[spiralTutorialCurrentStep.value] };
      
      // Translate tutorial texts if keys exist
      if (tutorialStep.titleTextKey) {
        tutorialStep.titleText = t(tutorialStep.titleTextKey);
      }
      
      if (tutorialStep.descriptionTextKey) {
        tutorialStep.descriptionText = t(tutorialStep.descriptionTextKey);
      }
      
      skin = {
        ...skin,
        ...tutorialStep
      };
    }
    
    return skin;
  };

  // Computed property that will be used by components
  const spiralSkin = computed(() => {
    // Returns an object without translation, components will use getTranslatedSpiralSkin
    // Base skin with default properties
    let skin = {
      ...spiralSkins.full.default,
    };
    
    // Hide title if needed
    if (!spiralWelcomeMode.value && spiralShowTitle.value === false) {
      skin = {
        ...skin,
        ...spiralSkins.full.hideTitle
      };
    }
    
    // Apply welcome skin if in welcome mode
    if (!spiralActivePanel.value && spiralWelcomeMode.value) {
      skin = {
        ...skin,
        ...spiralSkins.full.welcome
      };
    }
    
    // Apply tutorial skin if in tutorial mode
    if (spiralTutorialMode.value) {
      skin = {
        ...skin,
        ...spiralSkins.full.tutorial[spiralTutorialCurrentStep.value]
      };
    }
    
    return skin;
  });

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

  // Function to clear navigation state when changing routes
  const clearNavigationState = () => {
    clockTimeTravelMode.value = false;
    spiralTimeTravelMode.value = false;
    clockTutorialMode.value = false;
    spiralTutorialMode.value = false;
    clockActivePanel.value = null;
    spiralActivePanel.value = null;
  };

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
    getTranslatedClockSkin,
    getTranslatedSpiralSkin,
    hemisphereNotificationDismissed,
    hemisphereNotificationDismissedAt,
    clearNavigationState,
  };
}, {
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : null,
  },
});