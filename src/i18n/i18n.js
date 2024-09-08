import { createI18n } from "vue-i18n";

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
            welcome: "Welcome",
            clock: "Natural Time",
            moons: "13 moons",
            about: 'Read more',
            openLocationPicker: "Edit geolocation",
        },
        locationPicker: {
            title: {
                line1: "Welcome",
                line2: "at the clock of",
                line3: "natural time",
            },
            advise: "Please choose a place in order to set the clock up",
            searchFor: "Search for a place...",
            locateMe: "Track my location",
            form:{
                latitude: "latitude",
                longitude: "longitude",
                save: "Save location",
            },
            promptLocationName: "Please give a name to this place"
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
        about: {
            title: "Learn more about natural time"
        },
        year: "Year",
        moon: "Moon",
        day: "Day",
        weekDay: "{color} {element}",
        colors: { 1: "Red", 2: "Orange", 3: "Yellow", 4: "Green", 5: "Blue", 6: "Indigo", 7: "Violet" },
        elements: { 1: "Earth", 2: "Water", 3: "Air", 4: "Fire" },
        settings: {
            title: 'Settings',
            description: 'Customize your experience and preferences here.'
        }
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
            welcome: "Temps Naturel",
            clock: "Horloge 360°",
            moons: "Spirale 13 lunes",
            about: 'À propos',
            openLocationPicker: "Modifier l'emplacement géographique",
        },
        locationPicker: {
            title: {
                line1: "Bienvenue",
                line2: "sur l'horloge du",
                line3: "temps naturel",
            },
            advise: "Pour fonctionner, l'horloge a besoin d'une position géographique",
            searchFor: "Rechercher un lieu...",
            form:{
                latitude: "latitude",
                longitude: "longitude",
                save: "Valider la position",
            },
            promptLocationName: "Donner un nom à ce lieu (facultatif)"
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
        about: {
            title: "En savoir plus sur le temps naturel"
        },
        year: "Année",
        moon: "Lune",
        day: "Jour",
        weekDay: "{element} {color}",
        colors: { 1: "Rouge", 2: "Orange", 3: "Jaune", 4: "Vert", 5: "Bleu", 6: "Indigo", 7: "Violet" },
        elements: { 1: "Terre", 2: "Eau", 3: "Air", 4: "Feu" },
        settings: {
            title: 'Préférences',
            description: 'Customize your experience and preferences here.'
        }
    }
}
  
const i18n = createI18n({
    locale: navigator.language || navigator.userLanguage,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    messages: translations,
    legacy: false,
})

export default i18n;