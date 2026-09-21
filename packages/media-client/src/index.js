/**
 * @kolkrabbi/kol-media-client — read-only client for the kol-media CDN.
 *
 * Consolidates the byte-identical mediaLibrary.js copies from kol-labs-single
 * and kol-design-editor into one published package. Plain ESM, no React.
 *
 *   import { listMedia, mediaUrl } from '@kolkrabbi/kol-media-client'
 *   const objs = await listMedia('photoshoot/')  // [{ key, contentType, size }]
 *   <img src={mediaUrl(obj.key)} />              // https://r2.kolkrabbi.io/<key>
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

// adminBase stays admin. until media.kolkrabbi.io actually fronts the Pages app.
// 0.1.1 shipped it as media. prematurely: that hostname is still the R2 bucket,
// which serves no /api, so listMedia() 404s on it. admin. is also the safe
// end-state default — it stays attached after the move, so this line never has
// to change again. publicBase is the one that genuinely moved (R2 → r2.).
const DEFAULTS = {
  adminBase: 'https://admin.kolkrabbi.io',
  publicBase: 'https://r2.kolkrabbi.io',
  proxyPath: '/media/',
}

/**
 * THE BUCKET TABLE (MediaClientBucketTable, kol-fxr + kol-mirror 2026-08-28).
 * It shipped as a consumer's job and was immediately copied byte-for-byte into
 * two of them — and the duplicated fact is not a label, it is **which store
 * sends `Access-Control-Allow-Origin`**, i.e. which one taints a canvas when
 * loaded directly. That is kol-r2b2's infrastructure state, it changes without
 * this repo hearing, and it changed the day after the table existed twice.
 *
 * The failure is silent and asymmetric, which is why it belongs in one place:
 *   stale `proxy: true`  → a pointless extra hop; everything still works
 *   stale `proxy: false` → the canvas is tainted and `getImageData` THROWS on
 *                          the first read — every photo filter, the whole
 *                          effect chain and every export path in kol-fxr
 *
 * ⚠ `r2.proxy` STAYS `true` even though `r2.kolkrabbi.io` has sent
 * `access-control-allow-origin: *` since 2026-08-27 (verified with curl). The
 * header is on the RESPONSE, not the object: anything already in a user's cache
 * from a pre-policy load stays non-CORS and still taints, however the URL
 * behaves now. `crossOrigin="anonymous"` is the fix — it partitions the cache
 * so the browser refetches instead of reusing the tainted entry — and it must
 * be in place BEFORE the proxy comes off. kol-r2b2's sequence, which both
 * consumers follow: attribute first behind the proxy → one surface direct →
 * the rest → delete the rewrites. Flipping this flag is a deliberate release
 * with this paragraph next to it, never a default that quietly lands.
 */
export const KOL_BUCKETS = {
  r2:      { id: 'r2',      label: 'R2 · media',   publicBase: 'https://r2.kolkrabbi.io',  proxy: true  },
  b2:      { id: 'b2',      label: 'B2 · website', publicBase: 'https://b2.kolkrabbi.io',  proxy: false },
  b2vault: { id: 'b2vault', label: 'B2 · vault',   publicBase: 'https://b2v.kolkrabbi.io', proxy: false },
}

// ── Pure helpers (base-independent) ───────────────────────────────

export const isImageType = (ct) => !!ct && ct.startsWith('image/')
export const isVideoType = (ct) => !!ct && ct.startsWith('video/')

