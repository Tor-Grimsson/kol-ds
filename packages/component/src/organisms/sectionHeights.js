/* The section family's height ladder, as MIN-height — content may still grow,
 * the content stays vertically centred inside it (SectionSplitHeight →
 * SectionHeightLadder, kol-website 2026-08-27: "we need to set some sizes").
 * Same three names as SectionHero's presets; literal strings — a class built
 * at runtime is not a class (the SPLIT_HEIGHTS lesson). Anything else passes
 * through as a class string. */
/* Each rung also publishes itself as `--kol-section-h`, so a child that must
 * be BOUNDED by the rung — the split's media frame (SectionSplitMediaBounded,
 * 2026-08-27) — can read it. Literal strings, every one. */
export const MIN_HEIGHTS = {
  full: 'min-h-dvh [--kol-section-h:100dvh]',
  80: 'min-h-[70svh] md:min-h-[80vh] [--kol-section-h:70svh] md:[--kol-section-h:80vh]',
  60: 'min-h-[50svh] md:min-h-[60vh] [--kol-section-h:50svh] md:[--kol-section-h:60vh]',
  /* 40 (SectionHeightForty, 2026-08-27): the rung below 60 for a page-foot
   * CTA or a cards band that wants less air; default stays 60 everywhere */
  40: 'min-h-[35svh] md:min-h-[40vh] [--kol-section-h:35svh] md:[--kol-section-h:40vh]',
}
export const minHeightClass = (height) => MIN_HEIGHTS[height] || height
