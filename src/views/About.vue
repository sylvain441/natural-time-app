<script setup>

import { useI18n } from 'vue-i18n/index'
const i18n = useI18n();

// UPDATE PAGE TITLE
document.title = `${i18n.t('about.title')}`;

</script>

<template>
<div>
  <div id="backgrounds">
    <div id="clouds"></div>
  </div>

  <h1>À propos du temps naturel</h1>

  <div class="markdown-body">
    
    <p style="text-align: center;"><strong>Quelle heure est-il ?</strong><br>Le soleil est à 113° 🌞 😎</p>

    <p>Le temps naturel est un <strong>outil de mesure du temps</strong> intimement lié au vivant. Cette nouvelle convention, simple, fraiche et cohérente, est basée sur le bon sens et l’observation des cycles naturels. Le temps qui passe n'est plus compté avec des heures/minutes/secondes compliquées, ni des mois disproportionnés</p>

    <p>Pour bien comprendre, une introduction au temps naturel est consultable ici : <br><a href="https://sylvainbiquette.xyz/presentation-horloge-temps-naturel">sylvainbiquette.xyz/presentation-horloge-temps-naturel</a> (en français)</p>
    <p>Les spécifications techniques complètes sont disponibles ici :<br><a href="https://github.com/sylvain441/natural-time">github.com/sylvain441/natural-time</a> (en anglais)</p>
    
    <h2>Application naturaltime.app</h2>
    
    <p>Le temps naturel n'est pas dépendant de l'informatique pour exister. Une simple horloge effectuant le tour du cadran en une journée suffit pour l'adopter. Cette application open source a toutefois été créée (<a href="https://naturaltime.app">naturaltime.app</a>) pour comprendre et pour jouer avec l'horloge du temps naturel. Elle est hébergée sur <a href="https://github.com/sylvain441/natural-time-app">github</a> et libérée sous licence Creative Common Zero.</p>

    <h3>Comment l'installer</h3>

    <p>Ce n'est pas vraiment une application... Mais plutôt un site web qui peut fonctionner hors-ligne. Ne la cherche donc pas dans l’AppStore ni le PlayStore, il suffit simplement de se rendre sur <a href="https://naturaltime.app">naturaltime.app</a> puis de cliquer sur :</p>
    <ul>
      <li>iOS Safari : <em>Partager &gt; Sur l’écran d’accueil</em></li>
      <li>Android Chrome : <em>Menu &gt; Ajouter à l’écran d’accueil</em></li>
      <li>Google Chrome : <em>Barre d’adresse &gt; Installer Natural Time</em></li>
      <li>Microsoft Edge : <em>Barre d’adresse &gt; Installer Natural Time</em></li>
      <li>Firefox : <em>Installation hors ligne non permise</em></li>
      <li>Safari Mac : <em>Installation hors ligne non permise</em></li>
    </ul>
    
    <h3>Comment l'utiliser</h3>

    <p>Pour afficher <router-link :to="{name: 'time'}">l’horloge</router-link> et la <router-link :to="{name: 'date'}">spirale des 13 lunes</router-link>, l’utilisateur doit préalablement renseigner une position géographique. Les coordonnées sont sauvegardées dans les données temporaires du navigateur.</p>
    <p>Des boutons s’activent au toucher (ou au mouvement de la souris) pour permettre de jouer avec l’horloge. Il est possible de se déplacer dans le temps par incréments de 2°, de 360° (1 jour) ou de 7 jours. <br><em>Astuce : maintenir appuyé longtemps pour faire défiler le temps rapidement.</em></p>

    <h3>Comment partager</h3>

    <p>Il est possible de créer une URL personnalisée à partager avec ses amis ou pour enregistrer en tant que favori :<br><code>https://naturaltime.app/#/latitude,longitude/Nom_personnalisé_du_lieu</code>.<br>Ex: <code>https://naturaltime.app/#/29.97,31.13/Pyramide_de_Khéops</code></p>
    <p>Un simple copier/coller de l'adresse web (URL) suffit pour partager l'horloge du temps naturel pré-programmée à un emplacement géographique donné.</p>
    
    
    <h2>Contribuer</h2>
    
    <p>Si le projet parle à ton cœur, n’hésite pas à contribuer de la façon qui te ressemble. L’application aurait bien besoin d’un regard expert pour y apporter un peu d’optimisation.</p>
    <p>Le code source du temps naturel est divisé en trois parties :</p>
    <ul>
      <li>Spécifications complètes du temps naturel (no code) : <a href="https://github.com/sylvain441/natural-time">github.com/sylvain441/natural-time</a></li>
      <li>Librairie JavaScript de calcul du temps naturel &nbsp;: <a href="https://github.com/sylvain441/natural-time-js">github.com/sylvain441/natural-time-js</a></li>
      <li>Application VueJs horloge du temps naturel &nbsp;: <a href="https://github.com/sylvain441/natural-time-app">github.com/sylvain441/natural-time-app</a> — <a href="https://naturaltime.app">naturaltime.app</a></li>
    </ul>
    
    <p>Le code source et l’application appartiennent au domaine public sous licence CC0-1.0. Tu peux jouer à forker le code, le spooner ou le knifer même ! et pourquoi pas l’intégrer dans ta propre application ?</p>

    <p>L'application gagnerai à évoluer avec de nouvelles fonctionnalités telles qu'un mode widget minimaliste (embed iframe), le choix entre plusieurs "skins", l'ajout de point GPS multiples, ... Si tu es motivé, n'hésite surtout pas !</p>

    <h2>Remerciements</h2>

    <p>Un grand merci aux montagnes, aux chèvres, aux lamas et aux fourmis pour leur inspiration.<br>Gratitude infinie pour Toto et Uncle Skywalker, deux explorateurs du temps. Merci d'exister.</p>
    <p>Remerciement à Don Cross l'auteur d'<a href="https://github.com/cosinekitty/astronomy/">astronomy engine</a> qui permet à l'application de calculer le mouvement des astres dans le ciel. Merci également à tout l'univers open source qui offre au monde des solutions et des ressources abouties telles que Vue3, Vite, OpenLayers, OpenStreetMap, ... utilisées pour créer cette application</p>
    <p>Le temps naturel est né dans les Alpes Françaises lors du printemps/été 2022.<br>Pour toutes questions : <a href="mailto:sylvain441@pm.me">sylvain441@pm.me</a> – <a href="https://t.me/sylvain441">@sylvain441</a> (telegram).</p>
    <p style="text-align:center"><br><br>🌍 One love 🌎<br>🏔 🐐 🌞 🌈</p>
  </div>

  <a class="github-fork-ribbon" href="https://github.com/sylvain441/natural-time-app" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>

