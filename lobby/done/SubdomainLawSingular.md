# Subdomain law — kolkrabbi.io subdomains are one word, singular

**Staged:** 2026-10-28 · from a kol-website session
**Change:** docs only — no package

---

## The problem, in one case
Subdomains drifted between singular and plural (`brand.` · `media.` beside `metrics.`). The user ruled 2026-10-28: **one word, singular, naming the thing**; the app folder, hosting project and subdomain carry the same word (`apps/metric` · `kol-metric` · `metric.kolkrabbi.io`); a renamed subdomain keeps its old name as a permanent redirect. kol-website renames `metrics.` → `metric.` and ships the records site as `record.`.

The law and the live table live in kol-website `docs/operations/02-infrastructure/01-hosting-dns.md` § Subdomain law. Announced in the shared LLM_RULES BULLETIN the same day.

## The fix
- `docs/documentation/04-compositions/16-app-anatomy.md` and `docs/operations/07-apps-tier/INDEX.md` — where they name kolkrabbi.io subdomains, link the law and use it for any new one.
- Any DS doc or app that names `metrics.kolkrabbi.io` or a `records` subdomain moves to `metric.` / `record.`.

## Definition of done
- [ ] the two docs cite the law
- [ ] no DS doc names a plural kolkrabbi.io subdomain except `labs.` (kol-labs' own call)

## ✅ RESOLUTION — 2026-10-28 · kol-ds-ui docs (no package)

docs/operations/07-apps-tier/INDEX.md and docs/documentation/04-compositions/16-app-anatomy.md (§ The tools) state the law (one word, singular, naming the thing; folder = hosting project = subdomain; a renamed subdomain keeps a permanent redirect; labs. is kol-labs' call) and cite kol-website docs/operations/02-infrastructure/01-hosting-dns.md § Subdomain law. The one plural in the repo, metrics.kolkrabbi.io in the showcase's MetricsDashboard preview data, is metric.kolkrabbi.io now; no records. subdomain was named anywhere. Every other kolkrabbi.io subdomain named in the repo is already singular.

**Remainder here:** none — kol-website none.

