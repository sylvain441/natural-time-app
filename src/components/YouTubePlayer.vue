<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  videoId: {
    type: String,
    required: true
  }
})

const isOnline = ref(false)
const playerLoaded = ref(false)

onMounted(() => {
  isOnline.value = navigator.onLine
  window.addEventListener('online', () => isOnline.value = true)
  window.addEventListener('offline', () => isOnline.value = false)
})

const loadPlayer = () => {
  playerLoaded.value = true
}

const getThumbnailUrl = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
</script>

<template>
  <div v-if="isOnline" class="youtube-player relative w-full aspect-video">
    <template v-if="!playerLoaded">
      <img 
        :src="getThumbnailUrl(videoId)" 
        :alt="$t('youtubePlayer.thumbnail')"
        class="w-full h-full object-cover"
      />
      <button 
        @click="loadPlayer"
        class="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-10 hover:bg-opacity-20 transition-opacity"
      >
        <div class="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center">
          <div class="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
        </div>
      </button>
    </template>
    
    <iframe
      v-else
      :src="`https://www.youtube.com/embed/${videoId}?autoplay=1`"
      class="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<style scoped>
.youtube-player {
  max-width: 100%;
  background: #000;
}
</style> 