</div>
</template>

<style lang="scss" scoped>

#backgrounds {
  z-index: 0;
  background-color: rgba(0, 3, 13, calc(1 - var(--day-progression)));
  &, div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
  }
  #clouds {
    z-index: 40; 
    background: url("@/assets/background/clouds.jpg") center center; 
    background-size: cover;
    opacity: var(--day-progression);
  }
}

h1{
  position: relative;
  z-index: 1000;
  margin: 3em auto 1em;
  text-align: center;
  font-family: "Radio Canada", sans-serif;
}

/* https://raw.githubusercontent.com/sindresorhus/github-markdown-css/main/github-markdown-light.css */

.markdown-body {
  position: relative;
  z-index: 1000;
  width: 100%;
  max-width: 777px;
  padding: 30px 30px 45px;
  margin: 0 auto 3em;
  box-sizing: border-box;
  border-radius: 15px;

  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  color: #24292f;
  background-color: #ffffffAA;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body .octicon {
  display: inline-block;
  fill: currentColor;
  vertical-align: text-bottom;
}

.markdown-body h1:hover .anchor .octicon-link:before,
.markdown-body h2:hover .anchor .octicon-link:before,
.markdown-body h3:hover .anchor .octicon-link:before,
.markdown-body h4:hover .anchor .octicon-link:before,
.markdown-body h5:hover .anchor .octicon-link:before,
.markdown-body h6:hover .anchor .octicon-link:before {
  width: 16px;
  height: 16px;
  content: ' ';
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
  mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
}

.markdown-body details,
.markdown-body figcaption,
.markdown-body figure {
  display: block;
}

.markdown-body summary {
  display: list-item;
}

.markdown-body [hidden] {
  display: none !important;
}

.markdown-body a {
  background-color: transparent;
  color: #0969da;
  text-decoration: none;
}

.markdown-body a:active,
.markdown-body a:hover {
  outline-width: 0;
}

.markdown-body abbr[title] {
  border-bottom: none;
  text-decoration: underline dotted;
}

