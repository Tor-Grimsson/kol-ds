/* The Code format's editor (plan W19): CodeMirror 6 in Folio's colours. A textarea over coloured lines (16.4) could not
   fold, mark errors in the gutter or draw a minimap, so Code alone moved here; Markdown and Text keep their own editors.
   The parent owns the text (`value` / `onChange`) and reaches the view through `viewRef` for its menus. */
import { useEffect, useRef } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { history, defaultKeymap, historyKeymap, indentWithTab, indentSelection } from '@codemirror/commands'
import { foldGutter, foldKeymap, indentOnInput, bracketMatching, syntaxHighlighting, defaultHighlightStyle, StreamLanguage } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { linter, lintGutter, lintKeymap } from '@codemirror/lint'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { css } from '@codemirror/lang-css'
import { python } from '@codemirror/lang-python'
import { yaml } from '@codemirror/lang-yaml'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { showMinimap } from '@replit/codemirror-minimap'
import { client } from './client'

const LANG = {
  js: () => javascript(), jsx: () => javascript({ jsx: true }), ts: () => javascript({ typescript: true }),
  json: () => json(), css: () => css(), py: () => python(), yaml: () => yaml(), sh: () => StreamLanguage.define(shell),
}
const look = (zoom) => EditorView.theme({
  '&': { height: '100%', color: 'var(--color-folio-ink)', backgroundColor: 'transparent', fontSize: `${(14 * zoom) / 100}px` },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { fontFamily: 'var(--kol-font-family-mono), ui-monospace, monospace', lineHeight: '1.72' },
  '.cm-content': { caretColor: 'var(--color-folio-ink)', paddingBottom: '40px' },
  '.cm-cursor': { borderLeftColor: 'var(--color-folio-ink)' },
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none', color: 'var(--color-folio-muted)', paddingLeft: '40px' },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'color-mix(in oklab, var(--color-folio-ink) 4%, transparent)' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, .cm-content ::selection': { backgroundColor: 'color-mix(in oklab, var(--color-folio-green) 24%, transparent) !important' },
  '.cm-matchingBracket': { backgroundColor: 'color-mix(in oklab, var(--color-folio-green) 22%, transparent)', outline: 'none' },
  '.cm-foldGutter span': { padding: '0 6px', cursor: 'pointer' },
  '.cm-foldPlaceholder': { backgroundColor: 'var(--color-folio-surface)', border: '1px solid var(--color-folio-rule)', color: 'var(--color-folio-muted)', padding: '0 6px' },
  '.cm-tooltip': { backgroundColor: 'var(--color-folio-paper)', border: '1px solid var(--color-folio-rule)', color: 'var(--color-folio-ink)' },
  '.cm-diagnostic': { fontFamily: 'var(--kol-font-family-mono), monospace', fontSize: '12px' },
  '.cm-minimap-gutter': { borderLeft: '1px solid var(--color-folio-rule)' },
  '.cm-minimap-overlay': { backgroundColor: 'var(--color-folio-ink) !important' },
})
const MAP = showMinimap.compute(['doc'], () => ({ create: () => ({ dom: document.createElement('div') }), displayText: 'blocks', showOverlay: 'always' }))

/* "Format document" (19.5): the language re-indents every line, then trailing spaces go, leading tabs become two
   spaces, runs of blank lines fold to one, and the file ends on one newline */
export function formatDocument(view) {
  const all = { anchor: 0, head: view.state.doc.length }
  const keep = view.state.selection.main.head
  view.dispatch({ selection: all })
  indentSelection(view)
  const text = view.state.doc.toString().split('\n')
    .map((l) => l.replace(/^\t+/, (t) => '  '.repeat(t.length)).replace(/[ \t]+$/, ''))
    .join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n*$/, '\n')
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text }, selection: { anchor: Math.min(keep, text.length) } })
}

export default function CodeEditor({ value, onChange, ext, dark, zoom = 100, minimap = true, viewRef, onProblems }) {
  const host = useRef(null)
  const parts = useRef({ lang: new Compartment(), paint: new Compartment(), size: new Compartment(), map: new Compartment() })
  const latest = useRef({})
  latest.current = { onChange, onProblems, ext }

  useEffect(() => {
    const p = parts.current
    const view = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(), foldGutter(), lintGutter(), highlightActiveLine(), highlightActiveLineGutter(), drawSelection(),
          history(), indentOnInput(), bracketMatching(), closeBrackets(), EditorState.tabSize.of(2),
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...foldKeymap, ...lintKeymap, indentWithTab]),
          p.lang.of(LANG[ext]?.() ?? []),
          p.paint.of(syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle)),
          p.size.of(look(zoom)),
          p.map.of(minimap ? MAP : []),
          /* 19.2 — the check runs through the client (record: its dev server) a moment after typing stops */
          linter(async (v) => {
            const out = await Promise.resolve(client().check?.({ ext: latest.current.ext, source: v.state.doc.toString() }))
              .then((r) => r ?? { problems: [] }).catch(() => ({ problems: [] }))
            const problems = (out.problems ?? []).filter((d) => d.to <= v.state.doc.length)
            latest.current.onProblems?.({ errors: problems.filter((d) => d.severity === 'error').length, warnings: problems.filter((d) => d.severity === 'warning').length })
            return problems
          }, { delay: 400 }),
          EditorView.updateListener.of((u) => { if (u.docChanged) latest.current.onChange(u.state.doc.toString()) }),
        ],
      }),
    })
    if (viewRef) viewRef.current = view
    return () => { view.destroy(); if (viewRef) viewRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* the parent changed the text (find & replace, a format switch) — take it without losing the history */
  useEffect(() => {
    const view = viewRef?.current
    if (view && value !== view.state.doc.toString()) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
  }, [value, viewRef])
  useEffect(() => { viewRef?.current?.dispatch({ effects: parts.current.lang.reconfigure(LANG[ext]?.() ?? []) }) }, [ext, viewRef])
  useEffect(() => { viewRef?.current?.dispatch({ effects: parts.current.paint.reconfigure(syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle)) }) }, [dark, viewRef])
  useEffect(() => { viewRef?.current?.dispatch({ effects: parts.current.size.reconfigure(look(zoom)) }) }, [zoom, viewRef])
  useEffect(() => { viewRef?.current?.dispatch({ effects: parts.current.map.reconfigure(minimap ? MAP : []) }) }, [minimap, viewRef])

  return <div ref={host} className="min-h-0 flex-1 overflow-hidden [&_.cm-editor]:h-full" />
}
