# Guide d'internationalisation de Natural Time App

Ce document présente la stratégie et les étapes à suivre pour rendre l'application Natural Time multilingue. Il servira de référence tout au long du processus d'implémentation.

> **Note importante** : Nous avons choisi d'utiliser l'approche standard avec des fichiers de traduction centralisés (toutes les traductions rassemblées dans des fichiers dédiés par langue). Cette approche est la plus évolutive et la mieux adaptée pour une internationalisation complète.

## Table des matières

1. [Objectifs et Vue d'ensemble](#1-objectifs-et-vue-densemble)
2. [Configuration initiale de Vue I18n](#2-configuration-initiale-de-vue-i18n)
3. [Stratégies par type de contenu](#3-stratégies-par-type-de-contenu)
4. [Plan d'implémentation étape par étape](#4-plan-dimplémentation-étape-par-étape)
5. [Validation et tests](#5-validation-et-tests)
6. [Maintenance et évolution](#6-maintenance-et-évolution)

## 1. Objectifs et Vue d'ensemble

### Objectifs

- Rendre l'application Natural Time disponible en plusieurs langues (initialement français et anglais)
- Minimiser la complexité pour faciliter la maintenance 
- Permettre l'ajout facile de nouvelles langues à l'avenir
- Assurer une expérience utilisateur fluide lors du changement de langue

### État actuel

- Application principalement en français
- Textes codés en dur dans les composants Vue
- Structure URL déjà préparée avec préfixe `/fr/`
- FAQ déjà disponible en français et anglais (fichiers Markdown)
- Tutoriels avec textes intégrés dans des fichiers "skin" (clockSkins.js et spiralSkins.js)

### Approche générale

Nous adopterons une approche hybride adaptée aux différents types de contenus:

1. **Textes des composants et vues**: Utilisation de fichiers de traduction centralisés avec Vue I18n
2. **Tutoriels**: Utilisation de clés de traduction dans les fichiers skin
3. **FAQ**: Conservation de l'approche actuelle avec fichiers Markdown par langue
4. **URLs**: Adaptation du routeur pour supporter plusieurs langues

## 2. Configuration initiale de Vue I18n

### Installation et configuration de base

Vue I18n est déjà installé et partiellement configuré. Nous devons:

1. Créer les fichiers de traduction pour chaque langue
2. Organiser les traductions par sections/composants
3. Mettre à jour la configuration dans `src/i18n/i18n.js`

### Structure des fichiers de traduction

```
src/
  i18n/
    lang/
      fr.js        # Traductions françaises
      en.js        # Traductions anglaises
    faq/           # Structure existante pour les FAQ
      fr.md
      en.md
      faqLoader.js
    i18n.js        # Configuration Vue I18n
```

## 3. Stratégies par type de contenu

### A. Textes des composants et vues

Nous utiliserons des fichiers de traduction centralisés pour tous les textes des composants et vues.

**Avantages**:
- Organisation claire et évolutive
- Facilité d'ajout de nouvelles langues
- Séparation entre le code et le contenu
- Standard de l'industrie avec Vue I18n

**Implémentation**:
- Créer des fichiers `fr.js` et `en.js` avec structure hiérarchique organisée par composants/vues
- Remplacer tous les textes en dur par des clés `{{ $t('cle.sous_cle') }}`
- Organiser les clés de manière logique et cohérente

**Exemple de structure de fichier de traduction**:
```javascript
// src/i18n/lang/fr.js
export default {
  welcome: {
    title: 'Le Temps Naturel',
    subtitle: 'Une nouvelle convention du temps',
    naturalClock: {
      title: 'Horloge Naturelle',
      description: 'Je suis une horloge inspirée du vivant.\nMon aiguille tourne une fois par jour seulement...',
      cta: {
        discover: 'Découvrir l\'horloge',
        open: 'Ouvrir l\'horloge',
        tutorial: 'Voir le tutoriel'
      }
    },
    thirteenMoons: {
      title: 'Spirale 13 Lunes',
      description: 'Inspirés des traditions du monde entier...',
      // ...
    }
  },
  clock: {
    // Textes spécifiques à la vue horloge
  },
  spiral: {
    // Textes spécifiques à la vue spirale
  },
  // ... autres sections
}
```

**Exemple d'utilisation dans un composant**:
```vue
<template>
  <h1>{{ $t('welcome.title') }}</h1>
  <p>{{ $t('welcome.subtitle') }}</p>
  
  <!-- Avec des paramètres si nécessaire -->
  <p>{{ $t('welcome.greeting', { name: userName }) }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const welcomeMessage = t('welcome.message');
</script>
```

### B. Tutoriels dans les fichiers "skin"

Ces fichiers nécessitent une approche spécifique car ils combinent configuration d'affichage et textes.

**Stratégie**: Utilisation de clés de traduction

**Implémentation**:
- Remplacer les textes en dur dans les fichiers skin par des clés de traduction
- Ajouter ces clés et leurs traductions dans les fichiers de langue centralisés
- Utiliser la fonction `t()` ou `$t()` pour récupérer les traductions

**Exemple dans les fichiers skin**:
```javascript
export const clockSkins = {
  full: {
    // ... configs
    tutorial: [
      {
        context: { /* ... */ },
        titleTextKey: 'tutorials.clock.step1.title',
        descriptionTextKey: 'tutorials.clock.step1.description',
        // ... autres propriétés
      },
      {
        context: { /* ... */ },
        titleTextKey: 'tutorials.clock.step2.title',
        descriptionTextKey: 'tutorials.clock.step2.description',
        // ... autres propriétés
      },
      // Autres étapes...
    ]
  }
}
```

**Exemple dans le fichier de traduction**:
```javascript
// src/i18n/lang/fr.js
export default {
  // ... autres traductions
  tutorials: {
    clock: {
      step1: {
        title: 'Je suis une horloge naturelle',
        description: 'Je pointe à chaque instant en direction du soleil'
      },
      step2: {
        title: 'Mon unique aiguille',
        description: 'Tourne lentement, une seule fois par jour'
      },
      // Autres étapes...
    },
    spiral: {
      // Tutoriel de la spirale...
    }
  }
}
```

**Adaptation du code qui utilise les tutoriels**:
```javascript
const { t } = useI18n();

const clockSkinWithTranslation = computed(() => {
  const skin = { ...clockSkins.full.default };
  
  if (clockTutorialMode.value) {
    const tutorialStep = clockSkins.full.tutorial[clockTutorialCurrentStep.value];
    
    return {
      ...skin,
      ...tutorialStep,
      titleText: tutorialStep.titleTextKey ? t(tutorialStep.titleTextKey) : undefined,
      descriptionText: tutorialStep.descriptionTextKey ? t(tutorialStep.descriptionTextKey) : undefined,
    };
  }
  
  return skin;
});
```

### C. FAQ en Markdown

La structure actuelle est déjà bien adaptée pour l'internationalisation.

**Implémentation**:
- Conserver l'approche actuelle avec des fichiers Markdown séparés par langue
- S'assurer que le composant FAQAccordion utilise correctement la langue actuelle

### D. Routage et URLs

**Implémentation**:
- Adapter le routeur pour créer des routes équivalentes pour chaque langue
- Mettre à jour les redirections et la navigation
- Assurer la synchronisation entre la langue de l'interface et le préfixe d'URL

## 4. Plan d'implémentation étape par étape

### Phase 1: Préparation de la structure i18n

1. **Créer les fichiers de traduction de base**
   - Créer le dossier `src/i18n/lang` s'il n'existe pas
   - Créer les fichiers `fr.js` et `en.js` avec une structure vide
   - Mettre à jour `i18n.js` pour charger ces fichiers:
   ```javascript
   import { createI18n } from "vue-i18n";
   import fr from './lang/fr.js';
   import en from './lang/en.js';
   
   const i18n = createI18n({
     locale: 'fr',
     fallbackLocale: 'fr',
     messages: {
       fr,
       en
     },
     legacy: false,
   });
   
   export default i18n;
   ```

2. **Mettre à jour la configuration de Vue I18n dans l'application**
   - S'assurer que le plugin est correctement installé dans main.js
   ```javascript
   // main.js
   import i18n from './i18n/i18n.js';
   
   app.use(i18n);
   ```

### Phase 2: Adaptation des textes des composants

3. **Extraire les textes des composants principaux**
   - Commencer par la page d'accueil (WelcomeView.vue)
   - Extraire chaque texte et créer les clés correspondantes dans `fr.js`
   - Remplacer les textes en dur par des appels à `$t('cle')`
   - Traduire les textes en anglais dans `en.js`

   Par exemple, transformer:
   ```html
   <h1>Le Temps Naturel</h1>
   <p>Une nouvelle convention du temps</p>
   ```
   
   En:
   ```html
   <h1>{{ $t('welcome.title') }}</h1>
   <p>{{ $t('welcome.subtitle') }}</p>
   ```

4. **Répéter le processus pour les autres vues principales**
   - ClockView.vue
   - SpiralView.vue
   - 404.vue

5. **Adapter les composants réutilisables**
   - MainMenu.vue
   - FAQAccordion.vue
   - Autres composants contenant du texte

### Phase 3: Adaptation des tutoriels

6. **Modifier les fichiers de tutoriels pour utiliser des clés de traduction**
   - Remplacer les textes en dur dans `clockSkins.js` par des clés de traduction
   - Faire de même pour `spiralSkins.js`
   - Ajouter toutes les traductions dans les fichiers `fr.js` et `en.js`

   Exemple de modification:
   ```javascript
   // Avant
   {
     titleText: 'Je suis une horloge naturelle',
     descriptionText: 'Je pointe à chaque instant en direction du soleil',
     // ...
   }
   
   // Après
   {
     titleTextKey: 'tutorials.clock.step1.title',
     descriptionTextKey: 'tutorials.clock.step1.description',
     // ...
   }
   ```

7. **Adapter le code qui utilise les tutoriels**
   - Mettre à jour les computed properties dans configStore.js pour utiliser les clés de traduction:
   ```javascript
   const { t } = useI18n();
   
   const clockSkin = computed(() => {
     const skin = { ...clockSkins.full.default };
     
     if (clockTutorialMode.value) {
       const tutorialStep = clockSkins.full.tutorial[clockTutorialCurrentStep.value];
       
       return {
         ...skin,
         ...tutorialStep,
         titleText: tutorialStep.titleTextKey ? t(tutorialStep.titleTextKey) : undefined,
         descriptionText: tutorialStep.descriptionTextKey ? t(tutorialStep.descriptionTextKey) : undefined,
       };
     }
     
     return skin;
   });
   ```

### Phase 4: Adaptation du routeur

8. **Mettre à jour le routeur pour supporter plusieurs langues**
   - Créer des routes équivalentes pour chaque langue
   - Mettre à jour les redirections
   - Ajouter un middleware pour synchroniser la langue et le préfixe d'URL
   
   ```javascript
   // Fonction pour générer les routes par langue
   const createLocalizedRoutes = (lang) => [
     { 
       path: `/${lang}/`, 
       name: `welcome-${lang}`, 
       component: WelcomeView,
       meta: { locale: lang }
     },
     { 
       path: `/${lang}/${lang === 'fr' ? 'horloge-temps-naturel' : 'natural-time-clock'}`, 
       name: `time-${lang}`, 
       component: ClockView,
       meta: { locale: lang }
     },
     // ... autres routes
   ];
   
   // Créer des routes pour chaque langue
   const routes = [
     // Route par défaut
     { path: '/', redirect: '/fr/' },
     // Routes en français
     ...createLocalizedRoutes('fr'),
     // Routes en anglais
     ...createLocalizedRoutes('en'),
     // ... autres routes
   ];
   
   // Navigation guard pour changer la langue
   router.beforeEach((to, from, next) => {
     const locale = to.meta.locale || 'fr';
     i18n.global.locale.value = locale;
     next();
   });
   ```

9. **Adapter les liens de navigation**
   - Mettre à jour tous les `router-link` pour utiliser les bonnes routes en fonction de la langue
   ```html
   <router-link :to="{ name: `time-${$i18n.locale}` }">
     {{ $t('navigation.clock') }}
   </router-link>
   ```

### Phase 5: Interface utilisateur de sélection de langue

10. **Créer un composant de sélection de langue**
    - Créer un composant `LanguageSwitcher.vue`
    ```vue
    <template>
      <div class="language-switcher">
        <button 
          v-for="lang in availableLocales" 
          :key="lang" 
          @click="changeLanguage(lang)"
          :class="{ active: currentLocale === lang }"
          class="lang-btn"
        >
          {{ lang.toUpperCase() }}
        </button>
      </div>
    </template>
    
    <script setup>
    import { useI18n } from 'vue-i18n';
    import { useRouter } from 'vue-router';
    import { computed } from 'vue';
    
    const i18n = useI18n();
    const router = useRouter();
    
    const currentLocale = computed(() => i18n.locale.value);
    const availableLocales = computed(() => ['fr', 'en']);
    
    const changeLanguage = (lang) => {
      // Changer la langue
      i18n.locale.value = lang;
      
      // Rediriger vers l'URL équivalente dans la nouvelle langue
      const currentRoute = router.currentRoute.value;
      const routeName = currentRoute.name;
      
      if (routeName) {
        // Extraire la base du nom de route
        const baseRouteName = routeName.split('-')[0];
        // Construire le nouveau nom de route
        const newRouteName = `${baseRouteName}-${lang}`;
        
        // Rediriger
        router.push({ name: newRouteName });
      }
    };
    </script>
    ```
    
    - Intégrer ce composant dans l'interface (menu, en-tête, etc.)

## 5. Validation et tests

Pour chaque phase:

1. **Tests fonctionnels**
   - Vérifier que tous les textes s'affichent correctement dans chaque langue
   - S'assurer que le changement de langue fonctionne comme prévu

2. **Tests de navigation**
   - Vérifier que les URLs sont correctes et reflètent la langue
   - S'assurer que la navigation entre les pages préserve la langue

3. **Revue de code**
   - Vérifier qu'aucun texte n'est codé en dur
   - S'assurer que la structure des traductions est cohérente

## 6. Maintenance et évolution

### Ajout de nouvelles langues

1. Créer un nouveau fichier de traduction (ex: `de.js` pour l'allemand)
2. Traduire tous les textes
3. Ajouter la langue dans la configuration de Vue I18n:
   ```javascript
   // i18n.js
   import de from './lang/de.js';
   
   const i18n = createI18n({
     locale: 'fr',
     fallbackLocale: 'fr',
     messages: {
       fr,
       en,
       de // Ajouter la nouvelle langue
     },
     legacy: false,
   });
   ```
4. Mettre à jour le routeur pour supporter cette nouvelle langue
5. Ajouter la langue dans le sélecteur de langue

### Bonnes pratiques pour l'ajout de nouveaux textes

1. Toujours ajouter les nouveaux textes dans toutes les langues supportées
2. Utiliser des clés explicites et organisées hiérarchiquement
3. Éviter de coder en dur des textes dans les templates
4. Mettre à jour la documentation au besoin

---

Ce guide sera mis à jour au fur et à mesure de l'avancement du projet d'internationalisation. 