.markdown-body b,
.markdown-body strong {
  font-weight: 600;
}

.markdown-body dfn {
  font-style: italic;
}

.markdown-body h1 {
  margin: .67em 0;
  font-weight: 600;
  padding-bottom: .3em;
  font-size: 2em;
  border-bottom: 1px solid hsla(210,18%,87%,1);
}

.markdown-body mark {
  background-color: #fff8c5;
  color: #24292f;
}

.markdown-body small {
  font-size: 90%;
}

.markdown-body sub,
.markdown-body sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

.markdown-body sub {
  bottom: -0.25em;
}

.markdown-body sup {
  top: -0.5em;
}

.markdown-body img {
  border-style: none;
  max-width: 100%;
  box-sizing: content-box;
  background-color: #ffffff;
}

.markdown-body code,
.markdown-body kbd,
.markdown-body pre,
.markdown-body samp {
  font-family: monospace,monospace;
  font-size: 1em;
}

.markdown-body figure {
  margin: 1em 40px;
}

.markdown-body hr {
  box-sizing: content-box;
  overflow: hidden;
  background: transparent;
  border-bottom: 1px solid hsla(210,18%,87%,1);
  height: .25em;
  padding: 0;
  margin: 24px 0;
  background-color: #d0d7de;
  border: 0;
}

.markdown-body input {
  font: inherit;
  margin: 0;
  overflow: visible;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.markdown-body [type=button],
.markdown-body [type=reset],
.markdown-body [type=submit] {
  -webkit-appearance: button;
}

.markdown-body [type=button]::-moz-focus-inner,
.markdown-body [type=reset]::-moz-focus-inner,
.markdown-body [type=submit]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

.markdown-body [type=button]:-moz-focusring,
.markdown-body [type=reset]:-moz-focusring,
.markdown-body [type=submit]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

.markdown-body [type=checkbox],
.markdown-body [type=radio] {
  box-sizing: border-box;
  padding: 0;
}

.markdown-body [type=number]::-webkit-inner-spin-button,
.markdown-body [type=number]::-webkit-outer-spin-button {
  height: auto;
}

.markdown-body [type=search] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

.markdown-body [type=search]::-webkit-search-cancel-button,
.markdown-body [type=search]::-webkit-search-decoration {
  -webkit-appearance: none;
}

.markdown-body ::-webkit-input-placeholder {
  color: inherit;
  opacity: .54;
}

.markdown-body ::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body hr::before {
  display: table;
  content: "";
}

.markdown-body hr::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
}

.markdown-body td,
.markdown-body th {
  padding: 0;
}

.markdown-body details summary {
  cursor: pointer;
}

.markdown-body details:not([open])>*:not(summary) {
  display: none !important;
}

.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  line-height: 10px;
  color: #24292f;
  vertical-align: middle;
  background-color: #f6f8fa;
  border: solid 1px rgba(175,184,193,0.2);
  border-bottom-color: rgba(175,184,193,0.2);
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 rgba(175,184,193,0.2);
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h2 {
  font-weight: 600;
  padding-bottom: .3em;
  font-size: 1.5em;
  border-bottom: 1px solid hsla(210,18%,87%,1);
}

.markdown-body h3 {
  font-weight: 600;
  font-size: 1.25em;
}

.markdown-body h4 {
  font-weight: 600;
  font-size: 1em;
}

.markdown-body h5 {
  font-weight: 600;
  font-size: .875em;
}

.markdown-body h6 {
  font-weight: 600;
  font-size: .85em;
  color: #57606a;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 10px;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: #57606a;
  border-left: .25em solid #d0d7de;
}

.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 2em;
}

.markdown-body ol ol,
.markdown-body ul ol {
  list-style-type: lower-roman;
}

.markdown-body ul ul ol,
.markdown-body ul ol ol,
.markdown-body ol ul ol,
.markdown-body ol ol ol {
  list-style-type: lower-alpha;
}

.markdown-body dd {
  margin-left: 0;
}

.markdown-body tt,
.markdown-body code {
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  font-size: 12px;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 0;
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  font-size: 12px;
  word-wrap: normal;
}

.markdown-body .octicon {
  display: inline-block;
  overflow: visible !important;
  vertical-align: text-bottom;
  fill: currentColor;
}

.markdown-body ::placeholder {
  color: #6e7781;
  opacity: 1;
}

