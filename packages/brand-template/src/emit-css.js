/**
 * emit-css — the generator half of the manifest standard.
 *
 * ONE manifest object → the 4-section `kol-brand-color.css` skeleton. This is
 * the mechanical bridge that ends the "split across file types" problem: color
 * no longer lives hand-authored in each client's CSS, it's a projection of the
 * single manifest.
 *
 * The 4 sections (the de-facto standard, from the 2026-07-09 brand scan):
 *
 *   1. PALETTE PRIMITIVES  — hue ramps + cream as `--kol-color-{hue}-{stop}`;
 *                            the fixed grey ramp as `--grey-{stop}`.
 *   2. BRAND ROLES         — `--brand-{primary,on-primary,secondary,on-secondary}`
 *                            → ramp stops. The "edit these lines to rebrand" tier.
 *   3. ACCENT REBIND       — `--kol-accent-*` (the DS accent, brand-neutral by
 *                            default) rebound onto the brand roles. Buttons,
 *                            focus rings, sidenav dots switch from ink to brand.
 *   4. TAILWIND CONTRACT    — `@theme` exposures (`bg-brand-primary`,
 *                            `bg-kol-yellow-300`, …). Tailwind v4 reads @theme
 *                            from any imported CSS.
 *
 * Token convention: PRIMITIVES use the DS-canonical `--kol-color-*` naming
 * (the authoritative apps/brand `data/color.js` shape), NOT the legacy
 * `--brand-{hue}-*` prefix. The `--brand-*` tier is kept ONLY for the four
 * semantic ROLE tokens — the small rebrand surface the AC / kolkrabbi
 * skeletons already ship. This reconciles the two conventions found in the
 * wild rather than inventing a third.
 *
 *   import { emitBrandColorCss } from '@kolkrabbi/kol-brand-template/emit-css'
 *   const css = emitBrandColorCss(brand)   // → string; write to kol-brand-color.css
 */

import { withHouseDefaults, RAMP_ORDER } from './defaults.js'

/* Where a ramp's stops live as CSS custom properties. Grey is the fixed
 * theme-independent neutral (`--grey-NN`); everything else is a palette
 * primitive (`--kol-color-{id}-NN`). A stray 'brand-' prefix is tolerated. */
function rampVarBase(id) {
  const clean = String(id).replace(/^brand-/, '')
  if (clean === 'grey') return '--grey'
  return `--kol-color-${clean}`
}

/* Resolve an identity role value to a `var(...)` reference.
 *   'yellow-300'          → var(--kol-color-yellow-300)
 *   'grey-500'            → var(--grey-500)
 *   '--kol-color-red-200' → var(--kol-color-red-200)   (full token passthrough)
 *   '#FFCF33'             → #FFCF33                     (literal passthrough) */
function roleRef(v) {
  if (!v) return null
  const s = String(v).trim()
  if (s.startsWith('#') || s.startsWith('rgb') || s.startsWith('hsl') || s.startsWith('oklch')) return s
  if (s.startsWith('--')) return `var(${s})`
  const m = /^([a-z]+)-(\d+)$/i.exec(s)
  if (m) return `var(${rampVarBase(m[1])}-${m[2]})`
  return `var(${s})`
}

const pad = (s, n) => String(s).padEnd(n)

function sortedRamps(ramps) {
  const rank = (r) => {
    const i = RAMP_ORDER.indexOf(String(r.id).replace(/^brand-/, ''))
    return i === -1 ? RAMP_ORDER.length : i
  }
  return [...ramps].sort((a, b) => rank(a) - rank(b))
}

/**
 * emitBrandColorCss — render a manifest as the kol-brand-color.css skeleton.
 *
 * @param {object} manifest  a client manifest (partial; house defaults merged in)
 * @param {object} [opts]
 * @param {string} [opts.name='Brand']  display name for the file header
 * @param {boolean} [opts.merge=true]   merge house defaults first (idempotent)
 * @returns {string} the CSS source
 */
