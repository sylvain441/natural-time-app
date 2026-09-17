<template>

  <section class="spiral-intro">
    <div class="spiral-intro__ground" aria-hidden="true"></div>

    <PaperTexture class="spiral-intro__paper" :opacity=".4" blend="multiply" />
    <div class="spiral-intro__glow" aria-hidden="true"></div>

    <div class="spiral-intro__copy">

      <p class="spiral-intro__lead">
        <span class="spiral-intro__lead-soft">{{ $t('welcome.turn.line1') }}</span><br>{{ $t('welcome.turn.line2', { spiral: $t('welcome.turn.spiral') }) }}
      </p>

      <p class="spiral-intro__formula">{{ $t('welcome.moonsIntro.formula') }}</p>

      <i18n-t keypath="welcome.moonsIntro.statement" tag="p" class="spiral-intro__statement" scope="global">
        <template #moon>
          <span class="spiral-intro__moon">{{ $t('welcome.moonsIntro.moonWord') }}</span>
        </template>
        <template #same>
          <span class="spiral-intro__mark">{{ $t('welcome.moonsIntro.sameWord') }}</span>
        </template>
      </i18n-t>

      <nav class="spiral-intro__links">
        <router-link :to="spiralRoute" class="spiral-intro__link">
          <span>{{ $t('welcome.moonsIntro.links.spiral') }}</span>
        </router-link>
        <a href="#FAQ-3" class="spiral-intro__link">
          <span>{{ $t('welcome.moonsIntro.links.faq') }}</span>
        </a>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PaperTexture from '@/components/PaperTexture.vue';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import { getLocalizedRouteName } from '@/i18n/config';

const { locale } = useI18n();

const spiralRoute = computed(() => ({ name: getLocalizedRouteName('13moons', locale.value) }));
</script>

<style scoped>
.spiral-intro {
  position: relative;
  width: 100%;
  overflow: hidden;

  padding: clamp(4.5rem, 9vw, 8rem) 1.5rem clamp(4.5rem, 9vw, 7.5rem);
  font-family: "Poppins", ui-sans-serif, system-ui, sans-serif;

  --spiral-intro-page: #F2F8FB;
  --spiral-intro-ink: #10222B;
  --spiral-intro-soft: #5F6E76;
}

.spiral-intro__ground {
  position: absolute; inset: 0; z-index: 0;
  background: var(--spiral-intro-page);
}
.spiral-intro__paper { z-index: 1; }

.spiral-intro__glow {
  position: absolute; left: 0; right: 0; top: 0; height: 62%; z-index: 2;
  pointer-events: none;
  background: radial-gradient(58% 100% at 50% 0%,
    rgb(145 200 218 / .5) 0%, rgb(145 200 218 / .16) 42%, rgb(145 200 218 / 0) 72%);
}

.spiral-intro__copy {
  position: relative; z-index: 3;
  margin: 0 auto;
  width: 100%;
  max-width: 40rem;
}

.spiral-intro__lead {
  font-weight: 400;
  font-size: clamp(0.95rem, 1.2vw, 1.12rem);
  line-height: 1.6;
  text-align: center;
  text-wrap: pretty;
  color: var(--spiral-intro-ink);
}
.spiral-intro__lead-soft { color: var(--spiral-intro-soft); }

.spiral-intro__formula {
  margin-top: clamp(0.9rem, 1.8vw, 1.5rem);
  font-weight: 500;
  font-size: clamp(1.5rem, 2.6vw, 2.15rem);
  line-height: 1.2;
  letter-spacing: .005em;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: var(--spiral-intro-ink);

  text-decoration: underline;
  text-decoration-color: rgb(94 151 172 / 1);
  text-decoration-thickness: .07em;
  text-underline-offset: .16em;
}

.spiral-intro__statement {
  margin-top: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 400;
  font-size: clamp(1.3rem, 2vw, 1.68rem);
  line-height: 1.55;
  text-align: center;
  text-wrap: balance;
  color: var(--spiral-intro-ink);
}

.spiral-intro :deep(.spiral-intro__moon) {
  font-weight: 500;
  color: #2E6B82;
}

.spiral-intro :deep(.spiral-intro__mark) {

  --spiral-intro-hl: 111 175 198;
  background-image: linear-gradient(101deg,
    rgb(var(--spiral-intro-hl) / 0) 0.5%,
    rgb(var(--spiral-intro-hl) / 1) 2.2%,
    rgb(var(--spiral-intro-hl) / 0.85) 5.5%,
    rgb(var(--spiral-intro-hl) / 0.85) 92%,
    rgb(var(--spiral-intro-hl) / 1) 96%,
    rgb(var(--spiral-intro-hl) / 0) 99%);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 92%;
  border-radius: 0.42em 0.15em;
  color: #16140F;
  padding: 0.04em 0.24em;
  margin: 0 -0.16em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.spiral-intro__links {
  margin-top: clamp(2.4rem, 4.5vw, 3.6rem);
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: .9rem clamp(1.4rem, 3vw, 2.6rem);
}
.spiral-intro__link {
  font-size: clamp(.8rem, 1vw, .92rem); font-weight: 500;
  letter-spacing: .01em;
  color: var(--spiral-intro-ink);
  opacity: .7;
  transition: opacity .25s ease;
}
.spiral-intro__link span { border-bottom: 1px solid rgb(16 34 43 / .3); padding-bottom: .25em; }
.spiral-intro__link:hover, .spiral-intro__link:focus-visible { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .spiral-intro__link { transition: none; }
}
</style>
