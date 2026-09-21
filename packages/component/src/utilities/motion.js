/**
 * motion.js — the JS side of the motion sheet (user ruling 2026-08-28:
 * "localise animation to its own css … and use it to localise all the gsap
 * framer shit we are doing").
 *
 * kol-theme's `kol-animation.css` is where the estate's CSS motion lives. This
 * is its mirror for the motion CSS cannot express — a gsap tween, a framer
 * spring — so a hand-typed `duration: 0.5, ease: "power3.out"` in some
 * component is not a second, private vocabulary. Same numbers, one import.
 *
 * NOT here: a domain's own physics — the foundry's pressure damping, the
 * marquee's px/s, a scroll-scrub timeline. Those are content, not chrome, and
 * flattening them into house constants would say they are interchangeable.
 */

/* The house curves. `HOUSE` is `--kol-ease-house` as framer takes it (a
 * cubic-bezier array); the gsap column is the nearest named equivalent, so a
 * tween and a transition on the same element do not disagree. */
export const EASE = {
  house: [0.4, 0, 0.2, 1],
  houseGsap: 'power2.inOut',
  bounce: [0.34, 1.56, 0.64, 1],
  /* symmetric in-out — an ease-out pops the first 20 % and crawls the rest,
   * which reads as a jerk on a long fade (user, on the rail pill 2026-08-28) */
  longFade: [0.45, 0, 0.55, 1],
  outGsap: 'power3.out',
}

/* Milliseconds, mirroring `--kol-transition-*` in kol-design-tokens.css.
 * `s()` because gsap counts in seconds and framer in seconds — the CSS side is
 * the source, so the conversion lives here rather than at each call site. */
export const DURATION = { fast: 150, base: 200, slow: 300, spring: 500, zoom: 600 }
export const s = (ms) => ms / 1000

/* framer springs. `tilt` is the Tilt family's feel; `lazy` is the grounded
 * chase (heavier, slower to settle) — the two the hook already had inline. */
export const SPRING = {
  tilt: { stiffness: 350, damping: 35 },
  lazy: { stiffness: 250, damping: 25, mass: 0.6 },
}

/* THE RAIL'S GRAB EDGE (RailFlatGrabOpen, kol-mirror 2026-08-28 — kol-r2b2's
 * pill). The chrome is `.kol-rail-grab` in kol-animation.css; these are the
 * numbers JS owns, because they are pointer behaviour, not paint:
 *
 *   near / sleep  the pill wakes within 20px of the line and sleeps only past
 *                 40 — hovering the line itself flapped the class every frame
 *                 and restarted the fade, so the hysteresis is not optional
 *   stick         DWELL, not a grid (user ruling 2026-08-28: "I don't like the
 *                 snapping of the grabber, it's too far — let's make it come to
 *                 the cursor but have some sticky time where it lands, so it's
 *                 not constantly jerking"). The pill targets the pointer's own
 *                 position on the line and re-targets only once the pointer is
 *                 `stick` px away: it lands ON you, holds while you move inside
 *                 the radius, then travels to where you are now.
 *
 *                 It was four marks at 20/40/60/80 % of the edge until this
 *                 ruling — on a ~900px rail that is ~180px apart, so every
 *                 re-target was a long throw to a point the pointer was not at,
 *                 and the dwell read as the pill refusing to come to you and
 *                 then lurching. The earlier "snap to something so it has
 *                 somewhere to stick to" is served by dwell; the grid was the
 *                 wrong model for it.
 *   range         the pill's travel band, BIPOLAR FROM THE MIDDLE (user ruling
 *                 2026-08-28: "can we make sure the grab somehow doesn't go up
 *                 so high? maybe we limit/choke range to bipolar from middle
 *                 85% of 100"). 0.85 = the middle 85 % of the edge, so it is
 *                 held 7.5 % clear of each end — on a 900px rail, y 67 to 833.
 *                 Unclamped it tracked the pointer to within the CSS `clamp()`'s
 *                 36px of the top, which put it beside the logomark and the
 *                 first rung. The band is a fraction, not px, so it scales with
 *                 the viewport instead of pinning a gap that reads differently
 *                 on a laptop and a 27".
 *   travel        the chase. 1.1s, down from 2.8 with the grid: the throw now
 *                 covers a fraction of the distance, and a long tween over a
 *                 short throw reads as lag rather than weight
 *   snap          the width tween on release
 *   slop          under this, a pointerdown/up is a CLICK, not a drag
 */
export const GRAB = {
  near: 20,
  sleep: 40,
  stick: 90,
  range: 0.85,
  travel: { duration: 1.1, ease: EASE.outGsap },
  snap: { duration: 0.5, ease: EASE.outGsap },
  slop: 3,
}

/* THE COLUMN BROWSER'S HANDLES ARE NOT THE RAIL'S (BrowsePageRulingsAndSeams,
 * kol-r2b2 2026-09-02 — user: *"its a bit different, its not like the sidenav.
 * the handles are different from the sidenav"*). Same gesture, its own feel,
 * ruled in kol-r2b2 and running there since 2026-08-28:
 *
 *   travel   2.8s, not 1.1 — a long, unhurried chase
 *   stick    30px, not 90 — a much smaller retarget threshold, so the pill
 *            TRACKS the pointer down the edge instead of landing and holding.
 *            The dwell that fixed the rail's four-mark grid is not what these
 *            want; the deadband exists only so a slow drag does not nudge the
 *            target every frame — and it is measured against the last TARGET,
 *            not the animated value, because mid-flight the live value is still
 *            travelling.
 *   range    1 — no bipolar band. The rail chokes its travel so the pill never
 *            rides up beside the logomark; there is nothing at these edges to
 *            avoid, and the CSS `clamp()` at 2.25rem already stops it flush.
 *
 * `near` / `sleep` are shared — proximity is proximity. The FADE curve differs
 * too and lives with the rule (kol-theme's kol-components-molecules.css). */
export const GRAB_COLUMN = {
  ...GRAB,
  stick: 30,
  range: 1,
  travel: { duration: 2.8, ease: EASE.outGsap },
}
