# Workshop wordmark — asset spec (source for the SVG)

Not an SVG yet — this is the **typographic treatment**, preserved so it isn't
lost and can be traced to `wordmark-workshop.svg` later. It's a font set at a
specific size in a specific way; that makes it an asset.

| | |
|---|---|
| **String** | `Workshop` |
| **Font** | JetBrains Mono (`var(--kol-font-family-mono)`) |
| **Size** | 13px |
| **Weight** | 500 |
| **Letter-spacing** | 0.02em |
| **Tone** | foreground / `currentColor` |

**Eyebrow variant** (section label, e.g. `WORKSHOP` in the docs shell): same
mono, 11px, weight 500, `text-transform: uppercase`, letter-spacing 0.08em.

Treatment source: `showcase/src/workshop/shell/shell.css` (`.shell-header-logo`).

**To make the SVG:** set the string in JetBrains Mono at the metrics above,
convert text → outlines, export to `wordmark-workshop.svg`, and drop it in this
folder — `<Asset name="wordmark-workshop" />` picks it up automatically.
