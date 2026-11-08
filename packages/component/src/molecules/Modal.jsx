import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from '../atoms/Button.jsx'
import Input from '../atoms/Input.jsx'
import ToggleCheckbox from '../atoms/ToggleCheckbox.jsx'
import QuickLookHeader from './QuickLookHeader.jsx'

/**
 * Modal — promise-based prompt + confirm + alert dialogs.
 *
 *   const { prompt, confirm, alert } = useModal()
 *   const name    = await prompt('Name this frame:', 'Untitled')
 *   const proceed = await confirm('Discard unsaved changes?')
 *   const restore = await confirm('Restore your last canvas?',
 *                                 { okLabel: 'Restore', cancelLabel: 'New file' })
 *   await alert('Upload failed: quota exceeded')
 *
 * Both take an options object — `{ okLabel, cancelLabel }` (prompt: third
 * arg, after defaultValue) — so the buttons can SAY the outcome; defaults
 * stay OK / Cancel, existing callers untouched (ModalConfirmLabels,
 * 2026-08-12). Enter/Escape keep their meanings regardless of labels.
 *
 * PASSWORD (ModalPromptPassword, kol-atlas 2026-10-19): `prompt(title, '', { type: 'password' })`
 * masks the field (`autoComplete="current-password"`) for the family's sign-in prompts. The
 * native fallback cannot mask — mount a ModalProvider. `placeholder` sits in the same options.
 *
 * FORM (HubAccountRow, kol-fxr 2026-10-28 — sign-in asks Email AND Password): `form(title, fields, { okLabel, cancelLabel })`
 * draws one field per `{ id, placeholder, type?, autoComplete?, defaultValue? }` and resolves `{ [id]: value }` on submit,
 * `null` on cancel. The first field takes the focus; Enter in any field submits.
 *
 * THE PAGE HOLDS STILL UNDER THE KEYBOARD (PromptHoldsWithKeyboard, kol-fxr 2026-10-28 — user: *"does the UI have to move
 * upp to show keyboard?"*): every dialog sits in the VISUAL viewport (`visualViewport` resize/scroll), so on an iPhone it
 * rides above the keyboard; a field takes its focus without scrolling (`preventScroll`), and the document's scroll is put
 * back when the keyboard closes and when the dialog does.
 *
 * KEYBOARD: the dialog opens focused (prompt → its field, confirm/alert → OK), Tab cycles inside
 * it, and Enter on a focused button presses that button rather than submitting.
 *
 * Returned promise resolves to:
 *   - prompt  → string (value) on submit, `null` on cancel
 *   - confirm → boolean: `true` on confirm, `false` on cancel
 *   - confirm with `options` → `{ ok, values: { [id]: boolean } }` (below)
 *   - alert   → undefined, once dismissed. One button; `okLabel` names it.
 *     Added 2026-09-22 (media-pages-route-dialogs-through-usemodal) so an
 *     error report needs no native `alert()` beside DS prompts.
 *
 * TOGGLES (upload-dialog-optimise-and-keep-originals, kol-website 2026-10-09): `confirm` takes
 * `options: [{ id, label, hint?, defaultValue? }]`, drawn as `ToggleCheckbox` rows between the
 * title and the buttons, so one dialog asks a question and its settings:
 *
 *   const { ok, values } = await confirm('Web-optimise raster images?', {
 *     okLabel: 'Upload',
 *     options: [
 *       { id: 'optimise', label: 'Optimise', hint: '≤2560 px, ≤500 KB', defaultValue: true },
 *       { id: 'keepOriginals', label: 'Keep originals', hint: 'original/<name>', defaultValue: true },
 *     ],
 *   })
 *
 * `values` comes back on cancel too (the toggles as left), so a consumer can remember them either
 * way. Without `options`, confirm still resolves a plain boolean — existing callers untouched.
 *
 * THE FLOAT (`variant: 'float'` on any call or on the provider, float-everything W6 rows 84 · 85 · 89 · 90, 2026-11-04 —
 * kol-float--style 46:2795): the window on `kol-float-solid` at `--kol-float-window-r`, 24 in, 18 between its parts.
 * A `header` (with its `icon`) draws `QuickLookHeader variant="float"` over the title; the title is the heading
 * (`kol-float-section`… at 20: Inter 500), `body` a line under it in the hint ink; fields are float Inputs, toggles float
 * ToggleCheckboxes; the actions sit apart — the quiet cancel at the left (`tone="ghost"`), the next step at the right
 * (`inverted`, or `danger` when `tone: 'danger'` — the destructive confirm). Still a blocking task, so the scrim
 * stays: the scrim rule is "only when blocking", and a prompt always blocks.
 *
 *   await confirm('Delete “Orbit field”?', { variant: 'float', header: 'Delete layer', icon: 'alert-triangle',
 *     body: 'This removes the layer and its 4 keyframes from Scene 01.', tone: 'danger', okLabel: 'Delete layer', cancelLabel: 'Keep layer' })
 *
 * Mounted once at the app root (BrandLayout). Renders into `document.body`
 * via portal, so it floats above any rail / scroll-context.
 *
 * CONTAINER (float-operational W2, 2026-11-04 — a specimen page shows the confirm open inside its box): `container`
 * (an Element) is the portal target instead of `<body>`; the scrim turns `absolute` and fills that element (give it
 * `position: relative` and a height), the visual-viewport fit is skipped, the focus does not scroll the page and the
 * keys (Tab, Enter, Esc) are heard inside the box only.
 * Unset, nothing changes.
 *
 *   const [box, setBox] = useState(null)
 *   <div ref={setBox} className="relative h-[420px]"><ModalProvider container={box}>…</ModalProvider></div>
 */

