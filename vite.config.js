import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginMarkdown, { Mode } from 'vite-plugin-markdown'
import svgLoader from 'vite-svg-loader'

import { VitePWA } from 'vite-plugin-pwa'

import { analyzer } from 'vite-bundle-analyzer'

import 'vite-ssg'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      manifest: {
        name: 'Natural time',
        start_url: "https://naturaltime.app/?utm_source=web_app_manifest",
        description: 'Natural time is a fresh, elegant, and coherent way of measuring the movements of time here on the Earth. This new time standard is based on common sense and the observation of natural cycles',
        theme_color: '#fff200',
        background_color: "#d5f7fd",
        icons: [
          {
            src: 'naturaltime-pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'naturaltime-pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'naturaltime-pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'naturaltime-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    vitePluginMarkdown({
      mode: [Mode.HTML],
      enforce: 'pre'
    }),
    svgLoader(),
    /*analyzer({
      analyzerPort: 8888
    })*/
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'prettify',
    crittersOptions: {
      // Optimize critical CSS
      preload: 'js-lazy',
      preloadFonts: true,
    },
    dirStyle: 'nested',
    includedRoutes(paths, routes) {
      // Define the routes to pre-render
      return [
        '/',
        '/fr/',
        '/fr/horloge-temps-naturel',
        '/fr/spirale-13-lunes',
      ]
    },
    onFinished() {
      // Optional: Run any code after pre-rendering is complete
      console.log('Static site generation complete!')
    }
  },
  build: {
    ssrManifest: true, // Enable SSR manifest
    rollupOptions: {
      output: {
        manualChunks: {
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      }
    }
  }
})