.markdown-body input::-webkit-outer-spin-button,
.markdown-body input::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
}

.markdown-body .pl-c {
  color: #6e7781;
}

.markdown-body .pl-c1,
.markdown-body .pl-s .pl-v {
  color: #0550ae;
}

.markdown-body .pl-e,
.markdown-body .pl-en {
  color: #8250df;
}

.markdown-body .pl-smi,
.markdown-body .pl-s .pl-s1 {
  color: #24292f;
}

.markdown-body .pl-ent {
  color: #116329;
}

.markdown-body .pl-k {
  color: #cf222e;
}

.markdown-body .pl-s,
.markdown-body .pl-pds,
.markdown-body .pl-s .pl-pse .pl-s1,
.markdown-body .pl-sr,
.markdown-body .pl-sr .pl-cce,
.markdown-body .pl-sr .pl-sre,
.markdown-body .pl-sr .pl-sra {
  color: #0a3069;
}

.markdown-body .pl-v,
.markdown-body .pl-smw {
  color: #953800;
}

.markdown-body .pl-bu {
  color: #82071e;
}

.markdown-body .pl-ii {
  color: #f6f8fa;
  background-color: #82071e;
}

.markdown-body .pl-c2 {
  color: #f6f8fa;
  background-color: #cf222e;
}

.markdown-body .pl-sr .pl-cce {
  font-weight: bold;
  color: #116329;
}

.markdown-body .pl-ml {
  color: #3b2300;
}

.markdown-body .pl-mh,
.markdown-body .pl-mh .pl-en,
.markdown-body .pl-ms {
  font-weight: bold;
  color: #0550ae;
}

.markdown-body .pl-mi {
  font-style: italic;
  color: #24292f;
}

.markdown-body .pl-mb {
  font-weight: bold;
  color: #24292f;
}

.markdown-body .pl-md {
  color: #82071e;
  background-color: #FFEBE9;
}

.markdown-body .pl-mi1 {
  color: #116329;
  background-color: #dafbe1;
}

.markdown-body .pl-mc {
  color: #953800;
  background-color: #ffd8b5;
}

.markdown-body .pl-mi2 {
  color: #eaeef2;
  background-color: #0550ae;
}

.markdown-body .pl-mdr {
  font-weight: bold;
  color: #8250df;
}

.markdown-body .pl-ba {
  color: #57606a;
}

.markdown-body .pl-sg {
  color: #8c959f;
}

.markdown-body .pl-corl {
  text-decoration: underline;
  color: #0a3069;
}

.markdown-body [data-catalyst] {
  display: block;
}

.markdown-body g-emoji {
  font-family: "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 1em;
  font-style: normal !important;
  font-weight: 400;
  line-height: 1;
  vertical-align: -0.075em;
}

.markdown-body g-emoji img {
  width: 1em;
  height: 1em;
}

.markdown-body::before {
  display: table;
  content: "";
}

.markdown-body::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body>*:first-child {
  margin-top: 0 !important;
}

.markdown-body>*:last-child {
  margin-bottom: 0 !important;
}

.markdown-body a:not([href]) {
  color: inherit;
  text-decoration: none;
}

.markdown-body .absent {
  color: #cf222e;
}

.markdown-body .anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
}

.markdown-body .anchor:focus {
  outline: none;
}

