# kol-media-client: the one sign-in and the private bucket

**Staged:** 2026-10-28 · from a kol-website session
**Change:** kol-media-client (minor) · MediaLibrary only if the client change is not enough

---

## The problem, in one case
kol-website's media API (`media.kolkrabbi.io`) now has ONE sign-in for every kolkrabbi.io subdomain and a fourth bucket:

- `POST /api/login { password }` sets `kol_session` (HMAC-signed expiry) on `.kolkrabbi.io`, `SameSite=None; Secure; HttpOnly`. `GET /api/login` → `{ signedIn }`, `DELETE` signs out. Signed-out pages go to `https://media.kolkrabbi.io/signin?next=<url>`. Source: kol-website `apps/media/functions/api/_session.js`, `login.js`, `signin.js`.
- Bucket `private` = R2 `kol-private`: same D1 rows and permanent keys as `r2`, full verbs (upload · rename · move · delete), files served signed-in only at `https://private.kolkrabbi.io/<storageKey>`. `/api/list?bucket=private` answers only signed in; every write takes `bucket`.
- Writes accept the cookie or Basic. CORS is credentialed for `https://*.kolkrabbi.io` and `http://localhost:*`.

`createMediaClient`'s `listMedia` fetches without credentials, so an app on another subdomain embedding `MediaLibrary` can never see the private bucket, and `KOL_BUCKETS` has no `private` row. media itself (same origin) already works — it extends the client in `apps/media/src/App.jsx` + `src/lib/session.js`.

## The fix
- `listMedia` (and any write seam the package owns) sends `credentials: 'include'`.
- `KOL_BUCKETS.private = { id: 'private', label: 'R2 · private', publicBase: 'https://private.kolkrabbi.io', proxy: false, writable: true, signedIn: true }`.
- A session helper on the client: `session()` → `{ signedIn }`, `signIn(password)`, `signOut()`, `signInUrl(next)`, against `adminBase/api/login` and `/signin`.
- `buckets()` leaves out `signedIn: true` rows until `session()` says signed in, so `MediaLibrary`'s Store dropdown shows Private only then.

## Definition of done
- [ ] an app on another kolkrabbi.io subdomain, signed in, lists and opens files in `private` through `MediaLibrary`
- [ ] signed out, the same app shows no Private row
- [ ] kol-ds-ui's apps/media-fixture shows the row behind a fake session

## ✅ RESOLUTION — 2026-10-28 · kol-media-client@0.7.0 · kol-component@0.306.0

kol-media-client 0.7.0: KOL_BUCKETS.private (R2 kol-private, https://private.kolkrabbi.io, writable, signedIn: true); session() → { signedIn }, signIn(password), signOut(), signInUrl(next) against <adminBase>/api/login and /signin; buckets() leaves out signedIn rows until session() says signed in; listMedia sends credentials: 'include' for a signedIn bucket only (one deviation from the ticket: a credentialed request to a host answering ACAO * fails in the browser, so public lists stay uncredentialed); a client with no signedIn bucket never calls the login API. Selftest: 23 checks. kol-component 0.306.0: MediaLibrary asks client.session() once on mount and re-reads buckets(), so Private shows in the Store dropdown only signed in. apps/media-fixture: a fake session (signed in by default) and an empty private bucket; R2 · private shows in media-hub. Not tested here: the live cross-subdomain cookie.

**Remainder here:** none — kol-website bump kol-media-client to 0.7.0 and kol-component to 0.306.0; build clients with buckets: true (or with the private row); check the live sign-in from a second kolkrabbi.io subdomain.

