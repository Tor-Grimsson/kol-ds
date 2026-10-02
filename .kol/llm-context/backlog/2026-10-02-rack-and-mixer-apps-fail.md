# Issue — `/apps/rack`, `/apps/mixer` and `/apps/panels` look wrong

**Reported:** 2026-10-02, by the user, on the showcase. They have no console errors — "they just look wrong".

His words: "rack completly fails in /apps/rack so does /apps/mixer mark that as an issue somewhere." · "apps/panels also fails, mark that as well." · the cause, his: "its almost like you havent seen monitor. or the rack" · mixer: "how can you build, without even looking … I would start at MIRROR FUCKING CODEBASE".

His order: rack → mixer (from kol-mirror) → fxr labs (the space `apps/controls` tries to be, "set up wrong") → generator. **Do not propose the mixer until he says monitor is done** (his word, 2026-10-02).

## Rack — rebuilt 2026-10-02, waits on his eye

kol-monitor's whole `src/`, copied, on this repo's packages, as two apps (naming D2): `apps/rack` is the rack alone with all 59 module types (`pnpm rack`, 5194); `apps/rack-hub` is the shell, Home, Library, Create, Stage and Settings around it (`pnpm rack-hub`, 5196), importing the rack from `apps/rack`. Compared against `monitor.kolkrabbi.io` pixel by pixel — result, the edits monitor needs and what the bump visibly changes: `2026-10-02-monitor-bump-notes.md`. Evidence: `_tmp/2026-10-02-rack-testbed/`. The first, hand-drawn test bed and the 13-module port are in the same folder (`App.jsx`, `src-13-modules/`).

## Mixer — not started

Start from kol-mirror's codebase, the way the rack started from monitor's. `apps/mixer/src/App.jsx` today is 55 invented lines.

## Panels — not looked at

Not part of the 2026-10-02 build. Unread.
