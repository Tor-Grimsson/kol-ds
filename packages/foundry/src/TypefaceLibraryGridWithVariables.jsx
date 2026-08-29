import { useState, useMemo } from 'react'
import { ContentFilters, ContentCollection, ContentCard, ContentRow } from '@kolkrabbi/kol-component'
import TypefaceVariablePreview from './TypefaceVariablePreview.jsx'
import TypefaceAlphabet from './TypefaceAlphabet.jsx'
import { FOUNDRY_SAMPLE_TEXT } from './glyphData.js'

/* the card's hover reveal shows the foundry passage's FIRST sentence in the face
 * (TypefaceCardRevealText, user 2026-08-27: "why does it use quick brown fox? we
 * have custom text samples") — the whole passage does not fit a 500px card */
const REVEAL_TEXT = FOUNDRY_SAMPLE_TEXT.split(/(?<=\.)\s/)[0]

// typeface name → the loaded family (the mapping the retired TypefaceLibraryItem carried)
const faceFor = (typeface) => ({
  fontFamily: typeface.name === 'TG Rót' ? 'TGRoot' :
              typeface.name === 'TG Tröllatunga' ? 'TGTrollatunga' :
              typeface.name === 'TG Dylgjur' ? 'TGDylgjur' :
              typeface.name === 'TG Gullhamrar' ? 'TGGullhamrar' :
              'TGMalromur',
  fontStyle: typeface.name === 'TG Málrómur' ? 'italic' : 'normal',
  fontWeight: 400,
})

/**
 * TypefaceLibraryGridWithVariables — the library grid with a "By Typeface"
 * filter mode. Default mode shows standard TypefaceLibraryItem cards; selecting
 * a single typeface swaps to TypefaceVariablePreview per weight variant, with an
 * optional Axes filter for multi-axis families.
 *
 * Router-severed: every item is a real `<a href>`; pass `onNavigate(href, event)`
 * to intercept (the SPA seam — call your router there). `linkComponent` retired
 * 2026-08-27 (FoundryComponentsReconcile): the items are ContentCard / ContentRow
 * now and take `onNavigate`, not a wrapper.
 *
 * @param {Object} props
 * @param {Array} props.typefaces - Typeface objects.
 * @param {Object} props.typefaceWeights - Map of typeface name → weight variant array.
 * @param {number} props.totalCount - Total count of all typefaces.
 * @param {Function} props.onNavigate - (href, event) => void — the SPA seam; omit and the browser follows the href.
 * @param {string} props.titleIcon - ContentFilters title icon.
 */
