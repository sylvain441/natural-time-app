import { NaturalDate } from "natural-time-js";

let now = new NaturalDate(new Date(), 0);

export const spiralSkins = {
  full: {
    default: {
      animationSpeed: 0.4,
      showDaysNumber: true,
      showDisplay: true,
      singleMoonView: false,
      showAnimation: true,
    },
    welcome: {
      context: {
        currentTime: new Date(1356091200000),
        latitude: 42.42,
        longitude: 0,
      },
      animationSpeed: 0.4,
      descriptionText: "Découvrir la Spirale des 13 lunes, calendrier universel 100% basé sur la nature",
      showDaysNumber: false,
      showDisplay: false,
      singleMoonView: false,
      showAnimation: false,
    },
    tutorial: [
      {
        context: {
          currentTime: new Date(1326974400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Je suis un calendrier avec 13 mois de 28 jours",
        descriptionText: 'On m\'appelle la "Spirale des 13 lunes"',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
      },
      {
        context: {
          currentTime: new Date(1325160000000 + 28 * 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "1 lune = 4 semaines de 7 jours",
        descriptionText: "Soit exactement 28 jours, sans exception",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1325160000000 + 86400000 * 29),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "À chaque jour de la semaine, une couleur",
        descriptionText: "1er jour = Rouge",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1325160000000 + 86400000 * 35),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Puis Orange, Jaune, Vert, Bleu, Indigo",
        descriptionText: 'Et enfin le 7ème jour : Violet',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1325764800000 + 28 * 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Les 13 lunes sont disposées en spirale",
        descriptionText: "Car le temps n'est pas linéaire mais plutôt cyclique",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
      },
      {
        context: {
          currentTime: new Date(1329480000000 + 60 * 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Voici le 5ème jour de la 5ème lune",
        descriptionText: "Par exemple...",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1349697600000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Et ici : le 11ème jour de la lune 11",
        descriptionText: "Un jour vert... Quelque soit l'année, le siècle, le millénaire...",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356004800000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Le savais tu ? 13 x 28 = 364 jours 🤩",
        descriptionText: "Avec un jour de plus, on obtient 365 jours",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356004800000 + 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Il s'appelle le jour arc-en-ciel 🌈",
        descriptionText: "Un jour de célébration qui a lieu lors du solstice d'hiver de l'hémisphère nord",
        animationSpeed: 0.4,
        showAnimation: true,
        showDaysNumber: false,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356004800000 + 86400000 * 367),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Certaines années ont 366 jours au lieu de 365",
        descriptionText: "C'est l'occasion de fêter deux jours consécutifs de vie en dehors du temps",
        animationSpeed: 0.4,
        showAnimation: true,
        showDaysNumber: false,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Une date naturelle s'écrit : ANNEE ) LUNE ) JOUR",
        descriptionText: "Par exemple, aujourd'hui nous sommes le " + now.toDateString(),
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356177600000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Le 1er jour de l'an 001",
        descriptionText: "correspond au 22 décembre 2012 dans le calendrier grégorien (voir FAQ)",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356177600000 + 86400000 * 27),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Dernier détail important",
        descriptionText: "Les 28 jours ne correspondent pas aux 29,53 jours du cycles pleine/nouvelle lune (Voir FAQ)",
        animationSpeed: 0.4,
        showDaysNumber: true,
        singleMoonView: true,
        showDisplay: true, // Keep it
      },
      /////END OF TUTORIAL/////
      {
        context: {
          currentTime: new Date(),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Tutoriel terminé !",
        descriptionText: "Pour continuer, l'application a besoin de configurer une position géographique",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
    ]
  }
}