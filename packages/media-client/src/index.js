/**
 * @kolkrabbi/kol-media-client — read-only client for the kol-media CDN.
 *
 * Consolidates the byte-identical mediaLibrary.js copies from kol-labs-single
 * and kol-design-editor into one published package. Plain ESM, no React.
 *
 *   import { listMedia, mediaUrl } from '@kolkrabbi/kol-media-client'
 *   const objs = await listMedia('photoshoot/')  // [{ key, contentType, size }]
 *   <img src={mediaUrl(obj.key)} />              // https://media.kolkrabbi.io/<key>
 *
 * The contract (owned by kol-media-admin — bump this package when it changes):
 *   GET <adminBase>/api/list?prefix=<folder> → { objects: [{ key, contentType, size }] }
 *   public bytes: <publicBase>/<key>
 *
 * Canvas consumers (getImageData / export reads pixels): the CDN sends no CORS
 * headers, so cross-origin loads taint the canvas — load through `proxied(url)`
 * and give the consumer host a same-origin /media/* rewrite to the CDN
 * (vite proxy in dev, a host rewrite in prod). The rewrite is consumer config,
 * not this package's job.
 *
 * NOT this package: kol-media-admin's authenticated write API (upload / rename /
 * delete with Basic Auth). That client stays in the admin app — don't embed
 * write auth in a browser-shipped package.
 */

const DEFAULTS = {
  adminBase: 'https://admin.kolkrabbi.io',
  publicBase: 'https://media.kolkrabbi.io',
  proxyPath: '/media/',
}

// ── Pure helpers (base-independent) ───────────────────────────────

export const isImageType = (ct) => !!ct && ct.startsWith('image/')
export const isVideoType = (ct) => !!ct && ct.startsWith('video/')

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

// ── Factory ────────────────────────────────────────────────────────

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Build a client bound to a media host pair. Omit options for the production
 * Kolkrabbi hosts (the common case — the bare named exports below come from
 * this default instance).
 */
export function createMediaClient({
  adminBase = DEFAULTS.adminBase,
  publicBase = DEFAULTS.publicBase,
  proxyPath = DEFAULTS.proxyPath,
} = {}) {
  const cdnPrefix = new RegExp(`^${escapeRe(publicBase)}/`)

  /** Public URL for a bucket key. */
  const mediaUrl = (key) => `${publicBase}/${key}`

  /* Rewrite a public CDN URL to the same-origin proxy path so canvas
   * consumers aren't CORS-tainted. Non-CDN URLs (data:, blob:, already
   * proxied) pass through untouched. */
  const proxied = (url) => url.replace(cdnPrefix, proxyPath)

  /* List bucket objects, optionally under a folder prefix. Throws on a
   * non-OK response so callers can show an error. */
  async function listMedia(prefix = '', { signal } = {}) {
    const params = new URLSearchParams()
    if (prefix) params.set('prefix', prefix)
    const res = await fetch(`${adminBase}/api/list?${params}`, { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data.objects || []
  }

  return { adminBase, publicBase, mediaUrl, proxied, listMedia }
}

// Default instance on the production hosts — existing consumers migrate by
// changing only the import specifier.
export const mediaClient = createMediaClient()
export const { mediaUrl, proxied, listMedia } = mediaClient

// ── Optional: library upload via a consumer-side proxy ────────────
// The consumer host must run a server proxy holding ADMIN_PASSWORD (dev Vite
// plugin / Vercel function) — the password header below gates that proxy and
// never reaches the bucket. Prompted once per tab, cached in sessionStorage;
// a 401 clears it so a rotated password re-prompts. Browser-only.

const ADMIN_PW_KEY = 'kol_admin_pw'
function adminPassword() {
  let pw = sessionStorage.getItem(ADMIN_PW_KEY)
  if (!pw) {
    pw = window.prompt('Admin password (to upload to the library):') || ''
    if (pw) sessionStorage.setItem(ADMIN_PW_KEY, pw)
  }
  return pw
}

/** Upload a blob to the media library via the consumer's upload proxy.
 *  `key` is the bucket path, e.g. "radar/dither-1718.png". */
export async function uploadToLibrary(blob, key, { proxyPath = '/api/library/upload' } = {}) {
  const type = blob.type || 'application/octet-stream'
  const r = await fetch(`${proxyPath}?key=${encodeURIComponent(key)}&type=${encodeURIComponent(type)}`, {
    method: 'POST',
    headers: { 'x-admin-password': adminPassword() },
    body: blob,
  })
  if (r.status === 401) { sessionStorage.removeItem(ADMIN_PW_KEY); throw new Error('401 — wrong admin password, try again') }
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  return r.json()
}
