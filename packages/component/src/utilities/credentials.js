/**
 * credentials — which file URLs a preview fetches WITH the sign-in cookie (ArticleRendererHomeHeroSelection, kol-website
 * 2026-10-28 — a PDF on private.kolkrabbi.io answered 401 in Quick Look: `PdfPage` and `KindPreview` fetch the file
 * themselves, and a plain fetch sends no cookie, while an <img> or a download does).
 *
 * A REGISTRY OF ORIGINS, not "every cross-origin URL": a credentialed request to a public CDN that answers
 * `Access-Control-Allow-Origin: *` is refused by the browser, so sending the cookie everywhere would break every public
 * file. An origin is registered by whoever knows it is signed in — `MediaLibrary` registers its signed-in bucket's
 * `publicBase` (kol-media-client marks the private bucket `signedIn`), an app registers its own once at boot. A
 * `credentials` prop on `KindPreview` / `PdfPage` overrides per call.
 *
 *   import { registerCredentialedOrigin } from '@kolkrabbi/kol-component'
 *   registerCredentialedOrigin('https://private.kolkrabbi.io')
 */
const ORIGINS = new Set()

const originOf = (url) => {
  try { return new URL(url, typeof location !== 'undefined' ? location.href : 'http://localhost').origin } catch { return null }
}

export function registerCredentialedOrigin(url) {
  const o = originOf(url)
  if (o) ORIGINS.add(o)
}

/* 'include' for a registered origin, else undefined (the browser's same-origin default) */
export function credentialsFor(url, override) {
  if (override) return override
  const o = originOf(url)
  return o && ORIGINS.has(o) ? 'include' : undefined
}
