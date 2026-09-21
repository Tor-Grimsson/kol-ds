# tone-is-the-ground-axis — the ground vocabulary lives in Button's `variant`, so `tone` has one value

**Filed:** 2026-09-03 ← **kol-client-olina**
**Packages:** `@kolkrabbi/kol-component@0.175.0` — `src/utilities/tone.js`, `src/atoms/Button.jsx` · `@kolkrabbi/kol-theme@0.133.0` — `kol-components-molecules.css`
**Origin:** the user, on fxr's `/settings`: *"it would be best to not have to set every component but rather get a set with it already set"* — then, reading Button's variants: *"I thought you would set these colors as variants … that is 6 tones right?"*

## The finding

`tone` ships exactly one value:

```js
export const toneClass = (tone) => (tone === 'sunken' || tone === 'inverse' ? 'kol-tone-sunken' : '')
```

Everything else returns `''` — no class, fall through to the component's own base rule.
So `default` is not a tone, it is the absence of one, and what it renders depends on
which component you are looking at.

**The real ground vocabulary is in `Button`'s `variant`, and was never generalised.**
What the eight variants actually paint:

| variant | background | text | kind |
|---|---|---|---|
| `primary` | `surface-secondary` | `surface-on-primary` | a ground |
| `secondary` | `surface-on-primary` | `surface-primary` | a ground |
| `outline` | transparent + border | `surface-on-primary` | a ground |
| `ghost` | transparent | `oq-48` | a ground |
| `grey` | none at rest; `oq-16`/`oq-24` on hover/active | `surface-on-primary` | a ground |
| `nav` | transparent | `oq-80` | `ghost` + an `aria-current` rule |
| `danger` | `ui-error` | `ab-white` | **semantic** |
| `accent` | `accent-primary` | `accent-on-primary` | **semantic** |

Five of eight are ground-and-text choices. Because they live on `Button`, every other
component that needs the same grounds re-invents them: `Dropdown` and `.kol-control`
carry `--filled` / `--outline` / `--ghost` variants, `.kol-dd-panel` carries
`--primary` / `--grey` / `--outline` with *different* paints again. `sunken` is the one
ground that ever got promoted to a tone, and its own docstring says why — a control
beside a sunken Dropdown had no way to be *declared* rather than painted.

**Naming is offset by one and nothing says so.** `variant="primary"` paints
`surface-secondary`. The name tells you nothing about what it pairs with.

## The ask

### 1 — six tones

| tone | status | background | text |
|---|---|---|---|
| `primary` | new | `surface-secondary` | `surface-on-primary` |
| `secondary` | new | `surface-on-primary` | `surface-primary` |
| `outline` | new | the background, + 1px border | `surface-on-primary` |
| `ghost` | new | the background, no border | `oq-48` |
| `grey` | new | `oq-12` | `surface-on-primary` |
| `sunken` | ships | `surface-sunken` | `fg-96` |

Values are what the variants already paint, with one correction: `grey` has **no rest
background today** — only hover and active — so a grey Button is transparent at rest
while a grey control is filled. `oq-12` is the translucent wash the dropdown panel
already uses for grey, and being translucent it works over any background without
knowing it.

`default` survives as a **deprecated alias** for `primary` so no caller breaks. It
should not be documented as a choice.

### 2 — `outline` and `ghost` mean "the background", not "transparent"

A transparent trigger is fine; a **floating** surface is not. `.kol-dd-panel--outline`
currently hardcodes `background: var(--kol-surface-primary)`, so on a page whose
background is anything else, opening a dropdown changes the colour under it.

They should paint the background rather than let it through — same colour either way,
so opening changes nothing:

```css
.kol-tone-outline { --kol-tone-bg: var(--kol-surface-primary); }   /* the default */
.kol-dd-panel     { background: var(--kol-tone-bg); }
```

A page on another ground overrides `--kol-tone-bg` once. **Checked: the dropdown panel
is a DOM child of its trigger, not portalled**, so it inherits normally. `Modal` is the
only portalled floating surface and is its own surface by design.

