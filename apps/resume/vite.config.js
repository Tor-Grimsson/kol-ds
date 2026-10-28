import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'
import { kitExportPlugin } from '@kolkrabbi/kol-resume/vite'

// An apps/* member: runs locally on `pnpm resume` (ResumeKit 2026-10-28), and publishes into the showcase's output at
// ui.kolkrabbi.io/apps/resume. The kit's export (KIT_APP set by kitExportPlugin) builds to ./dist at / and previews it there.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
const kit = !!process.env.KIT_APP
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'R' }), react(), tailwindcss(), kitExportPlugin({ name: 'hekla-sveinsdottir' })],
  base: command === 'build' && !kit ? '/apps/resume/' : '/',
  build: kit ? { outDir: 'dist' } : { outDir: '../../showcase/dist/apps/resume', emptyOutDir: true },
  // the kit's export build keeps the shared public/ — the KOL fonts the PDF prints in live there
  publicDir: command === 'build' && !kit ? false : '../../public',
  resolve: { dedupe: ['react', 'react-dom'] },
  // its own port beside print (5210)
  server: { port: 5211, host: true },
  preview: { port: 5180 },
  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
