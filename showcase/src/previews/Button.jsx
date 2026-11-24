import { Button } from '@kolkrabbi/kol-component'

/* Exporting `variants` puts a picker in the preview toolbar; the active one
 * arrives as the `variant` prop, so every size and shape below re-renders in
 * that variant instead of needing one preview file per variant. */
/* variant is the intent — default (none) · accent · danger · nav; the ground is the tone knob
 * (2026-10-01: the six variants that duplicated tones are deprecated aliases) */
export const variants = ['default', 'accent', 'danger', 'nav', 'float', 'kolbox', 'folio']
/* tone and size ride the toolbar too (W19, 2026-09-30 — user: "atom button had dropdown for variant,
 * to atom ne and size, now its back to only variant?"). Tone is the ground and wins over variant.
 * `danger` is a tone on a float button only — the destructive role (float-everything W0.5). */
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken', 'danger']
export const sizes = ['md', 'xs', 'sm', 'lg']
/* the axes as ONE MultiSelect in the toolbar (2026-10-02, the user's preview of it on this page) */
export const picker = 'multi'

export default function ButtonPreview({ variant = 'default', tone = 'default', size = 'md' }) {
  const p = { variant: variant === 'default' ? undefined : variant, tone, size }
  return (
    <>
      <Button {...p}>Button</Button>
      <Button {...p} iconLeft="plus">With icon</Button>
      <Button {...p} iconOnly="settings-01" />
      <Button {...p} disabled>Disabled</Button>
      {/* kolbox (W31.2 batch 3): its three grounds as tones, the lit look as `pressed`, the icon button's 28 frame */}
      {variant === 'kolbox' && (
        <div className="flex w-full flex-wrap items-center gap-2 rounded p-4">
          <Button variant="kolbox" tone="primary">Export</Button>
          <Button variant="kolbox" tone="secondary">Preview</Button>
          <Button variant="kolbox" tone="ghost" iconLeft="plus">Add</Button>
          <Button variant="kolbox" pressed>Lit</Button>
          <Button variant="kolbox" tone="ghost" disabled>Share</Button>
          <Button variant="kolbox" iconOnly="corner-radius" aria-label="Split corners" pressed />
          <Button variant="kolbox" iconOnly="plus" aria-label="Add" />
          <Button variant="kolbox" iconOnly="star" aria-label="Star" disabled />
        </div>
      )}
      {/* folio (Folio batch A, 2026-11-22): the page actions (lg, primary and outline, a glyph after the label), the
          editor's tools (md, one lit) and its tool icon, on Folio's paper */}
      {variant === 'folio' && (
        <div data-folio-theme="light" className="flex flex-wrap items-center gap-2 rounded bg-[var(--kol-folio-paper)] p-4 text-[var(--kol-folio-ink)]">
          <Button variant="folio" size="lg" tone="primary" glyph="+">Add a book</Button>
          <Button variant="folio" size="lg" glyph="⌄">All collections</Button>
          <Button variant="folio" iconLeft="search">Find</Button>
          <Button variant="folio" iconLeft="folder-tree" pressed>Library</Button>
          <Button variant="folio" iconOnly="x" aria-label="Close" />
        </div>
      )}
      {/* the float's own parts (float-everything W2, 2026-11-04): the roles as tones, the key cap inside, the icon circles */}
      {variant === 'float' && (
        /* on the float's solid sheet, where the secondary role (the page surface as fill) reads */
        <div className="kol-float-solid flex w-full flex-wrap items-center gap-3 rounded-[var(--kol-float-menu-r)] p-4">
          <Button variant="float" size={size} tone="inverted">Export video</Button>
          <Button variant="float" size={size} tone="secondary">Duplicate</Button>
          <Button variant="float" size={size} tone="ghost">Learn more</Button>
          <Button variant="float" size={size} tone="danger" iconLeft="trash">Delete layer</Button>
          <Button variant="float" size={size} tone="secondary" kbd="⇧E">Export video</Button>
          <Button variant="float" size={size} tone="inverted" iconLeft="plus">New task</Button>
          <Button variant="float" size="sm" tone="inverted" iconRight="arrow-right">Resume reading</Button>
          <Button variant="float" size="sm" tone="secondary" iconOnly="plus" aria-label="Add" />
          <Button variant="float" size="md" tone="secondary" iconOnly="download" aria-label="Download" />
          <Button variant="float" size="lg" tone="secondary" iconOnly="search" aria-label="Search" />
        </div>
      )}
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <Button tone="primary">Button</Button>
}
