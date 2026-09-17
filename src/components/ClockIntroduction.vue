<template>

  <section class="clock-intro">
    <div class="clock-intro__ground" aria-hidden="true"></div>

    <PaperTexture class="clock-intro__paper" :opacity=".55" blend="multiply" />
    <div class="clock-intro__glow" aria-hidden="true"></div>

    <div class="clock-intro__copy">

      <p class="clock-intro__lead">{{ $t('welcome.intro.lead') }}</p>

      <i18n-t keypath="welcome.intro.statement" tag="p" class="clock-intro__statement" scope="global">
        <template #hand>
          <span class="clock-intro__note">{{ $t('welcome.intro.handWord') }}</span>
        </template>
        <template #dial>
          <span class="clock-intro__note">{{ $t('welcome.intro.dialWord') }}</span>
        </template>
        <template #sun>
          <span class="clock-intro__sun">{{ $t('welcome.intro.sunWord') }} ☀️</span>
        </template>
        <template #reference>
          <span class="clock-intro__mark">{{ $t('welcome.intro.referenceWord') }}</span>
        </template>
      </i18n-t>

      <div class="clock-intro__actions">
        <template v-if="isOnline">
          <button
            v-if="!videoOpen"
            type="button"
            @click="videoOpen = true"
            class="clock-intro__video"
          >
            <span class="clock-intro__play" aria-hidden="true"><span></span></span>
            {{ $t('welcome.intro.video.label') }}
          </button>
        </template>

        <p v-else class="clock-intro__offline">{{ $t('welcome.intro.video.offline') }}</p>

        <nav class="clock-intro__links">
          <router-link :to="clockRoute" class="clock-intro__link">
            <span>{{ $t('welcome.intro.links.clock') }}</span>
          </router-link>
          <a href="#FAQ-2" class="clock-intro__link">
            <span>{{ $t('welcome.intro.links.faq') }}</span>
          </a>
        </nav>
      </div>

      <div v-if="videoOpen" class="clock-intro__player">
        <YouTubePlayer :videoId="videoId" immediate />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import YouTubePlayer from '@/components/YouTubePlayer.vue';
import PaperTexture from '@/components/PaperTexture.vue';
import { useOnline } from '@/composables/useOnline';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import { getLocalizedRouteName } from '@/i18n/config';

const videoId = 'XP8XYidlgKA';

const { locale } = useI18n();
const isOnline = useOnline();
const videoOpen = ref(false);

const clockRoute = computed(() => ({ name: getLocalizedRouteName('time', locale.value) }));
</script>

<style scoped>
.clock-intro {
  position: relative;
  width: 100%;
  overflow: hidden;

  padding: clamp(4.5rem, 9vw, 8rem) 1.5rem clamp(4.5rem, 9vw, 7.5rem);
  font-family: "Poppins", ui-sans-serif, system-ui, sans-serif;

  --clock-intro-page: #FBF8EF;
  --clock-intro-ink: #1A1917;
  --clock-intro-soft: #6D6558;
}

.clock-intro__ground {
  position: absolute; inset: 0; z-index: 0;
  background: var(--clock-intro-page);
}
.clock-intro__paper { z-index: 1; }

.clock-intro__glow {
  position: absolute; left: 0; right: 0; top: 0; height: 62%; z-index: 2;
  pointer-events: none;
  background: radial-gradient(58% 100% at 50% 0%,
    rgb(240 196 63 / .28) 0%, rgb(240 196 63 / .09) 42%, rgb(240 196 63 / 0) 72%);
}

.clock-intro__copy {
  position: relative; z-index: 3;
  margin: 0 auto;
  width: 100%;
  max-width: 40rem;
}

.clock-intro__lead {
  font-weight: 400;
  font-size: clamp(0.95rem, 1.2vw, 1.12rem);
  line-height: 1.6;
  text-align: center;
  text-wrap: pretty;
  color: var(--clock-intro-soft);
}

.clock-intro__statement {
  margin-top: clamp(0.8rem, 1.5vw, 1.2rem);
  font-weight: 400;
  font-size: clamp(1.3rem, 2vw, 1.68rem);
  line-height: 1.55;
  text-align: center;

  text-wrap: balance;
  color: var(--clock-intro-ink);
}

.clock-intro :deep(.clock-intro__note) {
  text-decoration: underline;
  text-decoration-color: rgb(255 204 61 / 1);
  text-decoration-thickness: .13em;
  text-underline-offset: .13em;
}

.clock-intro :deep(.clock-intro__sun) {
  font-weight: 500;
}

.clock-intro :deep(.clock-intro__mark) {

  --clock-intro-hl: 255 204 61;
  background-image: linear-gradient(101deg,
    rgb(var(--clock-intro-hl) / 0) 0.5%,
    rgb(var(--clock-intro-hl) / 1) 2.2%,
    rgb(var(--clock-intro-hl) / 0.85) 5.5%,
    rgb(var(--clock-intro-hl) / 0.85) 92%,
    rgb(var(--clock-intro-hl) / 1) 96%,
    rgb(var(--clock-intro-hl) / 0) 99%);
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

.clock-intro__actions {
  margin-top: clamp(2.4rem, 4.5vw, 3.6rem);
  display: flex; flex-direction: column; align-items: center;
  gap: clamp(1.4rem, 2.6vw, 2rem);
}

.clock-intro__video {
  display: inline-flex; align-items: center; gap: .75rem;
  padding: .75rem 1.5rem;
  border: 1px solid rgb(26 25 23 / .18);
  border-radius: 999px;
  font-size: clamp(1rem, 1.3vw, 1.12rem); font-weight: 500;
  color: var(--clock-intro-ink);
  transition: border-color .3s ease, background-color .3s ease;
}
.clock-intro__video:hover, .clock-intro__video:focus-visible {
  border-color: rgb(26 25 23 / .45);
  background: rgb(26 25 23 / .05);
}
.clock-intro__play {
  display: flex; align-items: center; justify-content: center;
  width: 1.75rem; height: 1.75rem; flex: none;
  border-radius: 50%;
  background: rgb(220 38 38 / .9);
  transition: transform .3s ease;
}
.clock-intro__play span {
  margin-left: 3px;
  width: 0; height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 9px solid #fff;
}
.clock-intro__video:hover .clock-intro__play { transform: scale(1.1); }

.clock-intro__offline {
  font-size: .875rem;
  text-align: center;
  color: var(--clock-intro-soft);
}

.clock-intro__links {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: .9rem clamp(1.4rem, 3vw, 2.6rem);
}

.clock-intro__link {
  font-size: clamp(.8rem, 1vw, .92rem); font-weight: 500;
  letter-spacing: .01em;
  color: var(--clock-intro-ink);
  opacity: .7;
  transition: opacity .25s ease;
}
.clock-intro__link span { border-bottom: 1px solid rgb(26 25 23 / .3); padding-bottom: .25em; }
.clock-intro__link:hover, .clock-intro__link:focus-visible { opacity: 1; }

.clock-intro__player {
  margin-top: clamp(1.5rem, 3vw, 2rem);
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / .2);
}

@media (prefers-reduced-motion: reduce) {
  .clock-intro__video, .clock-intro__play, .clock-intro__link { transition: none; }
}
</style>
