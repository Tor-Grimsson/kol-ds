---
component: FloatingStyleAndSignInDemos
source: kol-fxr — canvas "FXR logged-out Home", page Round 3 (https://claude.ai/artifact/W81QSMMdZXXWFrFBtGWjZP); kol-shell HubHome.jsx#L262-L277 · PhoneNav · TransportPill; kol-theme kol-components-shell.css .kol-more-sheet
staged: 2026-10-30
status: draft
deps: [HubHome, PhoneNav, TransportPill, HomeMenu, Tooltip, Button, Input, Modal]
---

# FloatingStyleAndSignInDemos

**Raised:** user, 2026-10-30, reviewing fxr's signed-out Home, its sign in and the floating nav over three canvas rounds. On the rounded shapes: *"we are actually introducing a new style … we dont have rounded buttons and inputs and controls"*. On the ask: *"include in the ticket … 2 demo pages"* — sign in / sign up as rail or overlay, desktop and mobile; and *"the Floating style. and actually the current style as well"*, side by side, plus a page *"that shows us what we have with the ability to change style"*. Also: *"DS should consider hosting such a page on showcase — its a great reference"* (the AppFloatNav board). The user needs this in another repo too.

**The frames are the spec** — canvas page **Round 3**: desktop Home, desktop sign in, phone Home, phone sign-in modal (the user's own layout, keep it), phone column (compare), and the AppFloatNav reference board.

## 1. The floating style (B) beside the current one (A)
A second style KOL can switch on with one wrapper, so nothing gets a hand-rounded copy:

| Part | Value |
|---|---|
| Outer surface | `surface-secondary`; a pill (999) for bars, radius 24 for boxes and menus |
| Inset | 6 |
| Inner radius | 18 (24 − 6) for every row, input and button inside |
| Control height | 44 |

Inside the wrapper, `Button`, `Input` and menu rows take these shapes by themselves. A (today's square controls) stays the default.
- **Menus have no border by default.** `.kol-more-sheet` draws `1px solid var(--kol-oq-08)`; make it a prop, off unless asked.
- **The raised shadow becomes a token.** Over a clashing canvas the nav is lifted with fxr's local `0 8px 24px -8px rgba(0,0,0,.4), 0 2px 6px -2px rgba(0,0,0,.3)` (`kol-fxr src/editor/styles/kol-editor.css:468`) — KOL has no float shadow today.
- **Hover is KOL's `Tooltip`**, not a hand-drawn chip.

## 2. AppFloatNav — one floating nav, its variants
The user's name. Today these are `PhoneNav` (`variant="dock"` · `"panel"`, `shape="pill"`) and `TransportPill`; the board shows them as one family:
- **Desktop and phone:** the app's rail rows in rail order (fxr: Editor, Labs, Randomiser, Morph), then **···**, which opens the whole nav (Library, New File, Walkthrough, Sign in, Settings) and turns into ×.
- **A row with `sub` opens its rows above it** (fxr: Randomiser → Generate, Effects).
- **Labs:** the top pill (Home, Catalog, Params, Transport, More) and the transport (Play, Pause, Loop length, Stop, Rewind).
- **Hover:** the KOL tooltip with the row's name.

## 3. Sign in over Home
- **Desktop:** the app's sign-in column (672, `surface-primary`) slides in from the left over Home. The logomark stays exactly where it is, above the column. The rest of Home turns `surface-secondary` and the `stage` re-centres in what is left; the + and the nav stay. Form order: eyebrow, Email, Password, the "Don't have an account? Sign up" line, then the button.
- **Phone:** the sign-in box in style B, centred over the stage as the user drew it; the nav stays.
- **The + on the phone too.** `HomeMenu` on the signed-out page is `max-md:hidden`; the phone has no way to sign in from Home. Show it top-right on the logomark's line (16 / 24).

## 4. Two demo apps
- **`apps/style`** (name yours) — the basic components in A and B side by side: Button, Input, menu rows, the nav, the tooltip, the raised shadow.
- **`apps/modal`** (name yours; `apps/overlays` and `apps/rails` exist and may be the home) — sign in and sign up presented every way they can appear: the rail over Home, a centred overlay, the phone box, the phone column. A switch for style A / B and for desktop / phone.

## 5. Showcase
The AppFloatNav board (canvas, Round 3) as a showcase page.

## Done when
`apps/style` and `apps/modal` exist with A and B; style B is one wrapper; menus are borderless by default; the float shadow is a token; AppFloatNav covers the board's variants; HubHome takes the sign-in column over Home and shows the + on the phone — and fxr can pass data (its rows, its sign-in page) with no local styling.

## Built — 2026-10-31
W16 of `.kol/llm-context/plan-2026-10-31-figma-library.md` — round 3 (https://claude.ai/artifact/VMiZCd6QZm5PRaWc4Yy4yF) in the code; not published, not closed (main does that).
- kol-theme: `--kol-glass-dark-*` · `--kol-glass-light-*`, `--kol-float-*` sizes (touch row on `pointer: coarse`), `--kol-float-well`; `.kol-float-solid|glass-dark|glass-light` (+ `.kol-float-m`), reduced transparency → solid; float Button/Input/menu are capsules at round 3's sizes; `.kol-tooltip-float` · `.kol-seg--float` · `.kol-tabs-float`.
- kol-component: `Tooltip` / `SegmentedToggle` / `TabsRow` `variant="float"`, `floatSurfaceClass`; the TabsRow pill is 66 / 56 / 4 gap / 28 glyphs with `surface`, `split`, `labels`.
- kol-shell: `AppFloatNav surface` (all four variants, ··· as its own 66 circle 8 off), `labels`; `AccountForm surface` (box 340 · r 28 · 20 in).
- Showcase: `showcase/src/previews/AppFloatNav.jsx` (every variant × surface + the float controls) and `AccountForm.jsx`.
- Verified: Playwright, mouse and touch (hasTouch + coarse) × light and dark — 1944 checks within 1px, 0 fails; glass fills, backdrop-filter and box-shadow probed equal to the tokens.

## ✅ RESOLUTION — 2026-10-31 · kol-theme@0.203.0 · kol-component@0.320.0 · kol-shell@0.92.0

The float style is accepted (user 2026-10-31: both glass styles, round 3) and replaces the provisional values. kol-theme 0.203.0: --kol-glass-dark-* / --kol-glass-light-* (fill, blur 6/16 saturate 1.8, rim, shadows) and --kol-float-* sizes (mouse 28/36/44, touch 36/44/52 on pointer: coarse), .kol-float-solid|glass-dark|glass-light (+ .kol-float-m), reduced transparency to solid; glass-dark carries dark ink in either theme. kol-component 0.320.0: Tooltip, SegmentedToggle and TabsRow variant="float", surface; the TabsRow pill 66 tall, 56 slots, split and labels (tabbarPillWidth() values changed). kol-shell 0.92.0: AppFloatNav surface on all four variants + labels, AccountForm box surface (340, r 28). Showcase /components/app-float-nav. Measured: every shape x surface x mouse/touch x light/dark matches round 3 within 1px (1944 checks, 0 fails).

**Remainder here:** none — kol-fxr bump kol-theme 0.203.0 · kol-component 0.320.0 · kol-shell 0.92.0; pass surface= where a float sits over a stage.

