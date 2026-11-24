import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconLoader } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import Input from '../atoms/Input.jsx'
import ToggleCheckbox from '../atoms/ToggleCheckbox.jsx'
import ButtonGroup from './ButtonGroup.jsx'
import Header from './Header.jsx'
import ModalShell from './ModalShell.jsx'
import { KolboxShell, PopoverLayer } from '../utilities/Popover.jsx'

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
 * A `header` (with its `icon`) draws `Header variant="modal"` over the title; the title is the heading
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

/* THE MODAL VARIANTS (user 2026-10-31: *"do we not use variants for different styles?"*) live on ModalShell (W2.1,
 * 2026-11-08) — the one panel: `lift`, `bordered`, `float`. Each modal keeps its own default (prompts bordered, Dialog
 * lift) until he picks one; an unknown name falls back to that default. */
const KNOWN = new Set(['lift', 'bordered', 'float'])
const modalVariant = (v, fallback) => (KNOWN.has(v) ? v : fallback)

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
      {variant === 'kolbox' ? <ModalViewKolbox state={state} closeWith={closeWith} /> : state && typeof document !== 'undefined' && createPortal(
        <ModalView state={state} closeWith={closeWith} variant={state.variant ?? variant} contained={!!container} />,
        container ?? document.body,
      )}
    </ModalCtx.Provider>
  )
}

function ModalView({ state, closeWith, variant, contained }) {
  const look = modalVariant(variant, 'bordered')
  const float = look === 'float'
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
      <ModalShell
        ref={dialogRef}
        variant={look}
        role={typing ? 'dialog' : 'alertdialog'}
        aria-modal="true"
        aria-labelledby="kol-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
        className={float ? 'gap-[18px] p-6' : 'gap-4 p-5'}
        style={{
          minWidth: 320,
          maxWidth: contained ? '90%' : '90vw',
          ...(float ? { width: 'var(--kol-float-window-w)' } : {}),
        }}
        header={float && state.header && <Header variant="modal" icon={state.icon} title={state.header} onClose={cancel} />}
        footer={float ? (
          /* the float's actions sit apart: recovery quiet at the left, the next step at the right — one ButtonGroup (LAW 17) */
          <ButtonGroup align="between">
            {state.kind !== 'alert' ? <Button variant="float" tone="ghost" size="md" onClick={cancel}>{state.cancelLabel ?? 'Cancel'}</Button> : <span />}
            <Button variant="float" tone={state.tone === 'danger' ? 'danger' : 'inverted'} size="md" onClick={submit} data-modal-ok>{state.okLabel ?? 'OK'}</Button>
          </ButtonGroup>
        ) : (
          <div className="flex gap-2 justify-end">
            {state.kind !== 'alert' && <Button size="sm" onClick={cancel}>{state.cancelLabel ?? 'Cancel'}</Button>}
            {/* inverted, not primary: since tone-is-the-ground-axis (2026-09-03) primary is the
              * dark ground, so OK drew the same as Cancel and nothing showed what Enter does */}
            <Button tone="inverted"  size="sm" onClick={submit} data-modal-ok>{state.okLabel ?? 'OK'}</Button>
          </div>
        )}
      >
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
      </ModalShell>
    </div>
  )
}


/* ── the kolbox look (plan-2026-11-18-kolbox-system W31.2 batch 4, 2026-11-18) ──
 * `ModalProvider variant="kolbox"`: every prompt, confirm and alert is kolbox's ModalPrompt or ModalConfirm, carried line
 * for line, in `ModalDialog variant="kolbox"`. The calls are useModal's, KOL's words: `confirm(title, { okLabel,
 * cancelLabel, body })`, `alert(title, { okLabel, body })` (the action alone), `prompt(title, defaultValue, { okLabel,
 * cancelLabel, placeholder })`. The confirm: the title as its heading, `body` under it, the cancel (ghost) and the action
 * (primary); Enter confirms unless a button has the focus (it answers for itself); Escape and the dim cancel. The prompt:
 * one Input with the value selected; Enter submits. The provider draws its two dialogs in place (they portal
 * themselves); `container` and a per-call `variant` are not read in this look. */