### 3 — descendant scoping, so a set inherits its tone

The rules are element-scoped today — `.kol-btn.kol-tone-sunken`, `.kol-control.kol-tone-sunken`
— so the class must land **on** every control, and one that was not handed the prop
renders a different tone beside one that was. `SettingsScaffold` is as close as the
estate gets to a set, and all it does is forward one string to `ContentFilters`, which
forwards it again to its search field. Every other control on that page must be told
individually.

Descendant scoping fixes it without a context or an API break:

```css
.kol-tone-grey .kol-btn { … }     /* one class on the wrapper tones everything inside */
```

The per-component prop stays for exceptions. The wrapper sets `--kol-tone-bg` in the
same rule, so one class declares the tone **and** the background — the user's *"get a
set with it already set"*.

### 4 — what is NOT a tone

`danger` and `accent` stay `variant`s: they are semantic intent, not a ground.
`nav` retires into `ghost` plus its `aria-current` hover — the user's read, and the CSS
agrees (transparent, `oq-80` text, one extra state rule).

### 5 — migration

Ship the tones **beside** the variants. Each ground variant becomes an alias for its
tone, deprecated in `docs/operations/01-release/04-retirements.md`, retired in a later
pass once consumers have moved — the pattern already used for the card names, `AppShell`,
and `inverse`→`sunken`. Nothing breaks on the bump.

## Consumer status

Nothing worked around here. kol-client-olina's `apps/brand` is six-of-six on the
full-consumption greps and passes no `tone` anywhere; it adopts the wrapper form when
this ships. Filed because the user hit it reading fxr's `/settings` — this is an estate
question, not an olina one.

## Related

`page-family-is-not-a-set` and `page-header-one-masthead` (both 2026-09-03, closed) —
same shape of finding, one axis living in the wrong place and every consumer paying for
it.

## ✅ RESOLUTION — 2026-09-03 · kol-theme@0.134.0

Six tones, one mechanism — kol-theme 0.134.0 · kol-component 0.176.0 · kol-framework 0.40.0. A tone is a bundle of `--kol-tone-*` custom properties (rest · hover · press · pressed · what a floating surface of that tone paints), and every control reads its paint from them with its own old literal as the fallback — `.kol-btn`, the dropdown trigger, `.kol-control`, `.kol-dd-panel` fall back to primary, `.kol-icon-frame` to secondary, the theme-toggle variants, the view-toggle well and the open search shell to their own. Ask 3 for free: custom properties inherit, so one `kol-tone-grey` on a wrapper tones every control inside that carries no tone of its own; a control handed a variant or tone sets the properties on itself and wins. The ground variants are the same bundles under `:where()`, so `tone` beats `variant` on one element. Ask 2: `--kol-tone-panel-bg` — outline and ghost panels paint `--kol-tone-ground` (surface-primary unless the page sets it at its root) instead of hardcoding it. Three corrections to the ticket, on inspection: `grey` already had its `oq-12` rest fill; the dropdown panel IS portalled (FloatingPortal → body), so kol-component copies the trigger's resolved properties onto it on open — the cascade alone could not have served the ambient case; and `nav` stays a variant — it is `oq-80` ink against ghost's `oq-48`, so folding it would have dimmed every close button and rail row in the estate. `default` is not an alias of `primary`: it means inherit — an alias set on the element would block the inheritance ask 3 exists for. `danger` and `accent` stay variants. Verified with a computed-style matrix of 63 class combinations × rest / hover / active before and after: no regressions, and three sunken states the old element-scoped rules got wrong now follow the ladder. Law: docs/documentation/03-components/05-control-chrome.md → Tone.

**Remainder here:** none — kol-client-olina bump kol-theme@0.134.0 · kol-component@0.176.0 · kol-framework@0.40.0 (pin the numbers, not @latest); adopt the wrapper form — one kol-tone-* class on the settings page's root — and drop per-control tone props where the page tone covers them.

