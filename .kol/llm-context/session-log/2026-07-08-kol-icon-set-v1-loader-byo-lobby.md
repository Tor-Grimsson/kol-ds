# Session: kol-icon-set-v1 — rename, build, ground, clean + loader BYO/lobby loop

**Date:** 2026-07-08
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Renamed kol-loader→kol-icons, built the curated kol-icon-set-v1 (Figma-reviewed, usage-grounded), added registerIcons (bring-your-own) + the /kol-lobby-icon promotion loop, replaced a docs-hygiene gap and the 4-skill reinforcement bundle with global hooks — **then shipped it: v1 moved into the package, published `@kolkrabbi/kol-icons@0.4.0` (non-breaking, legacy alongside), and migrated the one published consumer (kol-design-editor).**

## Changes Made

### Package rename — @kolkrabbi/kol-loader → @kolkrabbi/kol-icons
- `mv packages/loader → packages/icons`; name + `repository.directory` updated; ~40 imports + 4 consumer deps + 2 `@source` globs + `usage-index.json` + 2 held changesets repointed; `pnpm install` relinked; build green. Changeset `rename-loader-to-icons` (kol-icons minor, component/framework patch). Resolves the parked "kol-loader rename" question. Old `kol-loader@0.3.0` stays on npm until deprecated.

