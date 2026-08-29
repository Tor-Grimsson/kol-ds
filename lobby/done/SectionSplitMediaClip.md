---
component: SectionSplitMediaClip
source: kol-website/apps/web/src/components/sections/home/HomeFoundry.jsx#L17-L40
staged: 2026-08-26
status: draft
deps: [SectionSplit]
---

# SectionSplitMediaClip — the media frame clips a 3D-tilted node

## Purpose

`SectionSplit`'s media frame is `kol-section-split-visual relative
rounded-[var(--kol-radius-sm)] overflow-hidden` (`SectionSplit.jsx:96`). The
media slot is documented as "image / video / interactive node" — but an
interactive node that transforms in 3D (kol-website's `TiltCard`, a
framer-motion spring tilt, restored on the Home foundry split 2026-08-26) is
clipped by the frame the moment it rotates: the corners that lift out of the
box are cut flat, the ones that dip in show the frame edge. User: *"rendering
with jagged edges, I don't remember it rendering like that"* — it never did;
the pre-08-15 section had no clipping wrapper.

## Ask

A seam so the frame does not clip: `mediaClip={false}` (frame keeps its
ratio and radius, drops `overflow-hidden`; the node owns its own clipping and
radius — `TiltCard` already does, `rounded-[inherit]` inside). Default stays
`true` — every photograph in the family wants the clip. `mediaHover` (frame
zoom) and a self-animating node are mutually exclusive in practice; worth a
note in the doc.

## Consumer state

`HomeFoundry` passes `TiltCard` with `rounded-[var(--kol-radius-sm)]` so its
own corners match the frame; the clip stays until this ships.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.76.3

`SectionSplit mediaClip` (default `true`): `false` drops the frame's `overflow-hidden` — the frame keeps its ratio and radius, the node owns its own clipping, so a 3D-tilting node keeps its lifted corners. `mediaHover` and a self-animating node are noted as mutually exclusive in the JSDoc and the reference page.

**Remainder here:** none — kol-website bump kol-component 0.76.3; HomeFoundry passes `mediaClip={false}` with its TiltCard.

