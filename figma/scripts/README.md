# Figma library scripts

The KOL Figma library (n48kE2bJtrFjl7wxst30xH) mirrors the showcase (plan `.kol/llm-context/plan-2026-11-03-figma-mirrors-showcase.md`). Its pages, tiers and cards come from the showcase's own data. Nothing is laid out by hand.

| Step | Command / file | What it does |
|---|---|---|
| 1 | `pnpm figma:manifest` | Writes `showcase/src/usage/figma-manifest.json`: every component the showcase lists, with tier, package, description, props, used-by, nested text styles and sets. |
| 2 | `figma/scripts/kol-card.js` | Card builder (paste into a `use_figma` call). Define `CARDS` and `TARGET` first: the target is the tier section's card row. It draws one card per master, with a labelled grid, props, used-by and the master itself under "Component". |
| 3 | `figma/scripts/kol-sheet.js` | Foundations sheet builder. Define `SHEETS` first. Section titles follow `showcase/src/nav/page-sections.json`, and every swatch is bound to its variable or style. |

## Re-sync after a new component

1. Run `pnpm figma:manifest`.
2. Draw the new master on the Components page.
3. Run `kol-card.js` with its manifest row and the row of its tier: Atoms, Molecules, Organisms, Utilities, or Modules on the Modules page.
4. Widen the row until its section is no taller than it is wide.

## The one gotcha

Scripts cannot load PP Right Grotesk.
- Every builder runs with the `type` collection set to Schibsted on the pages it touches, plus every node pinned to Right Grotesk.
- When it finishes, it restores those nodes and clears the page modes.
- An instance is created on the current page, so set the target page current first.
- Scripts also cannot delete pages: mark them `DELETE —` and remove them in the app.