.markdown-body p,
.markdown-body blockquote,
.markdown-body ul,
.markdown-body ol,
.markdown-body dl,
.markdown-body table,
.markdown-body pre,
.markdown-body details {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body blockquote>:first-child {
  margin-top: 0;
}

.markdown-body blockquote>:last-child {
  margin-bottom: 0;
}

.markdown-body sup>a::before {
  content: "[";
}

.markdown-body sup>a::after {
  content: "]";
}

.markdown-body h1 .octicon-link,
.markdown-body h2 .octicon-link,
.markdown-body h3 .octicon-link,
.markdown-body h4 .octicon-link,
.markdown-body h5 .octicon-link,
.markdown-body h6 .octicon-link {
  color: #24292f;
  vertical-align: middle;
  visibility: hidden;
}

.markdown-body h1:hover .anchor,
.markdown-body h2:hover .anchor,
.markdown-body h3:hover .anchor,
.markdown-body h4:hover .anchor,
.markdown-body h5:hover .anchor,
.markdown-body h6:hover .anchor {
  text-decoration: none;
}

.markdown-body h1:hover .anchor .octicon-link,
.markdown-body h2:hover .anchor .octicon-link,
.markdown-body h3:hover .anchor .octicon-link,
.markdown-body h4:hover .anchor .octicon-link,
.markdown-body h5:hover .anchor .octicon-link,
.markdown-body h6:hover .anchor .octicon-link {
  visibility: visible;
}

.markdown-body h1 tt,
.markdown-body h1 code,
.markdown-body h2 tt,
.markdown-body h2 code,
.markdown-body h3 tt,
.markdown-body h3 code,
.markdown-body h4 tt,
.markdown-body h4 code,
.markdown-body h5 tt,
.markdown-body h5 code,
.markdown-body h6 tt,
.markdown-body h6 code {
  padding: 0 .2em;
  font-size: inherit;
}

.markdown-body ul.no-list,
.markdown-body ol.no-list {
  padding: 0;
  list-style-type: none;
}

.markdown-body ol[type="1"] {
  list-style-type: decimal;
}

.markdown-body ol[type=a] {
  list-style-type: lower-alpha;
}

.markdown-body ol[type=i] {
  list-style-type: lower-roman;
}

.markdown-body div>ol:not([type]) {
  list-style-type: decimal;
}

.markdown-body ul ul,
.markdown-body ul ol,
.markdown-body ol ol,
.markdown-body ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body li>p {
  margin-top: 16px;
}

.markdown-body li+li {
  margin-top: .25em;
}

.markdown-body dl {
  padding: 0;
}

.markdown-body dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

.markdown-body dl dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

.markdown-body table th {
  font-weight: 600;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #d0d7de;
}

.markdown-body table tr {
  background-color: #ffffff;
  border-top: 1px solid hsla(210,18%,87%,1);
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body table img {
  background-color: transparent;
}

.markdown-body img[align=right] {
  padding-left: 20px;
}

.markdown-body img[align=left] {
  padding-right: 20px;
}

.markdown-body .emoji {
  max-width: none;
  vertical-align: text-top;
  background-color: transparent;
}

.markdown-body span.frame {
  display: block;
  overflow: hidden;
}

.markdown-body span.frame>span {
  display: block;
  float: left;
  width: auto;
  padding: 7px;
  margin: 13px 0 0;
  overflow: hidden;
  border: 1px solid #d0d7de;
}

.markdown-body span.frame span img {
  display: block;
  float: left;
}

.markdown-body span.frame span span {
  display: block;
  padding: 5px 0 0;
  clear: both;
  color: #24292f;
}

.markdown-body span.align-center {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-body span.align-center>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: center;
}

.markdown-body span.align-center span img {
  margin: 0 auto;
  text-align: center;
}

.markdown-body span.align-right {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-body span.align-right>span {
  display: block;
  margin: 13px 0 0;
  overflow: hidden;
  text-align: right;
}

.markdown-body span.align-right span img {
  margin: 0;
  text-align: right;
}

.markdown-body span.float-left {
  display: block;
  float: left;
  margin-right: 13px;
  overflow: hidden;
}

.markdown-body span.float-left span {
  margin: 13px 0 0;
}

.markdown-body span.float-right {
  display: block;
  float: right;
  margin-left: 13px;
  overflow: hidden;
}

.markdown-body span.float-right>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: right;
}

.markdown-body code,
.markdown-body tt {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(175,184,193,0.2);
  border-radius: 6px;
}

.markdown-body code br,
.markdown-body tt br {
  display: none;
}

.markdown-body del code {
  text-decoration: inherit;
}

.markdown-body pre code {
  font-size: 100%;
}

.markdown-body pre>code {
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body .highlight {
  margin-bottom: 16px;
}

.markdown-body .highlight pre {
  margin-bottom: 0;
  word-break: normal;
}

.markdown-body .highlight pre,
.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-body pre code,
.markdown-body pre tt {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-body .csv-data td,
.markdown-body .csv-data th {
  padding: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
}

.markdown-body .csv-data .blob-num {
  padding: 10px 8px 9px;
  text-align: right;
  background: #ffffff;
  border: 0;
}

.markdown-body .csv-data tr {
  border-top: 0;
}

.markdown-body .csv-data th {
  font-weight: 600;
  background: #f6f8fa;
  border-top: 0;
}

.markdown-body .footnotes {
  font-size: 12px;
  color: #57606a;
  border-top: 1px solid #d0d7de;
}

.markdown-body .footnotes ol {
  padding-left: 16px;
}

.markdown-body .footnotes li {
  position: relative;
}

.markdown-body .footnotes li:target::before {
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -24px;
  pointer-events: none;
  content: "";
  border: 2px solid #0969da;
  border-radius: 6px;
}

.markdown-body .footnotes li:target {
  color: #24292f;
}

.markdown-body .footnotes .data-footnote-backref g-emoji {
  font-family: monospace;
}

.markdown-body .task-list-item {
  list-style-type: none;
}

.markdown-body .task-list-item label {
  font-weight: 400;
}

.markdown-body .task-list-item.enabled label {
  cursor: pointer;
}

.markdown-body .task-list-item+.task-list-item {
  margin-top: 3px;
}

.markdown-body .task-list-item .handle {
  display: none;
}

.markdown-body .task-list-item-checkbox {
  margin: 0 .2em .25em -1.6em;
  vertical-align: middle;
}

.markdown-body .contains-task-list:dir(rtl) .task-list-item-checkbox {
  margin: 0 -1.6em .25em .2em;
}

.markdown-body ::-webkit-calendar-picker-indicator {
  filter: invert(50%);
}


/*!
 * "Fork me on GitHub" CSS ribbon v0.2.3 | MIT License
 * https://github.com/simonwhitaker/github-fork-ribbon-css
*/

.github-fork-ribbon {
  width: 12.1em;
  height: 12.1em;
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
  font-size: 13px;
  text-decoration: none;
  text-indent: -999999px;
}

/**
  Added to make it smaller
 */
 .github-fork-ribbon{
  transform: scale(0.7);
  transform-origin: right top;
}

.github-fork-ribbon.fixed {
  position: fixed;
}

.github-fork-ribbon:hover, .github-fork-ribbon:active {
  background-color: rgba(0, 0, 0, 0.0);
}

.github-fork-ribbon:before, .github-fork-ribbon:after {
  /* The right and left classes determine the side we attach our banner to */
  position: absolute;
  display: block;
  width: 15.38em;
  height: 1.54em;

  top: 3.23em;
  right: -3.23em;

  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;

  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

.github-fork-ribbon:before {
  content: "";

  /* Add a bit of padding to give some substance outside the "stitching" */
  padding: .38em 0;

  /* Set the base colour */
  background-color: rgb(57, 57, 76);

  /* Set a gradient: transparent black at the top to almost-transparent black at the bottom */
  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 0.15)));
  background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15));
  background-image: -moz-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15));
  background-image: -ms-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15));
  background-image: -o-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15));
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15));

  /* Add a drop shadow */
  -webkit-box-shadow: 0 .15em .23em 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 .15em .23em 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 .15em .23em 0 rgba(0, 0, 0, 0.5);

  pointer-events: auto;
}

