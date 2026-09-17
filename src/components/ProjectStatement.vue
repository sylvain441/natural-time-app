<template>

  <section class="project-statement">
    <div class="project-statement__ground" aria-hidden="true"></div>

    <div class="project-statement__copy">
      <div class="project-statement__disc">
        <div class="project-statement__disc-in">
          <h2 class="project-statement__lead">{{ $t('welcome.commons.lead') }}</h2>
          <i18n-t keypath="welcome.commons.statement" tag="p" class="project-statement__statement" scope="global">
            <template #convention>
              <span class="project-statement__highlight">{{ $t('welcome.commons.conventionWord') }}</span>
            </template>
            <template #units>
              <span class="project-statement__highlight">{{ $t('welcome.commons.unitsPhrase') }}</span>
            </template>
          </i18n-t>

          <a class="project-statement__cta"
             href="https://github.com/sylvain441/natural-time"
             target="_blank"
             rel="noopener noreferrer">
            <svg class="project-statement__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            {{ $t('welcome.commons.cta') }}
          </a>
        </div>
      </div>

      <p class="project-statement__author">
        <span>{{ $t('welcome.commons.author.text') }}</span>
        <span>{{ $t('welcome.commons.author.hunch') }}</span>
      </p>

      <nav class="project-statement__doors">
        <a href="https://biquette.xyz" target="_blank" rel="noopener noreferrer" class="project-statement__door">
          {{ $t('welcome.commons.links.site') }}
          <span class="project-statement__door-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </nav>

      <section class="project-statement__support">
        <h3 class="project-statement__support-label">{{ $t('welcome.commons.supportLabel') }}</h3>
        <p class="project-statement__support-text">{{ $t('welcome.commons.support') }}</p>
        <nav class="project-statement__support-doors">
          <a href="https://shop.biquette.xyz" target="_blank" rel="noopener noreferrer" class="project-statement__pill project-statement__pill-solid">
            {{ $t('welcome.commons.links.shop') }}
          </a>
          <a href="https://biquette.xyz/soutenir-mes-recherches/#/portal/support" target="_blank" rel="noopener noreferrer" class="project-statement__pill">
            {{ $t('welcome.commons.links.donate') }}
          </a>
        </nav>
      </section>
    </div>

    <PaperTexture class="project-statement__paper" :opacity="0.42" blend="multiply" :seed="77" />
  </section>
</template>

<script setup>
import PaperTexture from '@/components/PaperTexture.vue';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';

</script>

<style scoped>
.project-statement {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(4rem, 9vw, 7rem) 1.5rem clamp(4rem, 8vw, 6rem);
  font-family: "Poppins", ui-sans-serif, system-ui, sans-serif;

  --project-statement-page: #0A1120;
  --project-statement-ink: #EAEFF7;
  --project-statement-soft: #8D9AAE;

  --project-statement-edge: 234 239 247;

  --project-statement-disc: #FFCC3D;
  --project-statement-disc-ink: #16140F;
}

