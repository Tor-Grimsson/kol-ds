import { useEffect, useState } from 'react'
import { AppHub } from '@kolkrabbi/kol-shell'
import { CodeBlock, KeylineGuide } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'
import { IDENTITIES, ROLE_NOTES, identity } from './identity.js'
import currentKolkrabbiCard from './fixtures/kolkrabbi-og-current.png'

/* THE IDENTITY REFERENCE (plan-2026-10-28-identity W2 — user: *"apps/identity is the main point here. SO WE CAN VIEW AS
 * A SET"* · *"take aim from the artifact layout we use in skill, with guide toggles and such"*). Built the way the
 * /app-icon review page is: two panes, light and dark, every app icon judged on its ground beside the family, a guides
 * toggle per pane, every asset with its package path under it. Nothing is drawn here — every cell is a file from
 * @kolkrabbi/kol-icons' identity set (identity.js), inlined or shown as the PNG the renderer wrote. */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/family'

const APP = {
  name: 'Identity',
  subtitle: 'Every mark, judged as a set',
  logomark,
  defaultTheme: 'dark',
  about: 'The review surface for the identity set in kol-icons: every app and the brand on one home-screen row, light and dark, and each identity with every file in its folder and its path. The DS owns this system so the app icons are cut by one rule and seen side by side before they ship.',
  links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }],
}

const ITEMS = [
  { icon: 'grid-3x3', path: '/family', label: 'Family' },
  { icon: 'file', path: '/files', label: 'Files' },
  ...IDENTITIES.map((x) => ({ icon: x.icon ? x.id : 'layers', path: `/id/${x.id}`, label: x.name })),
]

/* ── inlining: every inlined svg gets its own ids (the glitch cuts share clipPath names) ── */
let n = 0
const uniq = (svg) => { const k = ++n; return svg.replace(/id="([^"]+)"/g, (_, id) => `id="${id}-${k}"`).replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${id}-${k})`) }
/* size the root tag; a favicon's own <style> is dropped so it cannot ink the page (VectorLoader's rule) */
const sized = (svg, w, h = w) => uniq(svg).replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/^<svg([^>]*?)\s+width="[^"]*"/, '<svg$1').replace(/^<svg([^>]*?)\s+height="[^"]*"/, '<svg$1')
  /* h="auto": width only, the height from the viewBox (an svg height attribute cannot be "auto") */
  .replace(/^<svg/, h === 'auto' ? `<svg width="${w}" style="display:block;height:auto;max-width:100%"` : `<svg width="${w}" height="${h}" style="display:block"`)
const Svg = ({ svg, w, h, className = '', style }) => <span className={`inline-block leading-none ${className}`} style={style} dangerouslySetInnerHTML={{ __html: sized(svg, w, h) }} />

