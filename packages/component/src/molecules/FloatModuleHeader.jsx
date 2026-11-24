/**
 * @deprecated 2026-11-12 — `FloatModuleHeader` is `RailHeader variant="float"` under its old name (the family word leads).
 * Drops when nobody imports it (04-retirements.md).
 */
import RailHeader from './RailHeader.jsx'

/* taxonomy-ok: molecule — the deprecated name of RailHeader variant="float" */

export default function FloatModuleHeader(props) {
  return <RailHeader variant="float" {...props} />
}
