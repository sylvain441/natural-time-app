import { NaturalDate } from "natural-time-js";

let now = new NaturalDate(new Date(), 0);

export const spiralSkins = {
  full: {
    default: {
      animationSpeed: 0.4,
      showDaysNumber: true,
      showTitle: true,
      showDisplay: true,
      singleMoonView: false,
    },
    hideTitle: {
      showTitle: false,
    },
    singleMoon: {
      singleMoonView: true,
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
    },
    tutorial: [
      {
        context: {
          currentTime: new Date(1356091200000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: 'Je suis la spirale des 13 lunes',
        descriptionText: "Un calendrier composé de 13 mois (lunes) de 28 jours",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
      },
      {
        context: {
          currentTime: new Date(1326974400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Chacune de mes 13 lunes comporte 28 jours",
        descriptionText: 'Ni plus, ni moins',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
      },
      {
        context: {
          currentTime: new Date(1356696000000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "4 semaines x 7 jours = 1 lune",
        descriptionText: "Exactement 28 jours, sans exception",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1356696000000 + 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "1er jour = Rouge",
        descriptionText: 'À chaque jour de la semaine une couleur',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1356696000000 + 86400000 * 2),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "2ème jour = Orange",
        descriptionText: 'À chaque jour de la semaine une couleur',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1356696000000 + 86400000 * 3),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "3ème jour = Jaune",
        descriptionText: 'À chaque jour de la semaine une couleur',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1356696000000 + 86400000 * 4),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "4ème jour = Vert",
        descriptionText: 'À chaque jour de la semaine une couleur',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1356696000000 + 86400000 * 5),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "5ème jour = Bleu",
        descriptionText: 'À chaque jour de la semaine une couleur',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1356696000000 + 86400000 * 6),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "6ème jour = Indigo",
        descriptionText: 'À chaque jour de la semaine une couleur',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1356696000000 + 86400000 * 7),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "7ème jour = Violet",
        descriptionText: 'À chaque jour de la semaine une couleur',
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1325764800000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Les 13 lunes sont arrangées en spirale",
        descriptionText: "Car le temps n'est pas linéaire mais plutôt cyclique",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: false,
      },
      {
        context: {
          currentTime: new Date(1329480000000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Voici le 1er jour de la 3ème lune",
        descriptionText: "NB: Les lunes ne correspondent pas exactement au cycles lunaires qui sont de 29,53 jours",
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
        titleText: "Ici, c'est le 11ème jour de la lune 11",
        descriptionText: "Un jour vert... Quelque soit la lune ou l'année",
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
        descriptionText: "Il manque un jour supplémentaire pour faire 365 jours",
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
        titleText: "C'est le jour arc-en-ciel 🌈",
        descriptionText: "Un jour de célébration qui a lieu lors du solstice d'hiver (celui de l'hémisphère nord)",
        animationSpeed: 0.4,
        showDaysNumber: false,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356004800000 + 86400000 * 366),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Certaines années font 366 jours",
        descriptionText: "C'est l'occasion de fêter deux jours consécutifs en dehors du temps",
        animationSpeed: 0.4,
        showDaysNumber: false,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356177600000),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Une nouvelle année commence",
        descriptionText: "Le 1er jour de la 1ère année naturelle correspond au 22 décembre 2012",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(),
          latitude: 42.42,
          longitude: 0,
        },
        titleText: "Une date naturelle s'écrit : ANNEE ) LUNE ) JOUR",
        descriptionText: "Ex: nous sommes aujourd'hui le " + now.toDateString(),
        animationSpeed: 0.4,
        showDaysNumber: true,
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