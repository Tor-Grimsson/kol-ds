/**
 * ProsePreview — A style collection in one view: every block a reading surface draws, set in ONE named collection's
 * styles, so the collection can be reviewed end to end. Built from the collection's own parts — its text roles, its pull
 * quote, its indent and its code block are the theme's named classes; no style is written in this file
 * (plan-2026-11-07-figma-library-tiers 2.8, the user: *"should it not be made from other components? f.e. text style
 * component, pull quote component, spacer component … it could be great and display workshop style, document style"*).
 *
 *   collection="prose" (default) — the long-form stylesheet: `.kol-prose` element styles (H1–H4, p, blockquote, pre,
 *                                  lists) with `.kol-prose-indented` and `.kol-prose-pullout`. Today's view.
 *   collection="doc"             — the documentation roles the workshop's DocumentationReader and the doc pages read:
 *                                  `kol-doc-heading` · `-section-title` · `-lede` · `-body` · `-code` · `-caption`
 *                                  (kol-type-roles.css), with the doc callout for the quote.
 *
 * A utility (`utilities/`): it wears the theme's sets and imports no molecule. A collection is a map, block → class, in
 * COLLECTIONS below — a new collection is a new row, never new styling.
 *
 * @param {'prose'|'doc'} collection  which style set (default `prose`)
 * @param {string} h1        trailing text of the H1 (rendered as `H1 — {h1}`)
 * @param {string} paragraph body paragraph text
 * @param {string} code      contents of the code block
 * @param {string} pullout   trailing text of the pullout (rendered as `Pullout — {pullout}`)
 * @param {string} quote     blockquote text
 */

const LEDE = 'Section lede — a larger paragraph used to introduce a section and establish tone before the body copy begins.'
const INDENT = 'Indented passage. Used for tangential copy, contextual notes, or nested argument that supports the main line.'

/* block → the collection's own class. `null` = the collection styles the bare element (prose's element sheet). */
const COLLECTIONS = {
  prose: {
    /* carried through verbatim from the one-block version, so `prose` renders exactly as before */
    root: 'kol-prose', h1: null, h2: null, h3: null, h4: null, lede: 'kol-sans-body-01 text-strong mb-6', body: null,
    quote: null, indent: 'kol-prose-indented', code: 'bg-fg-04 border border-fg-08',
    pullout: 'kol-prose-pullout kol-helper-12 tracking-widest text-body', list: null,
  },
  doc: {
    root: 'kol-doc-page', h1: 'kol-doc-heading', h2: 'kol-doc-section-title', h3: 'kol-doc-section-title', h4: 'kol-doc-eyebrow',
    lede: 'kol-doc-lede', body: 'kol-doc-body', quote: 'docs-callout kol-doc-body', indent: 'kol-prose-indented kol-doc-body',
    code: 'kol-doc-code', pullout: 'kol-doc-caption', list: 'kol-doc-body',
  },
}

export default function ProsePreview({ collection = 'prose', h1, paragraph, code, pullout, quote = 'Above as below — justice is a starfield.' }) {
  const c = COLLECTIONS[collection] ?? COLLECTIONS.prose
  const k = (block) => c[block] ?? undefined
  return (
    <div className={c.root} data-collection={collection}>
      <h1 className={k('h1')}>H1 — {h1}</h1>
      <h2 className={k('h2')}>H2 — Section title</h2>
      <h3 className={k('h3')}>H3 — Subsection</h3>
      <h4 className={k('h4')}>H4 — Block title</h4>
      <p className={k('lede')}>{LEDE}</p>
      <p className={k('body')}>{paragraph}</p>
      <blockquote className={k('quote')}><p>{quote}</p></blockquote>
      <div className={k('indent')}><p>{INDENT}</p></div>
      <pre className={k('code')}><code>{code}</code></pre>
      <p className={k('pullout')}>Pullout — {pullout}</p>
      <ul className={k('list')}>
        <li>Unordered list — item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ul>
      <ol className={k('list')}>
        <li>Ordered list — item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ol>
    </div>
  )
}
