<template>
  <div class="max-w-3xl w-full font-sans">
    <div v-for="(category, index) in faqData" :key="index" class="mb-8">
      <h3 class="text-3xl font-title mt-12 mb-4 text-gray-800">
        {{ category.name }}
      </h3>
      <div class="space-y-4">
        <div v-for="(item, itemIndex) in category.items" :key="itemIndex" class="faq-item">
          <h4 @click="toggleItem(index, itemIndex)" 
              class="text-lg font-semibold text-gray-700 cursor-pointer flex justify-between items-center">
            {{ item.question }}
            <span class="transform transition-transform duration-200" 
                  :class="{ 'rotate-180': itemOpen[index]?.[itemIndex] }">
              ▼
            </span>
          </h4>
          <div v-if="itemOpen[index]?.[itemIndex]">
            <p class="mt-2 text-gray-600 pl-4 border-l-2 border-gray-300">
              {{ item.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import yaml from 'js-yaml';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

const faqData = ref<FAQCategory[]>([]);
const itemOpen = ref<Record<number, Record<number, boolean>>>({});

onMounted(async () => {
  try {
    const response = await fetch('/src/i18n/faq/fr.yml');
    const yamlText = await response.text();
    faqData.value = yaml.load(yamlText);
    itemOpen.value = faqData.value.reduce((acc, _, index) => {
      acc[index] = {};
      return acc;
    }, {});
  } catch (error) {
    console.error('Error loading FAQ data:', error);
  }
});

const toggleItem = (categoryIndex: number, itemIndex: number) => {
  if (!itemOpen.value[categoryIndex]) {
    itemOpen.value[categoryIndex] = {};
  }
  itemOpen.value[categoryIndex][itemIndex] = !itemOpen.value[categoryIndex][itemIndex];
};
</script>