# Forward `badge` from the dash cards to CardHeader, or stop accepting it

**Staged:** 2026-08-30 · from a kol-chess session
**Change:** one prop threaded through `CardHeader` (+ its four callers), or four prop removals.

---

## The problem, in one case

`DashTableCard` destructures a `badge` prop and never uses it:

```jsx
// kol-dashboards/src/cards/DashTableCard.jsx
const DashTableCard = ({ title, subtitle, icon, badge, columns, rows, footer, className }) => (
  …
  <CardHeader icon={icon} title={title} subtitle={subtitle} />   // badge is not passed
```

and `CardHeader` takes only three:

```jsx
// cards/_shared/CardHeader.jsx
const CardHeader = ({ icon, title, subtitle }) => …
```

So `<DashTableCard badge={…} />` renders **nothing at all**, silently. React does
not warn — the prop is legitimately destructured, it is simply dropped on the
floor one line later.

**The cost is the silence.** Building `/insights` in kol-chess, `badge` was the
obviously correct slot for a finding's severity (WEAKNESS / STRENGTH / NOTE) — it
is named for exactly that, it sits in the signature next to `icon`, and reading
the signature is how a consumer decides what to pass. It was passed, the page
rendered, and the badges were absent with no error anywhere. The only way to
find out was to open the component and then open `CardHeader`. A prop that
accepts and discards is worse than a missing one: a missing prop fails at the
call site, this one fails silently at render and looks like a styling problem.

The same dead `badge` is in the sibling cards — `DashListCard`, `DashChartCard`
and `DashAlertCard` all take it and all call `CardHeader` with three arguments.

## The fix

Either direction closes it; **forwarding is the better one** — the slot is
genuinely useful and the name is already right:

```jsx
// CardHeader.jsx
const CardHeader = ({ icon, title, subtitle, badge }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      {icon && <Icon name={icon} size={24} className="text-oq-88" />}
      <span className="dash-title">{title}</span>
      {badge && <span className="ml-auto">{badge}</span>}
    </div>
    {subtitle && <span className="dash-detail text-fg-64">{subtitle}</span>}
  </div>
)
```

then pass `badge={badge}` in `DashTableCard`, `DashListCard`, `DashChartCard`,
`DashAlertCard`.

If the slot is not wanted, delete `badge` from all four signatures instead — a
call site then fails visibly rather than silently.

## Rejected alternative

**Consumers use `footer` for the badge.** That is what kol-chess did as a
stopgap and it is wrong: `footer` renders inside
`<span className="dash-detail text-fg-64">`, so a `Badge` node lands nested in
muted detail text and inherits a type role it should not. kol-chess ended up
keying severity off `icon` instead, which works but spends the icon slot on
something the icon is not for.

## Definition of done

- [ ] `<DashTableCard badge={<Badge/>} />` renders the badge
- [ ] Same for `DashListCard`, `DashChartCard`, `DashAlertCard` — or `badge` is gone from all four
- [ ] Existing call sites that pass no `badge` are pixel-unchanged

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-dashboards` 0.3.0.**

**One card was dead, not four.** The ticket's premise held for `DashTableCard`
only — it destructured `badge` and called `CardHeader` with three arguments.
The siblings were already alive:

| Card | Before | After |
|---|---|---|
| `DashTableCard` | destructured, dropped — **dead** | renders `<Badge>{badge}</Badge>` |
| `DashListCard` | renders it, `justify-between` row | unchanged |
| `DashChartCard` | renders it, right-hand column beside `currentValue` | unchanged |
| `DashFeaturedCard` | renders it, `self-start` above the header | unchanged |
| `DashAlertCard` | **has no `badge` prop at all** — its chip is `trendValue` | unchanged |

So there was nothing to fix in the three that work, and nothing to remove from
`DashAlertCard`. `<DashAlertCard badge={…} />` fails the way the ticket wants a
dead prop to fail: it is not in the signature, so it lands in no destructure.

**The fix is `DashListCard`'s shape, not a new `CardHeader` prop.** The ticket
proposed threading `badge` through `CardHeader`. Rejected: three of the four
cards place their badge *outside* the header on purpose — chart stacks it over
`currentValue`, featured sits it above the title — and none of those placements
survive a move into the shared header. Adding a `badge` slot there would have
created a second way to place a badge on one card family, and the two would
drift. `DashTableCard` now wears the sibling pattern verbatim:

```jsx
<div className="flex justify-between items-start">
  <CardHeader icon={icon} title={title} subtitle={subtitle} />
  {badge && <Badge>{badge}</Badge>}
</div>
```

**`badge` is CONTENT, not a node.** The house contract, set by the three live
cards: the card owns the `<Badge>` wrapper, the consumer passes the label.
`badge="WEAKNESS"`, not `badge={<Badge>WEAKNESS</Badge>}` — the second nests a
badge inside a badge. The DoD line `<DashTableCard badge={<Badge/>} />` is
therefore closed by the *string* form; a node still renders, it just renders
inside a chip.

**⚠️ The severity case is not fully served, and that is a separate ask.**
`Badge` carries the tones (`error` · `warning` · `info` · `success`), but no
dash card exposes them — all four hardcode `<Badge>` at `variant="default"`.
A WEAKNESS/STRENGTH/NOTE chip renders as three identical grey pills. Closing
that means a `badgeVariant` seam on four cards; it is new API on a shared
family and was not this ticket's ask, so it is not invented here. File it if
`/insights` still needs the colour.

### Definition of done
- [x] `<DashTableCard badge="…" />` renders the badge
- [x] `DashListCard` · `DashChartCard` · `DashFeaturedCard` verified already rendering it; `DashAlertCard` never accepted it
- [x] Existing call sites pixel-unchanged — no consumer in the estate passes
      `badge` to `DashTableCard`, and the wrapper is inert when it is absent
- [x] 25 gates: `props` clean, `syntax` clean, `roster` clean

**Not screen-verified** — source and gates only, no server was started.
