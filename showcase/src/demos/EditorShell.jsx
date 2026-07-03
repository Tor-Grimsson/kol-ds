import { EditorShell, Button } from '@kolkrabbi/kol-component'

export const stage = 'full'

const RailSection = ({ title, children }) => (
  <div className="flex flex-col gap-2 p-4">
    <span className="kol-mono-10 text-fg-32">{title}</span>
    {children}
  </div>
)

/* Bounded height so the shell embeds in the gallery instead of filling 100dvh. */
export default function EditorShellDemo() {
  return (
    <div className="overflow-hidden rounded border border-fg-16">
      <EditorShell
        height={440}
        railWidth={220}
        topbar={
          <div className="flex h-12 items-center justify-between px-4">
            <span className="kol-mono-12">Untitled composition</span>
            <Button size="sm">Export</Button>
          </div>
        }
        leftHeader={<div className="flex h-10 items-center px-4 kol-mono-12">Layers</div>}
        left={
          <RailSection title="LAYERS">
            <span className="kol-sans-body-02">Background</span>
            <span className="kol-sans-body-02">Headline</span>
            <span className="kol-sans-body-02">Product shot</span>
          </RailSection>
        }
        canvasHeader={
          <div className="flex h-10 items-center gap-4 px-4 kol-mono-12 text-fg-48">
            <span>Move</span><span>Frame</span><span>Text</span><span>Shape</span>
          </div>
        }
        rightHeader={<div className="flex h-10 items-center px-4 kol-mono-12">Inspector</div>}
        right={
          <RailSection title="TRANSFORM">
            <span className="kol-sans-body-02">X 120 · Y 150</span>
            <span className="kol-sans-body-02">W 420 · H 420</span>
          </RailSection>
        }
      >
        <div className="flex h-full items-center justify-center">
          <div className="flex h-52 w-40 items-center justify-center rounded border border-fg-16 bg-fg-08 kol-mono-10 text-fg-32">
            4:5 canvas
          </div>
        </div>
      </EditorShell>
    </div>
  )
}