function ModalConfirmKolbox({ open, title, message, action = 'OK', cancel = 'Cancel', onConfirm, onCancel }) {
  const ok = useRef(onConfirm); ok.current = onConfirm
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Enter' || e.target?.closest?.('button')) return
      e.preventDefault()
      ok.current?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  return (
    <ModalDialogKolbox
      open={open}
      onClose={onCancel}
      title={title}
      footer={(
        <>
          {cancel != null && <Button variant="kolbox" tone="ghost" onClick={onCancel}>{cancel}</Button>}
          <Button variant="kolbox" tone="primary" onClick={onConfirm} data-modal-ok>{action}</Button>
        </>
      )}
    >
      {message && <p className="kol-modal-body--kolbox px-4 pb-4" data-modal-confirm>{message}</p>}
    </ModalDialogKolbox>
  )
}

function ModalPromptKolbox({ open, title, label, value = '', placeholder, action = 'OK', cancel = 'Cancel', onSubmit, onCancel }) {
  const [draft, setDraft] = useState(value)
  const field = useRef(null)
  /* after the dialog has moved the focus into its shell, the field takes it with the value selected */
  useEffect(() => { if (open) { setDraft(value ?? ''); setTimeout(() => field.current?.select(), 0) } }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ModalDialogKolbox
      open={open}
      onClose={onCancel}
      title={title}
      footer={(
        <>
          <Button variant="kolbox" tone="ghost" onClick={onCancel}>{cancel}</Button>
          <Button variant="kolbox" tone="primary" onClick={() => onSubmit?.(draft)} data-modal-ok>{action}</Button>
        </>
      )}
    >
      <div className="px-4 pb-4" data-modal-prompt>
        <Input variant="kolbox" ref={field} aria-label={label ?? title} placeholder={placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSubmit?.(draft)} />
      </div>
    </ModalDialogKolbox>
  )
}

