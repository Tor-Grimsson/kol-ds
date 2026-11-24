import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from './CopyButton.jsx'

/**
 * CodeBlock — Highlighted code with a copy button. REPLICATED from the elder reference
 * (kol-website/packages/ui/src/molecules/CodeBlock.jsx, 2026-07-28 user
 * mandate): react-syntax-highlighter (Prism) with the oneDark theme flattened
 * onto KOL chrome — transparent bg, 14px/1.6 mono, no text-shadow — a single
 * filename-or-language chip, and the CopyButton atom positioned in-frame
 * (.kol-codeblock-copy). Chrome lives in kol-theme (kol-components-molecules.css).
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
    /* THE BLOCK WRAPS (06-code-surface.md: Block · pre-wrap + overflow-x auto)
     * and this is the one place that decides it. oneDark's code style carries
     * `whiteSpace: 'pre'`, and react-syntax-highlighter spreads the theme's
     * code style AFTER its own `wrapLongLines` pre-wrap — so the prop, the
     * .kol-codeblock rule and customStyle all said wrap while the <code>
     * computed `pre`, and every long line scrolled instead (measured on
     * /stack/vcap at 393: block 359 wide, content 465–759, CodeBlockMobile-
     * Overflow, kol-website 2026-08-25). */
    whiteSpace: 'pre-wrap',
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
function CodeBlockDefault({ children, code: codeProp, language: languageProp, filename: filenameProp, value, bare = false, size = 'md', copy = true }) {
  const code = String(value?.code ?? codeProp ?? children ?? '')
  const language = value?.language ?? languageProp ?? 'text'
  const filename = value?.filename ?? filenameProp

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
          /* `kol-codeblock-line` names each wrapped line so the theme can
           * reserve the copy control's lane on the FIRST one when no chip row
           * exists (kol-components-molecules.css). */
          lineProps={{
            className: 'kol-codeblock-line',
            style: {
              border: 'none',
              background: 'transparent',
              display: 'block',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
        {/* `copy={false}` (2026-09-23): a PREVIEW of a file is not a snippet to lift — the file's
          * own copy action lives on its card (user: *"thats a feature in grid mode"*). */}
        {copy && <CopyButton text={code} className="kol-frame-control" />}
      </div>
    </div>
  )
}

/* ── folio (Folio batch E, 2026-11-22) ─────────────────────────────────────────────────────────────────────────────
 * Folio's fenced code, carried from apps/folio's Fence.jsx: a 36 header naming the language (Folio's names, mono 11
 * capitals, muted) with Copy (Copied for 1.4s), over the code coloured by Prism, oneLight or oneDark flattened onto
 * Folio's code ground (the ink at 4% on the paper), in mono 13 / 1.7, long lines wrapped; a hairline frame at radius 3.
 * CodeBlock's words: `code` (or children) and `language`. Folio's own: `dark` (oneDark for Folio's night; the theme is the
 * caller's, which reads its own reader or canvas). `data-wide` stays on the root: Folio's prose grid runs it full width. */
const flatFolio = (theme) => ({
  ...theme,
  'pre[class*="language-"]': { ...theme['pre[class*="language-"]'], background: 'transparent', margin: 0, padding: 0, textShadow: 'none', fontSize: '13px', lineHeight: '1.7' },
  'code[class*="language-"]': { ...theme['code[class*="language-"]'], background: 'transparent', textShadow: 'none', fontFamily: 'var(--kol-font-family-mono), ui-monospace, monospace', fontSize: '13px' },
})
const FOLIO_LIGHT = flatFolio(oneLight)
const FOLIO_DARK = flatFolio(oneDark)
const FOLIO_NAME = { js: 'JavaScript', javascript: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', typescript: 'TypeScript', json: 'JSON', css: 'CSS', html: 'HTML', markup: 'HTML', md: 'Markdown', sh: 'Shell', bash: 'Shell', yaml: 'YAML', yml: 'YAML', py: 'Python', python: 'Python' }

function CodeBlockFolio({ code: codeProp, children, language, dark = false }) {
  const text = String(codeProp ?? children ?? '')
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400) }).catch(() => {})
  return (
    <div data-wide className="kol-codeblock--folio overflow-hidden rounded-[3px] border">
      <div className="kol-codeblock-head flex h-[36px] items-center justify-between border-b px-[14px]">
        <span className="kol-codeblock-language uppercase">{FOLIO_NAME[language] ?? language}</span>
        <button type="button" onClick={copy} className="kol-folio-meta kol-codeblock-action rounded-[3px] px-[8px] py-[4px]">{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <div className="overflow-x-auto px-[16px] py-[14px]">
        <SyntaxHighlighter language={language} style={dark ? FOLIO_DARK : FOLIO_LIGHT} wrapLongLines>{text}</SyntaxHighlighter>
      </div>
    </div>
  )
}

export default function CodeBlock(props) {
  return props.variant === 'folio' ? <CodeBlockFolio {...props} /> : <CodeBlockDefault {...props} />
}
