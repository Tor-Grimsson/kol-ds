/* Fenced code in Folio: `fenceOf` reads a fence's language and text off react-markdown's <pre>, which renders as KOL's
   CodeBlock variant="folio" (its header, Copy and Prism colouring live there since Folio batch E). A fence that names no
   language (the old archive's indented passages) is not code and stays plain text: `fenceOf` returns null for it. */
import { useContext } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useSettings, CanvasTheme } from './settings'
/* the editor's canvas can differ from the theme (View → Canvas); a code block is dark when this says 'dark' */
export const useCodeTheme = () => { const { theme } = useSettings(); return useContext(CanvasTheme) ?? theme }

const flat = (theme) => ({
  ...theme,
  'pre[class*="language-"]': { ...theme['pre[class*="language-"]'], background: 'transparent', margin: 0, padding: 0, textShadow: 'none', fontSize: '13px', lineHeight: '1.7' },
  'code[class*="language-"]': { ...theme['code[class*="language-"]'], background: 'transparent', textShadow: 'none', fontFamily: 'var(--kol-font-family-mono), ui-monospace, monospace', fontSize: '13px' },
})
const LIGHT = flat(oneLight)
const DARK = flat(oneDark)

/* from react-markdown's <pre> children: the language and the code (CodeBlock's words), or null when the fence names no language */
export function fenceOf(children) {
  const code = Array.isArray(children) ? children[0] : children
  const language = /language-([\w-]+)/.exec(code?.props?.className ?? '')?.[1]
  if (!language) return null
  const text = [].concat(code.props.children ?? '').join('').replace(/\n$/, '')
  return { language, code: text }
}

/* the languages a code document can be written in — the file extension and Prism's name */
export const CODE_LANGS = [['js', 'javascript', 'JavaScript'], ['jsx', 'jsx', 'JSX'], ['ts', 'typescript', 'TypeScript'], ['json', 'json', 'JSON'], ['css', 'css', 'CSS'], ['py', 'python', 'Python'], ['sh', 'bash', 'Shell'], ['yaml', 'yaml', 'YAML']]
export const prismOf = (ext) => CODE_LANGS.find(([e]) => e === ext)?.[1] ?? ext

/* one source line, coloured — the editor's code mode draws its mirror with this, so the characters never move */
export function CodeLine({ language, line }) {
  const theme = useCodeTheme()
  const style = theme === 'dark' ? DARK : LIGHT
  return (
    <SyntaxHighlighter language={language} style={style} PreTag="span" CodeTag="span"
      customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: 'inherit', lineHeight: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'inline' }}
      codeTagProps={{ style: { fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', whiteSpace: 'pre-wrap', background: 'transparent' } }}>
      {line}
    </SyntaxHighlighter>
  )
}
