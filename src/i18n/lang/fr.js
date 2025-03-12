export default {
  // Structure de base pour les traductions françaises
  welcome: {
    title: 'Le Temps Naturel',
    subtitle: 'Une nouvelle convention du temps',
    naturalClock: {
      title: 'Horloge Naturelle',
      description: 'Je suis une horloge inspirée du vivant.\nMon aiguille tourne une fois par jour seulement...\nJe suis la course du soleil dans le ciel,\ntranquillement... selon un cadran de 360°.',
      cta: {
        discover: 'Découvrir l\'horloge',
        open: 'Ouvrir l\'horloge',
        tutorial: 'Voir le tutoriel'
      }
    },
    thirteenMoons: {
      title: 'Spirale 13 Lunes',
      description: 'Inspirés des traditions du monde entier,\nmes 13 mois de 28 jours remplacent\nnotre vieux calendrier tout tordu.\nLe jour arc-en-ciel clôture l\'année.',
      cta: {
        discover: 'Découvrir les 13 lunes',
        open: 'Ouvrir les 13 lunes',
        tutorial: 'Voir le tutoriel'
      }
    },
    hero: {
      description: 'Le Temps Naturel réinvente notre façon de mesurer le temps.\nAvec {clock} et {spiral},\nle soleil retrouve sa place comme référence universelle\ndu temps qui passe...',
      clockLink: 'l\'horloge de 360°',
      spiralLink: 'la spirale de 13 lunes'
    },
    understanding: {
      title: 'Tout comprendre',
      subtitle: 'sur le temps naturel',
      mission: 'Le Temps Naturel est un système de mesure du temps\nimaginé pour remplacer (ou compléter)\nl\'horloge des 24 heures et le calendrier grégorien.'
    },
    faq: {
      title: 'Foire aux questions'
    },
    footer: {
      closing: {
        line1: 'Nous avons créé des machines pour mesurer le temps.',
        line2: 'Puis nous sommes devenus esclaves de leur tic tac.',
        line3: 'Le Temps Naturel inverse cette tendance.',
        line4: 'La vie a déja prévu la plus belle des horloges...',
        line5: 'On l\'appelle le soleil ! Maître du temps et chef d\'orchestre du vivant.'
      },
      credits: 'Created by {author} | {github}',
      author: 'Sylvain',
      github: 'Open sourced on GitHub',
      resetData: 'Réinitialiser les données'
    },
    meta: {
      title: 'Temps Naturel - Une nouvelle façon de mesurer le temps, inspirée du vivant',
      description: 'Découvrir et comprendre l\'horloge naturelle de 360° synchro avec le soleil et la spirale des 13 lunes de 28 jours',
      ogImage: 'https://naturaltime.app/natural-time-social-fr.jpg',
      ogUrl: 'https://naturaltime.app/fr'
    }
  },
  navigation: {
    clock: 'Horloge',
    spiral: '13 Lunes',
    faq: 'FAQ'
  },
  // Espace réservé pour les traductions des tutoriels
  tutorials: {
    clock: {
      // Les étapes du tutoriel de l'horloge seront ajoutées ici
    },
    spiral: {
      // Les étapes du tutoriel de la spirale seront ajoutées ici
    }
  },
  // Clock view translations
  clock: {
    title: 'Horloge du Temps Naturel',
    subtitle: 'Une seule aiguille synchro avec le soleil',
    meta: {
      description: 'Découvrir l\'horloge naturelle de 360° qui tourne lentement en suivant exactement la course du soleil dans le ciel',
      title: 'Horloge du Temps Naturel - Une seule aiguille synchro avec le soleil',
      ogImage: 'https://naturaltime.app/natural-time-social-fr.jpg',
      ogUrl: 'https://naturaltime.app/fr/clock'
    },
    timeTravel: {
      title: 'Voyage temporel',
      speedSelector: 'Vitesse de voyage',
      resetButton: 'Remettre à zéro',
      exitButton: 'Quitter le voyage temporel',
      speeds: [
        { value: '001°', equivalentTo: '4min' },
        { value: '005°', equivalentTo: '20min' },
        { value: '015°', equivalentTo: '1h' },
        { value: '360°', equivalentTo: '1j' },
        { value: '7 jours', equivalentTo: '' },
        { value: '28 jours', equivalentTo: '' }
      ]
    },
    tutorial: {
      startButton: 'Lancer le tutoriel',
      skipButton: 'Passer le tutoriel',
      tutorialStep: 'Tutoriel',
      configureButton: 'Configurer',
      skipWelcomeButton: 'Passer'
    },
    menu: {
      settings: 'Paramètres',
      locationPicker: 'Choisir un lieu',
      simplifiedMode: {
        title: 'Design épuré',
        fullMode: 'Design complet'
      },
      understanding: 'Comprendre',
      startTutorial: 'Lancer le tutoriel',
      faq: 'Foire aux questions',
      specialMode: 'Mode spécial',
      timeTravel: 'Voyage temporel'
    },
    notifications: {
      geolocation: {
        title: 'Nouvelle position détectée',
        ignoreButton: 'Ignorer',
        updateButton: 'Mettre à jour'
      },
      southernHemisphere: {
        title: 'Hémisphère Sud',
        description: 'l\'horloge tourne dans le sens inverse (de droite à gauche) car c\'est ainsi que se déplace le soleil dans cet hémisphère.',
        dismissButton: 'Okay, compris'
      }
    }
  },
  // Spiral view translations
  spiral: {
    title: 'Spirale des 13 lunes',
    subtitle: 'Une alternative au calendrier Grégorien',
    meta: {
      title: 'Spirale des 13 lunes - Temps naturel - Une alternative au calendrier Grégorien',
      description: 'Découvrir la spirale des 13 lunes de 28 jours qui remplace avec élégance nos 12 mois tout tordus',
      ogImage: 'https://naturaltime.app/natural-time-social-fr.jpg',
      ogUrl: 'https://naturaltime.app/fr/spiral'
    },
    timeTravel: {
      title: 'Voyage temporel',
      speedSelector: 'Vitesse de voyage',
      resetButton: 'Remettre à zéro',
      exitButton: 'Quitter le voyage temporel',
      speeds: [
        { label: '1 jour' },
        { label: '1 semaine' },
        { label: '1 lune' }
      ]
    },
    tutorial: {
      startButton: 'Lancer le tutoriel',
      skipButton: 'Passer le tutoriel',
      tutorialStep: 'Tutoriel',
      configureButton: 'Configurer',
      skipWelcomeButton: 'Passer'
    },
    menu: {
      settings: 'Paramètres',
      locationPicker: 'Choisir un lieu',
      viewMode: {
        spiralTitle: 'Afficher en spiral',
        verticalTitle: 'Afficher en vertical'
      },
      understanding: 'Comprendre',
      startTutorial: 'Lancer le tutoriel',
      faq: 'Foire aux questions',
      specialMode: 'Mode spécial',
      timeTravel: 'Voyage temporel'
    },
    notifications: {
      geolocation: {
        title: 'Position GPS modifiée. Mettre à jour ?',
        ignoreButton: 'Ignorer aujourd\'hui',
        updateButton: 'Oui',
        dismissButton: 'Non'
      }
    }
  },
  // FAQ component translations
  faq: {
    inProgress: '(En cours de rédaction)'
  },
  // LocationPicker component translations
  locationPicker: {
    title: 'Choisir un lieu',
    nameLabel: {
      new: 'Donner un nom au lieu',
      edit: 'Modifier le nom du lieu'
    },
    optional: '(Facultatif)',
    validate: 'Valider',
    clickMap: 'Cliquer la carte pour choisir un lieu',
    offline: 'L\'appareil semble hors-ligne. Veuillez vérifier votre connexion internet ou entrer vos coordonnées GPS manuellement.',
    latitude: 'Latitude',
    longitude: 'Longitude',
    name: 'Nom',
    geolocation: {
      enable: 'Activer la géolocalisation',
      enabled: 'Géolocalisation activée',
      searching: 'Géolocalisation en cours...',
      detected: 'Position GPS détectée',
      recenter: 'Recentrer',
      errors: {
        denied: 'Veuillez activer la géolocalisation dans votre navigateur',
        unavailable: 'Position non disponible',
        timeout: 'Délai de géolocalisation dépassé',
        error: 'Erreur de géolocalisation'
      },
      retry: 'Réessayer'
    },
    explanation: 'Le temps naturel a besoin d\'une position géographique pour déterminer la position du soleil.'
  },
  // MoonComponent translations
  moon: {
    title: {
      moon: 'Lune #{number}',
      rainbowDay: 'Jour arc-en-ciel',
      rainbowDays: 'Jours arc-en-ciel'
    },
    dayTooltip: {
      naturalTime: 'Temps Naturel => {date}',
      artificialTime: 'Temps artificiel => {date}'
    }
  }
} 