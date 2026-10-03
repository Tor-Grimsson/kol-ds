import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { findVariant } from '../../../mixer/src/data/mirrorVariants.js'
import Button from '../../../mixer/src/components/atoms/Button.jsx'

/**
 * ON THE HUB (apps/mixer-hub, 2026-10-03): this file is mirror's Home as DATA — `useHome()` returns
 * `HubHome`'s props and the walkthrough, and kol-shell's `AppStudio` draws the page. The masthead,
 * the RECENT · SAVED strip and the Walkthrough button are the Hub's now; what is below is mirror's.
 *
 * HomePage — /, on kol-shell's `CatalogPage` (ShellHomeSystemAdoption,
 * 2026-08-27 — this page, fxr's and monitor's were the same page written
 * three times). Recent = the one Empty Studio card (monitor's "Empty 7U");
 * Saved = the persisted memory slots. The full catalogue lives in /library.
 * Walkthrough is the panel over the catalog; grey action buttons bottom-left.
 */

const WALKTHROUGH_STEPS = [
  {
    title: '1. Distort',
    text: [
      'Three halls of distortion — Displacement (SVG turbulence), Movement (GSAP transforms), Copies (WebGL slicing, glitch, kaleidoscope).',
      'Pick a variant, drop in an image or vector, and shape it with the per-variant controls.',
    ],
  },
  {
    title: '2. Mix',
    text: [
      'The Symphony mixer layers three channels with independent FX chains, blend modes, and opacity — plus procedural generators (Noise, Gradient, Pattern, Color Field) as channel sources.',
      'Six send/return buses composite shared processing on top.',
    ],
  },
  {
    title: '3. Route',
    text: [
      'The routing matrix patches any output to any input — channel to channel, bus to channel, bus to bus.',
      'Loops are legal: a cycle reads last frame’s buffer, the classic video-synth feedback trick.',
    ],
  },
  {
    title: '4. Feed back',
    text: [
      'Per-channel feedback accumulates trails — decay sets how fast new frames take over (high decay = short trails), freeze holds the buffer.',
      'Drive any knob with an expression — click its value and type wave(t), rand(), ease(t).',
    ],
  },
  {
    title: '5. Record',
    text: [
      'Arm a channel and capture loops as .webm — trim with I/O marks, frame-step with arrows, freeze a take onto the channel as a video source.',
      'Save favourite states to the 9 memory slots; they persist across sessions.',
    ],
  },
  { title: 'Get started', actions: true },
]

const PREVIEW_SRC = '/images/stack-hero-400.jpg'

const EMPTY_STUDIO = [
  { name: 'empty-studio', title: 'Empty Studio', detail: '3 channels — mixer, buses, routing', src: PREVIEW_SRC, alt: 'Empty Studio' },
]

export function useHome() {
  const navigate = useNavigate()
  const [view, setView] = useState('recent')

  // Re-read on every route change — slots only change in the studio, and this hook never remounts.
  const { pathname } = useLocation()
  const memory = useMemo(() => {
    try {
      const raw = localStorage.getItem('mirror-archive')
      if (raw) return (JSON.parse(raw) || []).map((s, i) => ({ slot: s, i })).filter(({ slot }) => slot)
    } catch { /* no memory */ }
    return []
  }, [pathname])

  const saved = memory.map(({ slot, i }) => ({
    name: `m${i + 1}`,
    title: `M${i + 1} — ${findVariant(slot.variantId)?.title || slot.variantId}`,
    detail: slot.variantId,
    src: slot.imageSrc || PREVIEW_SRC,
    alt: '',
    slotIndex: i,
  }))

  const illustration = <img src="/images/stack-hero-800.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
  /* the Hub hands a step's `actions` its own close */
  const walkthrough = WALKTHROUGH_STEPS.map((s) => s.actions
    ? {
        ...s,
        actions: (close) => (
          <>
            <Button tone="grey" size="md" onClick={() => { close(); navigate('/studio') }}>Enter Studio</Button>
            <Button tone="grey" size="md" onClick={() => { close(); navigate('/library') }}>Browse Library</Button>
          </>
        ),
      }
    : { ...s, illustration })

  return {
    walkthrough,
    home: {
      items: view === 'recent' ? EMPTY_STUDIO : saved,
      filtersTitle: 'Studio',
      view,
      onViewChange: setView,
      toCard: (item) => ({
        key: item.name,
        title: item.title,
        detail: item.detail,
        media: <img src={item.src} alt={item.alt} />,
        onClick: item.slotIndex != null
          ? () => navigate('/studio', { state: { slotIndex: item.slotIndex } })
          : () => navigate('/studio'),
      }),
      actions: <Button tone="grey" size="md" onClick={() => navigate('/studio')}>Enter Studio</Button>,
      children: view === 'saved' && memory.length === 0 && (
        <p className="kol-helper-12 text-fg-32">No saved slots yet — save one from the studio sidebar.</p>
      ),
    },
  }
}
