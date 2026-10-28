#!/usr/bin/env node
/**
 * render-identity — every identity's rendered set, from its source marks (plan-2026-10-28-identity, 1.2).
 *
 *   pnpm identity:render            every folder in kol-icon-set-identity that has a `-logomark`
 *   pnpm identity:render mirror …   only those
 *
 * ONE FOLDER PER IDENTITY: `packages/icons/src/kol-icon-set-identity/<id>/`. The sources are authored —
 * `<id>-logomark.svg` (the raw mark in its own box), `<id>-wordmark.svg`, `<id>-lockup-h.svg`, `<id>-favicon.svg`
 * (the tab icon is drawn, never derived) — and this script writes the rest beside them, the three apps'
 * `generate-icons.mjs` (fxr 2026-10-09 · mirror · monitor) folded into one so the whole family is cut by one rule:
 *
 *   <id>-app-icon.svg · <id>-app-icon-light.svg   the app icon (Apple's word — the home-screen icon, apple-touch-icon) as a
 *                                         vector: the mark in the MIDDLE 60 % of a 24 box
 *                                         (docs/documentation/02-icons/05-app-icons.md — a 14.4 square at 4.8),
 *                                         white on #121215 · #121215 on #FAFAFA. The dark one is what iOS links.
 *   apple-touch-icon-dark.png 180 · apple-touch-icon-light.png 180 · icon-192.png · icon-512.png
 *   icon-512-maskable.png                 the mark in the middle 50 %, inside Android's safe circle
 *   favicon.ico 32 · favicon-96.png       the dark app icon at the sizes a host asks for by name (Sanity Studio, /favicon.ico)
 *   og.svg · og.png 1200×630              the share card: the lockup-h across the ground when the identity has one,
 *                                         else the wordmark (840 wide, mirror's), else the mark at 300 (fxr's)
 *
 * Same sharp densities as the apps' generators (300 for the squares, 150 for the card), so a set rendered here
 * is pixel-identical to what an app rendered for itself — that is the 1.2 acceptance, proved on Mirror.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SET = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'icons', 'src', 'kol-icon-set-identity')
const DARK = '#121215'
const LIGHT = '#FAFAFA'
const BOX = 24
const MARK = 0.6 // the middle 60 %
const SAFE = 0.5 // Android's maskable safe zone

/* an SVG file → { vb: [x y w h], inner } — comments dropped, the root tag stripped */
const read = (file) => {
  const svg = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '')
  const vb = (svg.match(/viewBox="([^"]+)"/) || [, `0 0 ${BOX} ${BOX}`])[1].trim().split(/\s+/).map(Number)
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim()
  return { vb, inner }
}

/* the mark placed in the middle `frac` of a 24 box — a 24-box mark at 0.6 is exactly the apps' `translate(4.8 4.8)
 * scale(0.6)`; any other box is scaled to fit the same square and centred in it */
const place = ({ vb, inner }, frac, ink) => {
  const [x, y, w, h] = vb
  const s = (BOX * frac) / Math.max(w, h)
  const tx = (BOX - w * s) / 2 - x * s
  const ty = (BOX - h * s) / 2 - y * s
  return `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${+s.toFixed(4)})" style="color:${ink}">${inner}</g>`
}

const square = (id, mark, { ground, ink, frac, note }) => `<svg width="180" height="180" viewBox="0 0 ${BOX} ${BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
<!-- ${id} app icon: ${note}. Rendered by scripts/render-identity.mjs from ${id}-logomark.svg — edit the logomark, not this. -->
<rect width="${BOX}" height="${BOX}" fill="${ground}"/>
${place(mark, frac, ink)}
</svg>`

