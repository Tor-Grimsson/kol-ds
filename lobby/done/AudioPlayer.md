---
component: AudioPlayer
source: kol-r2b2/src/KindPreview.jsx#L78-L87
staged: 2026-08-15
status: draft
deps: []
---

# AudioPlayer

## Purpose

An interactive audio player atom. The design system has **no audio component at all** —
it is the one media kind with nothing to reach for, so every consumer hand-rolls a bare
`<audio controls>` and inherits whatever the browser paints.

This is the follow-up filing to `done/media-library-non-av-blindness.md`. That ticket
made audio objects *arrive* (the `accept` widening shipped in `kol-component@0.39.0`);
its resolution explicitly declined to mint the component because the tier was a taxonomy
call and not the ticket's to make. **This filing is that call, made.**

Evidence: `kol-vault-media` holds **116 sound files**. kol-r2b2's viewer renders every
one of them with a raw native element and a comment apologising for it.

## Anatomy

```
<figure>                     ← container, column, centred
  ├── label                  ← optional filename / title line
  └── <audio>                ← the single native element
```

One native media element plus an optional label. Nothing else — no waveform, no
scrubber of our own, no playlist.

## Variants

None (single form). If a second form is ever wanted it is `compact` (label suppressed,
player only, for use inside a list row) — but do not build it speculatively.

## Props

| prop | type | default | controls |
|------|------|---------|----------|
| `src` | string | — | audio URL |
| `label` | string | `undefined` | optional line above the player; omitted entirely when absent |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | native preload hint |
| `className` | string | — | all layout/sizing, consumer-supplied |

`controls` is **not** a prop — this component is the interactive one by definition.
See the HlsVideo contrast in Recreation notes.

## Styling

From the consumer source (`KindPreview.jsx:82-85`), which is the whole of it:

- Container: `flex flex-col items-center gap-3 p-8`
- Label: `kol-mono-12 text-fg-48`
- Element: `w-[420px] max-w-full`

**Drop on recreation:**

- `p-8` — that is the viewer's padding, not the component's. Layout arrives via `className`.
- `w-[420px]` — a hardcoded consumer width. Should be `w-full` inside a consumer-sized box.
- The centring (`items-center`) — a call-site decision.

The native control strip is UA-painted and **not themeable** past `color-scheme`. Do not
attempt to restyle it with pseudo-element hacks; if the DS ever wants a branded transport,
that is a separate `AudioTransport` molecule built on this atom, not this ticket.

## States & interactions

Native only — play / pause / seek / volume / rate are the UA's. The component adds no
hover, focus, selected or disabled state of its own.

- **No src** → render nothing (match the guard style of the other media atoms).
- **Load failure** → native. Do not build an error surface here.

## Dependencies

None. No DS component, no third-party library. This is a single native element wrapper —
the smallest thing the DS can ship, which is exactly why it should have existed already.

## Recreation notes

**Tier: atom.** It sits beside `atoms/HlsVideo.jsx` — same shape (one native media
element, all layout via `className`, no composition).

**The one contrast worth reading before building:** `HlsVideo` is deliberately *inert* —
`pointer-events: none`, `controls={false}`, plus the full hardening set (no PiP, no
download, no fullscreen, no remote playback, no context menu). It is a background/
decorative atom. `AudioPlayer` is the opposite: it exists **to be operated**. Do not
copy HlsVideo's hardening block across. Same tier, inverted intent.

**Values that become props:** the width, the padding and the centring are all call-site
concerns — none of them belong in the component.

**Text casing** stays at the call site; no `text-transform`.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-component@0.43.0`** (registry-verified) as
`atoms/AudioPlayer.jsx`, exported from the barrel.

Built to the spec exactly, including its restraint: one native `<audio>` plus an
optional label, no waveform, no scrubber of our own, no playlist, and **no
`compact` variant** — the entry said not to build it speculatively, so it isn't
there. `controls` is not a prop, for the reason the entry gives: an audio player
without controls is not a variant, it is a different component.

**The three call-site values were dropped as instructed** — `p-8`, the
`w-[420px]` hardcode and the `items-center` centring are the viewer's layout, not
the atom's; layout arrives via `className` and the element is `w-full` inside
whatever box the consumer sizes.

**The HlsVideo hardening did NOT cross over.** The entry's "one contrast worth
reading" is now written into both files' headers so the next editor meets it
before touching either: same tier, same shape, inverted intent — HlsVideo inert
and decorative, this one built to be operated. No `pointer-events: none`, no
`controls={false}`, none of the PiP/download/fullscreen/remote-playback set.

No CSS half was needed — the native strip is UA-painted and not themeable past
`color-scheme`, and the entry is explicit that a branded transport would be a
separate `AudioTransport` molecule on top of this atom rather than work here.

Registered in the roster as an atom with the `media` function. 19 gates clean.

**Remainder here:** none.
