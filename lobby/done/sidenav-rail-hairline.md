# SideNav: the right-edge hairline is opt-in, not the default — split it out of `background`, and let AppShell forward it

**Staged:** 2026-08-26 · from a kol-studio session
**Change:** kol-framework — `src/SideNav.jsx` (one className, one new prop) + `src/AppShell.jsx` (forward SideNav props); no CSS, no token changes

---

## The problem, in one case

kol-studio adopted `@kolkrabbi/kol-framework` 0.24.0 today and its rail came up with a vertical hairline down the content edge. The user, on seeing it: the footer's `border-t` is fine, the **`border-r` is wrong** — fine to have as an option, as a prop, but **the default should be without**.

Where it comes from — `SideNav.jsx` L155 (0.24.0):

```jsx
className={`kol-sidenav${background ? ' bg-surface-primary border-r border-fg-08' : ''}…`}
```

`background` (2026-08-09) defaults to `true` and paints **two** things under one name: the rail surface and the right hairline. And `AppShell.jsx` L64 renders `<SideNav navTree drawerOpen onCloseDrawer />` — it forwards nothing else, so even the existing `background={false}` is unreachable for any consumer on AppShell. The only way to lose the line today is a consumer CSS override of package chrome, which the npm-consumption rule forbids.

## The fix

- **`SideNav`:** `background` keeps painting the surface only (`bg-surface-primary`), default `true`. New prop **`hairline`** (name open — `divider` / `edge` are fine), default **`false`**, paints `border-r border-fg-08`. The footer's `border-t border-fg-08` (L246) is unchanged — that one is right.
- **`AppShell`:** forward the SideNav props it doesn't own — at minimum `background` and `hairline`; simplest is a `sideNav` object prop spread onto `<SideNav {...sideNav} />`, so the next rail option needs no AppShell release.
- Default render (no props) → surface, no right border. That is the visual change, deliberate, the user's.

## Rejected alternative

- **Consumer CSS override** (`.kol-sidenav { border-right: 0 }` in kol-studio) — a local patch of package chrome; kol-studio's ARCHITECTURE §6 bans exactly this, and every other consumer would carry the same line.
- **Flipping `background` to default `false`** — loses the surface paint too, and the brand-hero model (`background={false}` floating over media) already means "no surface"; the hairline is a separate decision and deserves a separate switch.

## Definition of done

- [ ] `<SideNav>` with no props renders the surface and **no** `border-r`; `hairline` (or the chosen name) restores `border-r border-fg-08`
- [ ] Footer `border-t border-fg-08` untouched
- [ ] `AppShell` forwards SideNav props (`sideNav={{ hairline: true }}` or equivalent reaches the rail)
- [ ] Showcase asserts the default aside has no right border, and the prop puts it back
- [ ] kol-framework version cited; kol-studio bumps (📌 remainder there — nothing else to do, the default is what it wants)

## ✅ RESOLUTION — 2026-08-26 · kol-framework@0.26.0

`SideNav`: `background` paints the surface only; new `hairline` (default `false`) paints the right-edge `border-r border-fg-08`; the footer's `border-t` is untouched. `AppShell` takes a `sideNav` object spread onto the rail — `sideNav={{ hairline: true }}`, `background`, `isActive`, `onNavigate` all reach it with no AppShell release. Measured on the showcase rail: default → border-right 0, surface painted, footer border-top 1px; `hairline` → border-right 1px. Default flip flagged BREAKING in the changelog.

**Remainder here:** none — kol-studio bump kol-framework 0.26.0 — the default is what kol-studio wants; nothing to pass.

