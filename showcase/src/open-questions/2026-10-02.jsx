import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'

/* Round 7 — what the question round (2026-10-01 → 02) left unanswered. They sat in the phase log and
 * a backlog file, where the user does not look (user: "where are the questions"). Three questions,
 * each with its recommendation; nothing here is built. */
export const meta = {
  round: 7,
  date: '2026-10-02',
  title: 'Audio, the rack app, older rounds',
  status: 'open',
}

const cell = 'flex flex-col gap-2 rounded border border-fg-08 p-4'
const label = 'kol-doc-eyebrow'

const AUDIO = [
  ['AudioPlayer', 'the browser’s native audio strip under a label', 'nothing in this repo'],
  ['AudioPreview (its own player)', 'a drawn inline transport: play, a seek slider, a volume popover', 'nothing in this repo; only its siblings AudioTile, VideoTile and formatLength are imported'],
  ['AudioSheet', 'audio in the Quick Look window: artwork, time, the bar docked in the footer', 'the media library'],
  ['PlaybackBar', 'the transport bar: play, skip, scrub, volume, speed', 'AudioSheet, VideoSheet, the Quick Look frame, the design editor'],
]

export default function OpenQuestionsRound7() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 7 · 2026-10-02"
        title="Audio, the rack app, older rounds"
        lede="Three questions the question round left open. Each has a recommendation."
      />

      <DocSection id="audio" title="1 · Audio" lede="Do we retire AudioPlayer and AudioPreview’s own player, keeping PlaybackBar as the one transport?">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {AUDIO.map(([name, what, usedBy]) => (
            <div key={name} className={cell}>
              <span className="kol-doc-body text-emphasis">{name}</span>
              <span className="kol-doc-body">{what}</span>
              <span className="kol-mono-12 text-subtle">Rendered by: {usedBy}</span>
            </div>
          ))}
        </div>
        <div className={cell}>
          <span className={label}>Recommendation</span>
          <span className="kol-doc-body">Yes. The live path is the tile, then the Quick Look sheet, then PlaybackBar. The other two are two more ways to play a file that nothing here draws any more. They would be deprecated with ledger rows and dropped once the iMac scan says nobody imports them.</span>
        </div>
      </DocSection>

      <DocSection id="rack-app" title="2 · Where the rack and mixer are exercised" lede="The Rack and Mixer sets show the parts fitting together; nothing in them is wired, the 1U row has no labeled control, and the touch hold (onHold) is not connected.">
        <div className={cell}>
          <span className={label}>Recommendation</span>
          <span className="kol-doc-body">A new app, apps/rack, with a Rack page (1U and 3U rows, labeled controls in both, onHold opening the sheet) and a Mixer page. Not apps/controls: that is the controls reference, not a rack.</span>
        </div>
      </DocSection>

      <DocSection id="older-rounds" title="3 · Older rounds" lede="Rounds 4 and 5 are marked open and Round 3 is marked decided, review. Are they answered?">
        <div className={cell}>
          <span className={label}>Recommendation</span>
          <span className="kol-doc-body">Say which are settled and they get marked answered; anything still open stays on its round.</span>
        </div>
      </DocSection>
    </div>
  )
}
