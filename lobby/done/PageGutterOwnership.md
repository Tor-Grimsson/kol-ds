# PageGutterOwnership — the page gutter has no owner, so no two pages share a left edge

**Staged:** 2026-08-30 · from **kol-website**
**Nature:** systemic layout defect, found by audit. Full measurements:
`kol-website/.kol/llm-context/plans/2026-08-30-gutter-and-container-audit.md`

## Why it went out

The user spotted a gutter difference between `/work` and `/foundry` on a skim and
asked the right question: *"I shouldn't have to open dev tools to check this,
this should be somewhat solved for."* Every public route was then measured in a
same-origin iframe at 1280 and 1920 — `getBoundingClientRect` +
`getComputedStyle`, no eyeballing.

The gutter comes from **three different layers**, none of them consistently.

## 1. Three sources

| Route | Gutter comes from | Cap's own padding |
|---|---|---|
| `/work` · `/prints` | the page container (`px-4 md:px-6`) | 24 |
| `/foundry` · `/foundry/typefaces/*` | an **ancestor** | 0 |
| `/studio` · `/foundry/licensing` | an ancestor, at **56** | 0 |
| `/metrics` | `main` (`px-3`, 12px) | no ruled container |
| `/chess` · `/apparat` | `main` (24) | no ruled container |
| `/workshop` | nothing | no ruled container |

At 1280 three of these land their chrome at 24 and look correct — by three
different mechanisms, so nothing holds them together.

## 2. The ruled width is a ceiling, not a measure

`--kol-container-max` itself is fine (kol-framework's ladder: `100%` → 1400 →
1600 at ≥1280 → 1800 at ≥1920). What differs is what pages do inside it.

**At 1920, cap = 1800:**

| Route | Cap pad | Content width | Chrome left |
|---|---|---|---|
| `/work` | 24 | **1752** | 84 |
| `/prints` | 24 | **1752** | 84 |
| `/foundry` | 0 | **1800** | 60 |
| `/foundry/typefaces/malromur` | 0 | **1800** | **108** |

Two pages honour 1752, two honour 1800 — and **the two foundry pages disagree
with each other by 48px** on containers whose classes are identical.

## 3. Rows pad again on top, and disagree

| Variant | Row pad | Text edge at 1280 |
|---|---|---|
| `showcase` | 16 | 40 |
| `showcaseCanvas` | 24 | 48 |

So two pages can align their containers and still land their text 8px apart.
This is what was visible in the skim.

## 4. Vertical is the same story

`main` top padding: **224** on `/work` and `/prints`, **0** elsewhere, **80** on
`/metrics`. The first two match only because they were hand-matched on 08-29.
Nothing enforces it.

## Asks

1. **One owner.** The ruled container supplies cap **and** gutter together, as
   one component or one class — a page must not be able to get one without the
   other.
2. **Rule whether the gutter is inside or outside the cap.** This is the
   1752-vs-1800 split. Either answer is defensible; both at once is not.
3. **Rows compose with the page gutter rather than stacking on it** — a row
   inside a padded container currently double-indents.
4. **`showcase` and `showcaseCanvas` agree on their pad** (16 vs 24), or the
   reason is written into the source.
5. **Rule the vertical rung too** — a page's top offset is as unowned as its
   side gutter.

## Not the DS's

`/metrics`, `/workshop`, `/chess` and `/apparat` render no ruled container at
all. Whatever is decided will not reach them until kol-website adopts it there;
that adoption is ours, and is recorded on our side.

## Definition of done

- [ ] one owner for cap + gutter, and a page cannot take one without the other
- [ ] inside-or-outside ruled and applied
- [ ] row pad composes rather than stacks; the two showcase pads reconciled
- [ ] kol-website's page containers all resolve to one content width per breakpoint

## ✅ ANSWERED — 2026-08-30 · the owner already ships

Nothing was built, because `.kol-page` (kol-framework.css:340) has been the
owner since the width family was unified 2026-07-30:

```css
.kol-page {
  max-width: var(--kol-container-max);   /* the shell ladder */
  margin: 0 auto;
  padding: 64px var(--kol-pad-section-x); /* 20 → 32 → 48 */
}
```

Against the five asks:

| ask | answer |
|---|---|
| 1 · one owner, cap and gutter inseparable | **exists** — one class, both properties. A page cannot take one without the other because they are the same rule |
| 2 · inside or outside the cap | **already ruled: INSIDE.** Padding sits within `max-width`, so content = cap − 2× gutter. At 1920: 1800 − 96 = 1704 |
| 5 · the vertical rung | **already owned** — the same declaration's `64px` |
| 4 · showcase 16 vs 24 | **not drift** — both are user rulings on their own surfaces: `/work` at 16 (*"16px padding, that's fine"*, 2026-08-27) and the typeface column at 24. Converging them is a new ruling, not a fix |
| 3 · rows compose rather than stack | row padding is the row's internal inset and is deliberate; a row inside `.kol-page` is meant to sit inside the page gutter. If a listing wants to bleed, `.kol-full-bleed` is the ruled escape |

### So the defect is adoption, not the design

Every measurement in the audit is a page **not using `.kol-page`**: `/work` and
`/prints` hand-roll `px-4 md:px-6` (16/24, hence 1752 not 1704), `/foundry` and
`/studio` inherit from an ancestor, `/metrics` `/chess` `/apparat` `/workshop`
render no ruled container at all.

`05-layout-systems.md` already names this as the anti-pattern: *"hardcoded
`max-w-[Npx]` at call sites — if no cap fits, file it."* The two foundry pages
disagreeing by 48px on identical classes is that, exactly.

**Remainder here:** none. This is kol-website's adoption.
