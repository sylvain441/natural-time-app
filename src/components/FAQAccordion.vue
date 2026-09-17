<template>

  <div id="FAQ" class="faq-sheet">
    <PaperTexture class="faq-grain" :opacity="0.5" :seed="311" :scale="0.12" :fiber="0.04" :contrast="0.2" :roughness="0.45" />
    <div class="faq-page" ref="faqRef">

      <h2 class="faq-masthead">{{ $t('faq.title') }}</h2>
      <p class="faq-deck">{{ $t('faq.subtitle') }}</p>
      <div v-if="faqHtml" v-html="filteredFaq"></div>
      <div v-else class="faq-loading">{{ $t('common.loading') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick, onServerPrefetch } from 'vue';
import { useI18n } from 'vue-i18n';
import { loadFaqHtmlForLocale } from '@/i18n/faq/faqLoader';
import PaperTexture from '@/components/PaperTexture.vue';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';

const faqRef = ref(null);
const observer = ref(null);

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const { locale, t } = useI18n();

const faqHtml = ref('');

let answerSeq = 0;

async function refreshFaq() {
  faqHtml.value = await loadFaqHtmlForLocale(locale.value, t('faq.boardTitle'));
}

onServerPrefetch(refreshFaq);

const filteredFaq = computed(() => {
  const content = faqHtml.value || '';

  if (props.categories.length === 0) {
    return content;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const categories = doc.querySelectorAll('h3');

  categories.forEach((category, index) => {
    if (!props.categories.includes(index + 1)) {
      let nextElement = category.nextElementSibling;
      while (nextElement && nextElement.tagName !== 'H3') {
        const toRemove = nextElement;
        nextElement = nextElement.nextElementSibling;
        toRemove.remove();
      }
      category.remove();
    }
  });

  return doc.body.innerHTML;
});

const setupAccordion = () => {
  const categories = faqRef.value.querySelectorAll('h3');

  if (categories.length === 0) return;

  categories.forEach((category, index) => {
    const categoryId = props.categories.length > 0 ? props.categories[index] : index + 1;
    category.classList.add('faq-category');
    category.setAttribute('data-category', categoryId);
    category.id = `FAQ-${categoryId}`;

    if (category.dataset.enhanced !== 'true') {
      category.innerHTML = `<span class="faq-cat-text">${category.innerHTML}</span>`;
      category.dataset.enhanced = 'true';
    }

    const questions = [];
    let element = category.nextElementSibling;

    while (element && element.tagName !== 'H3') {
      if (element.tagName === 'H4') {
        const question = element;
        question.setAttribute('data-category', categoryId);
        const answerElements = [];
        element = element.nextElementSibling;

        while (element && element.tagName !== 'H4' && element.tagName !== 'H3') {
          answerElements.push(element);
          element = element.nextElementSibling;
        }

        questions.push({ question, answerElements });
      } else {
        element = element.nextElementSibling;
      }
    }

    questions.forEach(({ question, answerElements }) => {
      if (question.dataset.enhanced === 'true') return;
      question.classList.add('faq-question');

      const questionText = question.innerHTML;
      const hasAnswer = answerElements.length > 0;

      if (hasAnswer) {
        const answerId = `faq-answer-${++answerSeq}`;
        question.innerHTML =
          `<button type="button" class="faq-trigger" aria-expanded="false" aria-controls="${answerId}">` +
            `<span class="question-text">${questionText}</span>` +
            `<span class="faq-sign" aria-hidden="true"></span>` +
          `</button>`;

        const trigger = question.querySelector('.faq-trigger');
        const sign = question.querySelector('.faq-sign');

        const answerWrapper = document.createElement('div');
        answerWrapper.classList.add('faq-answer', 'hidden');
        answerWrapper.id = answerId;
        answerWrapper.setAttribute('data-category', categoryId);
        answerWrapper.setAttribute('aria-hidden', 'true');
        answerWrapper.inert = true;
        const answerBody = document.createElement('div');
        answerBody.classList.add('faq-answer-body');
        const ruled = document.createElement('div');
        ruled.classList.add('faq-answer-ruled');
        answerElements.forEach(el => ruled.appendChild(el));
        answerBody.appendChild(ruled);
        answerWrapper.appendChild(answerBody);

        question.parentNode.insertBefore(answerWrapper, question.nextSibling);

        trigger.addEventListener('click', () => {
          const open = answerWrapper.classList.toggle('hidden') === false;
          sign.classList.toggle('rotated', open);
          question.classList.toggle('open', open);
          trigger.setAttribute('aria-expanded', String(open));
          answerWrapper.setAttribute('aria-hidden', String(!open));
          answerWrapper.inert = !open;
        });
      } else {
        question.classList.add('no-answer');
        question.innerHTML =
          `<span class="question-text">${questionText}</span>` +
          `<span class="no-answer-message">${t('faq.inProgress')}</span>`;
      }

      question.dataset.enhanced = 'true';
    });
  });

};

onMounted(() => {
  refreshFaq();
  watch(() => locale.value, () => {
    refreshFaq();
  });
  watch(() => filteredFaq.value, async () => {
    await nextTick();
    setupAccordion();
  }, { flush: 'post' });

  setupAccordion();

  observer.value = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        setupAccordion();
        break;
      }
    }
  });

  observer.value.observe(faqRef.value, { childList: true, subtree: true });
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style lang="scss">