const ModalCtx = (globalThis[Symbol.for('@kolkrabbi/kol-component/ModalCtx')] ??= createContext(null))

/* THE MODAL VARIANTS (user 2026-10-31: *"do we not use variants for different styles?"*). `lift` — the overlay panel
 * every KOL overlay wears (oq-04, no border, the scrim is the edge); `bordered` — the page surface behind an fg-08
 * hairline. Each modal keeps its own default (prompts bordered, Dialog lift) until he picks one. */
const MODAL_VARIANTS = {
  lift: { className: 'kol-overlay-panel', style: {} },
  /* float (W6, 2026-11-04): the float window — solid ground + the float shadow, the window radius, no edge */
  float: { className: 'kol-float-solid !rounded-[var(--kol-float-window-r)] text-fg-emphasis', style: {} },
  bordered: { className: 'border border-fg-08', style: { background: 'var(--kol-surface-primary)', color: 'var(--kol-surface-on-primary)' } },
}
const modalVariant = (v, fallback) => MODAL_VARIANTS[v] ?? MODAL_VARIANTS[fallback]

export function ModalProvider({ children, variant = 'bordered', container }) {
  const [state, setState] = useState(null)

  const closeWith = useCallback((value) => {
    setState((s) => {
      if (s) s.resolve(value)
      return null
    })
  }, [])

  const prompt = useCallback((title, defaultValue = '', { okLabel, cancelLabel, type = 'text', placeholder, variant, header, icon, body } = {}) =>
    new Promise((resolve) => setState({ kind: 'prompt', title, defaultValue, okLabel, cancelLabel, type, placeholder, variant, header, icon, body, resolve })),
  [])

  const confirm = useCallback((title, { okLabel, cancelLabel, options, variant, header, icon, body, tone } = {}) =>
    new Promise((resolve) => setState({ kind: 'confirm', title, okLabel, cancelLabel, options: options?.length ? options : null, variant, header, icon, body, tone, resolve })),
  [])

  const alert = useCallback((title, { okLabel, variant, header, icon, body } = {}) =>
    new Promise((resolve) => setState({ kind: 'alert', title, okLabel, variant, header, icon, body, resolve })),
  [])

  const form = useCallback((title, fields = [], { okLabel, cancelLabel, variant, header, icon, body } = {}) =>
    new Promise((resolve) => setState({ kind: 'form', title, fields, okLabel, cancelLabel, variant, header, icon, body, resolve })),
  [])

  return (
    <ModalCtx.Provider value={{ prompt, confirm, alert, form }}>
      {children}
      {state && typeof document !== 'undefined' && createPortal(
        <ModalView state={state} closeWith={closeWith} variant={state.variant ?? variant} contained={!!container} />,
        container ?? document.body,
      )}
    </ModalCtx.Provider>
  )
}

