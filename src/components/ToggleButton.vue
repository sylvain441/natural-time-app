<template>
  <button
    @click="toggle"
    type="button"
    class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
    :style="[modelValue ? '' : `background-color: #EEE`]"
  >
    <span
      class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
      :class="{ 'translate-x-5': modelValue, 'translate-x-0': !modelValue }"
    ></span>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};

</script>