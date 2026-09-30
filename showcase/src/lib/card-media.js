/* Neutral stand-ins for photography — data URIs, so a website card renders offline and in an
 * iframe with no network (2026-09-30). One place, so the cards agree. */
const svg = (s) => `data:image/svg+xml,${encodeURIComponent(s)}`

export const heroBg = svg(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#1d1d21"/><circle cx="1150" cy="320" r="360" fill="none" stroke="#8a8a94" stroke-width="2"/><circle cx="1150" cy="320" r="220" fill="none" stroke="#5a5a63" stroke-width="2"/></svg>',
)

export const photo = (a, b) =>
  svg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/></svg>`,
  )

export const gradient = (from, to) =>
  svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/></svg>`,
  )

/* the fill a SectionSplit media slot takes */
export const splitFill = { background: 'linear-gradient(160deg, var(--kol-fg-08) 0%, var(--kol-fg-32) 100%)' }
