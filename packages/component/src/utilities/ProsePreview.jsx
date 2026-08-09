/**
 * ProsePreview — a full rich-text specimen: one `.kol-prose` block exercising
 * every long-form element — H1–H4 ladder, section lede, body paragraph,
 * blockquote, indented passage, code block, pullout, and unordered/ordered
 * lists — so the KOL prose stylesheet can be reviewed end-to-end in one view.
 * The "long-form" member of the type-specimen kit.
 *
 * Fixed structure; only the text slots vary. All element styling comes from
 * the prose stylesheet (kol-typography.css) plus the kit's
 * `.kol-prose-indented` / `.kol-prose-pullout` chrome — none lives here.
 *
 * @param {string} h1        trailing text of the H1 (rendered as `H1 — {h1}`)
 * @param {string} paragraph body paragraph text
 * @param {string} code      contents of the <pre><code> block
 * @param {string} pullout   trailing text of the pullout (rendered as `Pullout — {pullout}`)
 * @param {string} quote     blockquote text
 */
export default function ProsePreview({ h1, paragraph, code, pullout, quote = 'Above as below — justice is a starfield.' }) {
  return (
    <div className="kol-prose">
      <h1>H1 — {h1}</h1>
      <h2>H2 — Section title</h2>
      <h3>H3 — Subsection</h3>
      <h4>H4 — Block title</h4>
      <p className="kol-sans-body-01 text-strong mb-6">
        Section lede — a larger paragraph used to introduce a section and
        establish tone before the body copy begins.
      </p>
      <p>{paragraph}</p>
      <blockquote><p>{quote}</p></blockquote>
      <div className="kol-prose-indented">
        <p>
          Indented passage. Used for tangential copy, contextual notes, or
          nested argument that supports the main line.
        </p>
      </div>
      <pre className="bg-fg-04 border border-fg-08"><code>{code}</code></pre>
      <p className="kol-prose-pullout kol-helper-12 tracking-widest text-body">
        Pullout — {pullout}
      </p>
      <ul>
        <li>Unordered list — item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ul>
      <ol>
        <li>Ordered list — item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ol>
    </div>
  )
}
