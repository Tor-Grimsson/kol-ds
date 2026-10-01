import { TiltBento } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Bento tiles',
  description: 'Tiles that tilt and reveal text',
  category: 'content',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/cards', 'pattern/website-cards'],
}
export const stage = 'lg'

export default function ContentBento() {
  return (
    <div className="grid w-full max-w-[var(--kol-content-panel)] grid-cols-1 gap-4 sm:grid-cols-2">
      <TiltBento className="h-72" src={photo('#3a2f6b', '#12101f')} title="Northern Signal" subtitle="Field recording" description="A generative score driven by aurora telemetry." href="#" buttonLabel="View project" onNavigate={(e) => e.preventDefault()} />
      <TiltBento className="h-72" src={photo('#0f3d3a', '#0a1512')} title="Tidal Index" subtitle="Data print" description="Ten years of harbour tide levels in a single plate." href="#" buttonLabel="Open" onNavigate={(e) => e.preventDefault()} />
      <TiltBento className="h-72" src={photo('#5a2130', '#160a0e')} title="Ember Studies" subtitle="Motion" description="Loop tests for a title sequence." overlayOpacity={72} />
      <TiltBento className="h-72" title="Untitled" subtitle="Coming soon" enableTilt={false} />
    </div>
  )
}
