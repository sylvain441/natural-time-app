import { createI18n } from "vue-i18n/index";

const translations = {
    'en': {
        nt: "Natural time",
        at: "Artificial time",
        meta: {
            description: "Natural time is a fresh, elegant, and coherent way of measuring the movements of time here on the Earth. This new time standard is based on common sense and the observation of natural cycles."
        },
        longitude: "Longitude",
        latitude: "Latitude",
        rainbowDay: {
            full: "Rainbow Day",
            day: "Rainbow",
            out: "D",
            of: "A",
            time: "Y"
        },
        nav:{
            title1: "Natural",
            title2: "Time",
            clock: "Clock",
            moons: "13 moons",
            location: "Settings",
            about: 'Read more',
        },
        settings: {
            title: "Pick up a location",
            form: {
                latitude: "latitude",
                longitude: "longitude",
                location: "location name",
                save: "save",
                trackGPS: "Find me on the map"
            },
        },
        timeControl: {
            moveBackward: 'Move',
            moveForward: 'Move',
            days: 'days',
            day: 'day',
            degrees: 'degrees',
            past: 'in the past',
            future: 'in the future',
            reset: 'Set Now',
            resetTitle: 'Go back to now',
        },
        year: "Year",
        moon: "Moon",
        day: "Day",
        weekDay: "{color} {element}",
        colors: { 1: "Red", 2: "Orange", 3: "Yellow", 4: "Green", 5: "Blue", 6: "Indigo", 7: "Violet" },
        elements: { 1: "Earth", 2: "Water", 3: "Air", 4: "Fire" },
    },
    'fr': {
        nt: "Temps naturel",
        at: "Temps artificiel",
        meta: {
            description: "Le temps naturel est une nouvelle manière de mesurer les mouvements du temps de façon cohérente, fraiche et élégante. Cette nouvelle convention est basée sur le bon sens et sur l'observation des cycles naturels."
        },
        longitude: "Longitude",
        latitude: "Latitude",
        rainbowDay: {
            full: "Jour Arc en Ciel",
            day: "Jour",
            out: "Arc",
            of: "En",
            time: "Ciel"
        },
        nav:{
            title1: "Temps",
            title2: "Naturel",
            clock: "Horloge",
            moons: "13 lunes",
            location: "Réglages",
            about: 'En savoir +',
        },
        settings: {
            title: "Choisir un lieu",
            form: {
                latitude: "latitude",
                longitude: "longitude",
                location: "nom du lieu",
                save: "Enregistrer",
                trackGPS: "Me localiser"
            },
        },
        timeControl: {
            moveBackward: 'Reculer de',
            moveForward: 'Avancer de',
            days: 'j',
            day: 'jour',
            degrees: 'degrés',
            past: 'dans le passé',
            future: 'dans le futur',
            reset: 'Remise à 0',
            resetTitle: 'Revenir à Maintenant',
        },
        year: "Année",
        moon: "Lune",
        day: "Jour",
        weekDay: "{element} {color}",
        colors: { 1: "Rouge", 2: "Orange", 3: "Jaune", 4: "Vert", 5: "Bleu", 6: "Indigo", 7: "Violet" },
        elements: { 1: "Terre", 2: "Eau", 3: "Air", 4: "Feu" },
    }
}
  
const i18n = createI18n({
    locale: navigator.language || navigator.userLanguage,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    messages: translations,
})

export default i18n;