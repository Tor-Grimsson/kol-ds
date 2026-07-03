# Component lobby

Staging bay for components flung in from consumer apps via the `kol-lobby` skill.
Each entry is a spec the DS **recreates from** — not source. To promote: build the
component under `packages/component/src/{atoms,molecules,organisms}/` (or a new
`packages/*` for non-component work) to spec, then move its entry to `done/`
(recreated) or `archive/` (rejected, with a reason) and log the job below.

This is a work queue, not published docs — it intentionally sits outside `docs/`
and does not follow the `docs/_framework` conventions.

## Queue

| Component | Source | Staged | Status |
|-----------|--------|--------|--------|
| — | | | |

## Processed

| Entry | Recreated as | Where | Date | Notes |
|-------|--------------|-------|------|-------|
| [MediaCard](done/MediaCard.md) | `MediaCard` molecule | `packages/component/src/molecules/MediaCard.jsx` | 2026-07-03 | Slot contract per spec; checkbox = passive `SelectIndicator` (same file), NOT ToggleCheckbox — the card is the click target, a nested real input double-fires. `downloadHref` kept as anchor. Demo + story + changeset staged. |
| [MediaRow](done/MediaRow.md) | `MediaRow` molecule | `packages/component/src/molecules/MediaRow.jsx` | 2026-07-03 | Shares `SelectIndicator` with MediaCard; column widths exposed as `dateWidth`/`sizeWidth` props (defaults `w-24`/`w-20`). Demo + story + changeset staged. |
| [@kolkrabbi/kol-media-client](done/kol-media-client.md) | `@kolkrabbi/kol-media-client` package | `packages/media-client/` | 2026-07-03 | First of the **clients tier** (ARCHITECTURE §3). Factory `createMediaClient({adminBase, publicBase, proxyPath})` + default prod instance; core + `proxied` + `formatSize` + optional `uploadToLibrary` (`saveToGallery` not ported, per spec). Changeset staged; publishes with the held batch. |