function ModalView({ state, closeWith, variant, contained }) {
  const look = modalVariant(variant, 'bordered')
  const float = variant === 'float'
  const [val, setVal] = useState(state.defaultValue ?? '')
  const [values, setValues] = useState(() => Object.fromEntries((state.options ?? []).map((o) => [o.id, !!o.defaultValue])))
  const [fieldVals, setFieldVals] = useState(() => Object.fromEntries((state.fields ?? []).map((f) => [f.id, f.defaultValue ?? ''])))
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const overlayRef = useRef(null)
  const typing = state.kind === 'prompt' || state.kind === 'form'

  /* the visual viewport (PromptHoldsWithKeyboard): the scrim is sized to it, so the dialog centres above the keyboard
   * instead of the browser scrolling the page to clear it; the scroll the page had is restored when the keyboard goes
   * (the visual viewport back to full height) and when the dialog closes */
  useEffect(() => {
    if (typeof window === 'undefined' || contained) return undefined
    const y0 = window.scrollY
    const vv = window.visualViewport
    const fit = () => {
      const el = overlayRef.current
      if (!vv || !el) return
      el.style.top = `${vv.offsetTop}px`
      el.style.left = `${vv.offsetLeft}px`
      el.style.width = `${vv.width}px`
      el.style.height = `${vv.height}px`
      if (vv.height >= window.innerHeight - 1 && window.scrollY !== y0) window.scrollTo(0, y0)
    }
    fit()
    vv?.addEventListener('resize', fit)
    vv?.addEventListener('scroll', fit)
    return () => {
      vv?.removeEventListener('resize', fit)
      vv?.removeEventListener('scroll', fit)
      if (window.scrollY !== y0) window.scrollTo(0, y0)
    }
  }, [])

  /* alert resolves `undefined` whichever way it is dismissed; a confirm with toggles resolves
   * `{ ok, values }` */
  const answer = (ok) => (state.options ? { ok, values } : ok)
  const submit = () => closeWith(state.kind === 'prompt' ? val : state.kind === 'form' ? fieldVals : state.kind === 'alert' ? undefined : answer(true))
  const cancel = () => closeWith(typing ? null : state.kind === 'alert' ? undefined : answer(false))

  /* focus once on open — the key effect below re-runs per keystroke and would steal it back */
  useEffect(() => {
    if (typing) inputRef.current?.focus({ preventScroll: true })
    else dialogRef.current?.querySelector('[data-modal-ok]')?.focus(contained ? { preventScroll: true } : undefined)
  }, [state.kind])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') cancel()
      if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') submit()
      if (e.key === 'Tab') {
        const els = [...(dialogRef.current?.querySelectorAll('button, input') ?? [])].filter((el) => !el.disabled)
        if (!els.length) return
        const i = els.indexOf(document.activeElement)
        const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : (i === els.length - 1 ? 0 : i + 1)
        e.preventDefault()
        els[next].focus()
      }
    }
    /* contained, the keys are the box's: Tab, Enter and Esc elsewhere on the page stay the page's */
    const on = contained ? overlayRef.current : window
    on?.addEventListener('keydown', onKey)
    return () => on?.removeEventListener('keydown', onKey)
  }, [state.kind, val, values, fieldVals, closeWith]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={overlayRef}
      onMouseDown={cancel}
      /* THE scrim (overlay-scrim-outliers sweep, 2026-09-03): the docs said Modal
         wore `.kol-overlay-scrim`; the source drew a raw `rgba(0,0,0,0.5)`. The
         z stays above the drawers it can open from. */
      className="kol-overlay-scrim"
      style={{
        position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        ref={dialogRef}
        role={typing ? 'dialog' : 'alertdialog'}
        aria-modal="true"
        aria-labelledby="kol-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
        className={float ? `kol-modal flex flex-col gap-[18px] p-6 ${look.className}` : `kol-modal flex flex-col gap-4 p-5 rounded ${look.className}`}
        style={{
          ...look.style,
          minWidth: 320,
          maxWidth: contained ? '90%' : '90vw',
          ...(float ? { width: 562 } : {}),
        }}
      >
        {float && state.header && <QuickLookHeader variant="float" icon={state.icon} title={state.header} onClose={cancel} />}
        {/* kol-mono-12, not helper: dialog copy WRAPS, and helper's
          * line-height 1 is single-line chrome only (type protocol). */}
        {/* pre-line: an alert can carry a failure list, one per line */}
        <p id="kol-modal-title" className={float ? 'font-[family-name:var(--kol-font-family-float)] text-[20px] font-medium leading-[28px] text-fg-emphasis whitespace-pre-line' : 'kol-mono-12 text-emphasis whitespace-pre-line'}>{state.title}</p>
        {float && state.body && <p className="kol-float-body text-fg-64 whitespace-pre-line">{state.body}</p>}
        {state.kind === 'prompt' && (
          <Input
            ref={inputRef}
            type={state.type}
            autoComplete={state.type === 'password' ? 'current-password' : undefined}
            placeholder={state.placeholder}
            variant={float ? 'float' : 'outline'}
            size={float ? 'md' : 'sm'}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full"
          />
        )}
        {state.kind === 'form' && state.fields.map((f, i) => (
          <Input
            key={f.id}
            ref={i === 0 ? inputRef : undefined}
            type={f.type ?? 'text'}
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            aria-label={f.placeholder ?? f.id}
            variant={float ? 'float' : 'outline'}
            size={float ? 'md' : 'sm'}
            value={fieldVals[f.id]}
            onChange={(e) => setFieldVals((v) => ({ ...v, [f.id]: e.target.value }))}
            className="w-full"
          />
        ))}
        {state.options && (
          <div className="flex flex-col gap-3">
            {state.options.map((o) => (
              <ToggleCheckbox
                key={o.id}
                label={o.label}
                hint={o.hint}
                variant={float ? 'float' : undefined}
                checked={values[o.id]}
                onChange={(next) => setValues((v) => ({ ...v, [o.id]: next }))}
              />
            ))}
          </div>
        )}
        {float ? (
          /* the float's actions sit apart: recovery quiet at the left, the next step at the right */
          <div className="flex items-center justify-between gap-3">
            {state.kind !== 'alert' ? <Button variant="float" tone="ghost" size="md" onClick={cancel}>{state.cancelLabel ?? 'Cancel'}</Button> : <span />}
            <Button variant="float" tone={state.tone === 'danger' ? 'danger' : 'inverted'} size="md" onClick={submit} data-modal-ok>{state.okLabel ?? 'OK'}</Button>
          </div>
        ) : (
        <div className="flex gap-2 justify-end">
          {state.kind !== 'alert' && <Button size="sm" onClick={cancel}>{state.cancelLabel ?? 'Cancel'}</Button>}
          {/* inverted, not primary: since tone-is-the-ground-axis (2026-09-03) primary is the
            * dark ground, so OK drew the same as Cancel and nothing showed what Enter does */}
          <Button tone="inverted"  size="sm" onClick={submit} data-modal-ok>{state.okLabel ?? 'OK'}</Button>
        </div>
        )}
      </div>
    </div>
  )
}

