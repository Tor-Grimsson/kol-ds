/* A fenced code block with its language (``` json): a header naming the language with Copy, and the code coloured by
   Prism — oneLight on Folio's light paper, oneDark on its night — on the reader's code ground. A fence that names no
   language (the old archive's indented passages) is not code and stays plain text: `fenceOf` returns null for it. */
import { useContext, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useSettings, CanvasTheme } from './settings'
/* the editor's canvas can differ from the theme (View → Canvas) */
const useTheme = () => { const { theme } = useSettings(); return useContext(CanvasTheme) ?? theme }

const flat = (theme) => ({
  ...theme,
  'pre[class*="language-"]': { ...theme['pre[class*="language-"]'], background: 'transparent', margin: 0, padding: 0, textShadow: 'none', fontSize: '13px', lineHeight: '1.7' },
  'code[class*="language-"]': { ...theme['code[class*="language-"]'], background: 'transparent', textShadow: 'none', fontFamily: 'var(--kol-font-family-mono), ui-monospace, monospace', fontSize: '13px' },
})
const LIGHT = flat(oneLight)
const DARK = flat(oneDark)
const NAME = { js: 'JavaScript', javascript: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', typescript: 'TypeScript', json: 'JSON', css: 'CSS', html: 'HTML', markup: 'HTML', md: 'Markdown', sh: 'Shell', bash: 'Shell', yaml: 'YAML', yml: 'YAML', py: 'Python', python: 'Python' }

/* from react-markdown's <pre> children: the language and the text, or null when the fence names no language */
export function fenceOf(children) {
  const code = Array.isArray(children) ? children[0] : children
  const language = /language-([\w-]+)/.exec(code?.props?.className ?? '')?.[1]
  if (!language) return null
  const text = [].concat(code.props.children ?? '').join('').replace(/\n$/, '')
  return { language, text }
}

/* the languages a code document can be written in — the file extension and Prism's name */
export const CODE_LANGS = [['js', 'javascript', 'JavaScript'], ['jsx', 'jsx', 'JSX'], ['ts', 'typescript', 'TypeScript'], ['json', 'json', 'JSON'], ['css', 'css', 'CSS'], ['py', 'python', 'Python'], ['sh', 'bash', 'Shell'], ['yaml', 'yaml', 'YAML']]
export const prismOf = (ext) => CODE_LANGS.find(([e]) => e === ext)?.[1] ?? ext

/* one source line, coloured — the editor's code mode draws its mirror with this, so the characters never move */
export function CodeLine({ language, line }) {
  const theme = useTheme()
  const style = theme === 'dark' ? DARK : LIGHT
  return (
    <SyntaxHighlighter language={language} style={style} PreTag="span" CodeTag="span"
      customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: 'inherit', lineHeight: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'inline' }}
      codeTagProps={{ style: { fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', whiteSpace: 'pre-wrap', background: 'transparent' } }}>
      {line}
    </SyntaxHighlighter>
  )
}

export default function Fence({ language, text }) {
  const theme = useTheme()
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400) }).catch(() => {})
  return (
    <div data-wide className="overflow-hidden rounded-[3px] border border-folio-rule bg-[color-mix(in_oklab,var(--color-folio-ink)_4%,var(--color-folio-paper))]">
      <div className="flex h-[36px] items-center justify-between border-b border-folio-rule px-[14px]">
        <span className="font-[family-name:var(--kol-font-family-mono)] text-[11px] font-medium uppercase tracking-[0.72px] text-folio-muted">{NAME[language] ?? language}</span>
        <button type="button" onClick={copy} className="kol-reader-meta rounded-[3px] px-[8px] py-[4px] text-folio-muted hover:bg-folio-surface hover:text-folio-ink">{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <div className="overflow-x-auto px-[16px] py-[14px]">
        <SyntaxHighlighter language={language} style={theme === 'dark' ? DARK : LIGHT} wrapLongLines>{text}</SyntaxHighlighter>
      </div>
    </div>
  )
}
