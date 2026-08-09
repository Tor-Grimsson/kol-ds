import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — nests <Icon> from @kolkrabbi/kol-icons (the copy
 * affordance). The gate only counts kol-component nesting, so a molecule whose
 * only KOL child lives in a sibling package reads as an atom to it. */

/**
 * CodeBlock — REPLICATED from the elder reference
 * (kol-website/packages/ui/src/molecules/CodeBlock.jsx, 2026-07-28 user
 * mandate): react-syntax-highlighter (Prism) with the oneDark theme flattened
 * onto KOL chrome — transparent bg, 14px/1.6 mono, no text-shadow — a single
 * filename-or-language chip, and a 32×32 icon copy button (`copy` glyph →
 * check on copied). Chrome lives in kol-theme (kol-components-molecules.css).
 *
 * Input shapes (first match wins per field):
 *   • Portable Text: `value={{ code, language, filename }}`
 *   • Direct props: `code` / `language` / `filename`
 *   • Children: `<CodeBlock language="js">{'…'}</CodeBlock>`
 *
 * `language` falls back to `'text'`, and a `'text'` block draws NO chip — so a
 * fence that declares nothing renders as an unlabelled slab. That fallback is
 * kept (a chip reading "text" is worse than none) and the fix is upstream:
 * every fence declares a language, enforced by `pnpm validate:fences`.
 *
 * @param {string} [size='md']  'sm' | 'md' — the box and the type step together.
 * @param {boolean} [bare]      drop the FRAME; the host owns it. Not a size.
 */

const CheckMarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.4697 6.41987C19.7626 6.12697 20.2373 6.12697 20.5302 6.41987C20.8231 6.71276 20.8231 7.18752 20.5302 7.48041L10.9443 17.0663C9.87038 18.1401 8.12951 18.1401 7.05561 17.0663L3.46967 13.4804C3.17678 13.1875 3.17678 12.7128 3.46967 12.4199C3.76256 12.127 4.23732 12.127 4.53022 12.4199L8.11615 16.0058C8.60427 16.4938 9.39561 16.4938 9.88373 16.0058L19.4697 6.41987Z" fill="currentColor"/>
  </svg>
)

const syntaxTheme = (foregroundToken = 80) => ({
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    textShadow: 'none',
    letterSpacing: '0',
    overflow: 'visible',
    border: 'none',
    borderRadius: 0,
    color: `color-mix(in srgb, var(--kol-surface-on-primary) ${foregroundToken}%, transparent)`
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: 'var(--kol-font-family-mono)',
    fontSize: '14px',
    textShadow: 'none',
    letterSpacing: '0',
    textDecoration: 'none',
    display: 'block',
    borderRadius: 0,
    border: 'none',
    color: `color-mix(in srgb, var(--kol-surface-on-primary) ${foregroundToken}%, transparent)`
  },
  comment: {
    ...oneDark['comment'],
    fontStyle: 'normal'
  }
})

/* `bare` (2026-07-30): highlight + chip + copy WITHOUT the framed chrome — for
 * hosts that already own the frame (PreviewCard's Code tab sat a full
 * CodeBlock frame inside the kol-doc-figure border: frame-in-frame). */
/* `size` (2026-08-01, user ruling). The block had no size at all — its padding
 * and type size sat in `.kol-codeblock` as unnamed constants, so *"its just
 * whatever its defaulting to"* was literally true and no call site could ask
 * for anything else. `md` is those exact values, named; `sm` is one step down
 * on both axes. Size is INDEPENDENT of `bare`: bare removes the frame, size
 * sets the box, and a bare block still has one. */
export default function CodeBlock({ children, code: codeProp, language: languageProp, filename: filenameProp, value, bare = false, size = 'md' }) {
  const [copied, setCopied] = useState(false)

  const code = String(value?.code ?? codeProp ?? children ?? '')
  const language = value?.language ?? languageProp ?? 'text'
  const filename = value?.filename ?? filenameProp

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — silent */
    }
  }

  return (
    <div className={bare ? '' : 'kol-codeblock-wrapper'}>
      <div className={`kol-codeblock kol-codeblock--${size}${bare ? ' kol-codeblock--bare' : ''}`}>
        {(filename || (language && language !== 'text')) && (
          <div className="kol-codeblock-filename">{filename || language}</div>
        )}
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme(80)}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'visible',
            height: 'auto',
            maxHeight: 'none',
          }}
          wrapLines={true}
          wrapLongLines={true}
          PreTag="div"
          lineProps={{
            style: {
              border: 'none',
              background: 'transparent',
              display: 'block',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
        <button
          type="button"
          className="kol-codeblock-copy"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied!' : 'Copy code'}
          title={copied ? 'Code copied!' : 'Copy code'}
        >
          {copied ? <CheckMarkIcon /> : <Icon name="copy" size={16} />}
        </button>
      </div>
    </div>
  )
}
