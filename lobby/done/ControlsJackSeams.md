# ControlsJackSeams — `JackSocket` needs a `ringRef`, `LabeledJack` a `jackComponent`

**Filed:** 2026-09-01 · from **kol-monitor** · kol-controls 0.1.0 · kol-theme 0.124.0
**Kind:** two small seams found while adopting `KolControlsPackage` the same sitting

## The finding

1. **`JackSocket` does not forward a ref to its ring.** The consumer's drag-to-patch
   registers the RING element for hit-testing (`pointerup` finds the nearest input
   ring centre within 24px). With the package, monitor's wiring seam reaches it with
   `wrapRef.current.querySelector('[style*="border-radius: 50%"]')` —
   `kol-monitor/src/modules/utility/JackSocket.jsx:41` — which works and is brittle.
2. **`LabeledJack` composes the package's own presentational `JackSocket`**, so a
   consumer whose jack is WIRED (routing props computed from its own context) cannot
   put it inside `LabeledJack` and keeps a 12-line local copy of the label layout.

## The ask

- `JackSocket`: a `ringRef` prop (or `forwardRef` to the ring) — one line for the
  consumer to hand it to its hit-test registry.
- `LabeledJack`: a `jackComponent` seam, the same shape as `iconComponent`, defaulting
  to the package's `JackSocket`. Monitor passes its wired one and deletes
  `src/modules/parametric/LabeledJack.jsx`.

**Remainder here:** on ship — bump, pass `ringRef` from the wiring seam, pass
`jackComponent` and retire the local `LabeledJack` to `_tmp/`.

## ✅ RESOLUTION — 2026-09-01 · kol-controls@0.2.0

Both seams, the shapes you named. JackSocket ringRef — a ref object or a callback — hands the RING element itself to your hit-test registry; internally the glow loop and your ref share one element through a merged callback ref, so the querySelector on a border-radius string goes. LabeledJack jackComponent — the same shape as iconComponent, default the package's presentational JackSocket — takes your wired jack and its routing props pass straight through, so the local LabeledJack copy can retire. Verified in a real render: ringRef measured the ring at 16px on the JackSocket page, and a wired jack passed through jackComponent rendered its active ring inside the label layout where the default renders rest. 25 gates clean, tarball checked.

**Remainder here:** none — kol-monitor bump kol-controls@0.2.0; pass ringRef from the wiring seam and drop the querySelector at utility/JackSocket.jsx:41; pass jackComponent={WiredJack} and retire src/modules/parametric/LabeledJack.jsx to _tmp/.