const TypefaceLibraryGridWithVariables = ({
  typefaces,
  typefaceWeights = {},
  totalCount,
  onNavigate,
  titleIcon
}) => {
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [viewMode, setViewMode] = useState('list')
  const go = (href) => (event) => {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate(href, event)
  }

  // Handle filter changes with mutual exclusivity for typeface selection
  const handleFilterChange = (newFilters) => {
    // Check if a typeface (name) filter was added
    const newTypefaceFilter = Array.from(newFilters).find(f => f.startsWith('name:'))
    const oldTypefaceFilter = Array.from(activeFilters).find(f => f.startsWith('name:'))

    // If a new typeface is selected and it's different from the old one,
    // remove the old typeface filter to enforce mutual exclusivity
    if (newTypefaceFilter && oldTypefaceFilter && newTypefaceFilter !== oldTypefaceFilter) {
      const updatedFilters = new Set(newFilters)
      updatedFilters.delete(oldTypefaceFilter)
      setActiveFilters(updatedFilters)
    } else {
      setActiveFilters(newFilters)
    }
  }

  // Extract unique values for filter groups
  const classifications = [...new Set(typefaces.map((t) => t.classification))].sort()
  const styles = [...new Set(typefaces.map((t) => t.styles))].sort()
  const typefaceNames = typefaces.map((t) => t.name).sort()

  // Check if a specific typeface is selected
  const selectedTypeface = useMemo(() => {
    const typefaceFilter = Array.from(activeFilters).find(f => f.startsWith('name:'))
    return typefaceFilter ? typefaceFilter.split(':')[1] : null
  }, [activeFilters])

  // Get available axes for selected typeface
  const availableAxes = useMemo(() => {
    if (!selectedTypeface || !typefaceWeights[selectedTypeface]) return []
    const weights = typefaceWeights[selectedTypeface]
    const axes = [...new Set(weights.map(w => w.axis).filter(Boolean))]
    return axes
  }, [selectedTypeface, typefaceWeights])

  // Filter groups - dynamically add Axes filter if multi-axis typeface selected
  const filterGroups = useMemo(() => {
    const baseGroups = [
      { label: 'Kind', key: 'classification', values: classifications, stack: true },
      { label: 'Styles', key: 'styles', values: styles },
      { label: 'Typefaces', key: 'name', values: typefaceNames }
    ]

    // Add Axes filter if selected typeface has multiple axes
    if (selectedTypeface && availableAxes.length > 1) {
      baseGroups.push({
        label: 'Axes',
        key: 'axis',
        values: availableAxes
      })
    }

    return baseGroups
  }, [classifications, styles, typefaceNames, selectedTypeface, availableAxes])

  // Filtered items
  const filteredItems = useMemo(() => {
    if (activeFilters.size === 0) return typefaces

    return typefaces.filter((typeface) => {
      let matches = true
      activeFilters.forEach((filter) => {
        const [filterType, value] = filter.split(':')
        if (filterType === 'typeface' && typeface.name !== value) {
          matches = false
        }
        if (filterType === 'classification' && typeface.classification !== value) {
          matches = false
        }
        if (filterType === 'styles' && typeface.styles !== value) {
          matches = false
        }
      })
      return matches
    })
  }, [typefaces, activeFilters])

  // Layout strip (LIST / GRID) — the bar's layout spot, not the view spot
  const layoutOptions = [
    { value: 'list', label: 'LIST' },
    { value: 'grid', label: 'GRID' }
  ]

  // Render items based on filter mode
  const renderItems = (items, _viewMode, layout) => {
    const mode = layout === 'list' ? 'list' : 'card'

    // If a specific typeface is selected, show weight variants
    if (selectedTypeface && typefaceWeights[selectedTypeface]) {
      const typeface = items.find(t => t.name === selectedTypeface)
      if (!typeface) return null

      let weights = typefaceWeights[selectedTypeface]

      // Filter by selected axes if any axis filters are active
      const selectedAxes = Array.from(activeFilters)
        .filter(f => f.startsWith('axis:'))
        .map(f => f.split(':')[1])

      if (selectedAxes.length > 0) {
        weights = weights.filter(w => selectedAxes.includes(w.axis))
      }

      return (
        <ContentCollection form={mode === 'card' ? 'grid' : 'list'} cols={{ md: 2, lg: 4 }} gap={24}>
          {weights.map((w) => (
            <TypefaceVariablePreview
              key={`${typeface.name}-${w.weight}`}
              typeface={typeface}
              weight={w.weight}
              weightValue={w.value}
              variant={mode}
            />
          ))}
        </ContentCollection>
      )
    }

    // Default mode — the DS typeface pair (TypefaceCardAndRow, component
    // 0.95.0): the card's hover choreography is the DS's (`reveal`), the
    // specimens are ours. The local TypefaceLibraryItem retired to
    // _tmp/2026-08-27-typeface-library-ds-swap/.
    if (mode === 'card') {
      return (
        <ContentCollection form="grid" cols={{ md: 2, lg: 4 }}>
          {items.map((typeface) => {
            const face = faceFor(typeface)
            return (
              <ContentCard
                key={typeface.link}
                variant="typeface"
                title={typeface.name}
                body={typeface.styles}
                href={typeface.link}
                onNavigate={go(typeface.link)}
                media={
                  <div className="w-full h-full flex items-end justify-start p-8">
                    <span className="text-[140px] lg:text-[160px] leading-none" style={face}>Ðð</span>
                  </div>
                }
                reveal={
                  <p className="text-auto-inverse text-4xl lg:text-5xl leading-tight text-center" style={face}>
                    {REVEAL_TEXT}
                  </p>
                }
              />
            )
          })}
        </ContentCollection>
      )
    }

    // List view
    return (
      <ContentCollection form="list" gap={24}>
        {items.map((typeface) => {
          const face = faceFor(typeface)
          return (
            <ContentRow
              key={typeface.link}
              variant="typeface"
              title={typeface.name}
              body={typeface.styles}
              detail={typeface.classification}
              date={typeface.year}
              href={typeface.link}
              onNavigate={go(typeface.link)}
              footer={<TypefaceAlphabet fontFamily={face.fontFamily} fontStyle={face.fontStyle} />}
            />
          )
        })}
      </ContentCollection>
    )
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-[var(--kol-container-max)] mx-auto">
        <ContentFilters showCountOnlyWhenFiltering
          items={typefaces}
          title="All Typefaces"
          titleIcon={titleIcon}
          totalCount={totalCount}
          filterGroups={filterGroups}
          renderItem={renderItems}
          layoutPlacement="header"
          layoutOptions={layoutOptions}
          layoutClassName="kol-helper-14"
          defaultLayout="list"
          mutuallyExclusiveFilters={['name']}
          onFilterChange={handleFilterChange}
          customFilterKeys={['axis']}
        />
      </div>
    </section>
  )
}

export default TypefaceLibraryGridWithVariables
