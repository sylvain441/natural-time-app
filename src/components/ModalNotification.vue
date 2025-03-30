<template>
  <div>
    <!-- Backdrop blur overlay -->
    <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
    
    <!-- Notification -->
    <Transition name="notification-fade">
      <div v-if="show" 
           class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-lg overflow-hidden w-[90%] md:w-auto md:max-w-sm"
           :class="[
             type === 'clock' ? 'bg-nt-yellow-light' : 'bg-nt-cyan-light'
           ]"
           role="alert">
        <div class="p-4">
          <h3 class="text-base md:text-lg font-bold mb-2 text-black">{{ title }}</h3>
          <p class="text-sm md:text-base text-gray-700 whitespace-pre-line">{{ message }}</p>
          <button 
            @click="close" 
            class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20 transition-colors duration-200"
            aria-label="Close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import learnIcon from '@/assets/icon/learn-icon.svg';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'clock', // 'clock' or 'spiral'
    validator: (value) => ['clock', 'spiral'].includes(value)
  }
});

const show = ref(false);

function close() {
  show.value = false;
}

function open() {
  show.value = true;
}

// Auto-open the notification when mounted
onMounted(() => {
  // Delay opening slightly to ensure everything is ready
  setTimeout(() => {
    open();
  }, 100);
});

// Explicitly define the methods to expose
defineExpose({
  open,
  close
});
</script>

<style scoped>
.notification-gradient {
  background: v-bind("type === 'clock' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'");
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.notification-icon {
  color: white;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s ease-out;
}

.notification-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -40%);
}

.notification-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -60%);
}
</style>