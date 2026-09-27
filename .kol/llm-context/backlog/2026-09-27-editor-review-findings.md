# Editor review findings — apps/editor `/core` (user, 2026-09-27)

Logged, not acted on. The user's first pass over apps/editor after the seam and the cut, in his
words (lightly trimmed). **Next session opens with the DS-vs-inline audit** (item 13), since most
of the items below look like inline copies drifting from the DS. Screenshots are in the session's
image cache, not the repo.

1. **Transport in core.** "if core doesnt have motion, why transport controls?" The clock stayed
   core on purpose (generators are time functions), but the transport UI in a no-pack core reads
   as motion. Decide where the transport chrome lives.
2. **Transport controls incorrectly laid out.**
3. **Missing popovers / tooltips.**
4. **S for shortcuts is wrong.** The shortcuts sheet opens on `S` (View · "Show / hide shortcuts").
5. **Flip icon asymmetric.** The flip-horizontal icon has a dot missing, so it is asymmetrical.
6. **Constrain-proportions icon.** (a) Wrong: it doesn't show constrain proportions; "just use a
   lock or something more common". (b) It uses `fg-*`, which is illegal for stroked icons.
   "the entire app and repo needs to respect this, literally cant recall how many times ive said
   the same thing about the icons and icon loader" (LAW: icons use `oq-*`, never `fg-*`).
7. **The settings sidebar doesn't close on the X button.**
8. **The browser focus highlighter** (the blue ring on the Tools menu button). "I hate it, can we
   not use our own? like we do in media?"
9. **Line-height / letter-spacing glyphs too small** (measured ~12px) and on `fg-*`.
10. **Two alignments.** One on top (object alignment) and one with the text; in text "you dont
    have to label it alignment and the icons are different". Reference: Affinity's paragraph
    alignment row. In general don't section-label every micro thing: Affinity's Transform panel
    is one panel for x/y/w/h/rotation, with no "Dimensions" label. For a later session.
11. **Tones.** "so many different variations of bg", which suggests inline, not DS: segment
    toggles with the wrong active colour, a layer focus colour used nowhere else, another segment
    toggle with an outline in the transport controls. Typography has two dropdowns next to each
    other (family + style, then size with its own chevron), and type settings share a row with
    text alignment.
12. **Fill and stroke as panel sections.** Unneeded: colour is changed in the colour window, and
    selecting a layer gives its attributes in the inspector, as clicking the canvas does. Also
    broken: a red canvas shows white in the colour wheel, and changing it from the inspector
    gives a limited palette instead of the colour picker.
13. **The inspector is over-labelled.** Why is the canvas ratio called "Size"? What are these
    controls? **"I think we need a deep dive into what is DS and what is inline. an audit. a big
    sync, we shouldnt be shipping the same components multiple times, rather make variants if
    needed."** Related, from the controls work the same day: design-editor ships its own
    LayerStack · TimelineDock · CurveEditor · KeyframeEditor · ToolPalette · InspectorRail
    beside kol-component's.