export function emitBrandColorCss(manifest = {}, opts = {}) {
  const { name = manifest?.meta?.name || 'Brand', merge = true } = opts
  const m = merge ? withHouseDefaults(manifest) : manifest
  const ramps = sortedRamps(Array.isArray(m.ramps) ? m.ramps : [])
  const id = m.identity || {}

  const out = []
  const line = (s = '') => out.push(s)

  /* ── header ─────────────────────────────────────────────────────────── */
  line(`/**`)
  line(` * kol-brand-color.css — ${name} brand color layer. GENERATED from the`)
  line(` * brand manifest (@kolkrabbi/kol-brand-template). Do not hand-edit —`)
  line(` * change the manifest and re-emit.`)
  line(` *`)
  line(` * Layers ON TOP of kol-theme/kol-color.css (which ships brand-neutral:`)
  line(` * accent defaults to ink-on-surface). Import AFTER the DS theme.`)
  line(` */`)
  line()

  /* ── 1. PALETTE PRIMITIVES ──────────────────────────────────────────── */
  line(`/* ===========================================================================`)
  line(` * 1. PALETTE PRIMITIVES — hue ramps + cream (--kol-color-*), fixed grey (--grey-*)`)
  line(` * ========================================================================= */`)
  line(`:root {`)
  ramps.forEach((r, i) => {
    if (i > 0) line()
    if (r.label || r.note) line(`  /* ${[r.label, r.note].filter(Boolean).join(' — ')} */`)
    const base = rampVarBase(r.id)
    for (const s of r.stops || []) {
      const decl = `  ${base}-${s.stop}:`
      line(`${pad(decl, 26)} ${s.value};${s.note ? ` /* ${s.note} */` : (s.stop === r.anchor ? ' /* anchor */' : '')}`)
    }
  })
  line(`}`)
  line()

  /* ── 2. BRAND ROLES ─────────────────────────────────────────────────── */
  line(`/* ===========================================================================`)
  line(` * 2. BRAND ROLES — semantic identity. Edit these lines to rebrand; no consumer`)
  line(` * touches. Pairs keep ink-on-fill contrast across the system.`)
  line(` * ========================================================================= */`)
  line(`:root {`)
  const roles = [
    ['--brand-primary',      id.primary,     'dominant brand color'],
    ['--brand-on-primary',   id.onPrimary,   'ink on brand-primary'],
    ['--brand-secondary',    id.secondary,   'secondary brand color'],
    ['--brand-on-secondary', id.onSecondary, 'ink on brand-secondary'],
  ]
  for (const [tok, val, use] of roles) {
    const ref = roleRef(val)
    if (ref) line(`${pad(`  ${tok}:`, 24)} ${pad(ref + ';', 34)} /* ${use} */`)
  }
  line(`}`)
  line()

  /* ── 3. ACCENT REBIND ───────────────────────────────────────────────── */
  line(`/* ===========================================================================`)
  line(` * 3. ACCENT REBIND — DS accent (brand-neutral by default) takes the brand role.`)
  line(` * Buttons, focus rings, sidenav active dots switch from ink to brand.`)
  line(` * ========================================================================= */`)
  line(`:root {`)
  line(`${pad('  --kol-accent-primary:', 30)} var(--brand-primary);`)
  line(`${pad('  --kol-accent-on-primary:', 30)} var(--brand-on-primary);`)
  const strong = roleRef(id.primaryStrong)
  if (strong) line(`${pad('  --kol-accent-primary-strong:', 30)} ${strong}; /* hover / active */`)
  line(`${pad('  --kol-accent-secondary:', 30)} var(--brand-secondary);`)
  line(`${pad('  --kol-accent-on-secondary:', 30)} var(--brand-on-secondary);`)
  line(`}`)
  line()

  /* ── 4. TAILWIND CONTRACT ───────────────────────────────────────────── */
  line(`/* ===========================================================================`)
  line(` * 4. TAILWIND CONTRACT — @theme exposures. Generates bg-brand-primary,`)
  line(` * bg-kol-yellow-300, etc. Tailwind v4 reads @theme from any imported CSS.`)
  line(` * ========================================================================= */`)
  line(`@theme {`)
  line(`  /* Role layer — what the brand is, today. */`)
  line(`${pad('  --color-brand-primary:', 30)} var(--brand-primary);`)
  line(`${pad('  --color-brand-on-primary:', 30)} var(--brand-on-primary);`)
  line(`${pad('  --color-brand-secondary:', 30)} var(--brand-secondary);`)
  line(`${pad('  --color-brand-on-secondary:', 30)} var(--brand-on-secondary);`)
  // Ramp access — hues + cream (NOT grey; grey stays a plain primitive).
  for (const r of ramps) {
    const clean = String(r.id).replace(/^brand-/, '')
    if (clean === 'grey') continue
    line()
    line(`  /* ${r.label || clean} */`)
    for (const s of r.stops || []) {
      const from = `--color-kol-${clean}-${s.stop}:`
      line(`${pad('  ' + from, 30)} var(--kol-color-${clean}-${s.stop});`)
    }
  }
  line(`}`)

  return out.join('\n') + '\n'
}