#FAQ {

  --faq-line: clamp(1.55rem, 2.5cqi, 1.8rem);

  --faq-paper: #F4EFE0;
  --faq-paper-top: #F8F4E9;
  --faq-ink: #16140F;
  --faq-ink-soft: #3B352A;
  --faq-ink-faint: rgba(22, 20, 15, 0.45);

  --faq-rule: rgba(66, 92, 136, 0.2);
  --faq-rule-strong: rgba(66, 92, 136, 0.3);
  --faq-margin-line: rgba(192, 38, 65, 0.4);

  --faq-hl: 255 242 0;
  --faq-accent: #A8830A;

  position: relative;
  min-height: 100%;
  overflow: hidden;
  container-type: inline-size;
  background: linear-gradient(180deg, var(--faq-paper-top) 0%, var(--faq-paper) 22%, #EFE8D6 100%);
  color: var(--faq-ink);
  font-family: "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;

  box-shadow: inset 0 -14px 26px -20px rgba(0, 0, 0, 0.7);
}

.faq-grain {
  z-index: 0;
  mix-blend-mode: multiply;
}

.faq-page {
  --faq-margin: clamp(2.6rem, 11cqi, 7.5rem);

  position: relative;
  z-index: 1;
  max-width: 64rem;
  margin: 0 auto;

  padding: clamp(2.5rem, 6cqi, 4.5rem) var(--faq-margin);
  border-left: 1px solid var(--faq-margin-line);
}

.faq-loading {
  font-style: italic;
  color: var(--faq-ink-faint);
}

#FAQ [data-category="1"] { --faq-hl: 182 240 106; --faq-accent: #4C7A1E; }
#FAQ [data-category="2"] { --faq-hl: 255 242 0;   --faq-accent: #A8830A; }
#FAQ [data-category="3"] { --faq-hl: 0 242 255;   --faq-accent: #016B6E; }
#FAQ [data-category="4"] { --faq-hl: 255 128 203; --faq-accent: #C02641; }

