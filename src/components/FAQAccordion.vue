<template>
  <div id="FAQ" ref="faqRef">
    <div v-html="filteredFaq"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { faqContent } from '@/i18n/faq/faqLoader';

const faqRef = ref(null);
const observer = ref(null);

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const { locale, t } = useI18n();

const filteredFaq = computed(() => {
  const content = faqContent[locale.value] || faqContent.en;
  
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
      // Skip if already enhanced to avoid duplicate listeners
      if (question.dataset.enhanced === 'true') return;
      question.classList.add('faq-question');
      
      // Check if there are any answer elements
      const hasAnswer = answerElements.length > 0;
      
      // Add 'no-answer' class if there are no answers
      if (!hasAnswer) {
        question.classList.add('no-answer');
      }
      
      // Wrap question text in a span
      const questionText = question.innerHTML;
      question.innerHTML = `<span class="question-text">${questionText}</span>`;
      
      // Add arrow indicator only if there are answers
      if (hasAnswer) {
        const arrow = document.createElement('span');
        arrow.textContent = '▼';
        arrow.classList.add('faq-arrow');
        question.appendChild(arrow);
        
        const answerWrapper = document.createElement('div');
        answerWrapper.classList.add('faq-answer', 'hidden');
        answerWrapper.setAttribute('data-category', categoryId);
        answerElements.forEach(el => answerWrapper.appendChild(el));
        
        question.parentNode.insertBefore(answerWrapper, question.nextSibling);

        question.addEventListener('click', () => {
          answerWrapper.classList.toggle('hidden');
          arrow.classList.toggle('rotated');
          question.classList.toggle('open');
        });
      } else {
        // Wrap question text and no-answer message in separate divs
        const questionContent = question.innerHTML;
        question.innerHTML = `
          <div class="question-wrapper">
            <span class="question-text">${questionContent}</span>
            <span class="no-answer-message">${t('faq.inProgress')}</span>
          </div>
        `;
      }

      // mark as enhanced
      question.dataset.enhanced = 'true';
    });
  });

  if (observer.value) {
    observer.value.disconnect();
  }
};

