import CopyButton from '../atoms/CopyButton.jsx'

/**
 * CodeBlock — a chrome'd code block with language chip, filename chip, and copy.
 *
 * Accepts three input shapes (first match wins per field):
 *   • Portable Text: `value={{ code, language, filename }}` — the Sanity code-block
 *     object can be passed straight through from a portable-text map.
 *   • Direct props: `code` / `language` / `filename`.
 *   • Children: `<CodeBlock language="js">{'…'}</CodeBlock>` (the original API).
 *
 * DOM order is copy → filename → lang → pre so the `.kol-codeblock-*` + pre
 * adjacency rules in the chrome CSS can pad the pre when chips are present.
 */
export default function CodeBlock({ children, code, language, filename, value }) {
  const src = code ?? value?.code ?? children
  const lang = language ?? value?.language
  const file = filename ?? value?.filename
  return (
    <div className="kol-codeblock">
      <CopyButton text={String(src ?? '')} className="kol-codeblock-copy" />
      {file && <span className="kol-codeblock-filename">{file}</span>}
      {lang && <span className="kol-codeblock-lang">{lang}</span>}
      <pre><code>{src}</code></pre>
    </div>
  )
}
