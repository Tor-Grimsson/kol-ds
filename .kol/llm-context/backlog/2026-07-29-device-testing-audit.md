# Open task — mobile/tablet audit + desktop device-testing rig

**Captured:** 2026-07-29 (user ask, parked as open task — do not start unprompted)

The user wants a mobile + tablet audit of the showcase (and eventually consumer apps), but only owns a phone — unreliable/suboptimal as the primary test rig. Wanted: the recommended desktop-side approach to device testing.

## Recommended rig (sketch, to be ratified when the task opens)

**User-side (the answer to "how do devs actually test touch on desktop"):**

1. **Chrome DevTools Device Mode (⌘⇧M)** — the industry daily driver, not Firefox RDM (agreed: lacking). Device presets with real metrics/DPR, and **touch forced onto mouse**: the cursor becomes a touch point, touch events fire, and the CSS media features flip to `pointer: coarse` / `hover: none` — so touch-branching CSS RENDERS as touch while reviewing with a mouse. Surgical variant without full device mode: DevTools ⌘⇧P → "Emulate CSS media feature pointer: coarse".
2. **Real iOS WebKit on the Mac — Xcode Simulator** (free with Xcode; probably the "iOS through Claude app" sighting): full iOS Safari incl. browser chrome, dvh, safe-area. Safari's own Responsive Design Mode (Develop menu) is the quick twin and can drive the Simulator.
3. **The phone** — final-pass reality check only (touch latency, font rendering). The user's 95% suspicion is CONFIRMED: desktop emulation is the standard workflow; devices are last-mile QA.

**Agent-side:** Playwright viewport sweeps (375/390/768/834/1024 + `hasTouch`), screenshots per breakpoint per page; Playwright's bundled WebKit for engine-truth checks.

## Notes

- The showcase already has the chess `100dvh` stage + framework padding ramp laws (`docs/documentation/04-layout-breakpoints` territory) — the audit should verify against those, not invent new targets.
- Relates to the held preview-responsiveness complaints (arc 2 bug sweep: breakpoint buttons buggy, previews incorrectly responsive).
