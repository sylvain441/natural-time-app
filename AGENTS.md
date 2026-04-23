# AGENTS.md — Natural Time App

## 1. What Natural Time is (a 2-minute primer)

Natural Time is a **new time convention**, designed to replace (or complement)
the 24-hour clock and the Gregorian calendar. It relies only on observations
of the living world — not on conventions inherited from emperors, popes, or
daylight-saving schemes.

### The natural clock

- **A single hand** that follows the path of the sun across the sky.
- **One rotation per day**, very slowly, in the direction of the sun
  (clockwise in the northern hemisphere, counter-clockwise in the southern).
- **A 360° dial**: `0°` is the middle of the night (bottom of dial), `180°` (top of dial) is true noon
  (sun at its highest point in the sky), regardless of any time zone.
- **The "moustaches"** on the dial show the seasonal amplitudes of sunrise
  and sunset at the current latitude.
- **Time depends on location**: a geographic point is required. There is no
  such thing as "natural time" without a place. When sharing a time remotely,
  we write the angle followed by the longitude, e.g. `180° NT+6` for "180°
  natural at longitude +6".
- **Conversions**: 1 natural degree = 4 artificial minutes. 15° = 1 hour.
- We stop asking *"what time is it?"* and start asking *"where is the sun in
  the sky?"*.

### The 13-moons spiral

- **13 moons of 28 days = 364 days**, all identical. Every moon starts on a
  **red day** and ends on a **violet day**. In Natural Time, days are named
  after the seven colors of the rainbow (red, orange, yellow, green, blue,
  indigo, violet)
- **A rainbow day** (sometimes two) sits **outside of time**, closing the
  year around the winter solstice (northern hemisphere) as a celebration
  of life. This is not synced with gregorian leap years.
- **Date format**: `YEAR ) MOON ) DAY` — alphabetically sortable, readable
  anywhere.
- **Year 001** = 22 December 2012, the solstice that marked a big step along the
  Mayan long count.

### Why it matters

The artificial time we use every day (24h clock, time zones, daylight saving,
lopsided months) is a tool **that disconnects us from the living world**.
It makes us eat without hunger, sleep without being tired, "look for noon at
2pm", and endure a collective jet-lag twice a year. Most people never ask
why — it's just how it is.

It is actually a very recent thing to follow clocks like robots — to say
*"I wake up at 7am, winter or summer, because 7am is 7am and that's when you
wake up."* The living world doesn't work like that. Birds don't set alarms, 
they follow the sun. Only humans do. We've forgotten that the sun
itself is a perfectly good timekeeper, running on nothing but physics, free
of charge.

Natural Time offers an alternative that is **simple, elegant, universal, and
observable from anywhere on Earth**. It reconnects our notion of time to
**something real and observable — the sun itself — rather than to a human
abstraction**. Reading the time becomes a **visual** experience, not a
mental calculation. The visual cortex recognizes the angle of the sun
instantly, without translating numbers.

> *"Time is not money. Time is art."*

The project is **open source and released into the public domain**. The
clock belongs to no one, not even its author — in the same spirit that the
liter, the meter, and the kilogram belong to no one. Natural Time is meant
to be a standard, a shared unit of measure for humanity, not a product.

---

## 2. What this app is

**natural-time-app** is the official PWA served at **naturaltime.app**.
Its job is to let anyone, in any language, on any device, experience and understand
Natural Time without installing anything.

### Stack

- **Vue 3** (Composition API, `<script setup>`) + **Vite** + **Vite SSG**
  (static HTML generated per route, per language, hydrated on the client).
- **Tailwind CSS** with a custom palette (`nt-yellow-*`, `nt-cyan-*`).
- **Pinia** for state, persisted to `localStorage`.
- **vue-i18n** (eager on SSR, lazy code-split on CSR).
- **PWA** via `vite-plugin-pwa` (autoUpdate, precache, offline-ready).
- **OpenLayers** for the map-based location picker.
- **Matomo** analytics (production only, self-hosted, no third-party cookies).

### The three main views

- **WelcomeView** — landing page, URL `/<lang>/`. Entry point for new
  visitors, introduces the concept.
- **ClockView** — the live natural clock, URL `/<lang>/<slug-clock>/`.
  Includes the tutorial, time-travel mode, and the location picker.
- **SpiralView** (13moons) — the 13-moons spiral calendar, URL
  `/<lang>/<slug-13moons>/`. Also in beta.

All routes are localized per language. `/` redirects to the user's detected
locale. `/startpwa/` is the PWA entry point: it redirects to the clock if a
location is already stored, otherwise to the welcome page.

### How the pieces fit together

- **Astronomy lives outside the app**. The `natural-time-js` package (TypeScript,
  separate repo, published on npm) does all the heavy lifting: `NaturalDate`,
  `NaturalSunEvents`, `NaturalMoonPosition`, `MustachesRange`, and so on.
  This app is only a rendering layer.
