/* THE SAMPLE LIBRARY (plan-2026-11-20-kolbox-everything-left W4.2): what the Media space and the media window read when
   the app hosting the editor passes no media client. A client in kol-media-client's shape (`buckets`, `listMedia`,
   `mediaUrl`, `proxied`) over four pictures drawn here as SVG data, so nothing leaves the page. `sample` marks it, so
   the places that list it say so in one line (SAMPLE_LINE). The real media is the host's to connect (kol-fxr's). */
export const SAMPLE_LINE = 'Sample library: the app hosting the editor has connected no media.'

const svg = (body) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">${body}</svg>`)}`
const FILES = [
  ['sample/circle.svg', svg('<rect width="800" height="1000" fill="#1b1b1b"/><circle cx="400" cy="500" r="260" fill="#f2c230"/>')],
  ['sample/stripes.svg', svg('<rect width="800" height="1000" fill="#ece8df"/>' + Array.from({ length: 10 }, (_, i) => `<rect y="${i * 100}" width="800" height="50" fill="#9c4a1e"/>`).join(''))],
  ['sample/grid.svg', svg('<rect width="800" height="1000" fill="#22303c"/>' + Array.from({ length: 20 }, (_, i) => `<circle cx="${100 + (i % 4) * 200}" cy="${100 + Math.floor(i / 4) * 200}" r="60" fill="#8fb3d9"/>`).join(''))],
  ['sample/blocks.svg', svg('<rect width="800" height="1000" fill="#f4f1ea"/><rect x="80" y="120" width="380" height="380" fill="#1f3a5f"/><rect x="340" y="420" width="380" height="460" fill="#d94f30"/>')],
]
const url = new Map(FILES)

export const sampleMediaClient = {
  sample: true,
  buckets: () => [{ id: 'sample', label: 'Sample library' }],
  listMedia: async (prefix = '') => FILES
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, data]) => ({ key, size: data.length, contentType: 'image/svg+xml', lastModified: '2026-11-20T00:00:00Z' })),
  mediaUrl: (key) => url.get(key) ?? '',
  proxied: (u) => u,
}
