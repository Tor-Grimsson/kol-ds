# Playbook — Interface icon categories

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`. Plan: `plan-2026-10-31-icon-categories.md`.

**Goal:** kol-icon-set-interface regrouped into the user's 18 categories (2.1); an outline · solid · all filter in the icon browser (2.2).

**Standing rules (non-negotiable):**
- Interface only: signal, identity and external are separate sets.
- Icon names never change; every `<Icon name>` resolves before and after.
- Solid is a variant, not a category.
- The batch (2.3) stays parked: TALK.

---

[22:39 · 2026-10-31] · W1 · plan-2026-10-31-icon-categories.md
  what → W1 ruled as placed (user: "go on both dont stop until done go!"); building 2.1 + 2.2
  note → 2.3 stays TALK (his pick on duplicate drawings)
[22:43 · 2026-10-31] · 2.1 · packages/icons/src/kol-icon-set-interface/
  what → 255 SVGs moved from 25 group folders into 16 category folders (flow, commerce wait for the batch)
  what → showcase gallery ORDER = plan order; interface's category layer dropped (folders are the categories)
  what → inventory + home + loader docs regenerated; external inventory gains social (0.57.0 leftover)
  verify → names before/after 255 = 255, 0 lost ✓ · reachable gate ✓ · cuts 433 ✓ · page renders 16 groups ✓
[22:43 · 2026-10-31] · 2.2 · showcase IconsGallery Type chips
  what → filter already shipped (Stroke · Solid · Color, none = all); no code
  verify → Solid 49 of 255, all solid cut ✓ · Stroke 0 `-solid` ✓
  note → IconBrowser renders an empty first grid cell on every set (signal too) — existing, not this change
[22:44 · 2026-10-31] · W2 · published kol-icons 0.58.0
[22:58 · 2026-10-31] · 2.3 · packages/icons/src/kol-icon-set-interface/
  what → all 559 batch icons (treated copies) in their categories; 50 renamed to the next free -02/-03; flow + commerce folders open
  verify → 814 names, 18 folders ✓ · cuts 992 ✓ · reachable ✓ · Commerce page 39 icons, 0 blank ✓
  note → icon-ink's 4 failures are in component/framework/metric code, not the icons
  what → published kol-icons 0.59.0; ClaudeListIconSet closed, kol-hq receipt returned

[03:22, 2026-11-21] W21.3, iconset--kol-ds-ui page Bases 10:5236
  what → 88 icon bases built (48 shared, 40 category), 186 live properties, 169 examples; tally in _tmp/2026-11-21-iconset-fill/bases-tally.md
  verify → radius, bend radius and icon/stroke changed on three bases, examples followed, values restored
  note → category bases left on Bases (category frames still in progress); 240 kolicon-- import frames from the other run sit loose on Bases at y -400, not mine, untouched

[20:58, 2026-11-22] W3/W4 hosts, iconset--kol-ds-ui Bases 10:5236: File, Folder, Cloud, Calendar, Clipboard rows converted
  what → parts/form/base/output per row (File 46 parts 34 outputs, Folder 13/9, Cloud 15/9, Calendar 10/5, Clipboard 3/6); Icons page pointed; Form/file, folder, cloud, calendar-clipboard lanes and 4 page-host icons retired to 188:10975
  12 marks → heart (Badge-12), plus-small (Badge-12), chart (Pulse-12), left-wide (Arrow-12); new rows Base/code-12, gear-12 (gear, cog, sprocket), branch-12, sun-12, pie-12
  gotcha → setting vectorPaths on a clone drops per-vertex caps (ROUND→NONE); copy cap/join from the source; hidden boolean children vanish from instance.children, so swap nested marks before hiding

[02:16, 2026-11-23] W4 step 4, iconset--kol-ds-ui Bases 10:5236: rows cylinder, bars, align, text-rows, sliders, dots
  what → six new Primitives rows after Base/star (59 outputs for 60 icons); Icons page pointed; six Form/ lanes retired to 188:10975
  gotcha → instance sublayers of originals on the held page load lazily when the current page is Bases: await getMainComponentAsync() on every instance before findAll, or icons come back empty
  gotcha → sub-path matching by point sets must drop the closing duplicate point and sort command letters, else the same closed shape with another start point never matches
  gotcha → round near-square shapes with one size for both axes, or a 3.5 circle becomes a 4x3 oval

[02:42, 2026-11-23] W4 step 4, iconset--kol-ds-ui Bases 10:5236: file-sliders into File; mark-12 retired; nodes into his Nodes row; new rows tree, curve, logic-gates, blocks
  what → 103 icons pointed; six Form/ lanes retired to 188:10975; all checks 0, all looks match
  gotcha → building into his row: his form switches can default to true; set every one of them false in each new output or his parts draw on top
  gotcha → cloning a Raw group after removing it fails (node gone); clone the template first, then remove the old groups

[03:13, 2026-11-23] W4 steps 4 and 5, iconset--kol-ds-ui Bases 10:5236: rows letters, magnifier, crossed-out (Primitives), pencil, pointer, person (new Band / Objects)
  what → 67 outputs; Icons page pointed; six Form/ lanes retired to 188:10975; all checks 0, all looks match
  gotcha → rounding an open stroke about its centre breaks the joins it meets (pie-search, trend-search); keep exact geometry for any open path whose end lies within 0.6 of another piece
  gotcha → load the held page with `await page.loadAsync()` before reading originals from Bases, and clone a template cell before removing it from the tree

[03:35, 2026-11-23] W4 step 5, iconset--kol-ds-ui Bases 10:5236: rows sparkle, map-pin, award-badge, balance-bolt, brain, broadcast (Band / Objects)
  what → 29 outputs; Icons page pointed; six Form/ lanes retired to 188:10975; all checks 0, all looks match
  gotcha → a zero-length stroke (a round-cap dot, cast) rounds to a 1px line and then merges with real 1px ticks; keep zero-length paths unrounded
  gotcha → two copies of one shape that differ by under 0.1 in the original (map-route pins) miss the 0.06 post-rounding merge; 0.12 catches them

[03:51, 2026-11-23] W4 step 5, iconset--kol-ds-ui Bases 10:5236: rows drop-flask, filter-gear, flag, hand, ruler, eraser-scissors (Band / Objects)
  what → 24 outputs; Icons page pointed; six Form/ lanes retired to 188:10975; all checks 0, all looks match; script `_tmp/figma/obj-row-2.js` (obj-row.js with the 0.12 post-rounding merge in the file)
  gotcha → a 24 icon that is a gear (gear) is drawn; only a gear sitting on another piece (hand-gear) takes the Gear-12 mark, picked by matching its hole size (gear 2.4, not cog)

[04:07, 2026-11-23] W4 step 5, iconset--kol-ds-ui Bases 10:5236: rows magnet-hourglass, paint-roller, map, tag-loop, audio, food (Band / Objects)
  what → 23 outputs; Icons page pointed; six Form/ lanes retired to 188:10975; all checks 0, all looks match
  gotcha → a round-cap dot drawn as a 0.01-long path passes the old `w<0.01` zero-length test and rounds to a 1px line (cake candles); `_tmp/figma/obj-row-2.js` now keeps anything under 0.05 unrounded

[04:45, 2026-11-23] W4 step 5 done, iconset--kol-ds-ui Bases 10:5236: rows games, security, code, chess, design, places (Band / Objects)
  what → 58 outputs; Icons page pointed; six Form/ lanes retired to 188:10975; all checks 0, all looks match after fixes
  gotcha → an EVENODD filled vector (white chess pieces) split into sub-paths draws as a solid silhouette; keep such a vector whole as one part (clone it), never split it
  gotcha → originals with a mask group (eyedrop, pushpin) hand the script a 24x24 filled square; skip `isMask` nodes or retire the part

[05:02, 2026-11-23] W4 step 6 + One-offs sweep, iconset--kol-ds-ui Bases 10:5236: 11 new One-offs rows, 51 outputs moved to One-offs, holding section empty
  what → concierge-bell, attach and nine singles built from originals (`_tmp/figma/oneoff-row.js`); 51 one-part unshared outputs moved to their own rows (`_tmp/figma/oneoff-move.js`, scan `_tmp/figma/oneoff-scan.js`); 62 Icons cells pointed; all looks match
  gotcha → moving a variant out of its set renames it to `Set/output/<value>`, dropping a `_` set before the move; rename after appendChild
  gotcha → the keyline instance in a base is a variant (`small=false`) of set `Base/keyline`; match the set name, not the main component name, or every icon counts the keyline as a part

- 2026-11-23 05:13 — iconset W5 map and W6.1 close: `Map` section on Bases top (util Header, Section label, Type rows, Footer); held page emptied to `_delete Held 2026-11-23`
  gotcha → Raw cells are instances of `_originals` on the held page, and some originals hold instances of old `_Base/*`; walk the chain (moved node → its instances → their main's top on the held page) until it closes before emptying a page

- 2026-11-23 20:24 — Line form rebuilt on new page `Line, rebuilt` (593:10) after Bases: 6 parts, `Line` form (6 switches), `Base/line` (keyline off + exposed Line), `Line/output` (7 variants), 7 category icons; caps are `Line/horizontal` with stroke 6 and cap overridden on the instance, no new part
  gotcha → a variant export can read `5.64001` where its raw reads `5.64` (float32 drift from absolute position); compare exported paths at 0.01
