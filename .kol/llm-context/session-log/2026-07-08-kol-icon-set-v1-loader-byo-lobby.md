# Session: kol-icon-set-v1 — rename, build, ground, clean + loader BYO/lobby loop

**Date:** 2026-07-08
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Renamed kol-loader→kol-icons, built the curated kol-icon-set-v1 (Figma-reviewed, usage-grounded), added registerIcons (bring-your-own) + the /kol-lobby-icon promotion loop, and replaced a docs-hygiene gap and the 4-skill reinforcement bundle with global hooks.

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

## Current State

### Working
- kol-icons renamed + builds; `registerIcons` live. kol-icon-set-v1 (107) renders at `/icons/v1`. Both hooks tested + wired global (harness picked up reinforce mid-session).

### Known Issues
- kol-icon-set-v1 lives in `showcase/src/` (not the package) — package still ships the legacy ~800; it slims onto the set only once repos adopt BYO (**53 app-used names are not in v1** — a hard replace breaks apps until then).
- Oversizing refits + search/zoom magnifier harmony = Figma redraws (deferred).
- doc-sync hook blind spot: checks the *current* repo's docs, so dotfiles-doc edits from another repo's session aren't caught (caused this session's hooks-doc miss).
- Everything uncommitted (repo **and** dotfiles).

## Next Steps
1. ~~Rename `transfer-01/02` → `download`/`upload`~~ ✅ done.
2. When repos adopt `registerIcons`: slim the package onto kol-icon-set-v1, drop legacy, major bump.
3. Figma redraws (oversizing refits, search/zoom magnifier) → re-clean via `/kol-lobby-icon`.
4. Publish decisions: kol-icons rename (deprecate `kol-loader@0.3.0`) + the held changesets.
5. Consider a separate dotfiles session log for the hooks/skill/reinforcement work (it spanned two repos).
