#!/usr/bin/env node
/**
 * check-dragresize-names — the one thing that must not drift when
 * useDragResize became side-agnostic (ThreeColumnEditorShell, 2026-08-15).
 *
 * The generalisation is safe ONLY while the default token reproduces the
 * hardcoded 0.17.0 names exactly. If it ever stops, SideNav silently reads
 * variables nobody writes and persists under keys nobody reads — the rail
 * goes inert on every consumer, with no error anywhere. That is the failure
 * this file exists to catch, and it is a string-equality check, not a suite.
 *
 * ponytail: not wired into `pnpm validate` — validate-all.mjs is a shared
 * file and this is one hook. Run it directly, or add the line when someone
 * owns that file uncontended.
 */
import assert from 'node:assert/strict'
import { buildNames } from '../packages/framework/src/useDragResize.js'

/* The literal 0.17.0 contract, transcribed from the pre-generalisation source
 * — NOT re-derived from buildNames, or the check would pass by construction. */
const SHIPPED = {
  stateKey: 'kol-sidenav',
  widthKey: 'kol-sidenav-w',
  collapsedAttr: 'data-sidenav',
  draggingAttr: 'data-sidenav-dragging',
  wVar: '--kol-sidenav-w',
  collapsedVar: '--kol-sidenav-w-collapsed',
  snapVar: '--kol-sidenav-snap',
  stepVar: '--kol-sidenav-step',
  snapDefaultVar: '--kol-sidenav-snap-default',
}

assert.deepEqual(buildNames('kol-sidenav'), SHIPPED,
  'DEFAULT TOKEN DRIFTED — SideNav would go inert on every consumer')

/* The inspector rail the ticket asked for, so a typo in the derivation
 * surfaces here rather than as a dead gesture in an editor. */
const rail = buildNames('kol-rail')
assert.equal(rail.wVar, '--kol-rail-w')
assert.equal(rail.collapsedAttr, 'data-rail')
assert.equal(rail.draggingAttr, 'data-rail-dragging')
assert.equal(rail.stateKey, 'kol-rail')
assert.equal(rail.widthKey, 'kol-rail-w')

/* A token without the kol- prefix must not produce `data-` with nothing after
 * it — the attribute would be unselectable. */
assert.equal(buildNames('inspector').collapsedAttr, 'data-inspector')

console.log('check-dragresize-names: clean — default token byte-identical to 0.17.0')
