import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'
import ErrorBoundary from './ErrorBoundary.jsx'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard blocked — no-op */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 kol-mono-12 rounded-[var(--kol-radius-sm)] px-2 py-1 text-meta hover:text-emphasis hover:bg-fg-04 transition-colors"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      <Icon name={copied ? 'check' : 'copy'} size={13} />
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/**
 * shadcn-style preview block: a bordered card with Preview / Code tabs.
 * Preview renders the live demo (error-boundaried); Code shows the snippet
 * with a copy button. `render` is a component or element; `code` is a string.
 */
export default function ComponentPreview({ render, code, align = 'center' }) {
  const [tab, setTab] = useState('preview')
  const Demo = render
  const alignCls = align === 'start' ? 'items-start justify-start' : 'items-center justify-center'

  return (
    <div className="rounded-[var(--kol-radius-sm)] border border-fg-12 overflow-hidden">
      <div className="flex items-center gap-1 border-b border-fg-12 px-2 py-1.5">
        {['preview', 'code'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 capitalize transition-colors ${
              tab === t ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'
            }`}
            aria-selected={tab === t}
            role="tab"
          >
            {t}
          </button>
        ))}
        {tab === 'code' && code && (
          <div className="ml-auto">
            <CopyButton text={code} />
          </div>
        )}
      </div>

      {tab === 'preview' ? (
        <div className={`flex ${alignCls} flex-wrap gap-3 p-8 min-h-[8rem] bg-fg-02`}>
          {Demo ? (
            <ErrorBoundary>{typeof Demo === 'function' ? <Demo /> : Demo}</ErrorBoundary>
          ) : (
            <span className="kol-mono-12 text-meta opacity-60">
              no live preview — see code + usage below
            </span>
          )}
        </div>
      ) : (
        <pre className="kol-mono-12 whitespace-pre-wrap overflow-x-auto px-4 py-3 bg-fg-04 text-fg">
          {code || '// no canonical snippet'}
        </pre>
      )}
    </div>
  )
}
