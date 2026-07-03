import { useState } from 'react'
import Button from '../../atoms/Button.jsx'
import SpecimenSectionHeader from '../../molecules/foundry/SpecimenSectionHeader.jsx'
import { glyphSets, glyphCategories } from './glyphData.js'

/* taxonomy-ok: organism — nests Button + SpecimenSectionHeader (relative
 * imports) plus same-file GlyphCategory / GlyphItem. */

/** GlyphItem (same-file) — one bordered glyph cell that flips to the inverse
 *  surface on hover. Display-only (character sets aren't selectable). */
function GlyphItem({ glyph, fontFamily, fontStyle }) {
  return (
    <div
      className="aspect-square border rounded-lg flex items-center justify-center text-3xl leading-none transition-colors duration-300 w-16 h-16 hover:bg-surface-inverse"
      style={{ borderColor: 'var(--kol-border-default)', fontFamily, fontStyle }}
    >
      {glyph}
    </div>
  )
}

/** GlyphCategory (same-file) — a labeled category title over a wrap grid of
 *  GlyphItems, all rendered in the chosen family/style. */
function GlyphCategory({ title, glyphs, fontFamily, fontStyle, className = '' }) {
  return (
    <div className={`w-full flex flex-col gap-4 ${className}`.trim()}>
      <h3 className="kol-mono-12">{title}</h3>
      <div className="flex flex-wrap gap-4 w-full">
        {glyphs?.map((glyph, i) => (
          <GlyphItem key={i} glyph={glyph} fontFamily={fontFamily} fontStyle={fontStyle} />
        ))}
      </div>
    </div>
  )
}

/**
 * FoundryCharacterSets — the character-set browser: the shared header ("Character
 * Set" + Roman/Italic dropdown) above a stack of glyph categories rendered in
 * the chosen family/style. Collapsed by default to the first two categories
 * under a fade with a "Show All Glyphs" reveal; clicking expands to every
 * category.
 *
 * Light-theme fix ([source-bug]): the monorepo faded with a hardcoded
 * `rgba(18,18,21,…)` — the app's literal dark background baked in, which broke
 * in light theme. Here the mask runs `transparent → var(--kol-surface-primary)`
 * so it matches whatever surface it sits on, in either theme. `fontFamily` is
 * prop-driven (no brand default).
 *
 * Text casing: label, category titles and the reveal button render verbatim.
 *
 * @param {string} props.fontFamily - Family every glyph renders in.
 * @param {boolean} props.showDropdown - Render the Roman/Italic dropdown (default true).
 * @param {number} props.collapsedCount - Categories shown when collapsed (default 2).
 */
const FoundryCharacterSets = ({
  fontFamily = 'system-ui, sans-serif',
  showDropdown = true,
  collapsedCount = 2,
}) => {
  const [selectedStyle, setSelectedStyle] = useState('italic')
  const [showAll, setShowAll] = useState(false)

  const visibleCategories = showAll ? glyphCategories : glyphCategories.slice(0, collapsedCount)
  const fontStyle = selectedStyle === 'italic' ? 'italic' : 'normal'

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          label="Character Set"
          size="sm"
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          showDropdown={showDropdown}
        />

        <div className="w-full flex flex-col gap-12 relative">
          {visibleCategories.map((category, index) => (
            <GlyphCategory
              key={category.key}
              title={category.title}
              glyphs={glyphSets[category.key]}
              fontFamily={fontFamily}
              fontStyle={fontStyle}
              className={!showAll && index === collapsedCount - 1 ? 'relative' : ''}
            />
          ))}

          {!showAll && (
            <>
              {/* Theme-aware fade (fixes the hardcoded rgba(18,18,21) dark mask). */}
              <div
                className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 13%, var(--kol-surface-primary) 86%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <Button onClick={() => setShowAll(true)} variant="outline">
                  Show All Glyphs
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default FoundryCharacterSets
