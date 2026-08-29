import { Button, SectionHero } from '@kolkrabbi/kol-component'

export const variants = ['media', 'split', 'inverse', 'carousel', 'text', 'end']
export const stage = 'full'

// Neutral stand-in for hero photography — no network, renders everywhere.
const bg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#1d1d21"/><circle cx="1150" cy="320" r="360" fill="none" stroke="#8a8a94" stroke-width="2"/><circle cx="1150" cy="320" r="220" fill="none" stroke="#5a5a63" stroke-width="2"/></svg>',
)}`

/* The composed route: text props render as SectionText inside the hero's own
 * glass panel. Pass `panel` instead and the hero renders your node verbatim
 * (what FullBleedHero call sites do). */
export default function SectionHeroDemo({ variant = 'media' }) {
  if (variant === 'carousel') {
    return (
      <SectionHero
        media={[
          { src: bg, kind: 'image', alt: '', title: 'Málrómur', description: 'A variable serif for long reading.', href: '#' },
          { src: bg, kind: 'image', alt: '', title: 'Tröllatunga', description: 'A display grotesk with teeth.', href: '#' },
        ]}
        height="60"
        autoPlay
        ctaLabel="Explore typeface"
        renderTitle={(item) => <span className="kol-sans-display-02 text-emphasis block" style={{ fontStyle: 'italic' }}>{item.title}</span>}
        onNavigate={(href, e) => e.preventDefault()}
      />
    )
  }
  if (variant === 'text') {
    return (
      <SectionHero
        height="60"
        label="LICENSING"
        headline="One licence, every project"
        body="The text-only hero — the composed text on the surface, no media, no glass."
        actions={<Button size="sm">Read the terms</Button>}
      />
    )
  }
  if (variant === 'end') {
    return (
      <SectionHero
        media={{ src: bg, kind: 'image', alt: '' }}
        height="80"
        veil
        justify="end"
        align="start"
        headline="Pinned to the foot"
        body={'justify="end" with the veil under it — StackHero\'s frame.'}
        foot={<div className="mx-auto max-w-[640px] rounded-[var(--kol-radius-sm)] border border-fg-08 bg-surface-primary p-6 kol-mono-12 text-body">The foot slot — a node across the fold, pulled up by overlap.</div>}
      />
    )
  }
  if (variant === 'inverse') {
    return (
      <SectionHero
        variant="split"
        theme="inverse"
        headline="The other theme, in one card"
        body={'theme="inverse" stamps the paired theme on the section — every token inside flips, and it follows the toggle.'}
        className="min-h-[640px]"
      />
    )
  }
  if (variant === 'split') {
    return (
      <SectionHero
        variant="split"
        headline="A title card in two halves"
        className="min-h-[640px]"
      />
    )
  }
  return (
    <SectionHero
      media={{ src: bg, kind: 'image', alt: '' }}
      height="md"
      overlayOpacity={24}
      label="KOLKRABBI"
      headline="Full-bleed media hero"
      body="Cover media, an optional surface scrim, and the text in a glass panel — composed from SectionText, no hand-typed heading."
      actions={<Button size="sm">View work</Button>}
    />
  )
}
