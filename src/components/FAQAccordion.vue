<template>
  <div id="FAQ" v-html="filteredFaq"></div>
</template>

<script setup>
import { useFaq } from '../i18n/faq';
import { onMounted, onUnmounted, ref, computed } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const faq = useFaq();
const observer = ref(null);

const filteredFaq = computed(() => {
  if (props.categories.length === 0) {
    return faq.value;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(faq.value, 'text/html');
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
  const faqElement = document.getElementById('FAQ');
  const categories = faqElement.querySelectorAll('h3');

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
      
      // Wrap question text in a span
      const questionText = question.innerHTML;
      question.innerHTML = `<span class="question-text">${questionText}</span>`;
      
      // Add arrow indicator
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
        question.classList.toggle('open'); // Add this line
      });
    });
  });

  if (observer.value) {
    observer.value.disconnect();
  }
};

onMounted(() => {
  const faqElement = document.getElementById('FAQ');
  
  observer.value = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        setupAccordion();
        break;
      }
    }
  });

  observer.value.observe(faqElement, { childList: true, subtree: true });

  setupAccordion();
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style lang="scss">

#FAQ {
  .faq-category {
    @apply text-3xl mb-4 text-gray-800 font-title underline decoration-4;
    &:not(:first-of-type) {
      @apply mt-12;
    }
  }
  .faq-question {
    @apply text-lg md:text-xl mt-2 mb-1 text-gray-700;
    @apply cursor-pointer flex items-center justify-between;
    &:hover, &.open {
      .question-text {
        @apply underline decoration-2;
      }
    }
  }
  .faq-arrow {
    @apply text-sm ml-2 transition-transform duration-300 ease-in-out ;
    &.rotated {
      @apply transform rotate-180;
    }
  }
  .faq-answer {
    @apply transition-all duration-300 ease-in-out mb-4 mt-2 px-4 py-1 border-l-2 border-gray-300;
    p{
       @apply mb-2;
    }
    a{
      @apply underline decoration-sky-500 hover:decoration-sky-700;
    }
    &.hidden {
      @apply h-0 overflow-hidden opacity-0;
    }
  }
  @each $category, $color in (
    1: emerald-400,
    2: ntyellow-dark,
    3: ntcyan-dark,
    4: ntmagenta-dark
  ) {
    .faq-category[data-category="#{$category}"] {
      @apply decoration-#{$color};
    }
    .faq-question[data-category="#{$category}"] .question-text {
      @apply decoration-#{$color};
    }
    .faq-question[data-category="#{$category}"] .faq-arrow {
      @apply text-#{$color};
    }
  }
}
</style>