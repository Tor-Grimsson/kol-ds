import { useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'

/**
 * LinkAddRow — Add a named link. `name · URL · Add link` (float-everything W3 row 43, 2026-11-04 — the exploration's
 * project links card). One row: the name field, the URL field (mono, `https://…`) taking the room, and the Add
 * button; Enter in either field adds too. `onAdd({ name, url })` fires with both trimmed and the fields clear; the
 * button is disabled until the URL has something. With `title` the row sits under a head — the title at the float
 * body size with the open-in-new glyph linking to `href` — on a sheet (`--kol-float-menu-r`). `variant="float"`
 * draws the capsules; the default is the filled shell.
 *
 * @param {Function} onAdd       `({ name, url }) => void`
 * @param {string}   [title]     the head's name (`kol-vault`)
 * @param {string}   [href]      where the head's ↗ goes
 * @param {string}   [namePlaceholder]  default `Link name`
 * @param {string}   [urlPlaceholder]   default `https://…`
 * @param {string}   [addLabel]  default `Add link`
 * @param {'float'|'filled'|'outline'} [variant]
 * @param {string}   [className]
 */
export default function LinkAddRow({ onAdd, title, href, namePlaceholder = 'Link name', urlPlaceholder = 'https://…', addLabel = 'Add link', variant, className = '' }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const float = variant === 'float'
  const ready = url.trim().length > 0
  const add = () => { if (!ready) return; onAdd?.({ name: name.trim(), url: url.trim() }); setName(''); setUrl('') }
  const onKey = (e) => { if (e.key === 'Enter') add() }
  const row = (
    /* one line where it fits; on a phone the fields wrap, the URL keeping at least 160 */
    <div className="flex flex-wrap items-center gap-2">
      <Input variant={variant} size="md" placeholder={namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKey} className="w-64 max-w-full" />
      <Input variant={variant} size="md" type="url" inputMode="url" placeholder={urlPlaceholder} value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={onKey} width="100%" className="flex-1 min-w-40" inputClassName="font-mono" />
      <Button variant={float ? 'float' : undefined} size="md" tone={float ? 'secondary' : undefined} disabled={!ready} onClick={add}>{addLabel}</Button>
    </div>
  )
  if (!title) return <div className={className}>{row}</div>
  return (
    <div className={`flex flex-col gap-4 ${float ? 'rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4' : ''} ${className}`.trim()}>
      <div className="flex items-center justify-between gap-4">
        <span className="kol-float-body text-fg-emphasis">{title}</span>
        {href && (
          <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${title}`} className="inline-flex text-oq-64 hover:text-oq-96 transition-colors">
            <IconLoader name="arrow-upright" size={18} />
          </a>
        )}
      </div>
      {row}
    </div>
  )
}
