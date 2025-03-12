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
    }
  }
} 