/* the share card: an art file across the middle of the ground — a lockup or wordmark at 840 wide, the mark alone at 300 */
const card = (id, art, kind) => {
  const [x, y, w, h] = art.vb
  const bw = kind === 'logomark' ? 300 : 840
  const bh = bw * h / w
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<!-- ${id} share image: the ${kind}, white on ${DARK}. Rendered by scripts/render-identity.mjs from ${id}-${kind}.svg. -->
<rect width="1200" height="630" fill="${DARK}"/>
<svg x="${(600 - bw / 2).toFixed(1)}" y="${(315 - bh / 2).toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}" viewBox="${[x, y, w, h].join(' ')}" style="color:#FFFFFF">${art.inner}</svg>
</svg>`
}

/* opaque RGB, no alpha (05-app-icons: "180×180, opaque RGB") — the ground is painted, so alpha only adds a channel */
const png = (svg, size, out, density = 300) => sharp(Buffer.from(svg), { density }).resize(size, size).removeAlpha().png().toFile(out)

const render = async (id) => {
  const dir = join(SET, id)
  const logomark = join(dir, `${id}-logomark.svg`)
  if (!existsSync(logomark)) return false
  const mark = read(logomark)
  const dark = square(id, mark, { ground: DARK, ink: '#FFFFFF', frac: MARK, note: 'dark — the mark in the middle 60 %, the one iOS links' })
  const light = square(id, mark, { ground: LIGHT, ink: DARK, frac: MARK, note: 'light — for the record; iOS greys a light web clip' })
  const maskable = square(id, mark, { ground: DARK, ink: '#FFFFFF', frac: SAFE, note: 'maskable — the mark in the middle 50 %, inside the safe circle' })
  writeFileSync(join(dir, `${id}-app-icon.svg`), dark)
  writeFileSync(join(dir, `${id}-app-icon-light.svg`), light)
  /* `-tile` was this file's name in 0.50.0 (user 2026-10-28: "if apple uses app icon, why dont we?") — the old names
   * are written beside the new until 2026-11-27, then this pair and the files go */
  writeFileSync(join(dir, `${id}-tile.svg`), dark)
  writeFileSync(join(dir, `${id}-tile-light.svg`), light)
  await png(dark, 180, join(dir, 'apple-touch-icon-dark.png'))
  await png(light, 180, join(dir, 'apple-touch-icon-light.png'))
  await png(dark, 192, join(dir, 'icon-192.png'))
  await png(dark, 512, join(dir, 'icon-512.png'))
  await png(maskable, 512, join(dir, 'icon-512-maskable.png'))

  /* the tab icon as files a host asks for by name (IdentityFaviconIcoAnd96, kol-website 2026-10-28 — Sanity Studio serves
   * `static/favicon.ico` and `static/favicon-96.png`, and any browser asks `/favicon.ico`): the DARK APP ICON, as studio's
   * hand-made pair was (on its ground, so it reads on a light tab and a dark one, which a bare-ink favicon without its
   * scheme style cannot). The .ico is one 32 × 32 PNG in an ICO wrapper — every browser since IE9 reads that form */
  const png32 = await sharp(Buffer.from(dark), { density: 300 }).resize(32, 32).removeAlpha().png().toBuffer()
  const head = Buffer.alloc(22)
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4) // reserved · type icon · one image
  head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9) // 32 × 32, no palette
  head.writeUInt16LE(1, 10); head.writeUInt16LE(24, 12) // planes · bits per pixel (opaque RGB)
  head.writeUInt32LE(png32.length, 14); head.writeUInt32LE(22, 18) // bytes · offset
  writeFileSync(join(dir, 'favicon.ico'), Buffer.concat([head, png32]))
  await png(dark, 96, join(dir, 'favicon-96.png'))

  const kind = ['lockup-h', 'wordmark'].find((k) => existsSync(join(dir, `${id}-${k}.svg`))) ?? 'logomark'
  const og = card(id, kind === 'logomark' ? mark : read(join(dir, `${id}-${kind}.svg`)), kind)
  writeFileSync(join(dir, 'og.svg'), og)
  await sharp(Buffer.from(og), { density: 150 }).resize(1200, 630).removeAlpha().png().toFile(join(dir, 'og.png'))
  console.log(`${id}: app icon dark + light · 180/192/512 · maskable 512 · og 1200×630 from the ${kind}`)
  return true
}

const wanted = process.argv.slice(2)
const ids = wanted.length ? wanted : readdirSync(SET, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
let n = 0
for (const id of ids) {
  if (await render(id)) n++
  else if (wanted.length) { console.error(`${id}: no ${id}-logomark.svg — nothing to render from`); process.exitCode = 1 }
}
console.log(`${n} ${n === 1 ? 'identity' : 'identities'} rendered`)
