/**
 * TagPath — a tag is a PATH, not a string.
 *
 * User ruling 2026-08-01: "nested tags… its a feature not a shape."
 * `domain/components/atoms` printed flat, so the namespace read as noise
 * inside the name. The namespace dims and the LEAF carries — the same
 * hierarchy the taxonomy already declares (ten top-level namespaces,
 * `engine/doc-helpers.js` NAMESPACE_COLORS).
 *
 * Extracted out of TagModeOverlay 2026-08-01 when the frontmatter panel
 * became the second surface that needed it — every place a tag renders reads
 * from here rather than growing a second spelling.
 */
export default function TagPath({ tag }) {
  const parts = String(tag).replace(/^#/, '').split('/')
  const leaf = parts.pop()
  if (!parts.length) return leaf
  return (
    <>
      {/* 64, not 32 (user ruling 2026-08-01). The namespace dims — it does not
        * disappear. At 32 the prefix dropped so far under the leaf that a
        * nested tag read as a one-word tag with dirt in front of it. */}
      <span className="text-fg-64">{parts.join('/')}/</span>
      {leaf}
    </>
  )
}
