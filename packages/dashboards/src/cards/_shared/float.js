/* the float sheet (float-everything W7, 2026-11-04): the classes every float card wears, from the exploration's own
 * values — a 20 sheet (`--kol-float-menu-r`) on the secondary surface, Inter through the kol-float-* roles, no rim
 * (W0.4: the exploration's 7% white edge stays out). `WELL` is the sunken pill / field ground inside a sheet
 * (`--kol-float-well`); `PRESS` the pressable sheet's hover lift (fg-08, W0.7) and the 2px focus ring (W0.2). */
export const SHEET = 'bg-surface-secondary rounded-[var(--kol-float-menu-r)] min-w-0'
export const WELL = { background: 'var(--kol-float-well)' }
export const PRESS = 'transition-colors hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]'
