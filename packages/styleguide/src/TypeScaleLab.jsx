import TypeLab from './TypeLab.jsx'

/**
 * @deprecated 2026-10-29 — `TypeLab` (the lab family's name, BrandLabToolGaps), which also sets the roles. Same value
 * (`{ base, ratio }` still works); drops when nobody imports it (04-retirements.md).
 * TypeScaleLab — A brand's type, generated. The old name of TypeLab.
 */
export default function TypeScaleLab(props) {
  return <TypeLab {...props} />
}
