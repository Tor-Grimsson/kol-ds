import { useState, useMemo, useEffect, useRef } from 'react'
import { ContentFilters } from '@kolkrabbi/kol-component'
import TypefaceLibraryItem from './TypefaceLibraryItem.jsx'
import TypefaceVariablePreview from './TypefaceVariablePreview.jsx'

/**
 * TypefaceLibraryGridWithVariables — the library grid with a "By Typeface"
 * filter mode. Default mode shows standard TypefaceLibraryItem cards; selecting
 * a single typeface swaps to TypefaceVariablePreview per weight variant, with an
 * optional Axes filter for multi-axis families.
 *
 * Router-severed: pass an injected `linkComponent` (e.g. your router's `Link`)
 * to wrap each item — it receives a `to` prop. When omitted, items render as a
 * plain `<a href>`. Report: replaced the monorepo's `react-router-dom` `Link`.
 *
 * @param {Object} props
 * @param {Array} props.typefaces - Typeface objects.
 * @param {Object} props.typefaceWeights - Map of typeface name → weight variant array.
 * @param {number} props.totalCount - Total count of all typefaces.
 * @param {React.ElementType} props.linkComponent - Optional link wrapper (receives `to`); defaults to `<a href>`.
 */
const TypefaceLibraryGridWithVariables = ({
  typefaces,
  typefaceWeights = {},
  totalCount,
  linkComponent
}) => {
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [viewMode, setViewMode] = useState('list')
  const [activeIndex, setActiveIndex] = useState(null)
  const prevModeRef = useRef(null)

  const LinkEl = linkComponent || 'a'
  const linkPropsFor = (dest) => (linkComponent ? { to: dest } : { href: dest })

  // Reset active index when filters change
  useEffect(() => {
    setActiveIndex(null)
  }, [activeFilters])

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
      { label: 'Classification', key: 'classification', values: classifications },
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

  // View mode options
  const viewModeOptions = [
    { value: 'card', label: 'Card view' },
    { value: 'list', label: 'List view' }
  ]

  // Render items based on filter mode
  const renderItems = (items, mode) => {
    // Reset active index when view mode changes
    if (prevModeRef.current !== null && prevModeRef.current !== mode) {
      setActiveIndex(null)
    }
    prevModeRef.current = mode

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

      if (mode === 'card') {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weights.map((w) => (
              <TypefaceVariablePreview
                key={`${typeface.name}-${w.weight}`}
                typeface={typeface}
                weight={w.weight}
                weightValue={w.value}
                variant="card"
              />
            ))}
          </div>
        )
      }

      // List view
      return (
        <div className="space-y-6">
          {weights.map((w) => (
            <TypefaceVariablePreview
              key={`${typeface.name}-${w.weight}`}
              typeface={typeface}
              weight={w.weight}
              weightValue={w.value}
              variant="list"
            />
          ))}
        </div>
      )
    }

    // Default mode: show standard typeface cards
    if (mode === 'card') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((typeface, index) => (
            <LinkEl key={typeface.link} {...linkPropsFor(typeface.link)}>
              <TypefaceLibraryItem
                typeface={typeface}
                variant="card"
                isActive={activeIndex === index}
                onMouseEnter={() => setActiveIndex(index)}
              />
            </LinkEl>
          ))}
        </div>
      )
    }

    // List view
    return (
      <div className="space-y-6">
        {items.map((typeface, index) => (
          <LinkEl key={typeface.link} {...linkPropsFor(typeface.link)}>
            <TypefaceLibraryItem
              typeface={typeface}
              variant="list"
              isActive={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
            />
          </LinkEl>
        ))}
      </div>
    )
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-[1400px] mx-auto">
        <ContentFilters
          items={typefaces}
          title="All Typefaces (With Variable Preview)"
          totalCount={totalCount}
          filterGroups={filterGroups}
          renderItem={(items, mode) => renderItems(items, mode)}
          viewModeOptions={viewModeOptions}
          defaultViewMode="list"
          onFilterChange={handleFilterChange}
          mutuallyExclusiveFilters={['name']}
          customFilterKeys={['axis']}
        />
      </div>
    </section>
  )
}

export default TypefaceLibraryGridWithVariables
