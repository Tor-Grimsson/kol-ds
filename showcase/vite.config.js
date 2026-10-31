import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import { devFavicon, loaderApp } from '@kolkrabbi/kol-framework/vite'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/* DEV ONLY (IconTreatment select-and-move, 2026-10-31): the treatment page's category moves land on disk, so the agent
 * can read them. GET returns the log, POST appends `{ at, names, from, to }` (or an array of them). Never in a build. */
const MOVES = fileURLToPath(new URL('../lobby/archive/_assets/IconTreatment/moves.json', import.meta.url))
const iconTreatmentMoves = () => ({
  name: 'icon-treatment-moves',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__icon-treatment/moves', (req, res) => {
      const log = existsSync(MOVES) ? JSON.parse(readFileSync(MOVES, 'utf8')) : []
      const send = (body) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)) }
      if (req.method === 'GET') return send(log)
      if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
      let body = ''
      req.on('data', (c) => { body += c })
      req.on('end', () => {
        try {
          log.push(...[].concat(JSON.parse(body)))
          writeFileSync(MOVES, JSON.stringify(log, null, 1) + '\n')
          send(log)
        } catch (e) { res.statusCode = 400; res.end(String(e)) }
      })
    })
  },
})

/* DEV ONLY (2026-10-31 — user: "I cant do anything, it keeps refreshing" on /demo/icon-treatment): a markdown file
 * leaving or re-entering an eager glob (a lobby ticket moving inbox → done → archive, a docs page renamed by another
 * session) sent a FULL page reload to every open tab, wiping whatever page you were on. Vite already updates the glob's
 * importer (Lobby.jsx, vault.js …) — the reload came from the file's own stale module, left with no importer. So that
 * dead end is dropped: the importer re-transforms, the glob re-expands, and the page stays put, as for an edit. */
const quietGlobChanges = () => ({
  name: 'quiet-glob-changes',
  apply: 'serve',
  enforce: 'post',
  hotUpdate({ type, file, modules }) {
    /* a page edit also changed pages/<Page>.jsx?raw, which only lib/set-membership.js reads (mined text); its update ran
     * into the set-membership ↔ ComponentPage circle and reloaded every tab. The page itself still hot-updates; the mined
     * text catches up on the next load. */
    const minedOnly = (m) => m.url.includes('?raw') && m.importers.size > 0 && [...m.importers].every((i) => i.file?.endsWith('/lib/set-membership.js'))
    if (type === 'update' && modules.some(minedOnly)) return modules.filter((m) => !minedOnly(m))
    if (type === 'update' || !file.endsWith('.md')) return
    const live = modules.filter((m) => m.importers.size > 0 || m.isSelfAccepting)
    return live.length === modules.length ? undefined : live
  },
})

// https://vite.dev/config/
export default defineConfig({
  // mdx MUST precede react: it compiles .mdx → JSX, which react then transforms.
  // `providerImportSource` lets MDXProvider inject the shared component map, so
  // a doc gets <Preview>, <ApiTable> etc. without importing them per file.
  plugins: [iconTreatmentMoves(), quietGlobChanges(), devFavicon({ label: 'K' }), loaderApp({ graphic: '../packages/icons/src/kol-icon-set-identity/kol-ds/kol-ds-wordmark.svg', size: 840 }), 
    /* include: .mdx ONLY — the plugin also claims .md by default, which turns
       every `?raw` markdown import (the docs vault, the lobby queue) into a
       compiled module and breaks the markdown engine downstream. */
    /* remark-gfm (the showcase review W10, 2026-09-30): MDX is CommonMark, which has no tables — every
     * `| … |` table in a guide printed as one line of pipes. GFM adds tables, strikethrough and task lists. */
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react', include: /\.mdx$/, remarkPlugins: [remarkGfm] }) },
    react(),
    svgr(),
    tailwindcss(),
  ],
  // ONE public/ at repo root (repo rule, 2026-07-15) — every app points at it
  // via publicDir instead of keeping its own copy to hunt down.
  publicDir: '../public',
  // Workspace hoisting can leave two physical React copies in the tree
  // (root vs app node_modules), which crashes at runtime with a null
  // dispatcher. Force a single react / react-dom copy.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  /* the moves log is written by the middleware above, and _tmp/ is scratch — neither should ever wake HMR */
  server: {
    watch: { ignored: ['**/lobby/archive/_assets/IconTreatment/moves.json', '**/_tmp/**'] },
  },
})
