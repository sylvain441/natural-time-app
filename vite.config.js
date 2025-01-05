import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

// Plugins
import vue from '@vitejs/plugin-vue'
import vitePluginMarkdown, { Mode } from 'vite-plugin-markdown'
import svgLoader from 'vite-svg-loader'
import { VitePWA } from 'vite-plugin-pwa'

import 'vite-ssg'

export default defineConfig({
  base: '/',
  
  // Plugin configurations
  plugins: [
    // Vue plugin
    vue(),

    // PWA configuration
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 3_000_000,
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          }
        ],
      },
      manifest: {
        id: 'naturaltime.app.pwa',
        name: 'Natural time',
        start_url: `https://naturaltime.app/startpwa/`,
        description: 'Natural time is a fresh, elegant, and coherent way of measuring the movements of time here on the Earth. This new time standard is based on common sense and the observation of natural cycles',
        theme_color: '#000000',
        background_color: '#000000',
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
            src: 'naturaltime-maskable-512x512.jpg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),

    // Markdown plugin
    vitePluginMarkdown({
      mode: [Mode.HTML],
      enforce: 'pre'
    }),

    // SVG loader
    svgLoader(),
  ],

  // Static Site Generation options
  ssgOptions: {
    script: 'async',
    formatting: 'prettify',
    crittersOptions: {
      preload: 'js-lazy',
      preloadFonts: true,
    },
    dirStyle: 'nested',
    includedRoutes(paths, routes) {
      return [
        '/', '/startpwa/',
        '/fr/',
        '/fr/horloge-temps-naturel',
        '/fr/spirale-13-lunes',
      ]
    },
    onFinished() {
      console.log('Static site generation complete!')
    }
  },

  // Build configuration
  build: {
    ssrManifest: true,
    rollupOptions: {
      output: {
        sanitizeFileName: (name) => name.replace(/\x00/g, '').replace(/^_/, '')
      }
    }
  },

  // Path aliases
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      }
    }
  }
})