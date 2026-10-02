// The eurorack grid — 1HP = 16px, everything derives from it (kol-monitor's
// `modules/utility/eurorack.js`, lifted 2026-10-01 with the rack frames).

export const HP_PX = 16
export const TOTAL_HP = 104
export const MIN_HP = 2

// Row heights in px, by rack unit. Monitor resolves its row aspect (1U 12:1, 3U 4:1) against the
// 104hp row width, so a row is a definite height everywhere — WebKit does not treat an
// `aspect-ratio` box as a definite height for its percentage-height children (2026-09-02).
export const ROW_HEIGHT = {
  '1u': (TOTAL_HP * HP_PX) / 12, // 138.67
  '3u': (TOTAL_HP * HP_PX) / 4,  // 416
}

// Rail height in px — the dead zone at the top and bottom of each module
export const RAIL_HEIGHT = 14

export const hpToPx = (hp) => hp * HP_PX
