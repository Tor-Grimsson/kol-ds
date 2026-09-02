# CardTagsNoVisibleFill — every card tag row is painted the page colour

**Filed:** 2026-09-01 · from **kol-website** (`apps/web`)
**Source:** kol-component `molecules/ContentText.jsx:247` · kol-theme `kol-components-molecules.css:318`
**Seen at:** `/stack`, `/stack/:slug`, `/work` — every `ContentCard` / `ContentRow` tag row

## The defect

`ContentText` renders every card tag as:

```jsx
<Tag key={i} variant="tertiary" size="sm">{t}</Tag>
```

and `tertiary` is:

```css
.kol-tag--tertiary {
  background-color: var(--kol-surface-primary);   /* ← the page's own colour */
  color: var(--kol-fg-80);
  border-color: transparent;
}
```

A fill that equals the page background, with a transparent border. On any card
that sits directly on `surface-primary` — which is all of them — the chip is
**invisible**: the tags read as loose `#WORDS` floating in the layout with no
object around them. Second report from the user in one day: *"but the tags are
without background? why?"* → then *"still no background on tags."*

`tertiary` was minted on my own ticket (`TagTertiary`, 08-27) for the `/work`
ROW — *"no outline, mono voice, fg-80"* — and the fill was never the point there
because it matched a filled row. As the default for **every** card tag it
removes the chip entirely.

## What the estate already has

| variant | fill | reads as |
|---|---|---|
| `primary` | `color-mix(surface-on-primary 16%, transparent)` | a chip — a soft ink wash |
| `secondary` | `surface-primary` + `border-default` | outlined chip |
| `tertiary` | `surface-primary`, no border | **invisible on-surface** |
| `inverse` | `surface-on-primary` | solid ink |

`primary` is the one that reads as a tag on a plain card.

## Why it can't be fixed here

The variant is a literal inside `ContentText`. `ContentCard`/`ContentRow` expose
per-slot class seams, but the type protocol says those REPLACE the class — they
cannot reach a child component's `variant` prop.

## Ask

Either default card tags to `primary`, or add a `tagVariant` seam on
`ContentCard`/`ContentRow` so a consumer can choose. I would rather the default
changed: an invisible chip is not a deliberate look on a plain surface, and
every consumer rendering cards has the same problem.

If `tertiary` must stay the default for the filled `/work` row, then the fix is
per-variant — filled rows keep `tertiary`, cards on `surface-primary` take
`primary`.

## What stays here

Nothing. The consumer passes `tags` and takes whatever the family draws.

## Remainder here once it ships

bump; re-check `/stack` at 390 — the tag row should read as chips, not as bare
`#WORDS`.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.158.0

Your preferred answer, with the per-variant half built in so the /work ruling survives: ContentText takes tagVariant, default primary — the soft ink wash, the one that reads as a chip on a plain surface — and ContentCard / ContentRow derive it from the BOX: a solid surface fill (a --kol-surface-* token) keeps tertiary, which is exactly the filled /work row the variant was minted for on 08-27, and everything else — article cards on the page, washed boxes — takes primary. Both expose tagVariant to override. You were right that tertiary on surface-primary is not a look; the fill was never the point on the row and it removed the chip everywhere else. Verified in a real render: the article card's chips are kol-tag--primary at a 16% ink wash; the work row's chips stay kol-tag--tertiary on its surface-secondary fill. Tarball checked.

**Remainder here:** none — kol-website bump kol-component@0.158.0 and re-check /stack at 390 — the tag row reads as chips; /work rows unchanged.

