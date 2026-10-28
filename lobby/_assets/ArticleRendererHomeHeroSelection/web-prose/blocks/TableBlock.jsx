import { Table } from '@kolkrabbi/kol-component'

const buildColumns = (columns = []) => {
  if (!Array.isArray(columns)) return []
  return columns.map((column, index) => {
    const accessor = column?.key?.trim() || `column_${index}`
    const alignmentClass = (() => {
      switch (column?.alignment) {
        case 'left':
          return 'text-left'
        case 'center':
          return 'text-center'
        case 'right':
          return 'text-right'
        default:
          return ''
      }
    })()
    const renderCell = (row) => {
      const rawValue = row?.[accessor]
      const displayValue = rawValue !== undefined && rawValue !== null && rawValue !== '' ? rawValue : '—'
      return <span className="kol-mono-14 text-xs">{displayValue}</span>
    }

    return {
      header: column?.label || `Column ${index + 1}`,
      accessor,
      className: `kol-table-cell-text ${alignmentClass}`.trim(),
      headerClassName: `kol-table-cell-title ${alignmentClass}`.trim(),
      render: renderCell
    }
  })
}

const buildRows = (rows = [], columns = []) => {
  if (!Array.isArray(rows)) return []
  return rows.map((row, rowIndex) => {
    const rowData = { id: row?._key || `row_${rowIndex}` }
    columns.forEach((column, columnIndex) => {
      rowData[column.accessor] = row?.cells?.[columnIndex] ?? ''
    })
    return rowData
  })
}

const TableBlock = ({ value }) => {
  const columns = buildColumns(value?.columns)
  const rows = buildRows(value?.rows, columns)

  if (!columns.length || !rows.length) {
    return null
  }

  return (
    <div className="my-8">
      <Table caption={value?.caption} columns={columns} rows={rows} />
      {value?.footnote ? (
        <p className="kol-helper-12 text-fg-64 mt-3">{value.footnote}</p>
      ) : null}
    </div>
  )
}

export default TableBlock