@mixin marker($a, $b) {
  background-image: linear-gradient(101deg,
    rgb(var(--faq-hl) / 0) 0.5%,
    rgb(var(--faq-hl) / #{$a}) 2.2%,
    rgb(var(--faq-hl) / #{$b}) 5.5%,
    rgb(var(--faq-hl) / #{$b}) 92%,
    rgb(var(--faq-hl) / #{$a}) 96%,
    rgb(var(--faq-hl) / 0) 99%);
  background-repeat: no-repeat;
  border-radius: 0.7em 0.25em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

#FAQ .faq-category {
  position: relative;
  margin: clamp(3rem, 8cqi, 5.5rem) 0 0;
  padding-bottom: clamp(0.9rem, 2cqi, 1.35rem);
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-weight: 900;
  font-size: clamp(1.35rem, 3.6cqi, 1.95rem);
  line-height: 1.18;
  letter-spacing: -0.025em;
  text-wrap: balance;
  color: var(--faq-ink);

  &:first-of-type { margin-top: 0; }

  &::before {
    content: "0" attr(data-category);
    position: absolute;
    top: 0.34em;
    right: calc(100% + clamp(0.55rem, 1.6cqi, 1.1rem));
    font-family: "Playfair Display", Georgia, serif;
    font-weight: 900;
    font-size: clamp(0.78rem, 1.4cqi, 1.05rem);
    letter-spacing: 0.02em;
    line-height: 1;
    color: var(--faq-accent);
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.5px;
    background: var(--faq-accent);
    opacity: 0.55;
  }
}

#FAQ .faq-cat-text {
  @include marker(0.95, 0.8);
  background-size: 100% 100%;
  padding: 0.04em 0.28em;
  margin: 0 -0.28em;
}

#FAQ .faq-deck {
  margin: 0 0 clamp(2.2rem, 5.5cqi, 3.5rem);
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(0.95rem, 1.75cqi, 1.1rem);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--faq-ink-soft);
}

#FAQ .faq-board {

  box-sizing: border-box;
  margin: clamp(1.4rem, 3cqi, 2.1rem) 0 clamp(2.2rem, 5cqi, 3.4rem);
  max-width: min(100%, 46rem);
  padding: clamp(0.85rem, 2.2cqi, 1.35rem) clamp(0.95rem, 2.4cqi, 1.5rem);
  background: rgba(255, 255, 255, 0.42);
  font-size: clamp(0.85rem, 1.45cqi, 0.95rem);
  line-height: 1.45;
  color: var(--faq-ink-soft);
}

#FAQ .faq-board-title {
  margin: 0 0 clamp(0.9rem, 2.2cqi, 1.35rem);
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-size: clamp(1.02rem, 1.75cqi, 1.18rem);
  line-height: 1.35;
  text-wrap: balance;
  color: var(--faq-ink);
}

#FAQ .faq-board table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

#FAQ .faq-board col:first-child { width: 26%; }
#FAQ .faq-board col:nth-child(2) { width: 27%; }
#FAQ .faq-board col:nth-child(3) { width: 47%; }

#FAQ .faq-board th {
  padding: 0 1.05rem 0.5rem;
  border-bottom: 1px solid var(--faq-accent);
  text-align: left;
  font-family: "Poppins", system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.78em;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--faq-ink-faint);
  vertical-align: bottom;
}

#FAQ .faq-board th:nth-child(2) {
  color: var(--faq-ink);
  span { @include marker(0.9, 0.72); background-size: 100% 100%; padding: 0.1em 0.4em; margin: 0 -0.4em; }
}

#FAQ .faq-board th:nth-child(2),
#FAQ .faq-board td:nth-child(2) {
  background: rgb(var(--faq-hl) / 0.16);
}

#FAQ .faq-board td {
  padding: 0.7em 1.05rem;
  border-bottom: 1px solid var(--faq-rule);
  vertical-align: baseline;
  overflow-wrap: break-word;
}

#FAQ .faq-board tr:last-child td { border-bottom-color: var(--faq-rule-strong); }

#FAQ .faq-board th:first-child,
#FAQ .faq-board td:first-child { padding-left: 0; }
#FAQ .faq-board th:last-child,
#FAQ .faq-board td:last-child { padding-right: 0; }

#FAQ .faq-board small {
  display: block;
  margin-top: 0.2em;

  font-family: "Poppins", system-ui, sans-serif;
  font-size: 0.8em;
  font-weight: 400;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: 0;
  color: var(--faq-ink-faint);
}
#FAQ .faq-board td:first-child small { font-size: 0.72em; }

#FAQ .faq-board td:first-child {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.06em;
  line-height: 1.35;
  color: var(--faq-ink);
}

#FAQ .faq-board td:nth-child(2) {
  font-weight: 500;
  color: var(--faq-ink);
}

#FAQ .faq-board td:last-child { color: var(--faq-ink-faint); }

#FAQ .faq-board figcaption {
  margin-top: clamp(0.8rem, 1.8cqi, 1.15rem);
  font-size: 0.88em;
  line-height: 1.5;
  color: var(--faq-ink-faint);
}