### kol-icon-set-v1 (the curated set)
- New showcase page `/icons/v1` (`pages/IconsV1.jsx`). Proposal iterated: family model → **grounded in a cross-corpus usage sweep of 10 consumer repos** (kol-monorepo, kol-labs-monorepo, kol-apparat/*, kol-client, kol-resume) — corrected the taste-pick (added theme-toggle/save/refresh/layout/…, dropped unused lock/zoom), added a **kol-domain** group (foundation/component/atomic/stat/rabbit) since the user is the only consumer.
- **Cleaned the Figma export** (`_tmp/icons-from-figma`, 110 svgs) → `showcase/src/kol-icon-set-v1/<group>/<name>.svg` (**107** after culls): currentColor, stripped Figma clip junk, normalised filenames, grouped by frame. Python cleaner in scratchpad.
- SVG fixes: `settings` missing `stroke-width` (rendered 1.0 not 1.5 — systemic: 36 legacy icons share the gap); `more-horizontal` stroked-rings → filled dots; deleted expanded false-stroke `settings-02`; resolved 2 byte-identical cross-group name collisions (`trash`, `external-link` — kept singletons copies); renamed the `transfer` pair `transfer-01/02` → `download`/`upload` (read from geometry: down-arrow-on-baseline / up-arrow-to-bar).
- Page renders raw SVG via glob (currentColor themes to the plate); list view, 2-col, sizes to 128.

### Loader BYO + lobby loop
- **`registerIcons()`** added to `packages/icons/src/Icon.jsx` + exported (`index.js`): a consumer globs its own SVG folder and registers it; custom-first resolution, synchronous, non-breaking. Changeset `icons-register-byo` (minor); README documented. The **⬇ down** half — package ships small, repos bring their own.
- **`/kol-lobby-icon`** skill (`~/.claude/skills/kol-lobby-icon/`): the **⬆ up** half — clean + check (stroke-weight, keyline, false-stroke, collision) + drop a repo's icon into the set. Sibling of `/kol-lobby` but emits the cleaned SVG, not a spec. Logged in the dotfiles skill catalog.

### Showcase — solid removed
- `Icons.jsx` STYLE (stroke/FILL) toggle removed (stroke-only); **retired `IconsVariants`** page (route + file + sidebar/doc links); sidebar gains `kol-icon-set-v1`.

### Docs
- Repo: `02-icons/INDEX.md` rewritten (loader + kol-icon-set-v1 + registerIcons + lobby loop; killed /icons/variants + solid refs); `documentation/INDEX.md` icons row updated.
- Dotfiles reinforcement/hooks: see below + `~/.dotfiles` `04-hooks-and-tools.md`, `02-skills.md`, `01-agent-context-protocol.md`, `07-output-formats.md`, `TOOLING.md`, both `LLM_RULES.md`.

### Reinforcement + docs-hygiene → global hooks (dotfiles)
- **`doc-sync-reminder`** (`PostToolUse(Edit|Write)`): on edit of a file declared in a doc's `sources:` frontmatter, reminds to update that doc same-turn. Global, precise, fail-open.
- **`agent-reinforce`** (`UserPromptSubmit`): report-shape + rules + no-git on a cadence (full turn 1, compact every ~5 turns) — **replaced the 4-skill bundle** (deleted `agent-reinforce` + `agent-output-format` + `-rules` + `-memory`); 10 dotfiles files repointed; hooks-doc + skill-catalog updated. `claude-clear`/`claude-bullet` kept (user-invoked tools).

### Shipped — v1 into package, published, editor migrated (Phase 1–3)
- **v1 into the package:** moved `showcase/src/kol-icon-set-v1/` → `packages/icons/src/kol-icon-set-v1/`; `iconData.js` globs a `V1` map; `Icon.resolveIcon` = custom → **v1** → legacy. Exports `KOL_ICON_SET_V1` + `KOL_ICON_SET_V1_NAMES`; `/icons/v1` dogfoods the package `<Icon>`. Changeset `icons-v1-into-package`.
- **Migration helpers:** (1) legacy resolution `console.warn`s once per name; (2) **`npx kol-icons audit`** bin (`packages/icons/bin/kol-icons.mjs`) — scans `<Icon name>` usage → in-v1 / legacy-only / not-in-package.
- **Published:** merged the Version Packages PR (#6) → CI green → **`@kolkrabbi/kol-icons@0.4.0` live on npm** (also component 0.4.1 · framework 0.3.0 · theme 0.4.0). Non-breaking — legacy ships alongside.
- **Consumer migrated:** `kol-design-editor` (the *only* repo importing the published pkg) → `kol-icons@0.4.0`: peer+dev deps, 2 imports, `vite.config` `optimizeDeps.exclude`, `pnpm-workspace` release-age pin, README. `pnpm install`'d, running.

## Current State

### Working
- **`@kolkrabbi/kol-icons@0.4.0` is live on npm.** v1 (107) ships in the package + resolves first; `registerIcons` + `npx kol-icons audit` shipped; `/icons/v1` dogfoods it. `kol-design-editor` migrated + running. Both global hooks live (doc-sync fired correctly on this session's Icon.jsx/index.js edits).

### Known Issues
- **Phase 4 (slim) is gated:** the legacy ~800 still ships (the non-breaking bridge). Drop it + major-bump only after `kol-design-editor` registers its own `tool-*`/`align-*` icons and clears its 6 legacy-only (its `npx kol-icons audit` goes clean).
- `kol-loader@0.3.0` still on npm — **deprecate** it once ready (`npm deprecate` → kol-icons); optional, sole consumer is migrated.
- Oversizing refits + search/zoom magnifier harmony = Figma redraws (deferred).
- doc-sync hook blind spot: checks the *current* repo's docs, so dotfiles-doc edits from another repo's session aren't caught.
- Uncommitted: `kol-design-editor` migration + the dotfiles tooling. (kol-design-system **is** committed — it published via the release.)

## Next Steps
1. Commit the `kol-design-editor` migration + the dotfiles tooling (both uncommitted, both yours).
2. Deprecate `kol-loader@0.3.0` → `kol-icons` (optional, now safe).
3. **Phase 4 (slim):** `kol-design-editor` registers its own `tool-*`/`align-*` icons + clears its 6 legacy-only → then delete the legacy 800 → major bump.
4. Figma redraws (oversizing refits, search/zoom magnifier) → re-clean via `/kol-lobby-icon`.