onMounted(() => {
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
  blockquote {
    @apply mt-4 mb-12 p-6 rounded-lg bg-orange-950/30 border-l-4 border-orange-500/50 shadow-sm;

    p {
      @apply text-orange-300/80 mb-3 last:mb-0;
    }

    ul {
      @apply my-4 pl-6 list-disc;
      
      li {
        @apply mb-2 text-orange-300/80;
      }
      
      a {
        @apply font-medium text-orange-400 hover:text-orange-300 underline decoration-2 
               decoration-orange-400/50 hover:decoration-orange-500;
      }
    }

    // Emoji styling
    p:first-child, p:last-child {
      @apply text-center text-xl tracking-wider;
    }
  }

  .faq-category {
    @apply text-3xl mb-4 text-gray-100 font-title underline decoration-4;
    &:not(:first-of-type) {
      @apply mt-12;
    }
  }

  .faq-question {
    @apply text-lg md:text-xl mt-2 mb-1 text-gray-300 font-light;
    @apply flex items-center justify-between;
    
    &:not(.no-answer) {
      @apply cursor-pointer;
      
      &:hover:not(.open) .question-text {
        @apply underline decoration-2;
      }
    }
  }

  .faq-arrow {
    @apply text-sm ml-2 transition-transform duration-300 ease-in-out;
    &.rotated {
      @apply transform rotate-180;
    }
  }

  .faq-answer {
    @apply transition-all duration-300 ease-in-out mb-8 mt-4 px-6 py-2 border-l-2 border-slate-600 font-light;
    
    p {
      @apply mb-2 text-gray-300;
    }
    
    a, ul a {
      @apply underline text-sky-400 hover:text-sky-300;
    }
    
    &.hidden {
      @apply h-0 overflow-hidden opacity-0;
    }
    
    &:not(.hidden) {
      @apply bg-gradient-to-tr from-gray-800/70 via-gray-900/50 to-gray-900/30 rounded-lg shadow-inner p-4 border border-gray-700/50;
    }
    
    ul {
      @apply list-disc pl-8 mb-3 text-gray-300;
    }
    
    // Amélioration pour les éléments de mise en forme markdown
    strong, b {
      @apply font-bold text-gray-100;
    }
    
    em, i {
      @apply italic text-gray-200;
    }
    
    code {
      @apply px-1.5 py-0.5 rounded bg-gray-800 text-gray-200 font-mono text-sm;
    }
    
    pre {
      @apply p-4 my-4 rounded-lg bg-gray-800/50 overflow-x-auto;
      
      code {
        @apply bg-transparent p-0;
      }
    }
    
    h5 {
      @apply text-lg font-medium text-gray-200 mt-4 mb-2;
    }
    
    h6 {
      @apply text-base font-medium text-gray-300 mt-3 mb-1;
    }
    
    img {
      @apply max-w-full rounded-lg my-4 mx-auto;
    }
    
    table {
      @apply w-full my-4 border-collapse;
      
      th {
        @apply bg-gray-800 text-gray-200 p-2 text-left font-medium border border-gray-700;
      }
      
      td {
        @apply p-2 border border-gray-700 text-gray-300;
      }
      
      tr:nth-child(even) {
        @apply bg-gray-800/30;
      }
    }
    
    hr {
      @apply my-6 border-gray-700;
    }
    
    blockquote {
      @apply pl-4 border-l-2 border-gray-600 italic text-gray-400 my-4;
    }
  }

  .faq-category[data-category="1"] {
    @apply decoration-emerald-500;
  }
  .faq-question[data-category="1"] .question-text {
    @apply decoration-emerald-500;
  }
  .faq-question[data-category="1"] .faq-arrow {
    @apply text-emerald-500;
  }
  .faq-answer[data-category="1"] {
    @apply border-emerald-500;
    &:not(.hidden) {
      @apply bg-gradient-to-tr from-emerald-900/50 via-emerald-950/40 to-gray-900/30 border-emerald-800/50;
    }
  }

  .faq-category[data-category="2"] {
    @apply decoration-yellow-500;
  }
  .faq-question[data-category="2"] .question-text {
    @apply decoration-yellow-500;
  }
  .faq-question[data-category="2"] .faq-arrow {
    @apply text-yellow-500;
  }
  .faq-answer[data-category="2"] {
    @apply border-yellow-500;
    &:not(.hidden) {
      @apply bg-gradient-to-tr from-yellow-900/50 via-yellow-950/40 to-gray-900/30 border-yellow-800/50;
    }
  }

  .faq-category[data-category="3"] {
    @apply decoration-cyan-500;
  }
  .faq-question[data-category="3"] .question-text {
    @apply decoration-cyan-500;
  }
  .faq-question[data-category="3"] .faq-arrow {
    @apply text-cyan-500;
  }
  .faq-answer[data-category="3"] {
    @apply border-cyan-500;
    &:not(.hidden) {
      @apply bg-gradient-to-tr from-cyan-900/50 via-cyan-950/40 to-gray-900/30 border-cyan-800/50;
    }
  }
  
  .faq-category[data-category="4"] {
    @apply decoration-pink-500;
  }
  .faq-question[data-category="4"] .question-text {
    @apply decoration-pink-500;
  }
  .faq-question[data-category="4"] .faq-arrow {
    @apply text-pink-500;
  }
  .faq-answer[data-category="4"] {
    @apply border-pink-500;
    &:not(.hidden) {
      @apply bg-gradient-to-tr from-pink-900/50 via-pink-950/40 to-gray-900/30 border-pink-800/50;
    }
  }
  
  // Styles pour les éléments markdown dans tout le FAQ (pas seulement dans les réponses)
  strong, b {
    @apply font-bold text-gray-100;
  }
  
  em, i {
    @apply italic text-gray-200;
  }
  
  code {
    @apply px-1.5 py-0.5 rounded bg-gray-800 text-gray-200 font-mono text-sm;
  }
  
  pre {
    @apply p-4 my-4 rounded-lg bg-gray-800/50 overflow-x-auto;
    
    code {
      @apply bg-transparent p-0;
    }
  }
  
  h5 {
    @apply text-lg font-medium text-gray-200 mt-4 mb-2;
  }
  
  h6 {
    @apply text-base font-medium text-gray-300 mt-3 mb-1;
  }
}

.faq-question.no-answer {
  @apply opacity-75;
  &:hover .question-text {
    @apply no-underline;
  }
}

.no-answer-message {
  @apply text-sm text-gray-400 italic text-center sm:text-right sm:ml-2 mt-1 sm:mt-0;
}
</style>