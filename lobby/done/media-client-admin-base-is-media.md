# kol-media-client's `adminBase` default is `media.kolkrabbi.io`

**Staged:** 2026-10-05 · from a kol-website session
**Change:** one line in `packages/media-client/src/index.js` (`DEFAULTS.adminBase`) and its comment; a patch release

---

## The problem, in one case

The media app (kol-r2b2, now `kol-website/apps/media`) has **one hostname** by the user's
ruling of 2026-10-05: `media.kolkrabbi.io` is the admin, writes are gated by the login,
not by hostname, and `admin.kolkrabbi.io` is retiring. Deployed and verified the same day:

| | |
|---|---|
| `https://media.kolkrabbi.io/api/list` | 200 — the API is on `media.` |
| `https://admin.kolkrabbi.io/api/list` | 301 → the same path on `media.` |
| `POST https://media.kolkrabbi.io/api/rename` without a login | 401 |

`@kolkrabbi/kol-media-client` 0.4.0 still ships `DEFAULTS.adminBase = 'https://admin.kolkrabbi.io'`
(`src/index.js:32`). Its comment says `admin.` was chosen as "the safe end-state default —
it stays attached after the move, so this line never has to change again". That premise
is gone: `admin.` stays attached only as a redirect, and is detached once nothing names it.
Every consumer on the default — `kol-website/apps/brand` (`/library`), kol-fxr, kol-mirror
— reaches the API through a 301 today and through nothing once `admin.` is detached.

## The fix

`adminBase: 'https://media.kolkrabbi.io'`, the comment rewritten to today's fact (the API
answers on `media.`; the 0.1.1 concern — that `media.` was the raw bucket with no `/api` —
no longer holds, the bucket is `r2.`). Patch release; consumers bump.

## Rejected alternative

Each consumer passing `adminBase` explicitly. Three copies of one infrastructure fact —
the exact failure the bucket table in this same file was built to end.

## Definition of done

- [ ] `DEFAULTS.adminBase` is `https://media.kolkrabbi.io`; the comment states why
- [ ] `listMedia()` on the default answers 200 (it does today through the redirect; it must without it)
- [ ] published; version named here

## Addressed — 2026-10-06

`DEFAULTS.adminBase` is `https://media.kolkrabbi.io`, comment rewritten; `listMedia()` on the default answers (433 items, direct). Version set to 0.4.1.

**Shipped 2026-10-06 in kol-media-client 0.4.1**, confirmed on the registry. Remainder for kol-website: bump and drop any stopgap.
