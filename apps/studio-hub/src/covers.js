/* THE REVIEW APPS' COVERS (studio-hub 2026-10-23, editor-hub's seed the same day): outputs, not UI — what a patch or a
 * preset would render, drawn from a seed as an SVG data URI. One generator, so the hubs' dummy files look alike. */

export const title = (slug) => slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
/* COVERS ARE OUTPUTS, NOT UI (review 2, § 1.1 — *"use output, not screenshot of ui … some geometric abstractions? some
 * gradients"*): `cover(seed)` draws what a patch would render — a dark ground and one of five compositions (a gradient
 * wash, triangles, a line grid, neon strokes, concentric rings), hue and layout from the seed, as an SVG data URI */
const rnd = (seed) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280) }
export function cover(seed) {
  const r = rnd(seed + 1)
  const h = Math.floor(r() * 360)
  const hsl = (dh, l = 60, a = 1) => `hsla(${(h + dh) % 360},80%,${l}%,${a})`
  let body = ''
  switch (seed % 5) {
    case 0: /* a gradient wash */
      body = `<defs><radialGradient id="g" cx="${20 + r() * 60}%" cy="${20 + r() * 60}%" r="80%"><stop offset="0" stop-color="${hsl(0, 62)}"/><stop offset=".55" stop-color="${hsl(40, 30, 0.6)}"/><stop offset="1" stop-color="${hsl(80, 8, 0)}"/></radialGradient></defs><rect width="400" height="400" fill="url(#g)"/>`
      break
    case 1: /* triangles */
      for (let i = 0; i < 9; i++) { const x = r() * 400, y = r() * 400, s = 60 + r() * 140; body += `<polygon points="${x},${y - s} ${x + s},${y + s * 0.7} ${x - s},${y + s * 0.7}" fill="${hsl(i * 18, 30 + r() * 35, 0.55)}"/>` }
      break
    case 2: { /* a line grid, bent */
      const n = 10 + Math.floor(r() * 10), bend = 20 + r() * 60
      for (let i = 0; i <= n; i++) { const y = (i / n) * 400; body += `<path d="M0 ${y} Q200 ${y + (i % 2 ? bend : -bend)} 400 ${y}" stroke="${hsl(i * 6, 55)}" stroke-width="1.2" fill="none" opacity="${0.3 + (i / n) * 0.7}"/>` }
      break }
    case 3: /* neon strokes */
      for (let i = 0; i < 6; i++) body += `<path d="M${r() * 400} ${r() * 400} C${r() * 400} ${r() * 400} ${r() * 400} ${r() * 400} ${r() * 400} ${r() * 400}" stroke="${hsl(i * 50, 62)}" stroke-width="${2 + r() * 6}" fill="none" stroke-linecap="round" filter="url(#b)"/>`
      body = `<defs><filter id="b"><feGaussianBlur stdDeviation="2"/></filter></defs>${body}`
      break
    default: { /* concentric rings */
      const cx = 100 + r() * 200, cy = 100 + r() * 200
      for (let i = 14; i > 0; i--) body += `<circle cx="${cx}" cy="${cy}" r="${i * 22}" fill="none" stroke="${hsl(i * 9, 25 + i * 3)}" stroke-width="${i % 3 ? 2 : 6}"/>`
    }
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#0b0b0d"/>${body}</svg>`)}`
}
