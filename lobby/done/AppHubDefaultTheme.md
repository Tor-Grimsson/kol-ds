# AppHubDefaultTheme

**Staged:** 2026-10-24 · from a kol-mirror session
**Change:** an app's default theme, which the Settings rail's reset and the toggle's "system" fall back to, instead of the OS

---

## The problem, in one case
The user, in kol-mirror: *"make this repo dark mode default"*. Mirror stamps `<html data-theme="dark">` (theme.js's veto of the OS), so a fresh load is dark. But the Settings rail's reset *"hands the theme back to the system"* (`AppHub`, `applyTheme('system')`), which clears the stamp. On a light-mode Mac the app turns light until the next reload, when `index.html` stamps dark again. A dark-first app can't keep dark through a reset.

## The fix
`AppHub defaultTheme="dark"` (or `app.defaultTheme`): the reset and the toggle's system choice resolve to it, not to `prefers-color-scheme`. Omit it and nothing changes.

## Definition of done
- [ ] Reset on a dark-default app leaves it dark on a light-mode OS
- [ ] Apps without it behave as today
- [ ] Published; kol-mirror's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-framework 0.55.0 · kol-shell 0.81.0 live

`AppHub defaultTheme` (or `app.defaultTheme`) stamps `data-theme-default`; kol-framework's `applyTheme('system')` — the rail's reset and the toggle's alt-click — lands on it instead of prefers-color-scheme, stamped and never persisted. No attribute = as before. studio-hub is dark-first as the reference. Walk `_tmp/2026-10-24-whole-flip/theme-walk.mjs`: on a light OS a reset leaves it dark with nothing saved; without the attribute the same reset hands the page to the OS. Registry live. Receipt returned to kol-mirror's outbox.
