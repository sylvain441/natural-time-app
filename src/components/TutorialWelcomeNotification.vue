<template>
  <div>
    <!-- Backdrop blur overlay -->
    <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
    
    <!-- Notification -->
    <Transition name="notification-fade">
      <div v-if="show" 
           class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg shadow-lg z-50 max-w-xs notification-gradient"
           role="alert">
        <div class="flex items-start">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <learnIcon class="notification-icon mr-2 w-6 h-6" fill="currentColor" />
              <h4 class="text-white font-bold text-base">{{ title }}</h4>
            </div>
            <p class="text-white text-sm">
              {{ message }}
            </p>
          </div>
          <button @click="close" class="ml-4 text-white hover:text-gray-200 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
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
  autoHideDelay: {
    type: Number,
    default: 7000 // 7 seconds by default
  },
  type: {
    type: String,
    default: 'clock', // 'clock' or 'spiral'
    validator: (value) => ['clock', 'spiral'].includes(value)
  }
});

const show = ref(false);

function close() {
  console.log('Closing tutorial notification');
  show.value = false;
}

function open() {
  console.log('Opening tutorial notification');
  show.value = true;
  
  // Auto-hide after specified delay
  if (props.autoHideDelay > 0) {
    setTimeout(() => {
      close();
    }, props.autoHideDelay);
  }
}

// Auto-open the notification when mounted
onMounted(() => {
  console.log('TutorialWelcomeNotification component mounted');
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
  transition: opacity 0.5s, transform 0.5s;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
}
</style>