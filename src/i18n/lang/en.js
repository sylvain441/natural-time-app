export default {
  // Basic structure for English translations
  welcome: {
    title: 'Natural Time',
    subtitle: 'A new time convention',
    naturalClock: {
      title: 'Natural Clock',
      description: 'I am a clock inspired by nature.\nMy hand turns only once a day...\nI follow the course of the sun in the sky,\nquietly... on a 360° dial.',
      cta: {
        discover: 'Discover the clock',
        open: 'Open the clock',
        tutorial: 'View tutorial'
      }
    },
    thirteenMoons: {
      title: '13 Moons Spiral',
      description: 'Inspired by traditions from around the world,\nmy 13 months of 28 days replace\nour old twisted calendar.\nThe rainbow day closes the year.',
      cta: {
        discover: 'Discover the 13 moons',
        open: 'Open the 13 moons',
        tutorial: 'View tutorial'
      }
    },
    hero: {
      description: 'Natural Time reinvents our way of measuring time.\nWith the {clock} and the {spiral},\nthe sun regains its place as a universal reference\nfor the passing of time...',
      clockLink: '360° clock',
      spiralLink: '13 moons spiral'
    },
    understanding: {
      title: 'Understanding',
      subtitle: 'natural time',
      mission: 'Natural Time is a time measurement system\ndesigned to replace (or complement)\nthe 24-hour clock and the Gregorian calendar.'
    },
    faq: {
      title: 'Frequently Asked Questions'
    },
    footer: {
      closing: {
        line1: 'We created machines to measure time.',
        line2: 'Then we became slaves to their ticking.',
        line3: 'Natural Time reverses this trend.',
        line4: 'Life has already provided the most beautiful clock...',
        line5: 'We call it the sun! Master of time and conductor of all living things.'
      },
      credits: 'Created by {author} | {github}',
      author: 'Sylvain',
      github: 'Open sourced on GitHub',
      resetData: 'Reset data'
    },
    meta: {
      title: 'Natural Time - A new way to measure time, inspired by nature',
      description: 'Discover and understand the 360° natural clock synchronized with the sun and the 13 moons spiral of 28 days',
      ogImage: 'https://naturaltime.app/natural-time-social-en.jpg',
      ogUrl: 'https://naturaltime.app/en'
    }
  },
  navigation: {
    clock: 'Clock',
    spiral: '13 Moons',
    faq: 'FAQ'
  },
  // Reserved space for tutorial translations
  tutorials: {
    clock: {
      // Clock tutorial steps will be added here
    },
    spiral: {
      // Spiral tutorial steps will be added here
    }
  },
  // Clock view translations
  clock: {
    title: 'Natural Time Clock',
    subtitle: 'A single hand synchronized with the sun',
    meta: {
      description: 'Discover the 360° natural clock that slowly rotates following exactly the course of the sun in the sky',
      title: 'Natural Time Clock - A single hand synchronized with the sun',
      ogImage: 'https://naturaltime.app/natural-time-social-en.jpg',
      ogUrl: 'https://naturaltime.app/en/clock'
    },
    timeTravel: {
      title: 'Time Travel',
      speedSelector: 'Travel speed',
      resetButton: 'Reset to zero',
      exitButton: 'Exit time travel',
      speeds: [
        { value: '001°', equivalentTo: '4min' },
        { value: '005°', equivalentTo: '20min' },
        { value: '015°', equivalentTo: '1h' },
        { value: '360°', equivalentTo: '1day' },
        { value: '7 days', equivalentTo: '' },
        { value: '28 days', equivalentTo: '' }
      ]
    },
    tutorial: {
      startButton: 'Start tutorial',
      skipButton: 'Skip tutorial',
      tutorialStep: 'Tutorial',
      configureButton: 'Configure',
      skipWelcomeButton: 'Skip'
    },
    menu: {
      settings: 'Settings',
      locationPicker: 'Choose location',
      simplifiedMode: {
        title: 'Simplified design',
        fullMode: 'Full design'
      },
      understanding: 'Understanding',
      startTutorial: 'Start tutorial',
      faq: 'Frequently asked questions',
      specialMode: 'Special mode',
      timeTravel: 'Time travel'
    },
    notifications: {
      geolocation: {
        title: 'New position detected',
        ignoreButton: 'Ignore',
        updateButton: 'Update'
      },
      southernHemisphere: {
        title: 'Southern Hemisphere',
        description: 'the clock rotates counterclockwise (right to left) because that\'s how the sun moves in this hemisphere.',
        dismissButton: 'Okay, got it'
      }
    },
    component: {
      title: 'Natural Time'
    }
  },
  // Spiral view translations
  spiral: {
    title: '13 Moons Spiral',
    subtitle: 'An alternative to the Gregorian calendar',
    meta: {
      title: '13 Moons Spiral - Natural Time - An alternative to the Gregorian calendar',
      description: 'Discover the 13 moons spiral of 28 days that elegantly replaces our twisted 12 months',
      ogImage: 'https://naturaltime.app/natural-time-social-en.jpg',
      ogUrl: 'https://naturaltime.app/en/spiral'
    },
    timeTravel: {
      title: 'Time Travel',
      speedSelector: 'Travel speed',
      resetButton: 'Reset to zero',
      exitButton: 'Exit time travel',
      speeds: [
        { label: '1 day' },
        { label: '1 week' },
        { label: '1 moon' }
      ]
    },
    tutorial: {
      startButton: 'Start tutorial',
      skipButton: 'Skip tutorial',
      tutorialStep: 'Tutorial',
      configureButton: 'Configure',
      skipWelcomeButton: 'Skip'
    },
    menu: {
      settings: 'Settings',
      locationPicker: 'Choose location',
      viewMode: {
        spiralTitle: 'Show as spiral',
        verticalTitle: 'Show vertically'
      },
      understanding: 'Understanding',
      startTutorial: 'Start tutorial',
      faq: 'Frequently asked questions',
      specialMode: 'Special mode',
      timeTravel: 'Time travel'
    },
    notifications: {
      geolocation: {
        title: 'GPS position changed. Update?',
        ignoreButton: 'Ignore today',
        updateButton: 'Yes',
        dismissButton: 'No'
      }
    }
  },
  // FAQ component translations
  faq: {
    inProgress: '(Work in progress)'
  },
  // LocationPicker component translations
  locationPicker: {
    title: 'Choose a location',
    nameLabel: {
      new: 'Give a name to this location',
      edit: 'Edit location name'
    },
    optional: '(Optional)',
    validate: 'Confirm',
    clickMap: 'Click on the map to choose a location',
    offline: 'The device appears to be offline. Please check your internet connection or enter your GPS coordinates manually.',
    latitude: 'Latitude',
    longitude: 'Longitude',
    name: 'Name',
    geolocation: {
      enable: 'Enable geolocation',
      enabled: 'Geolocation enabled',
      searching: 'Searching for location...',
      detected: 'GPS position detected',
      recenter: 'Recenter',
      errors: {
        denied: 'Please enable geolocation in your browser',
        unavailable: 'Position unavailable',
        timeout: 'Geolocation timeout',
        error: 'Geolocation error'
      },
      retry: 'Try again'
    },
    explanation: 'Natural time needs geographic coordinates to determine the position of the sun.'
  },
  // MoonComponent translations
  moon: {
    title: {
      moon: 'Moon #{number}',
      rainbowDay: 'Rainbow Day',
      rainbowDays: 'Rainbow Days'
    },
    dayTooltip: {
      naturalTime: 'Natural Time => {date}',
      artificialTime: 'Artificial Time => {date}'
    }
  },
  // MainMenu translations
  mainMenu: {
    homeTooltip: 'Home naturaltime.app'
  },
  // DisplayComponent translations
  display: {
    year: 'Year',
    moon: 'Moon',
    day: 'Day',
    rainbow: {
      arc: 'Rain',
      day: 'bow',
      sky: 'Day'
    },
    dateFormat: 'en-US'
  },
  // MainMenuLegacy translations
  mainMenuLegacy: {
    title: 'Natural Time',
    clock: 'Clock',
    spiral: '13 Moons',
    home: '← Home',
    reset: 'reset',
    aria: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    }
  },
  // YouTubePlayer translations
  youtubePlayer: {
    thumbnail: 'Understand Natural Time in 10 minutes'
  },
  // 404 view translations
  notFound: {
    title: '404',
    message: 'Oops! Page not found.',
    button: 'Back to home'
  }
} 