# AppCardBackCover

**Staged:** 2026-10-24 · from a kol-monitor session
**Change:** a second cover on the `app` card (and the Hub's Home cards), revealed on hover. Three treatments, so the user can pick by seeing them

---

## The problem, in one case
Monitor's patch covers are the patch's OUTPUT now (`public/previews/patches/*.png`, the output canvas, running). The rack screenshots they replaced, the patch as you'd build it, are still worth showing. The user wants both on one card: the output in front and the rack revealed on hover.

The card can't do it. `media` is one element. `flip` (`ContentCard.jsx:421`) turns the media 180° on `selected` with `backfaceVisibility: hidden` and no back face, so a turned card shows nothing. It's driven by `selected`, which also sets the selected border and `data-selected`, so a consumer can't put it on hover without the card also reading as selected. Home's cards are drawn by `HubHome` from a `cover` string, so a consumer can't swap the media there even by hand.

## The fix: `back` (a second cover) + `reveal` (how it shows)
`back`: a src (or node), the other cover, passed as `cover` is (on the `app` item, on Hub file data, on `toCard`). Absent `back` = today's card, so fxr and mirror move nothing.

`reveal` picks how the back shows on hover (and on focus-visible; on touch, decide: long-press or none):

| `reveal` | what turns | notes |
|---|---|---|
| `flip-image` | the media only: front = cover, back = `back`, rotateY 180° | the existing flip's turn (0.4s ease-out, preserve-3d) with a real back face; the text plate stays put; the download/mark corner controls stay on top, unflipped |
| `flip-card` | the whole card: front = today's card, back = `back` filling the card (title on the back too, or bare; your call, say which) | |
| `hover` | the media swaps in place, no motion (or a quick cut) | the user said "not fade" for the default, so if this one animates, a cut or a slide, not an opacity crossfade |

Hover drives it, not `selected`: the selected border/state must not change on hover. Respects `prefers-reduced-motion` (both flips become the in-place swap).

Show all three side by side in the `app` card showcase / `apps/rack-hub` with monitor's real pairs (assets below) so the user can choose. The losers can stay as props or be cut after his ruling.

## Assets
`_assets/2026-10-24-app-card-back-cover/`: `output/<name>.png` (the fronts, 368×652-ish output frames) and `rack/<name>.png` (the backs, full-rack screenshots, ~3528×3174, so the cover fit matters: cover-crop at `--kol-media-focus` top left like the old rack previews). 46 rack shots vs 41 presets: `burst` and a few others are retired presets, so pair by name and skip the unmatched.

## Rejected alternative
Monitor wrapping the card media in its own hover node. It works only on Library/Create (Home's media isn't the consumer's), and it's a card behaviour that fxr (file thumbnails vs renders) and mirror would want too.

## Definition of done
- [ ] `back` + `reveal="flip-image" | "flip-card" | "hover"` on the `app` card; HubHome file data carries `back`
- [ ] hover/focus reveals; `selected` unaffected; reduced motion respected
- [ ] all three in the showcase with monitor's pairs, for the user's pick
- [ ] Published; kol-monitor's receipt names the version and the user's pick

## 🟠 ADDRESSED — 2026-10-24 · built, unpublished, the pick is his

- `ContentCard back` (src | node, as `media`) + `backReveal="flip-image" | "flip-card" | "hover"` — default `flip-image`
  until the ruling. **Not named `reveal`:** that prop is the canvas card's overlay node already; a string on it would
  be one prop with two types. `back` on `toCard` flows through `CatalogPage`; `HubHome` maps a file's `back`.
- Hover and `:focus-visible` reveal it; `selected` is never read (the walk: `data-selected` null → null across all three,
  and `true` with SELECTED on). Reduced motion drops the turn's transition (0s measured), so both flips are the cut.
  Touch: none — the front is the card. `flip-card`'s back is bare; its cost (every control turns away) is named on the round.
- The choreography is kol-theme's (`.kol-card[data-back]`, kol-animation.css). A src back is cover-cropped at
  `--kol-media-focus` (monitor binds `top left`).
- **Round 17** `showcase/src/open-questions/2026-10-24.jsx` — the three treatments on four of monitor's pairs, SELECTED
  toggle. `apps/rack-hub`: every shipped patch and the four Home saves carry `back: /previews/racks/<name>.png` (the 42
  matched rack shots resized to 1600 into the root `public/previews/racks/`; `burst` · `init-test` · `sonar` · `starter` have
  no patch and sit in `_tmp/2026-10-24-app-card-back-cover/unmatched-racks/`).
- Walk `_tmp/2026-10-24-app-card-back-cover/walk.mjs`: 19/19 — round 17 and rack-hub Library (41) and Home (4), the
  download control hit-testable while the back shows, console clean. Docs: `06-content-card-system.md`, `ContentCard.mdx`
  (`back`, `backReveal`), the ContentCard preview's `back` state; Unreleased lines in kol-component · kol-theme · kol-shell.
- **Closes on:** his pick (the losers go), then the publish; the receipt names the version and the pick.

**Amended 2026-10-24, later:** rack-hub's `/previews/patches` were still monitor's old rack screenshots, so the twin's
fronts and backs were both racks — swapped for the ticket's output frames (FileRailImages' pass); round 17 now shows the
real pairs.

## 🟢 CLOSED — 2026-10-24 · kol-component 0.299.0 · kol-theme 0.187.0 · kol-shell 0.79.0 live

Registry live (checked once after the PUT, kol-theme on a second look). Published with `flip-image` as the default; the pick is the user's on open questions round 17, and the other two treatments stay as `backReveal` values until he rules — a decision, not a lobby item. Receipt returned to kol-monitor's outbox — its remainder: bump, the rack shots to `public/previews/racks/`, `back` on `shipped.jsx` `card`, Home's file data and Create's parts.
