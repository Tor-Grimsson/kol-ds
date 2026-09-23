import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from './CopyButton.jsx'

/**
 * CodeBlock — REPLICATED from the elder reference
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
export default function CodeBlock({ children, code: codeProp, language: languageProp, filename: filenameProp, value, bare = false, size = 'md', copy = true }) {
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
