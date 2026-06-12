import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

const organizerRoot = path.resolve(__dirname, 'src/frontend/work-organizer-ui')

export default defineConfig({
  resolve: {
    alias: {
      '@': organizerRoot,
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    electron([
      {
        entry: 'src/electron/preload.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['electron'],
              output: {
                format: 'cjs',
                entryFileNames: 'preload.cjs',
              },
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
})
