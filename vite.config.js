import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import { AVAILABLE_LANGUAGES, ROUTE_PATHS, DEFAULT_LANGUAGE } from './src/i18n/config'

// Plugins
import vue from '@vitejs/plugin-vue'
import vitePluginMarkdown, { Mode } from 'vite-plugin-markdown'
import svgLoader from 'vite-svg-loader'
import { VitePWA } from 'vite-plugin-pwa'

import 'vite-ssg'

// Function to generate routes for all languages
function generateRoutesForAllLanguages() {
  const routes = ['/', '/startpwa/']
  
  AVAILABLE_LANGUAGES.forEach(lang => {
    // Add the base route for each language
    routes.push(`/${lang}/`)
    
    // Add routes for each page type defined in ROUTE_PATHS
    Object.keys(ROUTE_PATHS).forEach(routeKey => {
      if (ROUTE_PATHS[routeKey][lang]) {
        routes.push(`/${lang}/${ROUTE_PATHS[routeKey][lang]}`)
      }
    })
  })
  
  return routes
}

// Function to generate sitemap XML content
function generateSitemapXml() {
  const baseUrl = 'https://naturaltime.app'
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  // Add entries for each language
  AVAILABLE_LANGUAGES.forEach(lang => {
    // Add the base route for each language
    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/${lang}/</loc>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>1.0</priority>\n`
    xml += `  </url>\n`
    
    // Add routes for each page type defined in ROUTE_PATHS
    Object.keys(ROUTE_PATHS).forEach(routeKey => {
      if (ROUTE_PATHS[routeKey][lang]) {
        xml += `  <url>\n`
        xml += `    <loc>${baseUrl}/${lang}/${ROUTE_PATHS[routeKey][lang]}</loc>\n`
        xml += `    <changefreq>weekly</changefreq>\n`
        xml += `    <priority>0.8</priority>\n`
        xml += `  </url>\n`
      }
    })
  })
  
  xml += '</urlset>'
  return xml
}

// Function to inject SEO meta tags
async function injectSEOTags(filePath, lang) {
  try {
    const fs = await import('fs');
    let content = await fs.promises.readFile(filePath, 'utf8');
    
    // Get the relative path from the dist directory
    const relativePath = filePath.split('dist/')[1].replace('index.html', '');
    let canonicalPath = relativePath.endsWith('/') ? relativePath : `${relativePath}/`;
    // Normalize to avoid double slashes (e.g., //)
    canonicalPath = canonicalPath.replace(/\/+/g, '/');
    
    // Build canonical href without producing double slashes for root
    const canonicalHref = canonicalPath === '/' ? '' : canonicalPath.replace(/^\//, '');
    
    // Detect startpwa (utility page): avoid indexing and canonical to root
    const isStartPwa = canonicalPath.startsWith('startpwa/');

    // Helper: build slug->routeKey map for a given lang
    const slugToRouteKey = (language) => {
      const map = {};
      Object.keys(ROUTE_PATHS).forEach((key) => {
        const slug = ROUTE_PATHS[key]?.[language];
        if (slug) map[slug.replace(/\/$/, '')] = key;
      });
      return map;
    };
    const currentSlugToKey = slugToRouteKey(lang);
    
    // Determine page slug (part after lang/), if any
    // canonicalPath is like "en/" or "en/natural-time-clock/" or "" for root
    let pageSlug = '';
    if (canonicalPath && canonicalPath !== '/' && lang && canonicalPath.startsWith(`${lang}/`)) {
      pageSlug = canonicalPath.slice(lang.length + 1).replace(/\/$/, '');
    }
    
    const alternateLinks = isStartPwa ? '' : AVAILABLE_LANGUAGES.map((alternateLang) => {
      if (alternateLang === lang) return '';
      // Root page (no lang in path): alternate homepages
      if (!canonicalPath || canonicalPath === '/') {
        return `<link rel="alternate" hreflang="${alternateLang}" href="https://naturaltime.app/${alternateLang}/" />`;
      }
      // Language homepage
      if (pageSlug === '') {
        return `<link rel="alternate" hreflang="${alternateLang}" href="https://naturaltime.app/${alternateLang}/" />`;
      }
      // Content page: map slug -> route key -> alternate slug
      const routeKey = currentSlugToKey[pageSlug];
      const altSlug = routeKey ? (ROUTE_PATHS[routeKey]?.[alternateLang] || pageSlug) : pageSlug;
      return `<link rel="alternate" hreflang="${alternateLang}" href="https://naturaltime.app/${alternateLang}/${altSlug}/" />`;
    }).filter(Boolean).join('\n    ');

    // Add x-default alternate
    let xDefaultHref = 'https://naturaltime.app/';
    if (canonicalPath && canonicalPath !== '/' && pageSlug) {
      const routeKey = currentSlugToKey[pageSlug];
      const defaultSlug = routeKey ? (ROUTE_PATHS[routeKey]?.[DEFAULT_LANGUAGE] || pageSlug) : pageSlug;
      xDefaultHref = `https://naturaltime.app/${DEFAULT_LANGUAGE}/${defaultSlug}/`;
    } else {
      // For language homepages and root, point x-default to site root
      xDefaultHref = 'https://naturaltime.app/';
    }
    const xDefaultLink = `<link rel="alternate" hreflang="x-default" href="${isStartPwa ? 'https://naturaltime.app/' : xDefaultHref}" />`;
    
    // Only add essential SEO tags that don't conflict with component meta tags
    const seoTags = `
    <meta charset="UTF-8" />
    ${alternateLinks}
    ${xDefaultLink}
    <meta name="robots" content="${isStartPwa ? 'noindex,follow' : 'index,follow'}" />
    <link rel="canonical" href="https://naturaltime.app/${isStartPwa ? '' : canonicalHref}" />`;
    
    // Remove only duplicate canonical and alternate links
    content = content.replace(/<link rel="alternate" hreflang[^>]*>/g, '')
                    .replace(/<link rel="canonical"[^>]*>/g, '')
                    .replace(/<meta charset[^>]*>/g, '');
    
    // Insert the tags after the opening head tag
    content = content.replace(/<head>/, `<head>${seoTags}`);
    
    await fs.promises.writeFile(filePath, content, 'utf8');
  } catch (err) {
    console.error(`Error injecting SEO tags in ${filePath}:`, err);
  }
}

