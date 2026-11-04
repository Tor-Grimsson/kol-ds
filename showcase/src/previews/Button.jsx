import { Button } from '@kolkrabbi/kol-component'

/* Exporting `variants` puts a picker in the preview toolbar; the active one
 * arrives as the `variant` prop, so every size and shape below re-renders in
 * that variant instead of needing one preview file per variant. */
/* variant is the intent — default (none) · accent · danger · nav; the ground is the tone knob
 * (2026-10-01: the six variants that duplicated tones are deprecated aliases) */
export const variants = ['default', 'accent', 'danger', 'nav', 'float']
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
