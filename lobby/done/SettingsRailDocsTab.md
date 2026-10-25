# SettingsRailDocsTab

**Staged:** 2026-10-24 · from a kol-mirror session
**Change:** the Settings rail gets a **Docs** tab for an app's explanatory prose; **Repo** folds into About, so the tab row stays four words on one line

---

## The problem, in one case
The user, on mirror's Settings rail: *"settings are so overloaded with information that its hard to navigate, do we need all this information? and if yes, then we should just start a documentation tab for it."* Mirror's render sections each carried a 4–9 line `note` above their controls. The rail's contract (`AppHub.jsx` `settings`, ruled the same day: *"not 2 lines"*) fixes the row at Settings · Shortcuts · About · Repo and gives an app no tab, so the prose had nowhere to go but above the controls.

Mirror's half is done: Settings is controls and one-line hints only, and the notes moved verbatim to mirror's `docs/documentation/00-mirrors/render-settings.md`.

## The fix
- A **Docs** tab drawn by the Hub from data, e.g. `app.docs: [{ label, paragraphs: [] }]` (no JSX, like `app.about`).
- **Repo**'s link list draws under About, and the row becomes Settings · Shortcuts · About · Docs — four words, one line, on every hub.
- No `app.docs` → no Docs tab (and Repo stays where it is, if the KOL prefers that fallback).

## Rejected alternative
Mirror keeps the paragraphs as `note`s, or puts them in `app.about`. The first is what the user called overloaded; the second mixes the colophon with a manual.

## Definition of done
- [ ] `app.docs` renders a Docs tab on the rail; About carries the links
- [ ] The tab row is one line at the rail's width
- [ ] Published; kol-mirror's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-shell 0.80.0 live

`app.docs: [{ label, paragraphs }]` draws a Docs tab on the settings rail — each entry a section in About's voice, no JSX (`About` warns on a node); `app.links` draw under About (a Links section over the colophon), so the row is Settings · Shortcuts · About · Docs, four words on one line on every hub. No `app.docs` = no Docs tab; Repo folds into About on every hub regardless, one shape (the KOL's call on the fallback). The page tier (`HubSettings`) keeps its ABOUT and REPO. studio-hub carries two docs sections as the reference. Walk `_tmp/2026-10-24-settings-rail-docs-tab/walk.mjs`: the four words on one line, in order, no Repo, Docs draws both sections, About carries the links, console clean (8/8). Docs: `17-settings.md`, `06-studio-adoption.md`, the AppHub JSDoc. Registry live (checked once). Receipt returned to kol-mirror's outbox.