- **Location is the foundation**. Nothing meaningful can be shown until the
  user has set a latitude and longitude — through the map, a postal address,
  raw coordinates, or the browser's geolocation API. This is handled by
  `contextStore.js`.
- **UI state is held in stores**, not in individual components. `configStore`
  tracks which mode is active (welcome, tutorial, time-travel, simplified,
  etc.) and which panel is open. `contextStore` tracks location, geolocation
  permissions, and the current-time ticker.
- **Every user-facing string goes through i18n**. French (`fr.json`) is the
  reference; the other 11 languages are translated from it. There is no
  hardcoded French in components.
- **The PWA is offline-first**. Essential assets are precached; language
  pages use `NetworkFirst`. Service worker updates are detected hourly and
  surfaced through a notification on major/minor version bumps.

### Repository layout

```
natural-time-app/
├── AGENTS.md ............................. this file
├── package.json .......................... scripts: dev, build, preview, deploy
├── vite.config.js ........................ Vite + PWA + SSG + post-build SEO
├── tailwind.config.js .................... custom palette and utilities
├── public/
│   └── CNAME ............................. naturaltime.app
└── src/
    ├── main.js ........................... ViteSSG bootstrap, i18n, PWA
    ├── App.vue ........................... router-view wrapper, global shortcuts
    ├── router/router.js .................. localized routes per language
    ├── i18n/
    │   ├── config.js ..................... AVAILABLE_LANGUAGES, ROUTE_PATHS
    │   ├── i18n.js ....................... SSR eager / CSR lazy message loader
    │   └── lang/*.json ................... translations (fr.json is the reference)
    ├── stores/
    │   ├── configStore.js ................ UI modes, active panels, skins
    │   └── contextStore.js ............... location, geolocation, time ticker
    ├── views/
    │   ├── WelcomeView.vue
    │   ├── ClockView.vue
    │   └── SpiralView.vue
    ├── components/
    │   ├── ClockComponent.vue ............ the reusable SVG clock
    │   ├── LocationPicker.vue ............ map + search + GPS
    │   ├── FAQAccordion.vue
    │   └── ...
    ├── plugins/
    │   ├── pwa.js ........................ SW registration, update notifications
    │   └── matomo.js ..................... analytics (prod-only)
    ├── utils/
    │   └── notificationManager.js
    └── assets/
        ├── debut-light.png ............... background texture (light mode)
        ├── debut-dark.png ................ background texture (dark mode)
        ├── icon/ ......................... SVG icons
        ├── clock/ ........................ clock-related assets
        ├── pebble/ ....................... Pebble watchface mockups
        └── fonts/
```

---

## 3. Code conventions

- Vue 3 `<script setup>`, Composition API.
- **Every user-visible string goes through `$t()`.** `fr.json` is the
  reference; translate into the other languages afterwards. Do not hardcode
  strings.
- **SSR-safe**: any access to `window`, `navigator`, `document`, or
  `localStorage` must be gated with `import.meta.env.SSR` or placed inside
  `onMounted`. A single unguarded access breaks the static build.
- Pinia stores are persisted via `pinia-plugin-persistedstate`. Be
  intentional about which keys are persisted.
- Tailwind utility classes are preferred. For repeated patterns, add a
  component rather than a custom class.
- Prefer CSS transitions and `requestAnimationFrame` over animation
  libraries. Always respect `prefers-reduced-motion`.
- Commits are hand-written, short, factual, in English. No enforced
  conventional-commit format; follow the style visible in `git log`.

---

## 4. Adding a new language

1. In `src/i18n/config.js`, add the locale code to `AVAILABLE_LANGUAGES` and
   extend `ROUTE_PATHS` with localized slugs for `time` and `13moons`.
2. Create `src/i18n/lang/<code>.json`, using `en.json` as a starting point.
3. Run `npm run build` and check that `/<code>/…` routes are generated and
   that `hreflang`/`canonical` tags appear in the output HTML.

---

## 5. What this app is **not**

The PWA exists to be **universal and didactic** — a free, neutral, offline-
capable way to discover and use Natural Time. Anyone is welcome to build
other things on top of the concept (productivity tools, meditation timers,
commercial watches, games, installations), but **this specific codebase
stays out of those lanes**.

- Not a productivity app.
- Not a meditation or wellness app.
- Not a commercial app. No monetization, no intrusive tracking. Matomo is
  self-hosted, cookieless.
- Not trying to replace every clock in the world by tomorrow morning. It's
  an **invitation** to look at the sky differently.

---

## 6. When in doubt

- On a Natural Time concept → see the specifications in the sibling
  `natural-time` repository.
- On an astronomical calculation → see `natural-time-js` (that's where the
  truth and the caches live).
- On the PWA itself → the files and sections above should be enough. If
  they're not, the code is small — read it.

🌞