/* a keyline icon (mark at 75 %) → an app icon (mark at 60 %): the whole icon at 0.8 about the centre, on the ground */
const appIconOf = (iconSvg, ground = '#121215', ink = '#FFFFFF') => {
  const inner = iconSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="${ground}"/><g transform="translate(2.4 2.4) scale(0.8)" style="color:${ink}">${inner}</g></svg>`
}

/* ── the guide: the 24 keyline grid (kol-component's KeylineGuide) + the app-icon rule's 60 % box and the maskable 50 % circle ── */
function AppIconGuide({ dark }) {
  const key = dark ? '#F2D24B' : '#CA3ABC'
  return (
    <span className="pointer-events-none absolute inset-0">
      <KeylineGuide light={!dark} />
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect x="4.8" y="4.8" width="14.4" height="14.4" fill="none" stroke={key} strokeWidth="0.18" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="#0A8DA4" strokeWidth="0.12" strokeDasharray="0.4 0.4" />
      </svg>
    </span>
  )
}

/* an app icon at a size: the rendered app-icon SVG on its ground, the iOS corner (22.37 %), the guide on top when on */
function AppIcon({ svg, size, guides, dark = true }) {
  return (
    <span className="relative inline-block overflow-hidden" style={{ width: size, height: size, borderRadius: size * 0.2237 }}>
      <Svg svg={svg} w={size} />
      {guides && <AppIconGuide dark={dark} />}
    </span>
  )
}

const Tag = ({ children }) => <span className="kol-mono-10 block max-w-[28ch] break-all opacity-55">{children}</span>
const Cell = ({ children, tag, className = '' }) => (
  <div className={`flex flex-col items-start gap-2 ${className}`}>{children}{tag && <Tag>{tag}</Tag>}</div>
)
const H2 = ({ children }) => <h2 className="kol-mono-12 mt-10 mb-1 uppercase tracking-wider">{children}</h2>
const Sub = ({ children }) => <p className="kol-mono-10 mb-4 max-w-[60ch] opacity-55">{children}</p>

/* ── the two panes: literal grounds, the same content on each, a guides toggle per pane ── */
const PANE = { light: { bg: '#FAFAFA', fg: '#111111', dark: false }, dark: { bg: '#121215', fg: '#FAFAFA', dark: true } }
function Panes({ children }) {
  const [guides, setGuides] = useState({ light: true, dark: true })
  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      {Object.entries(PANE).map(([k, p]) => (
        <section key={k} data-pane={k} className="relative min-w-0 flex-1 px-4 pt-8 pb-24 md:px-10" style={{ background: p.bg, color: p.fg }}>
          {/* the toggle at the TOP of the pane, sticky (user 2026-10-28: "guides on off should be on top not below the fold") */}
          <button
            type="button"
            data-guides={k}
            aria-pressed={guides[k]}
            onClick={() => setGuides((g) => ({ ...g, [k]: !g[k] }))}
            className="kol-mono-10 sticky top-4 z-10 mb-6 cursor-pointer rounded border px-3 py-2"
            style={{ borderColor: 'rgba(128,128,128,.4)', background: p.bg, color: p.fg, opacity: guides[k] ? 1 : 0.55 }}
          >
            guides · {guides[k] ? 'on' : 'off'}
          </button>
          {children({ pane: k, dark: p.dark, guides: guides[k] })}
        </section>
      ))}
    </div>
  )
}

/* ── Family: every app icon in the home-screen row, at the phone's size, then 120 and 40 ── */
const WITH_APP_ICON = IDENTITIES.filter((x) => x.appIcon)
function Family() {
  return (
    <Panes>
      {({ pane, guides }) => (
        <>
          <h1 className="kol-mono-16 uppercase tracking-wider">The family</h1>
          <Sub>Every identity's app icon, dark, as apple-touch-icon links it — {pane} pane. The mark sits in the middle 60 % of the 24 box (the yellow or magenta square), the maskable crop keeps it inside the teal circle. Rendered by scripts/render-identity.mjs from each folder's logomark.</Sub>
          {[60, 120, 40].map((px) => (
            <div key={px}>
              <H2>{px === 60 ? 'On the home screen · 60' : `At ${px}`}</H2>
              <div className="flex flex-wrap gap-x-5 gap-y-6" data-row={px}>
                {WITH_APP_ICON.map((x) => (
                  <a key={x.id} href={`#/id/${x.id}`} className="flex flex-col items-center gap-2 no-underline" style={{ color: 'inherit', width: Math.max(px, 64) }}>
                    <AppIcon svg={x.appIcon.raw} size={px} guides={guides} dark />
                    <span className="kol-mono-10 text-center">{x.name}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
          <H2>Light ground, for the record</H2>
          <Sub>iOS greys a light web clip in its dark appearance, which is why the dark app icon is the one linked.</Sub>
          <div className="flex flex-wrap gap-x-5 gap-y-6">
            {WITH_APP_ICON.filter((x) => x.appIconLight).map((x) => (
              <div key={x.id} className="flex flex-col items-center gap-2" style={{ width: 64 }}>
                <AppIcon svg={x.appIconLight.raw} size={60} guides={guides} dark={false} />
                <span className="kol-mono-10 text-center">{x.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Panes>
  )
}

/* ── one identity: every file in its folder, by role, with its path ── */
const fileTag = (f) => f.path
function Favicon({ svg, name }) {
  /* the favicon in a light and a dark browser tab — its own scheme style picks the ink there, so here each tab inks it */
  return (
    <div className="flex flex-col gap-2">
      {[['#F1F1F3', '#0E0E11'], ['#2A2A2E', '#FFFFFF']].map(([bg, fg]) => (
        <div key={bg} className="kol-mono-12 flex items-center gap-2 rounded-t-md px-3 py-2" style={{ background: bg, color: fg, width: 200 }}>
          <Svg svg={svg} w={16} />{name}
        </div>
      ))}
    </div>
  )
}

/* a share card from an art file: the renderer's own composition (lockup or wordmark at 840 wide, the mark at 300), drawn
 * at the page's scale — for the website's options row only, every other card is the rendered og.png */
const cardOf = (art, kind) => {
  const vb = (art.match(/viewBox="([^"]+)"/) || [, '0 0 24 24'])[1].split(/\s+/).map(Number)
  const inner = art.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  const bw = kind === 'logomark' ? 300 : 840
  const bh = bw * vb[3] / vb[2]
  return `<svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#121215"/><svg x="${600 - bw / 2}" y="${315 - bh / 2}" width="${bw}" height="${bh}" viewBox="${vb.join(' ')}" style="color:#FFFFFF">${inner}</svg></svg>`
}

function Identity({ id }) {
  const x = identity(id)
  if (!x) return <p className="kol-mono-12 p-10">No identity named “{id}”.</p>
  const fxr = identity('fxr'), mon = identity('monitor')
  return (
    <Panes>
      {({ dark, guides }) => (
        <>
          <h1 className="kol-mono-16 uppercase tracking-wider">{x.name}</h1>
          <Sub>{`packages/icons/src/kol-icon-set-identity/${x.id}/ — ${x.files.length} files. The file named like the folder is the icon; every other file is an asset by role.`}</Sub>

          {x.appIcon && (
            <>
              <H2>The app icon</H2>
              <Sub>What ships: the dark app icon is what apple-touch-icon links, the light one is for the record, the favicon in a light and a dark tab.</Sub>
              <div className="flex flex-wrap items-start gap-8">
                <Cell tag={fileTag(x.appIcon)}><AppIcon svg={x.appIcon.raw} size={120} guides={guides} /></Cell>
                {x.appIconLight && <Cell tag={fileTag(x.appIconLight)}><AppIcon svg={x.appIconLight.raw} size={120} guides={guides} dark={false} /></Cell>}
                {x.favicon && <Cell tag={fileTag(x.favicon)}><Favicon svg={x.favicon.raw} name={x.name} /></Cell>}
              </div>
              <H2>The ramp</H2>
              <Sub>The app icon from the home screen down to the tab.</Sub>
              <div className="flex flex-wrap items-end gap-4">
                {[60, 40, 29, 16].map((px) => <Cell key={px} tag={String(px)}><AppIcon svg={x.appIcon.raw} size={px} guides={guides && px >= 29} /></Cell>)}
              </div>
            </>
          )}
          {!x.appIcon && x.favicon && (<><H2>Favicon</H2><Cell tag={fileTag(x.favicon)}><Favicon svg={x.favicon.raw} name={x.name} /></Cell></>)}

          <H2>The marks</H2>
          <Sub>The icon on the keyline is what Icon renders; the logomark is the raw mark the app icon and the loader are cut from.</Sub>
          <div className="flex flex-wrap items-start gap-8">
            {x.icon && (
              <Cell tag={`${fileTag(x.icon)} · <Icon name="${x.id}">`}>
                <span className="relative inline-block" style={{ width: 120, height: 120 }}><Svg svg={x.icon.raw} w={120} />{guides && <span className="absolute inset-0"><KeylineGuide light={!dark} /></span>}</span>
              </Cell>
            )}
            {x.logomark && <Cell tag={fileTag(x.logomark)}><span className="inline-block outline outline-1 outline-offset-0" style={{ outlineColor: guides ? 'rgba(10,141,164,.6)' : 'transparent' }}><Svg svg={x.logomark.raw} w={120} /></span></Cell>}
          </div>

          {(x.wordmark || x.lockupH || x.lockupV) && (
            <>
              <H2>Wordmark and lockups</H2>
              <Sub>Set as type, on this pane's ground; the share card and the boot loader read these.</Sub>
              <div className="flex flex-col items-start gap-8">
                {[x.wordmark, x.lockupH, x.lockupV].filter(Boolean).map((f) => (
                  <Cell key={f.file} tag={fileTag(f)}><Svg svg={f.raw} w={280} h="auto" /></Cell>
                ))}
              </div>
            </>
          )}

          {x.pngs.length > 0 && (
            <>
              <H2>Rendered sizes</H2>
              <Sub>Opaque PNGs from scripts/render-identity.mjs — what an app copies into public/touch-icons/. The maskable one keeps the mark inside Android's safe circle.</Sub>
              <div className="flex flex-wrap items-end gap-6">
                {x.pngs.map((f) => {
                  const px = f.file.includes('512') ? 128 : f.file.includes('192') || f.file.includes('-96') ? 96 : f.file.endsWith('.ico') ? 32 : 90
                  const mask = f.file.includes('maskable')
                  return (
                    <Cell key={f.file} tag={f.path}>
                      <span className="relative inline-block" style={{ width: px, height: px, borderRadius: mask ? '50%' : 0, overflow: 'hidden' }}>
                        <img src={f.url} width={px} height={px} alt="" className="block" />
                      </span>
                    </Cell>
                  )
                })}
              </div>
            </>
          )}

          {x.og && (
            <>
              <H2>Share card</H2>
              <Sub>1200 × 630, og:image — {x.ogSvg ? 'rendered from this folder.' : ''}</Sub>
              <Cell tag={x.og.path}><img src={x.og.url} alt="" className="block w-full max-w-[480px]" /></Cell>
            </>
          )}

          {x.id === 'kolkrabbi' && (
            <>
              <H2>The website's card, options</H2>
              <Sub>kolkrabbi.io's share card five ways on one ground: what ships today, then the lockups, the wordmark and the logomark. The pick is what kolkrabbi/og.png renders.</Sub>
              <div className="flex flex-col items-start gap-6">
                <Cell tag="current · kol-website/public/identity/web/og/open-graph-01.png"><img src={currentKolkrabbiCard} alt="" className="block w-full max-w-[480px]" /></Cell>
                {[['lockup-h', x.lockupH], ['lockup-v', x.lockupV], ['wordmark', x.wordmark], ['logomark', x.logomark]].filter(([, f]) => f).map(([k, f]) => (
                  <Cell key={k} tag={`${k} · ${f.path}`}><Svg svg={cardOf(f.raw, k)} w={480} h={252} className="max-w-full" /></Cell>
                ))}
              </div>
            </>
          )}

          {x.id === 'mirror' && x.alts.length > 0 && (
            <>
              <H2>Mirror's round</H2>
              <Sub>The current app icon and the alternate, each at 120, the ramp, then FXR and MON at 40 for weight. Pick by row name.</Sub>
              {[['glitch-0-fill', 'current — MR over its reflection, stretched to FXR\'s box', x.appIcon.raw, x.appIcon.path], ...x.alts.map((a) => ['mir-fxr-i0.35', 'MIR as one tall row, cut and slid ±1, drawn like FXR and MON', appIconOf(a.raw), a.path])].map(([row, note, svg, path]) => (
                <div key={row} data-candidate={row} className="mb-6">
                  <div className="kol-mono-12 mb-2"><b>{row}</b> <span className="opacity-55">— {note}</span><Tag>{path}</Tag></div>
                  <div className="flex flex-wrap items-end gap-6">
                    <AppIcon svg={svg} size={120} guides={guides} />
                    <div className="flex items-end gap-3">{[60, 40, 29, 16].map((px) => <AppIcon key={px} svg={svg} size={px} guides={guides && px >= 29} />)}</div>
                    <div className="flex items-end gap-3 border-l pl-4" style={{ borderColor: 'rgba(128,128,128,.3)' }}>
                      {[fxr, mon].filter((r) => r?.appIcon).map((r) => <Cell key={r.id} tag={r.name}><AppIcon svg={r.appIcon.raw} size={40} guides={false} /></Cell>)}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <H2>Every file</H2>
          <div className="kol-mono-10 flex flex-col gap-1" data-files={x.id}>
            {x.files.map((f) => <span key={f.file} className="opacity-70">{f.path}</span>)}
          </div>
        </>
      )}
    </Panes>
  )
}

/* ── Files: the rule, once, shown live on one identity ── */
const COPY = `// package.json → "icons": "node scripts/icons.mjs"  — run after every /bump of @kolkrabbi/kol-icons
import { cpSync, mkdirSync } from 'node:fs'
const ID = 'mirror'   // your identity's folder
const SET = \`node_modules/@kolkrabbi/kol-icons/src/kol-icon-set-identity/\${ID}\`
mkdirSync('public/touch-icons', { recursive: true }); mkdirSync('public/svg', { recursive: true }); mkdirSync('public/og', { recursive: true })
for (const f of ['apple-touch-icon-dark.png', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png']) cpSync(\`\${SET}/\${f}\`, \`public/touch-icons/\${f}\`)
cpSync(\`\${SET}/\${ID}-favicon.svg\`, 'public/svg/favicon.svg')
cpSync(\`\${SET}/og.png\`, \`public/og/\${ID}.png\`)`

function Files() {
  const x = identity('kolkrabbi')
  const live = { icon: x.icon, logomark: x.logomark, wordmark: x.wordmark, 'lockup-h': x.lockupH, 'lockup-v': x.lockupV, favicon: x.favicon, 'app-icon': x.appIcon, 'app-icon-light': x.appIconLight, png: x.png('apple-touch-icon-dark.png'), og: x.og }
  return (
    <Panes>
      {({ guides }) => (
        <>
          <h1 className="kol-mono-16 uppercase tracking-wider">The files</h1>
          <Sub>One folder per identity: packages/icons/src/kol-icon-set-identity/&lt;id&gt;/. The file named like its folder is the icon — the one name Icon renders. Every other file is an asset by role, read by path: @kolkrabbi/kol-icons/identity/&lt;id&gt;/&lt;file&gt;. Shown live on kolkrabbi.</Sub>
          <div className="flex flex-col gap-6">
            {ROLE_NOTES.map(({ role, what, readBy }) => {
              const f = live[role]
              return (
                <div key={role} data-role={role} className="grid items-center gap-4 border-t pt-4 md:grid-cols-[120px_1fr]" style={{ borderColor: 'rgba(128,128,128,.25)' }}>
                  <div>
                    {!f ? <span className="kol-mono-10 opacity-40">—</span>
                      : f.raw && role.startsWith('app-icon') ? <AppIcon svg={f.raw} size={60} guides={guides} dark={role === 'app-icon'} />
                      : f.raw && role === 'favicon' ? <Svg svg={f.raw} w={32} />
                      : f.raw ? <Svg svg={f.raw} w={role.startsWith('lockup') || role === 'wordmark' ? 110 : 60} h="auto" />
                      : <img src={f.url} alt="" className="block" style={{ width: role === 'og' ? 110 : 60 }} />}
                  </div>
                  <div className="kol-mono-10 flex flex-col gap-1">
                    <b className="kol-mono-12">{role === 'icon' ? '<id>.svg' : role === 'png' ? '*.png' : role === 'og' ? 'og.png · og.svg' : `<id>-${role}${role === 'alt' ? '-*' : ''}.svg`}</b>
                    <span>{what}</span>
                    <span className="opacity-55">read by: {readBy}</span>
                    {f && <span className="opacity-55">{f.path}</span>}
                  </div>
                </div>
              )
            })}
          </div>
          <H2>How an app takes its set</H2>
          <Sub>The app draws nothing: its pnpm icons copies its folder out of the package into public/. The /app-icon round still happens in the app; the pick is ticketed here, normalised, rendered, and comes back on the next bump.</Sub>
          <CodeBlock language="js" code={COPY} size="sm" />
        </>
      )}
    </Panes>
  )
}

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const id = path.startsWith('/id/') ? path.slice(4) : null
  return (
    <AppHub app={APP} items={ITEMS} currentPath={path} onNavigate={navigate} homePath="/family" dev={{ tabs: [] }}>
      <div className="h-full overflow-auto">
        {id ? <Identity id={id} /> : path === '/files' ? <Files /> : <Family />}
      </div>
    </AppHub>
  )
}
