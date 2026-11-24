import { useMemo, useState } from 'react'
import './DataTable.css'

function getCellValue(row, column) {
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : row[column.accessor]
}

function compareValues(left, right) {
  if (left == null) return right == null ? 0 : -1
  if (right == null) return 1
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function DataTable({
  columns,
  data,
  emptyMessage = 'No results found.',
  pageSize = 5,
  rowKey = 'id',
  searchPlaceholder = 'Filter rows...',
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ accessor: null, direction: 'asc' })
  const [page, setPage] = useState(0)

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const filtered = normalizedQuery
      ? data.filter((row) => columns.some((column) => {
        const value = getCellValue(row, column)
        return value != null && String(value).toLocaleLowerCase().includes(normalizedQuery)
      }))
      : data

    if (!sort.accessor) return filtered

    const sorted = [...filtered].sort((left, right) => {
      const column = columns.find((item) => item.accessor === sort.accessor)
      if (!column) return 0
      return compareValues(getCellValue(left, column), getCellValue(right, column))
    })

    return sort.direction === 'asc' ? sorted : sorted.reverse()
  }, [columns, data, query, sort])

  const pageCount = Math.ceil(filteredData.length / pageSize)
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0))
  const pageRows = filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  const firstRow = filteredData.length === 0 ? 0 : currentPage * pageSize + 1
  const lastRow = Math.min((currentPage + 1) * pageSize, filteredData.length)

  function toggleSort(accessor) {
    setSort((current) => ({
      accessor,
      direction: current.accessor === accessor && current.direction === 'asc' ? 'desc' : 'asc',
    }))
    setPage(0)
  }

  function handleSearch(event) {
    setQuery(event.target.value)
    setPage(0)
  }

  return (
    <div className="react-data-table">
      <div className="react-data-table__toolbar">
        <label className="react-data-table__search-label" htmlFor="data-table-search">
          Search
        </label>
        <input
          id="data-table-search"
          className="react-data-table__search"
          type="search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="react-data-table__scroll">
        <table className="react-data-table__table">
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = sort.accessor === column.accessor
                return (
                  <th key={column.accessor} scope="col" aria-sort={
                    isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
                  }>
                    <button
                      className="react-data-table__sort"
                      type="button"
                      onClick={() => toggleSort(column.accessor)}
                    >
                      {column.header}
                      <span className="react-data-table__sort-indicator" aria-hidden="true">
                        {isSorted ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length > 0 ? pageRows.map((row, index) => {
              const key = row[rowKey] ?? `${currentPage}-${index}`
              return (
                <tr key={key}>
                  {columns.map((column) => {
                    const value = getCellValue(row, column)
                    return (
                      <td key={column.accessor}>
                        {column.cell ? column.cell(value, row) : value ?? '—'}
                      </td>
                    )
                  })}
                </tr>
              )
            }) : (
              <tr>
                <td className="react-data-table__empty" colSpan={columns.length}>{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="react-data-table__pagination">
        <span className="react-data-table__summary">
          Showing {firstRow}–{lastRow} of {filteredData.length}
        </span>
        <div className="react-data-table__page-controls">
          <button
            type="button"
            className="react-data-table__page-button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="react-data-table__page-number">
            Page {pageCount === 0 ? 0 : currentPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            className="react-data-table__page-button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
