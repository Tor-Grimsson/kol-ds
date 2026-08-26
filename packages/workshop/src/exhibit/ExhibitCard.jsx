/**
 * ExhibitCard — the specimen header inside an exhibit section: what this
 * variant is called, what it does, and (optionally) its technical line and its
 * prop signature. Recreated from kol-website's local `DesCard` (37L), which
 * every showcase page in that repo imported by relative path.
 *
 * Card-level hierarchy, one rung under the section's own PageSection title:
 * name `kol-card-value` · description `kol-mono-12` · details/code `kol-mono-10`.
 * The type comes from the role classes, never from a utility stack at the call
 * site — the 2026-07-30 law that a component's type lives in its own rule.
 *
 * @param {string} name         variant name — ".text-auto", "Default state"
 * @param {string} [description] one line on what the variant is for
 * @param {string} [details]    technical line — variant trigger, classes used
 * @param {string} [code]       the prop signature, rendered as code
 */
export default function ExhibitCard({ name, description, details, code }) {
  return (
    <div>
      <h4 className="kol-card-value">{name}</h4>

      {description && <p className="kol-mono-12 text-fg-64 mt-2">{description}</p>}

      {details && <p className="kol-mono-10 text-fg-48 mt-1">{details}</p>}

      {code && <code className="block kol-mono-10 text-fg-48 mt-2">{code}</code>}
    </div>
  )
}