@container (max-width: 620px) {
  #FAQ .faq-board {
    padding: clamp(0.75rem, 3cqi, 1.1rem) clamp(0.8rem, 3.2cqi, 1.2rem);
  }

  #FAQ .faq-board table,
  #FAQ .faq-board tbody,
  #FAQ .faq-board tr,
  #FAQ .faq-board td { display: block; width: auto; }

  #FAQ .faq-board thead { display: none; }

  #FAQ .faq-board tr {
    padding: 0.85em 0;
    border-bottom: 1px solid var(--faq-rule);
  }
  #FAQ .faq-board tr:last-child { border-bottom-color: var(--faq-rule-strong); }

  #FAQ .faq-board td {
    padding: 0;
    border-bottom: 0;
    background: none;
  }

  #FAQ .faq-board td:nth-child(2) { background: rgb(var(--faq-hl) / 0.16); }

  #FAQ .faq-board td:first-child {
    margin-bottom: 0.5em;
    font-size: 1.12em;
  }

  #FAQ .faq-board td[data-label] {
    display: grid;
    grid-template-columns: 7em 1fr;
    align-items: baseline;
    gap: 0 0.7rem;
    padding: 0.28em 0.55rem;
    margin-inline: -0.55rem;

    &::before {
      content: attr(data-label);
      font-size: 0.76em;
      line-height: 1.35;
      color: var(--faq-ink-faint);
    }
  }
  #FAQ .faq-board td:nth-child(2)::before { color: var(--faq-accent); }

  #FAQ .faq-board td[data-label] small {
    grid-column: 1 / -1;
    margin-top: 0.1em;
  }
}

#FAQ .faq-question {
  margin: 0;
  border-bottom: 1px solid var(--faq-rule-strong);
}

#FAQ .faq-trigger {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: clamp(0.9rem, 3cqi, 2rem);
  width: 100%;

  padding: clamp(0.8rem, 1.7cqi, 1.1rem) 0 clamp(0.36rem, 0.7cqi, 0.48rem);
  border: 0;
  background: none;
  text-align: left;
  color: var(--faq-ink);
  cursor: pointer;
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-size: clamp(1.02rem, 1.75cqi, 1.18rem);
  line-height: 1.4;

  &:focus-visible {
    outline: 2px solid var(--faq-accent);
    outline-offset: 2px;
  }
}

#FAQ .question-text {
  @include marker(0.9, 0.72);
  background-size: 0% 100%;
  padding: 0.06em 0.3em;
  margin: 0 -0.3em;
  transition: background-size 0.5s cubic-bezier(0.32, 0.72, 0.3, 1);
}
#FAQ .faq-trigger:hover .question-text,
#FAQ .faq-trigger:focus-visible .question-text,
#FAQ .faq-question.open .question-text {
  background-size: 100% 100%;
}

#FAQ .faq-sign {
  position: relative;
  flex: 0 0 auto;
  width: 12px;
  height: 12px;
  align-self: center;
  transition: transform 0.45s cubic-bezier(0.32, 0.72, 0.3, 1);

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    background: var(--faq-accent);
  }
  &::before { width: 12px; height: 1.5px; transition: opacity 0.25s ease; }
  &::after  { width: 1.5px; height: 12px; }

  &.rotated {
    transform: rotate(90deg);
    &::before { opacity: 0; }
  }
}

#FAQ .faq-answer {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.32, 0.72, 0.3, 1),
              opacity 0.3s ease 0.06s;

  &.hidden {
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.45s cubic-bezier(0.32, 0.72, 0.3, 1),
                opacity 0.18s ease;
  }
}

#FAQ .faq-answer-body {
  min-height: 0;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    display: block;
    height: calc(var(--faq-line) * 0.75);
  }
}

