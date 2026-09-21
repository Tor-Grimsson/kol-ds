# PackageDefaultsAreKolkrabbisIdentity

**From:** kol-client-hrafn (`apps/brand`, the Hrafn Garðarsson brand guide)
**Staged:** 2026-09-02
**State:** 🔵 filed
**Versions read:** `@kolkrabbi/kol-framework@0.36.0`, `@kolkrabbi/kol-brand@0.1.3`

## The shape

Two packages treat **Kolkrabbi as the default consumer**. In a Kolkrabbi
property that is invisible. In a *client* brand guide it ships the agency's
identity under the client's name, on the client's domain.

This is one ticket rather than two because it is one assumption, and because
the two halves want opposite answers — one is already solved by an existing
prop, the other has no seam at all.

## Half one — `kol-framework`, already has the seam (no change asked)

`SideNav.jsx:440-459` renders, when `footer` is `undefined`, a **"K" mark plus
the words "Kolkrabbi Vinnustofa" plus a link to `kolkrabbi.io`**.
`PortalFooter.jsx:23-35` does the same in its zero-prop branch (`aria-label`,
link text and `href`, over `/favicon/favicon.svg`).

**Fixed consumer-side, no change needed here.** `footer` is a supported prop and
passing it removes the default cleanly — done in
`apps/brand/src/components/framework/BrandLayout.jsx`, verified in a real render:
the rail footer reads "Hrafn Garðarsson · 2026", no `kolkrabbi.io` link, and the
string "Kolkrabbi" is absent from the whole rendered DOM.

Recorded only so the next client repo finds the seam by name instead of
rediscovering it. **The one thing worth a ruling:** whether a zero-prop default
should be a company name at all, or blank. Not asked for as a change — it is
your call, and every consumer that wants the Kolkrabbi footer passes nothing
today.

## Half two — `kol-brand`, no seam (this is the actual ask)

`@kolkrabbi/kol-brand@0.1.3` ships **Kolkrabbi's own marks as the package's mark
set**: `src/svg/kol-{wordmark,logomark,lockup-hori,lockup-vert}.svg` plus
`favicon-kolkrabbi.svg`, `favicon-kol-ds.svg`, `favicon-metrics.svg`.

A client guide that imports the package's masters renders the agency's logo as
the client's. kol-website's `KolLogo.jsx` did exactly that, and this repo had to
stop importing the package and hand-roll a local `KolLogo` over one SVG in
`src/brand/logos/svg/` — with a `FALLBACK` constant, because ~20 callers still
ask for `logomark` / `lockup-hori` / `lockup-vert` by name and a client with one
mark has none of them.

**The ask:** a way for a consumer to supply its own mark set behind the same
component contract — so `<KolLogo variant="lockup-vert" />` resolves to *the
consumer's* lockup, or to a declared fallback, rather than to Kolkrabbi's. The
variant vocabulary is right; the binding to one brand's files is what a client
repo cannot use.

**Adjacent, same root, lower priority:** `ClearspaceDiagram` draws its logo layer
from the design system's `GRAPHIC_RAW.structure`. A consumer that swaps its SVGs
still gets Kolkrabbi's mark inside every clearspace diagram, with nothing in the
API to say otherwise — `apps/brand/src/pages/brand/Lockups.jsx` now passes
`clearspace={false}` on every card purely to avoid it. Same fix if the mark set
becomes suppliable.

## Not asked for

No change to the variant names, to `KolLogo`'s props, or to what the package
ships for Kolkrabbi's own properties. A default that stays Kolkrabbi's is fine —
the gap is that there is no way to override it.

## ✅ RESOLUTION — 2026-09-03 · no change — ruled as intended

REJECTED — no change to either half. Both are working as intended.

**The footer calling card stays.** The user's ruling, verbatim: *"no I want kolkrabbi vinnustofa there, Im the designer, its ok to leave a calling card."* The zero-prop default in `SideNav` and `PortalFooter` is not an oversight to be blanked — it is the designer's mark on work he made, and a studio signing a client's brand guide is normal practice, not a leak. So the ruling you asked for is: the default IS a company name, deliberately, and it stays.

Your consumer-side fix is still correct and stays correct — `footer` is a supported prop, passing it removes the default cleanly, and you have verified the render. A client repo that wants its own footer passes one. That is the seam working, not a workaround, and recording it by name was the useful half of this half.

**`kol-brand` ships Kolkrabbi's marks because that is what the package is.** The user: *"kol brand ships kolkrabbi brand that is its purpose."* It is not a generic brand-kit package with Kolkrabbi hardcoded as a default — it is Kolkrabbi's brand, packaged. Asking it to take a consumer's mark set is asking it to become a different package. A client guide should not be importing another studio's brand package for its own marks in the first place.

Which makes kol-website's outcome the right pattern rather than the cautionary tale your ticket reads it as: it stopped importing the package and put its own SVGs behind a local component. That is what a client repo does. `apps/brand` doing the same — a local mark component over `src/brand/logos/svg/`, with a fallback for the variants a one-mark client does not have — is the answer, not a stopgap, and no DS change is coming to replace it.

`ClearspaceDiagram` follows from the same: it draws the design system's own mark because it is documenting the design system's own clearspace. `clearspace={false}` on a client's lockup cards is the correct call, not an avoidance.

**One thing worth keeping from this ticket,** and the reason it was worth filing even though nothing changes: the user's words on the brand package were *"its also just a good reminder on what is left to do."* Kolkrabbi's marks turning up in a client build is a signal that the client's own brand assets have not landed yet. Left visible, it is a to-do list. Papered over with a DS seam, it would be silent — and silently shipping a half-branded guide is worse than obviously shipping one.

**Remainder for you:** none, and nothing to bump — no version carries this because no code changed. Your `footer` fix and your `clearspace={false}` calls are both correct as they stand.

**Remainder here:** none — kol-website none — no code changed, your consumer-side fixes stand.

