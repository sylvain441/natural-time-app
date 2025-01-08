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

const { locale } = useI18n();

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
            <span class="no-answer-message">(En cours de rédaction)</span>
          </div>
        `;
      }
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
    @apply mt-4 mb-12 p-6 rounded-lg bg-orange-950/30 border-l-4 border-orange-500 shadow-sm;

    p {
      @apply text-orange-200 mb-3 last:mb-0;
    }

    ul {
      @apply my-4 pl-6 list-disc;
      
      li {
        @apply mb-2 text-orange-200;
      }
      
      a {
        @apply font-medium text-orange-400 hover:text-orange-300 underline decoration-2 
               decoration-orange-400/50 hover:decoration-orange-500;
      }
    }

    // Emoji styling
    p:first-child, p:last-child {
      @apply text-center text-2xl tracking-wider;
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
      
      &:hover, &.open {
        .question-text {
          @apply underline decoration-2;
        }
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
    @apply transition-all duration-300 ease-in-out mb-8 mt-4 px-6 py-2 border-l-2 border-zinc-600 font-light;
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
      @apply bg-gradient-to-tr from-gray-50/5 to-transparent rounded-lg;
    }
    ul {
      @apply list-disc pl-8 mb-3 text-gray-300;
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