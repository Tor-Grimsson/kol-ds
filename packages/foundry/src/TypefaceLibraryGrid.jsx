import { ContentFilters } from '@kolkrabbi/kol-component'

/**
 * TypefaceLibraryGrid — filtered typeface library grid. Thin wrapper around the
 * DS `ContentFilters` configured for typefaces (Classification + Styles filter
 * groups, card/list view toggle). The parent supplies `renderItem` so it can
 * wrap each entry in its own navigation.
 *
 * @param {Object} props
 * @param {Array} props.typefaces - Typeface objects.
 * @param {Function} props.renderItem - (typeface, viewMode) => node, wraps each item.
 * @param {number} props.totalCount - Total count of all typefaces.
 */
const TypefaceLibraryGrid = ({
  typefaces,
  renderItem,
  totalCount
}) => {
  // Extract unique values for filter groups
  const classifications = [...new Set(typefaces.map((t) => t.classification))].sort()
  const styles = [...new Set(typefaces.map((t) => t.styles))].sort()

  const filterGroups = [
    {
      label: 'Classification',
      key: 'classification',
      values: classifications
    },
    {
      label: 'Styles',
      key: 'styles',
      values: styles
    }
  ]

  const viewModeOptions = [
    { value: 'card', label: 'Card view' },
    { value: 'list', label: 'List view' }
  ]

  // Render items in grid or list based on view mode
  const renderItemsWithLayout = (items, viewMode) => {
    if (viewMode === 'card') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((typeface) => renderItem(typeface, 'card'))}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {items.map((typeface) => renderItem(typeface, 'list'))}
      </div>
    )
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-[1400px] mx-auto">
        <ContentFilters
          items={typefaces}
          title="All Typefaces"
          totalCount={totalCount}
          filterGroups={filterGroups}
          renderItem={(items, viewMode) => renderItemsWithLayout(items, viewMode)}
          viewModeOptions={viewModeOptions}
          defaultViewMode="list"
        />
      </div>
    </section>
  )
}

export default TypefaceLibraryGrid