// Map to store language for each route
const routeLanguageMap = {};

// Populate the route language map
AVAILABLE_LANGUAGES.forEach(lang => {
  // Base route for each language
  routeLanguageMap[`/${lang}/`] = lang;
  
  // Routes for each page type defined in ROUTE_PATHS
  Object.keys(ROUTE_PATHS).forEach(routeKey => {
    if (ROUTE_PATHS[routeKey][lang]) {
      routeLanguageMap[`/${lang}/${ROUTE_PATHS[routeKey][lang]}`] = lang;
      // Also add versions with trailing slash for consistency
      routeLanguageMap[`/${lang}/${ROUTE_PATHS[routeKey][lang]}/`] = lang;
    }
  });
});

// Default routes use the default language
routeLanguageMap['/'] = AVAILABLE_LANGUAGES[0];
routeLanguageMap['/startpwa/'] = AVAILABLE_LANGUAGES[0];

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
            urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            },
          }
        ],
      },
      manifest: {
        id: 'naturaltime.app.pwa',
        name: 'Natural time',
        short_name: 'Natural time',
        start_url: `https://naturaltime.app/startpwa/`,
        description: 'Natural time is a fresh, elegant, and coherent way of measuring the movements of time here on the Earth. This new time standard is based on common sense and the observation of natural cycles',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
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
      return generateRoutesForAllLanguages()
    },
    async onFinished() {
      // Fix language tags in HTML files
      try {
        const fs = await import('fs');
        const path = await import('path');
        const distDir = path.resolve('./dist');
        
        // Generate and write sitemap.xml
        const sitemapContent = generateSitemapXml();
        await fs.promises.writeFile(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf8');
        
        // Generate robots.txt with additional SEO-friendly directives
        const robotsContent = `User-agent: *
Allow: /
Disallow: /startpwa

# Crawl-delay: 10
# Allow crawling of JavaScript and CSS
Allow: *.js
Allow: *.css
Allow: *.jpg
Allow: *.jpeg
Allow: *.gif
Allow: *.png
Allow: *.svg

Sitemap: https://naturaltime.app/sitemap.xml`;
        await fs.promises.writeFile(path.join(distDir, 'robots.txt'), robotsContent, 'utf8');
        
        // Fix lang attribute and inject SEO tags in each HTML file
        async function fixLangAttribute(filePath, targetLang) {
          try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const result = data.replace(/<html lang="<!--app-lang-->">/, `<html lang="${targetLang}">`);
            await fs.promises.writeFile(filePath, result, 'utf8');
            await injectSEOTags(filePath, targetLang);
          } catch (err) {
            console.error(`Error fixing lang attribute in ${filePath}:`, err);
          }
        }
        
        // Process each language directory
        for (const lang of AVAILABLE_LANGUAGES) {
          const langDir = path.join(distDir, lang);
          
          if (fs.existsSync(langDir)) {
            // Fix the main index.html for this language
            await fixLangAttribute(path.join(langDir, 'index.html'), lang);
            
            // Process HTML files in this language directory
            const files = await fs.promises.readdir(langDir);
            for (const file of files) {
              if (file.endsWith('.html')) {
                await fixLangAttribute(path.join(langDir, file), lang);
              } else {
                const subdir = path.join(langDir, file);
                try {
                  const stats = await fs.promises.stat(subdir);
                  if (stats.isDirectory()) {
                    const subdirFiles = await fs.promises.readdir(subdir);
                    for (const subdirFile of subdirFiles) {
                      if (subdirFile.endsWith('.html')) {
                        await fixLangAttribute(path.join(subdir, subdirFile), lang);
                      }
                    }
                  }
                } catch (err) {
                  // Not a directory or can't access, skip
                }
              }
            }
          }
        }
        
        // Fix root files (defaults to default language)
        const rootFiles = ['index.html', 'startpwa/index.html'];
        for (const file of rootFiles) {
          const filePath = path.join(distDir, file);
          if (fs.existsSync(filePath)) {
            await fixLangAttribute(filePath, AVAILABLE_LANGUAGES[0]);
          }
        }
      } catch (err) {
        console.error('Error during post-build processing:', err);
      }
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