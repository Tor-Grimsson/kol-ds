import CopyButton from '../atoms/CopyButton.jsx'

export default function CodeBlock({ children, language }) {
  return (
    <div className="kol-codeblock">
      {language && <span className="kol-codeblock-lang">{language}</span>}
      <CopyButton text={String(children)} className="kol-codeblock-copy" />
      <pre><code>{children}</code></pre>
    </div>
  )
}
