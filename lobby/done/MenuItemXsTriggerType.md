# MenuItemXsTriggerType — `MenuItem size="xs"` puts the trigger's height on the rung but not its type

**Staged:** 2026-10-15 · from a kol-monitor session
**Change:** one class map in `molecules/MenuItem.jsx`, the same shape as `ROW_BY_SIZE` beside it

---

## The problem, in one case

Monitor's Scope+ module (an xs panel front) put its EX / REF reference menus on `MenuItem size="xs"`.
The trigger came out 22px tall, but it was set in `kol-helper-12` with `px-3` and 0.72px tracking:
12px type in a 22px box, beside `Button size="xs"` neighbours at kol-mono-8 / px-2. The trigger hardcodes
`kol-helper-12 px-3` whatever the `size` is, while the rows in the same panel already follow the rung
(`ROW_BY_SIZE.xs` = `kol-mono-8 px-2 h-5`, "xs wears the TRIGGER's face").

## The fix

A `TRIGGER_BY_SIZE` map beside `TRIGGER_H`: `xs` → `kol-mono-8 px-2`, `sm` / `md` / `lg` → today's
`kol-helper-12 px-3`. Default `md` is unchanged byte for byte.

## Carried in monitor meanwhile

`src/modules/display/OscilloscopeModule.jsx` `RefDropdown`: `buttonClassName="uppercase text-[8px] tracking-normal !px-2"`.
It drops on ship.

## Rejected alternative

Monitor passing `kol-mono-8` through `buttonClassName`: it ties `kol-helper-12` on specificity and loses on
sheet order, which is why the carry has to use utilities with `!`.

## Definition of done

- [ ] `MenuItem size="xs"` trigger renders kol-mono-8, px-2, no helper tracking
- [ ] sm / md / lg unchanged
- [ ] monitor drops the `buttonClassName` carry

## ✅ RESOLUTION — 2026-10-16 · kol-component@0.262.0

`TRIGGER_BY_SIZE` beside `TRIGGER_H`: `xs` → `kol-mono-8 px-2`, sm · md · lg → `kol-helper-12 px-3` as before. Measured: xs trigger 8px type, 8px pad, normal tracking, 22px tall; md unchanged (12px, 12px pad, 0.72px tracking, 32px).

**Remainder here:** none — kol-monitor bump kol-component@0.262.0; drop the `buttonClassName` carry on RefDropdown in OscilloscopeModule.jsx.