.github-fork-ribbon:after {
  /* Set the text from the data-ribbon attribute */
  content: attr(data-ribbon);

  /* Set the text properties */
  color: #fff;
  font: 700 1em "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.54em;
  text-decoration: none;
  text-shadow: 0 -.08em rgba(0, 0, 0, 0.5);
  text-align: center;
  text-indent: 0;

  /* Set the layout properties */
  padding: .15em 0;
  margin: .15em 0;

  /* Add "stitching" effect */
  border-width: .08em 0;
  border-style: dotted;
  border-color: #fff;
  border-color: rgba(255, 255, 255, 0.7);
}

.github-fork-ribbon.left-top, .github-fork-ribbon.left-bottom {
  right: auto;
  left: 0;
}

.github-fork-ribbon.left-bottom, .github-fork-ribbon.right-bottom {
  top: auto;
  bottom: 0;
}

.github-fork-ribbon.left-top:before, .github-fork-ribbon.left-top:after, .github-fork-ribbon.left-bottom:before, .github-fork-ribbon.left-bottom:after {
  right: auto;
  left: -3.23em;
}

.github-fork-ribbon.left-bottom:before, .github-fork-ribbon.left-bottom:after, .github-fork-ribbon.right-bottom:before, .github-fork-ribbon.right-bottom:after {
  top: auto;
  bottom: 3.23em;
}

.github-fork-ribbon.left-top:before, .github-fork-ribbon.left-top:after, .github-fork-ribbon.right-bottom:before, .github-fork-ribbon.right-bottom:after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

</style>
