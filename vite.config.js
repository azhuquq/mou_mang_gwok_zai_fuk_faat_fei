import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Ticket Getter',
        short_name: 'Ticket',
        description: 'A 6X Boost Ticket Getter Web Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    // vueDevTools(),
  ],
  json: {
    namedExports: true,
    stringify: false
  },
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})