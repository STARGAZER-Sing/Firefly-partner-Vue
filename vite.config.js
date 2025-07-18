import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.png', '**/*.jpg'],
  server: {
    host: true,
    port: 5173
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    // alias: {
    //   '@': fileURLToPath(new URL('./src', import.meta.url))
    // },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

})