/* Warn once, not per call — the fallback swallowing a missing ModalProvider
 * silently is how kol-fxr ran months on native window.confirm without
 * noticing (ModalConfirmLabels, 2026-08-12). */
let warnedNoProvider = false

export function useModal() {
  const ctx = useContext(ModalCtx)
  if (ctx) return ctx
  /* No-context fallback — falls back to native prompt/confirm so callers
   * don't need to null-check. */
  if (!warnedNoProvider && typeof console !== 'undefined') {
    warnedNoProvider = true
    console.warn('[kol] useModal(): no <ModalProvider> mounted — falling back to native window.prompt/confirm/alert. Custom labels are ignored on the fallback.')
  }
  return {
    prompt:  async (title, def = '') => {
      if (typeof window === 'undefined') return null
      const v = window.prompt(title, def)
      return v
    },
    /* the fallback cannot draw toggles: options come back at their defaults */
    confirm: async (title, { options } = {}) => {
      const ok = typeof window !== 'undefined' && window.confirm(title)
      return options?.length ? { ok, values: Object.fromEntries(options.map((o) => [o.id, !!o.defaultValue])) } : ok
    },
    alert: async (title) => {
      if (typeof window !== 'undefined') window.alert(title)
    },
  }
}

/**
 * Dialog — Modal's shell holding any content (MetricDashboardUpstream, kol-website 2026-10-31 — metric's filter and
 * segment dialogs). The same `.kol-overlay-scrim` + `.kol-modal` surface as the prompts above, with `children` in place
 * of a prompt. **z 150, not Modal's 1000**, so KOL's portalled floats (z 210+) open ABOVE it — a Dropdown or Combobox
 * inside a dialog has to show its list (a native `<dialog>` cannot: `showModal()` puts it in the top layer, over every
 * portal). Esc and a press on the scrim close it; Esc is left to an open float inside first.
 *
 *   <Dialog open={open} onClose={() => setOpen(false)} title="Filter by page" width={560}>…</Dialog>
 *
 * `variant="float"` (float-everything W6 rows 83 · 84 · 89, 2026-11-04 — kol-float--style 46:2655): the float window —
 * `kol-float-solid` on `--kol-float-window-r`, 24 in, 18 between its parts, the title drawn as `QuickLookHeader
 * variant="float"` (`icon` · title · − when `onMinimise` · ×) over the children. `blocking` (default true) keeps the
 * scrim: a blocking task dims the scene, a utility window does not (row 89) — `blocking={false}` drops the scrim and the
 * press-outside close and leaves the scene live (QuickLookFrame float is the utility window proper).
 * @param {'lift'|'bordered'|'float'} [variant='lift']
 * @param {string}   [icon]       float: the header's glyph
 * @param {Function} [onMinimise] float: the − control
 * @param {boolean}  [blocking=true]
 * @param {Element}  [container]  the portal target instead of `<body>` (float-operational W2, 2026-11-04): the layer turns
 *   `absolute` and fills it — a specimen box (`position: relative`, a height) shows the window open in place. Unset, unchanged.
 */
