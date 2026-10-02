import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    VueI18nPlugin({
      include: [resolve(__dirname, './src/portfolio/i18n/locales/**')],
      runtimeOnly: true,
      compositionOnly: true,
      ssr: true,
    }),
    // Dev tools only while serving (never in the client or SSR builds)
    command === 'serve' && vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_FULL_INSTALL__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    manifest: true,
  },
  server: {
    port: 5175,
    strictPort: true,
  },
}))