function ModalViewKolbox({ state, closeWith }) {
  const s = state ?? {}
  const confirming = s.kind === 'confirm' || s.kind === 'alert'
  const answer = (ok) => (s.options ? { ok, values: Object.fromEntries(s.options.map((o) => [o.id, !!o.defaultValue])) } : ok)
  return (
    <>
      <ModalPromptKolbox open={s.kind === 'prompt'} title={s.title} value={s.defaultValue} placeholder={s.placeholder}
        action={s.okLabel} cancel={s.cancelLabel} onSubmit={(v) => closeWith(v)} onCancel={() => closeWith(null)} />
      <ModalConfirmKolbox open={confirming} title={s.title} message={s.body} action={s.okLabel}
        cancel={s.kind === 'alert' ? null : s.cancelLabel}
        onConfirm={() => closeWith(s.kind === 'alert' ? undefined : answer(true))}
        onCancel={() => closeWith(s.kind === 'alert' ? undefined : answer(false))} />
    </>
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
 * ModalDialog (was `Dialog`, renamed 2026-11-12; `Dialog` stays a deprecated alias) — Modal's shell holding any content (MetricDashboardUpstream, kol-website 2026-10-31 — metric's filter and
 * segment dialogs). The same `.kol-overlay-scrim` + `.kol-modal` surface as the prompts above, with `children` in place
 * of a prompt — both draw their panel through `ModalShell` (W2.1, 2026-11-08). **z 150, not Modal's 1000**, so KOL's portalled floats (z 210+) open ABOVE it — a Dropdown or Combobox
 * inside a dialog has to show its list (a native `<dialog>` cannot: `showModal()` puts it in the top layer, over every
 * portal). Esc and a press on the scrim close it; Esc is left to an open float inside first.
 *
 *   <ModalDialog open={open} onClose={() => setOpen(false)} title="Filter by page" width={560}>…</ModalDialog>
 *
 * `variant="float"` (float-everything W6 rows 83 · 84 · 89, 2026-11-04 — kol-float--style 46:2655): the float window —
 * `kol-float-solid` on `--kol-float-window-r`, `--kol-float-window-w` wide unless `width` says otherwise (plan-2026-11-12-one-header
 * W6.1), 24 in, 18 between its parts, the title drawn as `Header
 * variant="modal"` (`icon` · title · − when `onMinimise` · ×) over the children. `blocking` (default true) keeps the
 * scrim: a blocking task dims the scene, a utility window does not (row 89) — `blocking={false}` drops the scrim and the
 * press-outside close and leaves the scene live (QuickLookFrame float is the utility window proper).
 * @param {'lift'|'bordered'|'float'|'kolbox'|'folio'} [variant='lift']  `kolbox` (W31.2 batch 4): kolbox's Modal, see `ModalDialogKolbox`;
 *   `folio` (Folio migration batch B): Folio's dialog, `title`, `width` (720), `children`, see `ModalDialogFolio`
 * @param {string}   [icon]       float: the header's glyph
 * @param {Function} [onMinimise] float: the − control
 * @param {boolean}  [blocking=true]
 * @param {Element}  [container]  the portal target instead of `<body>` (float-operational W2, 2026-11-04): the layer turns
 *   `absolute` and fills it — a specimen box (`position: relative`, a height) shows the window open in place. Unset, unchanged.
 */
/*
 * `variant="settings"` (plan-2026-11-05-float-editor W7.1 — his "Stripe Array settings modal", Figma 7K5v68l4tblHPFuiLdokRu
 * 12:2282, 880 × 656): the generator's settings window. A 60 header — `Header variant="settings"` (the `title` in Inter 14 semibold, `kind` beside it in
 * the hint ink, `headerEnd` — the preset select — and the ×), a 156 section list on the primary surface (`sections`
 * `[{ key, label, state }]` — the name and a one-line state, 6 apart; the lit one carries its 2px marker and no fill,
 * hover the only fill (LAW 16, plan-2026-11-12-float-rails-figma W13.1; it sat on oq-12 until then); `section` /
 * `onSection`), the body (`children`, 24 in, scrolling), an `aside` column 248 wide (the preview), and a 60 `footer`. The
 * secondary surface, a 20 round, no outer border (his mock 143:35343, W8.1), oq-16 rules between the parts; the footer hugs
 * its 60 and the body fills the rest. `height` (default 656) and
 * `width` (default 880) are its size; both shrink to the viewport.
 * @param {string} [kind] settings: the line beside the title ("Generate")
 * @param {ReactNode} [headerEnd] settings: the header's right side, before the × (the preset select)
 * @param {Array} [sections] settings: `[{ key, label, state }]`
 * @param {string} [section] · @param {Function} [onSection]
 * @param {ReactNode} [aside] · @param {ReactNode} [footer] · @param {number} [height=656]
 * @param {string} [sectionsLabel='Settings'] settings: the section list's title (the generator calls its list Steps, W23.3)
 * @param {string} [movable] settings · kolbox: a key; the window drags by its header (see `useMovable`)
 * @param {{x?: number, right?: number, y: number}} [place] kolbox: where the window opens until it is moved, in place of centred: its top at `y`, its left at `x` or its right edge at `right`; kept whole on screen
 */
/* `variant="kolbox"` (W31.2 batch 4): kolbox's Modal carried line for line: the kolbox panel shell (`ModalShell
 * variant="kolbox"`) centred on the dim (fg-ab-24), 480 wide (`--kol-kolbox-modal-w`) unless `width` (any CSS length)
 * says otherwise. Escape (the last layer's) and a click on the dim close it. `blocking={false}`: a window over a live
 * scene, no dim; a press, scroll or pinch outside it reaches what is under it and never closes it. Focus moves into the dialog on open and back
 * to whatever held it on close. The shell's `title`, `leading`, `actions`, `footer` and `aria-label` pass through;
 * `className` reaches the dialog beside its own. */
/* A WINDOW THAT MOVES (plan-2026-11-18-kolbox-system W23.1, 2026-11-18; his "still cant grab this modal to move it out
 * of the way"): `movable` (a key, e.g. "generator") lets a press on the window's header, outside its controls, drag it.
 * It can be moved out of the way, never lost: its header stays on screen top to bottom, its left edge (the title,
 * where it is grabbed) stays on screen, and it may hang off the right edge until 160 px of it are left, so it can
 * always be grabbed back. Once moved it is fixed at its own left and top, so a
 * change of content never re-centres it, and its place is kept per key while the app is open. Only the kolbox and
 * settings variants take it; unset, nothing changes. */
const SPOTS = new Map()
const NO_DRAG = 'button, input, select, textarea, a, [role="button"], [role="combobox"], [role="tab"], [role="switch"], [contenteditable="true"], [data-no-drag]'
const KEEP = 160
function useMovable(key, ref, place) {
  const [at, setAt] = useState(() => (key ? SPOTS.get(key) ?? null : null))
  /* `place` (kolbox): where the window opens until it is moved, kept whole on screen (8 from each edge) */
  const [placed, setPlaced] = useState(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!place || at || !el) return
    const m = 8
    const x = place.x ?? place.right - el.offsetWidth
    setPlaced({ x: Math.max(m, Math.min(x, window.innerWidth - el.offsetWidth - m)), y: Math.max(m, Math.min(place.y, window.innerHeight - el.offsetHeight - m)) })
  }, [place?.x, place?.right, place?.y]) // eslint-disable-line react-hooks/exhaustive-deps
  const moved = useRef(false)
  const fit = (x, y, w) => {
    const hh = ref.current?.firstElementChild?.offsetHeight ?? 0
    return { x: Math.max(0, Math.min(x, window.innerWidth - KEEP)), y: Math.max(0, Math.min(y, window.innerHeight - hh)) }
  }
  useEffect(() => { if (key && at) SPOTS.set(key, at) }, [key, at])
  useEffect(() => {
    if (!key) return undefined
    const onResize = () => setAt((a) => { const el = ref.current; return a && el ? fit(a.x, a.y, el.offsetWidth) : a })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  const onPointerDown = (e) => {
    const el = ref.current, head = el?.firstElementChild
    if (!key || e.button !== 0 || !head?.contains(e.target) || e.target.closest(NO_DRAG)) return
    e.preventDefault()
    const r = el.getBoundingClientRect(), sx = e.clientX, sy = e.clientY
    const move = (ev) => {
      const p = fit(r.left + ev.clientX - sx, r.top + ev.clientY - sy, r.width)
      if (p.x !== r.left || p.y !== r.top) moved.current = true
      setAt(p)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      /* the click a drag's release raises on the dim is not a press outside */
      setTimeout(() => { moved.current = false })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }
  const spot = at ?? placed
  return {
    style: spot ? { position: 'fixed', left: spot.x, top: spot.y, margin: 0 } : null,
    onPointerDown: key ? onPointerDown : undefined,
    handle: key ? '[&>header]:cursor-grab [&>header]:active:cursor-grabbing' : '',
    dragged: () => moved.current,
  }
}

function ModalDialogKolbox({ open, onClose, width = 'var(--kol-kolbox-modal-w)', className = '', variant, movable, blocking = true, place, ...shell }) {
  const ref = useRef(null)
  const mv = useMovable(movable, ref, place)
  useEffect(() => {
    if (!open) return
    const back = document.activeElement
    ref.current?.focus({ preventScroll: true })
    return () => back?.focus?.({ preventScroll: true })
  }, [open])
  const close = () => { if (!mv.dragged()) onClose?.() }
  return (
    <PopoverLayer open={open} onClose={close} placement="center" kind="modal" blocking={blocking}>
      <KolboxShell ref={ref} tabIndex={-1} aria-modal={blocking ? 'true' : undefined} onClose={onClose} width={width} className={`outline-none ${mv.handle} ${className}`}
        {...shell} style={mv.style ? { width, ...mv.style } : { width }} onPointerDown={mv.onPointerDown} />
    </PopoverLayer>
  )
}

/* `variant="folio"` (Folio migration batch B, 2026-11-22): Folio's New overlay carried class for class (kol-theme
 * `.kol-modal-dialog--folio`): `ModalShell variant="folio"` 14% down on the Folio dim, `width` wide (720) and never wider
 * than the window, a 64 header (the title, the 32 ×) over a rule, then `children`. Drawn in place, never portalled, so
 * it keeps the frame's `data-folio-*`. Escape and a press on the dim close it. */
function ModalDialogFolio({ open, onClose, title, width = 720, children }) {
  useEffect(() => {
    if (!open) return undefined
    const esc = (e) => e.key === 'Escape' && onClose?.()
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="kol-modal-dim--folio fixed inset-0 z-50 flex items-start justify-center px-[16px] pt-[14vh]" onMouseDown={onClose}>
      <ModalShell variant="folio" role="dialog" aria-label={title} onMouseDown={(e) => e.stopPropagation()} className="kol-modal-dialog--folio max-w-full" style={{ width }}>
        <div className="kol-modal-head--folio flex h-[64px] items-center justify-between border-b pl-[24px] pr-[16px]">
          <p className="kol-modal-title--folio">{title}</p>
          <button type="button" aria-label="Close" onClick={onClose} className="kol-modal-close--folio flex size-[32px] items-center justify-center rounded-[3px]"><IconLoader name="x" size={14} /></button>
        </div>
        {children}
      </ModalShell>
    </div>
  )
}

export function ModalDialog(props) {
  if (props.variant === 'kolbox') return <ModalDialogKolbox {...props} />
  if (props.variant === 'folio') return <ModalDialogFolio {...props} />
  return <ModalDialogOn {...props} />
}

function ModalDialogOn({ open, onClose, title, width, variant = 'lift', icon, onMinimise, blocking = true, container, kind, headerEnd, sections, section, onSection, aside, footer, height = 656, movable, sectionsLabel = 'Settings', children }) {
  const look = variant === 'settings' ? 'settings' : modalVariant(variant, 'lift')
  const shellRef = useRef(null)
  const mv = useMovable(variant === 'settings' && !container ? movable : undefined, shellRef)
  const float = look === 'float'
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
        <ModalShell ref={shellRef} variant="settings" role="dialog" aria-modal={blocking ? 'true' : undefined} aria-label={title} data-dialog onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={mv.onPointerDown}
          className={`kol-settings-window pointer-events-auto overflow-hidden ${mv.handle}`.trim()}
          style={{ width: `min(${width ?? 880}px, calc(${within} - 32px))`, height: `min(${height}px, calc(${withinH} - 32px))`, ...mv.style }}
          header={<Header variant="settings" title={title} kind={kind} end={headerEnd} onClose={onClose} />}
          footer={footer && <footer className="flex items-center gap-3 h-[60px] shrink-0 px-6 border-t border-oq-16">{footer}</footer>}>
          <div className="flex flex-1 min-h-0">
            {sections?.length > 0 && (
              <nav aria-label={sectionsLabel} className="w-[156px] shrink-0 overflow-y-auto bg-surface-primary border-r border-oq-16 px-2 pt-[21px] pb-4">
                <p className="pl-[10px] pb-[14px] text-[9px] font-medium leading-[11px] uppercase text-oq-64">{sectionsLabel}</p>
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
                        className={`relative h-[45px] shrink-0 flex flex-col items-start justify-center gap-[5px] px-3 rounded-md text-left focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${lit ? 'bg-fg-12' : 'hover:bg-fg-04'}`}>
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
        </ModalShell>
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
      <ModalShell
        variant={look}
        role="dialog"
        aria-modal={blocking ? 'true' : undefined}
        aria-label={title}
        data-dialog
        onMouseDown={(e) => e.stopPropagation()}
        /* THE OVERLAY PANEL (MetricRebuild, 2026-10-31 — user: the filter dialog read as "a borderless box floating
         * mid-page"): it painted the page's own surface behind an fg-08 hairline, so on a dark page it was the page.
         * `.kol-overlay-panel` is the lift every KOL overlay wears (oq-04, no border — the scrim is the edge). */
        className={float ? `pointer-events-auto gap-[18px] p-6 ${container ? 'max-h-[85%]' : 'max-h-[85vh]'} overflow-auto` : `${container ? 'max-h-[85%]' : 'max-h-[85vh]'}${blocking ? '' : ' pointer-events-auto'}`}
        /* the float window's width is the token (P8: *"why doesnt it use width?"*); `width` (px) still overrides */
        style={{ width: `min(${width != null ? `${width}px` : float ? 'var(--kol-float-window-w)' : '560px'}, calc(${container ? '100%' : '100vw'} - 32px))` }}
        header={float && title && <Header variant="modal" icon={icon} title={title} onMinimise={onMinimise} onClose={onClose} />}
      >
        {children}
      </ModalShell>
    </div>,
    container ?? document.body,
  )
}
