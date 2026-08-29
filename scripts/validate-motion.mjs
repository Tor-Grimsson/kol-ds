#!/usr/bin/env node
/**
 * validate-motion.mjs — the motion sheet stays ONE file (pnpm validate:motion).
 *
 * The law (user, 2026-08-28): *"shouldn't we localise animation to its own
 * css?"* — a rule he had given before and that every agent agreed to and none
 * carried out. `packages/theme/kol-animation.css` is that file: every
 * `@keyframes` in the system, every named motion class, every
 * `prefers-reduced-motion` block.
 *
 * WHY A GATE. The sheet was assembled out of four component files, and nothing
 * stopped a fifth: the next agent adding a keyframe writes it beside the
 * component it moves, exactly as the last six did. That is not carelessness,
 * it is the path of least resistance — so the gate is the thing that has to
 * change, not the intent.
 *
 * THE RULES
 *
 *   M1  No `@keyframes` outside kol-animation.css. Keyframe names are GLOBAL
 *       whichever file declares them, so this costs nothing and buys one place
 *       to read the estate's motion.
 *   M2  Every `@keyframes` name is `kol-*`. A keyframe name is GLOBAL, and the
 *       collision is not hypothetical: **Tailwind's own `animate-pulse` utility
 *       emits `@keyframes pulse`**, and every consumer repo in the estate is on
 *       Tailwind (kol-mirror, 2026-08-28, which carried an unprefixed `pulse`
 *       of its own for a render-cost readout). Two definitions of one name:
 *       source order decides the winner, nothing errors, and the animation
 *       either stops or starts doing something else. The DS shipped `pulse`,
 *       `fadeIn`, `numberTick` and `lineDraw` in its chess pack until the
 *       motion sheet was minted — every one of them a name Tailwind or an app
 *       could also define.
 *
 * NOT a rule: a bare `transition:` inside a component's own rest rule. Pulling
 * those out means two rules for one selector, and two rules for one selector
 * drift — the rest rule owns its easing. Named animations move; per-property
 * easing stays.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const THEME = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'theme')
const HOME = 'kol-animation.css'
const errors = []
const files = readdirSync(THEME).filter((f) => f.endsWith('.css'))
let total = 0

for (const f of files) {
  const src = readFileSync(join(THEME, f), 'utf8')
  for (const m of src.matchAll(/^@keyframes\s+([\w-]+)/gm)) {
    total++
    if (basename(f) !== HOME) {
      errors.push(`\`@keyframes ${m[1]}\` is in ${f} — every keyframe lives in ${HOME} (M1). Move it and leave the rule that uses it where it is.`)
    } else if (!m[1].startsWith('kol-')) {
      errors.push(`\`@keyframes ${m[1]}\` is unprefixed — a keyframe name is global, so it must be \`kol-*\` (M2).`)
    }
  }
}

if (errors.length) {
  console.error(`motion: ${errors.length} violation(s) across ${files.length} sheets\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`motion: clean (${total} keyframes, all in ${HOME}, all kol-* prefixed)`)
