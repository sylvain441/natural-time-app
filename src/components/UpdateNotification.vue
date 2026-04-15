<template>
  <Transition name="notification-fade">
    <div v-if="show" 
         class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-xs notification-gradient"
         role="alert">
      <div class="flex items-start">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <span class="notification-icon mr-2">✨</span>
            <h4 class="text-white font-bold text-base">{{ $t('update.title') }}</h4>
          </div>
          <p class="text-white text-sm" v-if="versionSpecificMessage">
            {{ versionSpecificMessage }}
          </p>
          <a v-if="versionSpecificCta && versionSpecificUrl"
             :href="versionSpecificUrl" target="_blank" rel="noopener noreferrer"
             @click="close"
             class="mt-3 inline-block w-full text-center bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            {{ versionSpecificCta }} →
          </a>
        </div>
        <button @click="close" class="ml-4 text-white hover:text-gray-200 transition-colors flex-shrink-0" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { version } from '../../package.json';

// Initialize i18n
const { t } = useI18n();

const props = defineProps({
  fromVersion: {
    type: String,
    default: ''
  }
});

const show = ref(false);

// Derive the version key once (e.g. "v2_5")
const versionKey = computed(() => {
  const [major, minor] = version.split('.');
  return `v${major}_${minor}`;
});

// Get version-specific message if available
const versionSpecificMessage = computed(() => {
  const key = `update.${versionKey.value}`;
  const msg = t(key);
  return msg !== key ? msg : '';
});

// Get optional CTA label and URL for this version
const versionSpecificCta = computed(() => {
  const key = `update.${versionKey.value}_cta`;
  const val = t(key);
  return val !== key ? val : '';
});

const versionSpecificUrl = computed(() => {
  const key = `update.${versionKey.value}_url`;
  const val = t(key);
  return val !== key ? val : '';
});

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
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.notification-icon {
  font-size: 1.25rem;
  animation: sparkle 1.5s infinite alternate;
}

@keyframes sparkle {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.2) rotate(10deg);
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
  transform: translateY(-20px);
}
</style> 