.project-statement__ground {
  position: absolute; inset: 0; z-index: 0;

  background: linear-gradient(180deg, #101827 0%, var(--project-statement-page) 52%, #070B14 100%);
}

.project-statement__paper {
  position: absolute; inset: 0; z-index: 3;
  pointer-events: none;
}

.project-statement__copy {
  position: relative; z-index: 2;
  margin: 0 auto;
  width: 100%;
  max-width: 34rem;
  text-align: center;
}

.project-statement__disc {
  position: relative;
  width: min(92vw, 34rem);
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 50%;
  background: var(--project-statement-disc);
  display: grid;
  place-items: center;
  color: var(--project-statement-disc-ink);

  container-type: inline-size;
}

.project-statement__disc-in {
  width: 72%;
  text-align: center;
  text-wrap: balance;
}

.project-statement__lead {
  font-weight: 500;
  font-size: 3.4cqi;
  line-height: 1.45;
  color: rgb(22 20 15 / .62);
}

.project-statement__statement {
  margin-top: 3cqi;
  font-weight: 400;
  font-size: 4.2cqi;
  line-height: 1.5;
}

.project-statement__disc :deep(.project-statement__highlight) {
  --project-statement-white: 255 255 255;
  background-image: linear-gradient(101deg,
    rgb(var(--project-statement-white) / 0) 0.5%,
    rgb(var(--project-statement-white) / 1) 2.2%,
    rgb(var(--project-statement-white) / 0.9) 5.5%,
    rgb(var(--project-statement-white) / 0.9) 92%,
    rgb(var(--project-statement-white) / 1) 96%,
    rgb(var(--project-statement-white) / 0) 99%);
  background-repeat: no-repeat;
  background-position: 0 100%;

  background-size: 100% 94%;
  border-radius: 0.42em 0.15em;
  padding: 0.06em 0.26em;
  margin: 0 -0.18em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.project-statement__cta {
  display: inline-flex;
  align-items: center;
  gap: .5em;
  margin-top: 4.4cqi;

  padding: max(.55rem, 1.5cqi) max(1.05rem, 3.3cqi);

  background: #FFFFFF;
  border: 1px solid rgb(22 20 15 / .08);
  border-radius: 999px;
  font-size: max(.76rem, 2.7cqi);
  font-weight: 500;
  line-height: 1.2;
  color: var(--project-statement-disc-ink);
  white-space: nowrap;
  transition: background-color .25s ease, border-color .25s ease;
}
.project-statement__mark {
  width: 1.15em; height: 1.15em;
  flex: none;
  margin-right: -.1em;
}
.project-statement__cta:hover, .project-statement__cta:focus-visible {
  background: #FFFDF7;
  border-color: rgb(22 20 15 / .3);
}

@media (max-width: 480px) {
  .project-statement__disc {
    width: 104vw;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}

@container (max-width: 26rem) {
  .project-statement__disc-in { width: 68%; }
  .project-statement__cta {
    margin-top: 3.6rem;
    margin-top: 3.6cqi;
    padding: .42rem .85rem;
    font-size: .74rem;
  }
}

.project-statement__author {
  margin: clamp(2.6rem, 5vw, 3.8rem) auto 0;
  max-width: 32rem;
  font-size: clamp(.9rem, 1.1vw, 1rem);
  line-height: 1.8;
  text-wrap: pretty;
  color: var(--project-statement-ink);
}

.project-statement__author span { display: block; }
.project-statement__author span + span { margin-top: .9em; }

.project-statement__doors {
  margin-top: clamp(1.5rem, 2.6vw, 2rem);
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: .7rem;
}

.project-statement__door {
  display: inline-flex;
  align-items: center;
  gap: .5em;
  padding: .5rem 1.1rem;
  border: 1px solid rgb(var(--project-statement-edge) / .28);
  border-radius: 999px;
  font-size: clamp(.78rem, .95vw, .86rem);
  font-weight: 500;
  line-height: 1.2;
  color: var(--project-statement-ink);
  opacity: .85;
  transition: opacity .25s ease, border-color .25s ease, background-color .25s ease;
}
.project-statement__door-arrow { transition: transform .3s ease; }
.project-statement__door:hover, .project-statement__door:focus-visible {
  opacity: 1;
  background: rgb(var(--project-statement-edge) / .07);
  border-color: rgb(var(--project-statement-edge) / .5);
}
.project-statement__door:hover .project-statement__door-arrow { transform: translateX(2px); }

.project-statement__support {
  margin: clamp(2.6rem, 5vw, 3.6rem) auto 0;
  max-width: 32rem;
  padding-top: clamp(1.8rem, 3.4vw, 2.6rem);
  border-top: 1px solid rgb(var(--project-statement-edge) / .14);
}

.project-statement__support-label {
  margin: 0;
  font-size: clamp(.68rem, .82vw, .74rem);
  font-weight: 500;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgb(var(--project-statement-edge) / .5);
}

.project-statement__support-text {
  margin-top: .9rem;
  font-size: clamp(.86rem, 1.05vw, .95rem);
  line-height: 1.75;
  text-wrap: pretty;
  color: rgb(var(--project-statement-edge) / .72);
}

.project-statement__support-doors {
  margin-top: 1.3rem;
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: .7rem;
}

.project-statement__pill {
  display: inline-flex;
  align-items: center;
  padding: .58rem 1.2rem;
  border-radius: 999px;
  background: rgb(var(--project-statement-edge) / .1);
  border: 1px solid rgb(var(--project-statement-edge) / .16);
  font-size: clamp(.78rem, .95vw, .86rem);
  font-weight: 500;
  line-height: 1.2;
  color: var(--project-statement-ink);
  transition: background-color .25s ease, border-color .25s ease;
}
.project-statement__pill:hover, .project-statement__pill:focus-visible {
  background: rgb(var(--project-statement-edge) / .18);
  border-color: rgb(var(--project-statement-edge) / .3);
}

.project-statement__pill-solid {
  background: #FFFFFF;
  border-color: rgb(255 255 255 / .9);
  color: var(--project-statement-disc-ink);
}
.project-statement__pill-solid:hover, .project-statement__pill-solid:focus-visible {
  background: #FFFDF7;
  border-color: #FFFFFF;
}

@media (prefers-reduced-motion: reduce) {
  .project-statement__cta, .project-statement__door, .project-statement__door-arrow, .project-statement__pill { transition: none; }
}
</style>