/*
 * `variant="settings"` (plan-2026-11-05-float-editor W7.1 — his "Stripe Array settings modal", Figma 7K5v68l4tblHPFuiLdokRu
 * 12:2282, 880 × 656): the generator's settings window. A 60 header (the `title` in Inter 14 semibold, `kind` beside it in
 * the hint ink, `headerEnd` — the preset select — and the ×), a 156 section list on the primary surface (`sections`
 * `[{ key, label, state }]` — the name and a one-line state, the lit one on oq-12 with a 2px marker; `section` /
 * `onSection`), the body (`children`, 24 in, scrolling), an `aside` column 248 wide (the preview), and a 60 `footer`. The
 * secondary surface, a 16 round, oq-16 rules between the parts — his frame draws them. `height` (default 656) and
 * `width` (default 880) are its size; both shrink to the viewport.
 * @param {string} [kind] settings: the line beside the title ("Generate")
 * @param {ReactNode} [headerEnd] settings: the header's right side, before the × (the preset select)
 * @param {Array} [sections] settings: `[{ key, label, state }]`
 * @param {string} [section] · @param {Function} [onSection]
 * @param {ReactNode} [aside] · @param {ReactNode} [footer] · @param {number} [height=656]
 */
export function Dialog({ open, onClose, title, width = 560, variant = 'lift', icon, onMinimise, blocking = true, container, kind, headerEnd, sections, section, onSection, aside, footer, height = 656, children }) {
  const look = modalVariant(variant, 'lift')
  const float = variant === 'float'
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape' && !document.querySelector('.kol-popover-float, [data-state="open"].kol-dd-trigger')) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open || typeof document === 'undefined') return null
  if (variant === 'settings') {
    const within = container ? '100%' : '100vw'
    const withinH = container ? '100%' : '100dvh'
    return createPortal(
      <div onMouseDown={blocking ? onClose : undefined} className={blocking ? 'kol-overlay-scrim' : 'pointer-events-none'}
        style={{ position: container ? 'absolute' : 'fixed', inset: 0, zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div role="dialog" aria-modal={blocking ? 'true' : undefined} aria-label={title} data-dialog onMouseDown={(e) => e.stopPropagation()}
          className="kol-modal kol-settings-window pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-oq-16 bg-surface-secondary text-fg-96 font-(family-name:--kol-font-family-float) shadow-[var(--kol-shadow-float)]"
          style={{ width: `min(${width}px, calc(${within} - 32px))`, height: `min(${height}px, calc(${withinH} - 32px))` }}>
          <header className="flex items-center gap-4 h-[60px] shrink-0 pl-6 pr-[22px] border-b border-oq-16">
            <h2 className="text-[14px] font-semibold leading-none">{title}</h2>
            {kind && <span className="text-[11px] text-oq-64 leading-none mt-px">{kind}</span>}
            <span className="flex-1" />
            {headerEnd}
            <button type="button" aria-label="Close" onClick={onClose}
              className="ml-3 size-7 -mr-[7px] inline-flex items-center justify-center rounded-md text-[20px] leading-none text-oq-64 hover:text-(--kol-fg-96) hover:bg-(--kol-oq-08) focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">×</button>
          </header>
          <div className="flex flex-1 min-h-0">
            {sections?.length > 0 && (
              <nav aria-label="Settings" className="w-[156px] shrink-0 overflow-y-auto bg-surface-primary border-r border-oq-16 px-2 pt-[21px] pb-4">
                <p className="pl-[10px] pb-[14px] text-[9px] font-medium leading-[11px] uppercase text-oq-64">Settings</p>
                <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-1.5"
                  onKeyDown={(e) => {
                    const dir = { ArrowDown: 1, ArrowUp: -1 }[e.key]
                    if (!dir) return
                    e.preventDefault()
                    const at = sections.findIndex((s) => s.key === section)
                    const next = sections[(at + dir + sections.length) % sections.length]
                    onSection?.(next.key)
                    e.currentTarget.querySelector(`[data-section="${next.key}"]`)?.focus()
                  }}>
                  {sections.map((s) => {
                    const lit = s.key === section
                    return (
                      <button key={s.key} type="button" role="tab" aria-selected={lit} data-section={s.key} tabIndex={lit ? 0 : -1}
                        onClick={() => onSection?.(s.key)}
                        className={`relative h-[45px] shrink-0 flex flex-col items-start justify-center gap-[5px] px-3 rounded-md text-left focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${lit ? 'bg-oq-12' : 'hover:bg-(--kol-oq-08)'}`}>
                        {lit && <span aria-hidden="true" className="absolute left-0 top-[13px] h-[18px] w-0.5 rounded-[1px] bg-fg-96" />}
                        <span className={`text-[11px] leading-[13px] text-fg-96 ${lit ? 'font-medium' : ''}`}>{s.label}</span>
                        {s.state != null && <span className="text-[10px] leading-[12px] text-oq-64">{s.state}</span>}
                      </button>
                    )
                  })}
                </div>
              </nav>
            )}
            <div className="flex-1 min-w-0 overflow-y-auto pl-6 pr-5 pt-6 pb-6">{children}</div>
            {aside && <aside className="w-[248px] shrink-0 mr-6 pt-6 pb-6 overflow-y-auto">{aside}</aside>}
          </div>
          {footer && <footer className="flex items-center gap-3 h-[60px] shrink-0 px-6 border-t border-oq-16">{footer}</footer>}
        </div>
      </div>,
      container ?? document.body,
    )
  }
  return createPortal(
    <div
      onMouseDown={blocking ? onClose : undefined}
      className={blocking ? 'kol-overlay-scrim' : 'pointer-events-none'}
      style={{ position: container ? 'absolute' : 'fixed', inset: 0, zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        role="dialog"
        aria-modal={blocking ? 'true' : undefined}
        aria-label={title}
        data-dialog
        onMouseDown={(e) => e.stopPropagation()}
        /* THE OVERLAY PANEL (MetricRebuild, 2026-10-31 — user: the filter dialog read as "a borderless box floating
         * mid-page"): it painted the page's own surface behind an fg-08 hairline, so on a dark page it was the page.
         * `.kol-overlay-panel` is the lift every KOL overlay wears (oq-04, no border — the scrim is the edge). */
        className={float ? `kol-modal pointer-events-auto flex flex-col gap-[18px] p-6 ${container ? 'max-h-[85%]' : 'max-h-[85vh]'} overflow-auto ${look.className}` : `kol-modal flex flex-col rounded ${container ? 'max-h-[85%]' : 'max-h-[85vh]'} ${look.className}${blocking ? '' : ' pointer-events-auto'}`}
        style={{ ...look.style, width: `min(${width}px, calc(${container ? '100%' : '100vw'} - 32px))` }}
      >
        {float && title && <QuickLookHeader variant="float" icon={icon} title={title} onMinimise={onMinimise} onClose={onClose} />}
        {children}
      </div>
    </div>,
    container ?? document.body,
  )
}
