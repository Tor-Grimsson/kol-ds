import LockupLab from './LockupLab.jsx'

/**
 * @deprecated 2026-10-29 — `LockupLab` (the lab family's name, BrandLabToolGaps). Same component, same props; drops when
 * nobody imports it (04-retirements.md).
 * LockupBuilder — A product lockup, generated from a name. The old name of LockupLab.
 */
export default function LockupBuilder({ parent, presets, ...props }) {
  /* the old props: `parent` was a prop, LockupLab holds it in its value; the first preset seeds the product */
  const first = Object.values(presets ?? {})[0]?.[0]
  return <LockupLab presets={presets} value={props.value ?? { ...(parent ? { parent } : {}), ...(first ? { product: first } : {}) }} {...props} />
}