export function formatSize(bytes) {
  /* a sizeless object renders NOTHING, not "null B" (kol-fxr 2026-08-28): the
   * first comparison is `null < 1024`, which is true, so the guard has to come
   * before it. fxr's hand-rolled copy had this and lost it on adopting 0.2.0 —
   * the guard belongs here so the next consumer cannot lose it the same way. */
  if (bytes == null || !Number.isFinite(bytes)) return ''
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
  /* ONE CLIENT, N BUCKETS (MediaLibraryPages, kol-monitor/kol-r2b2 2026-08-27): a
   * table `{ id: { id, label, publicBase, proxy, writable } }` so a consumer's
   * bucket dropdown reaches `R2 · media`, `B2 · website`, `B2 · vault` through
   * the one client. `listMedia` sends `bucket=<id>` (kol-r2b2's worker takes it
   * on /api/list); `mediaUrl(key, id)` builds on that bucket's publicBase.
   *
   * FOUR VALUES (MediaClientBucketTable, 2026-08-28; the ARRAY added 2026-09-03,
   * one-bucket-consumer from kol-client-olina — the table is the package's, see
   * KOL_BUCKETS above):
   *   `null` (default)  today's single bucket — nothing existing breaks
   *   `true`            KOL_BUCKETS as shipped
   *   an object         KOL_BUCKETS with these merged in, per id — a label, an
   *                     extra bucket, a `writable` flag. A consumer overrides;
   *                     it does not restate. Passing the canonical three
   *                     verbatim (what both consumers do today) merges to
   *                     exactly itself, so adoption is a deletion, not a swap.
   *   an ARRAY          EXACTLY these, nothing merged. The object form has no
   *                     value meaning "mine and no others", so a client that is
   *                     not Kolkrabbi could not describe itself: olina passed
   *                     one bucket and its admin rendered three, `B2 · website`
   *                     and `B2 · vault` among them — Kolkrabbi's buckets on a
   *                     client's domain. The array reads as THE LIST, which is
   *                     what a one-bucket consumer means. Entries carry their
   *                     own `id`; a missing one falls back to the array index.
   *                     Merge behaviour for the object form is untouched. */
  buckets = null,
} = {}) {
  const cdnPrefix = new RegExp(`^${escapeRe(publicBase)}/`)
  const merged = buckets === true ? KOL_BUCKETS
    /* the array is EXACT — KOL_BUCKETS is never consulted */
    : Array.isArray(buckets) ? Object.fromEntries(
        buckets.map((b, i) => [b.id ?? String(i), b])
      )
    : buckets ? Object.fromEntries(
        [...new Set([...Object.keys(KOL_BUCKETS), ...Object.keys(buckets)])]
          .map((id) => [id, { ...KOL_BUCKETS[id], ...buckets[id] }])
      )
    : null
  const table = merged ? Object.fromEntries(Object.entries(merged).map(([id, b]) => [id, { id, ...b }])) : {}
  /* the proxy decision is the TABLE's, not the URL's: a bucket that sends CORS
   * is passed through even though its host is a CDN we could rewrite. Longest
   * prefix first, so a bucket on a sub-path of another still matches its own. */
  const rewrites = Object.values(table)
    .filter((b) => b.publicBase)
    .map((b) => ({ re: new RegExp(`^${escapeRe(b.publicBase)}/`), proxy: b.proxy !== false }))
    .sort((a, b) => b.re.source.length - a.re.source.length)

  /** Public URL for a bucket key — on a named bucket's own host when the table names it. */
  const mediaUrl = (key, bucket) => `${table[bucket]?.publicBase ?? publicBase}/${key}`

  /** The buckets this client can list — `[]` without a table. */
  const bucketList = () => Object.values(table)

  /* Rewrite a public CDN URL to the same-origin proxy path so canvas
   * consumers aren't CORS-tainted. Non-CDN URLs (data:, blob:, already
   * proxied) pass through untouched — and so does a bucket the table marks
   * `proxy: false`, which is what makes that flag load-bearing here instead of
   * a note the consumer has to read. Without a table this is the old
   * single-prefix rewrite, unchanged. */
  const proxied = (url) => {
    if (!rewrites.length) return url.replace(cdnPrefix, proxyPath)
    const hit = rewrites.find((r) => r.re.test(url))
    if (!hit) return url
    return hit.proxy ? url.replace(hit.re, proxyPath) : url
  }

  /* List bucket objects, optionally under a folder prefix. Throws on a
   * non-OK response so callers can show an error. */
  async function listMedia(prefix = '', { signal, bucket } = {}) {
    const params = new URLSearchParams()
    if (prefix) params.set('prefix', prefix)
    if (bucket) params.set('bucket', bucket)
    const res = await fetch(`${adminBase}/api/list?${params}`, { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data.objects || []
  }

  return { adminBase, publicBase, mediaUrl, proxied, listMedia, buckets: bucketList }
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