#FAQ .faq-answer-ruled {
  font-family: "Poppins", system-ui, sans-serif;
  font-weight: 400;
  font-size: clamp(0.88rem, 1.4cqi, 0.97rem);
  line-height: var(--faq-line);
  color: var(--faq-ink-soft);

  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(var(--faq-line) - 1px),
    var(--faq-rule) calc(var(--faq-line) - 1px),
    var(--faq-rule) var(--faq-line));

  background-position: 0 calc(var(--faq-line) * 0.68 + 1px);

  max-width: min(100%, 62ch);

  p {
    margin: 0 0 var(--faq-line);
    &:last-child { margin-bottom: 0; }
  }

  ul, ol {
    list-style: none;
    margin: 0 0 var(--faq-line);
    padding-left: 1.5rem;
  }
  ul li, ol li { position: relative; }
  ul li::before {
    content: "—";
    position: absolute;
    left: -1.5rem;
    color: var(--faq-accent);
  }
  ol { counter-reset: faq-ol; }
  ol li {
    counter-increment: faq-ol;
    &::before {
      content: counter(faq-ol) ".";
      position: absolute;
      left: -1.5rem;
      color: var(--faq-accent);
      font-size: 0.85em;
    }
  }

  a {
    color: var(--faq-ink);
    text-decoration: none;
    background-image: linear-gradient(transparent 58%, rgb(var(--faq-hl) / 0.85) 58%, rgb(var(--faq-hl) / 0.85) 94%, transparent 94%);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    transition: background-image 0.25s ease;
    &:hover {
      background-image: linear-gradient(transparent 12%, rgb(var(--faq-hl) / 0.8) 12%, rgb(var(--faq-hl) / 0.8) 94%, transparent 94%);
    }
  }

  strong, b {
    font-weight: 500;
    color: var(--faq-ink);
    background-image: linear-gradient(transparent 62%, rgb(var(--faq-hl) / 0.42) 62%, rgb(var(--faq-hl) / 0.42) 95%, transparent 95%);
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  em, i { font-style: italic; }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.84em;
    padding: 0.1em 0.4em;
    background: rgba(255, 255, 255, 0.55);
    color: var(--faq-ink);
  }

  pre {
    margin: 0 0 var(--faq-line);
    padding: 0 0.9rem;
    border-left: 2px solid var(--faq-accent);
    background: rgba(255, 255, 255, 0.45);
    overflow-x: auto;
    font-size: 0.84em;
    line-height: var(--faq-line);
    code { background: none; padding: 0; font-size: inherit; }
  }

  h5, h6 {
    font-family: "Playfair Display", Georgia, serif;
    font-weight: 900;
    color: var(--faq-ink);
    line-height: var(--faq-line);
    margin: 0 0 var(--faq-line);
  }
  h5 { font-size: 1.08rem; }
  h6 { font-size: 0.95rem; }

  img {
    display: block;
    max-width: 100%;
    margin: 0 auto var(--faq-line);
  }

  table {
    width: 100%;
    margin: 0 0 var(--faq-line);
    border-collapse: collapse;
    font-size: 0.9em;
    line-height: var(--faq-line);
  }
  th, td {
    line-height: var(--faq-line);
    padding: 0 0.8rem 0 0;
    border: 0;
  }
  th {
    text-align: left;
    font-weight: 500;
    color: var(--faq-ink);
    box-shadow: inset 0 -2px 0 var(--faq-accent);
  }
  td {
    box-shadow: inset 0 -1px 0 var(--faq-rule);
  }

  hr {
    height: var(--faq-line);
    margin: 0;
    border: 0;
    background: none;
  }

  blockquote {
    margin: 0 0 var(--faq-line);
    padding-left: 1.1rem;
    border-left: 3px solid rgb(var(--faq-hl) / 0.9);
    font-style: italic;
  }
}

#FAQ .faq-question.no-answer {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: clamp(0.8rem, 1.7cqi, 1.1rem) 0 clamp(0.36rem, 0.7cqi, 0.48rem);
  font-family: "Playfair Display", Georgia, serif;
  font-weight: 400;
  font-size: clamp(1.02rem, 1.75cqi, 1.18rem);
  line-height: 1.4;
  color: var(--faq-ink-faint);
}

#FAQ .no-answer-message {
  flex: 0 0 auto;
  font-family: "Poppins", system-ui, sans-serif;
  font-size: 0.78rem;
  font-style: italic;
  color: var(--faq-ink-faint);
}

#FAQ .faq-masthead {
  margin: 0 0 clamp(0.8rem, 2cqi, 1.2rem);
  padding-bottom: clamp(0.7rem, 1.8cqi, 1.15rem);
  border-bottom: 3px solid var(--faq-ink);
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-weight: 900;
  font-size: clamp(1.8rem, 5.6cqi, 2.9rem);
  line-height: 1.06;
  letter-spacing: -0.035em;
  text-wrap: balance;
  color: var(--faq-ink);
}

@media (prefers-reduced-motion: reduce) {
  #FAQ .faq-sign,
  #FAQ .faq-sign::before,
  #FAQ .question-text,
  #FAQ .faq-answer {
    transition: none;
  }
}
</style>
