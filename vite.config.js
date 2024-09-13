import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginMarkdown, { Mode } from 'vite-plugin-markdown'

import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff2}']
      },
      manifest: {
        name: 'Natural time',
        start_url: "https://naturaltime.app/?utm_source=web_app_manifest",
        description: 'Natural time is a fresh, elegant, and coherent way of measuring the movements of time here on the Earth. This new time standard is based on common sense and the observation of natural cycles',
        theme_color: '#CAF3FF',
        background_color: "#CAF3FF",
        icons: [
          {
            src: './icon/naturaltime-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: './icon/naturaltime-128x128-maskable.jpg',
            sizes: '128x128',
            type: 'image/jpg',
            purpose: "any maskable"
          },
          {
            src: './icon/naturaltime-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: './icon/naturaltime-180x180-maskable.jpg',
            sizes: '180x180',
            type: 'image/jpg',
            purpose: "any maskable"
          },
          {
            src: './icon/naturaltime-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './icon/naturaltime-192x192-maskable.jpg',
            sizes: '192x192',
            type: 'image/jpg',
            purpose: "any maskable"
          },
          {
            src: './icon/naturaltime-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: './icon/naturaltime-512x512-maskable.jpg',
            sizes: '512x512',
            type: 'image/jpg',
            purpose: "any maskable"
          },
        ]
      }
    }),
    vitePluginMarkdown({
      mode: [Mode.HTML],
      enforce: 'pre'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})