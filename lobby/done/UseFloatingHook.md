# UseFloatingHook

**Staged:** 2026-10-28 · from a kol-mirror session (plan 19 W3)
**Change:** lift kol-monitor's `useFloating` into kol-hardware's frames — two apps carry it

---

## The problem, in one case
`useFloating` is kol-monitor's hook (`apps/rack-hub/src/stage/useFloating.js`): drag a panel around the stage by its body, scale it from a corner, window listeners rather than pointer capture, and a press on a control (read from its computed `cursor`) belongs to the control. kol-mirror copied it 2026-10-03 for the floating monitor (`src/hooks/useFloating.js`, used by `SymphonyViewport` + `FloatingFrame`). One line differs: Mirror's cursor test also lets `nwse-resize` through, for the corner grip (monitor scales the whole board instead). Its own comment: *"a second copy of one hook. Lift it to a package (kol-hardware's frames) if the float arrangement is kept — two consumers is the trigger, and this is the second."* The user (2026-10-28): *"seems like DS should tho?"*

## The ask
- `useFloating` in kol-hardware (frames), with the corner grip supported (`nwse-resize` passes the control test). Scale range is 0.35–2.5 in Mirror.

## Definition of done
- [ ] `useFloating` exported from kol-hardware
- [ ] kol-mirror's floating monitor drags by its body and scales from its corner on it
- [ ] Published; kol-mirror's receipt names the version (kol-monitor gets its own adoption ticket)


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-hardware 0.8.0**. `useFloating` in kol-hardware's frames, monitor's hook with mirror's one line (`nwse-resize` passes, for the corner grip), scale 0.35–2.5 (`FLOATING_MIN_SCALE` · `FLOATING_MAX_SCALE`). apps/rack-hub's stage runs on it: walked, a floating panel drags by its body.
