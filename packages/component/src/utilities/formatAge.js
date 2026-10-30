/* formatAge — how long ago, in the fewest characters: `now` under an hour, `5h` under a day, `3d` after. record's board
 * reads a card's time in its column this way (DocumentLibraryAndBoardParts, kol-website 2026-10-29). '' for no time. */
export default function formatAge(ms, now = Date.now()) {
  if (!ms) return ''
  const d = now - ms
  if (d < 36e5) return 'now'
  if (d < 864e5) return `${Math.floor(d / 36e5)}h`
  return `${Math.floor(d / 864e5)}d`
}
