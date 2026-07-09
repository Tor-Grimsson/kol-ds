// Data is consumer-provided via the `chessData` prop (no bundled dataset).
// Required chessData functions: loadMonthGames(month), getMonthlySummary(),
// getRandomMonth(), getGamePgnByIdAsync(id, month).
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Dropdown, Input, Button, Table, Tag, Pill } from '@kolkrabbi/kol-component'

const MAX_VISIBLE_GAMES = 5

const GameArchiveTable = ({ chessData, onGameLoad }) => {
  const {
    loadMonthGames = async () => [],
    getMonthlySummary = () => [],
    getRandomMonth = () => null,
    getGamePgnByIdAsync = async () => null
  } = chessData ?? {}

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric'
      }),
    []
  )

  // Lightweight data - always loaded
  const monthlySummary = useMemo(() => getMonthlySummary(), [])

  // Heavy data - loaded on demand
  const [loadedMonths, setLoadedMonths] = useState(new Set())
  const [monthlyGames, setMonthlyGames] = useState({}) // { "2024-08": [...games] }
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedTimeClass, setSelectedTimeClass] = useState('all')
  const [selectedResult, setSelectedResult] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAllGames, setShowAllGames] = useState(false)

  // Month options (from lightweight summary)
  const monthOptions = useMemo(() => {
    const formatted = (monthlySummary || [])
      .filter((entry) => entry?.month && entry.month !== 'unknown')
      .map((entry) => ({
        label: monthFormatter.format(new Date(`${entry.month}-01T00:00:00Z`)),
        value: entry.month,
        count: entry.total
      }))
      .reverse()
    return formatted
  }, [monthlySummary, monthFormatter])

  // Load random month on mount
  useEffect(() => {
    const loadInitialMonth = async () => {
      const randomMonth = getRandomMonth()
      setIsLoading(true)
      const games = await loadMonthGames(randomMonth)
      setMonthlyGames({ [randomMonth]: games.slice(0, 5) }) // Only first 5 games
      setLoadedMonths(new Set([randomMonth]))
      setSelectedMonth(randomMonth)
      setIsLoading(false)
    }
    loadInitialMonth()
  }, [])

  // Load month data when explicitly requested
  const handleLoadMonth = useCallback(async (month) => {
    if (loadedMonths.has(month)) {
      // Already loaded, just switch to it
      setSelectedMonth(month)
      return
    }

    setIsLoading(true)
    const games = await loadMonthGames(month)
    setMonthlyGames(prev => ({ ...prev, [month]: games }))
    setLoadedMonths(prev => new Set([...prev, month]))
    setSelectedMonth(month)
    setIsLoading(false)
  }, [loadedMonths])

  // Get current month's games
  const currentMonthGames = useMemo(() => {
    if (!selectedMonth) return []
    return monthlyGames[selectedMonth] || []
  }, [selectedMonth, monthlyGames])

  // Time class options (from current month only)
  const timeClassOptions = useMemo(() => {
    const unique = Array.from(
      new Set(currentMonthGames.map((game) => game.timeClass).filter(Boolean))
    )
    return [
      { label: 'All Time Classes', value: 'all' },
      ...unique.map((timeClass) => ({
        label: timeClass.charAt(0).toUpperCase() + timeClass.slice(1),
        value: timeClass
      }))
    ]
  }, [currentMonthGames])

  // Result options (from current month only)
  const resultOptions = useMemo(() => {
    const unique = Array.from(
      new Set(currentMonthGames.map((game) => game.playerResult).filter(Boolean))
    )
    return [
      { label: 'All Results', value: 'all' },
      ...unique.map((result) => ({
        label: result.charAt(0).toUpperCase() + result.slice(1),
        value: result
      }))
    ]
  }, [currentMonthGames])

  // Reset filters when month changes
  useEffect(() => {
    setShowAllGames(false)
    setSelectedTimeClass('all')
    setSelectedResult('all')
    setSearchTerm('')
  }, [selectedMonth])

  // Filter games
  const filteredGames = useMemo(() => {
    if (!currentMonthGames.length) return []

    const term = searchTerm.trim().toLowerCase()

    return currentMonthGames
      .filter((game) => {
        if (selectedTimeClass !== 'all' && game.timeClass !== selectedTimeClass) return false
        if (selectedResult !== 'all' && game.playerResult !== selectedResult) return false

        if (!term) return true

        const haystack = [
          game.player?.username,
          game.opponent?.username,
          game.timeControl,
          game.eco
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(term)
      })
      .sort((a, b) => (b.endTime ?? 0) - (a.endTime ?? 0))
  }, [currentMonthGames, selectedTimeClass, selectedResult, searchTerm])

  const tableRows = useMemo(() => {
    if (showAllGames || filteredGames.length <= MAX_VISIBLE_GAMES) {
      return filteredGames
    }
    return filteredGames.slice(0, MAX_VISIBLE_GAMES)
  }, [filteredGames, showAllGames])

  const canShowAll = filteredGames.length > MAX_VISIBLE_GAMES

  const monthLabel = useMemo(() => {
    if (!selectedMonth) return 'No month selected'
    try {
      return monthFormatter.format(new Date(`${selectedMonth}-01T00:00:00Z`))
    } catch {
      return selectedMonth
    }
  }, [monthFormatter, selectedMonth])

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }, [])

  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [])

  const formatResult = useCallback((result) => {
    if (!result) return 'Pending'
    switch (result) {
      case 'win':
        return 'Win'
      case 'draw':
        return 'Draw'
      case 'stalemate':
        return 'Stalemate'
      case 'resigned':
        return 'Resigned'
      default:
        return result.charAt(0).toUpperCase() + result.slice(1)
    }
  }, [])

  const handleLoadGame = useCallback(async (game) => {
    // Pass month directly to avoid fetching full dataset
    const pgn = await getGamePgnByIdAsync(game.id, game.month)
    if (!pgn) {
      console.error('[GameArchiveTable] No PGN found for game:', game.id, 'month:', game.month)
      return
    }
    const loadedGame = {
      ...game,
      pgn
    }
    if (onGameLoad) {
      onGameLoad(loadedGame)
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [onGameLoad])

  const columns = useMemo(
    () => [
      {
        header: 'Date',
        accessor: 'date',
        className: 'kol-table-cell-text analysis-table__cell',
        render: (game) => (
          <div className="flex items-center gap-3">
            <span>{formatDate(game.endTime)}</span>
            {game.endTime ? (
              <span className="kol-table-token bg-fg-08 hidden md:inline-flex">{formatTime(game.endTime)}</span>
            ) : null}
          </div>
        )
      },
      {
        header: 'Opponent',
        accessor: 'opponent',
        className: 'kol-table-cell-text analysis-table__cell',
        render: (game) => <span>{game.opponent?.username ?? 'Opponent'}</span>
      },
      {
        header: 'Result',
        accessor: 'result',
        className: 'kol-table-cell-text analysis-table__cell',
        render: (game) => {
          const label = game.terminationCategory
            ? game.terminationCategory.replace('win-', 'win by ').replace(/-/g, ' ')
            : formatResult(game.playerResult)
          return <span className="kol-table-token bg-fg-08">{label}</span>
        }
      },
      {
        header: 'Color',
        accessor: 'color',
        className: 'kol-table-cell-text analysis-table__cell hidden lg:table-cell',
        headerClassName: 'kol-table-cell-title hidden lg:table-cell',
        render: (game) => (
          <span
            className={`kol-table-pill ${
              game.playerColor === 'white' ? 'kol-table-pill-light' : 'kol-table-pill-dark'
            }`}
          >
            {game.playerColor === 'white' ? 'White' : 'Black'}
          </span>
        )
      },
      {
        header: 'Time Control',
        accessor: 'timeControl',
        className: 'kol-table-cell-text analysis-table__cell hidden md:table-cell',
        headerClassName: 'kol-table-cell-title hidden md:table-cell',
        render: (game) => {
          const label = game.timeClass
            ? game.timeClass.charAt(0).toUpperCase() + game.timeClass.slice(1)
            : '—'
          return <span>{label}</span>
        }
      },
      {
        header: 'Rating',
        accessor: 'ratings',
        className: 'kol-table-cell-text analysis-table__cell hidden lg:table-cell',
        headerClassName: 'kol-table-cell-title hidden lg:table-cell',
        render: (game) => (
          <div className="flex items-center gap-3">
            <span className="kol-table-pill kol-table-pill-dark">
              {game.player?.rating ?? '—'}
            </span>
            <span>{game.opponent?.rating ?? '—'}</span>
          </div>
        )
      },
      {
        header: 'Link',
        accessor: 'url',
        className: 'kol-table-cell-text analysis-table__actions-cell',
        headerClassName: 'kol-table-cell-title analysis-table__actions-header',
        render: (game) => (
          <div className="analysis-table__actions">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleLoadGame(game)
              }}
            >
              <span className="hidden sm:inline">Load here</span>
              <span className="inline sm:hidden">Load</span>
            </Button>
            {game.url ? (
              <a
                href={game.url}
                className="analysis-table__link"
                target="_blank"
                rel="noreferrer"
              >
                Chess.com →
              </a>
            ) : (
              <span className="analysis-table__meta">No link</span>
            )}
          </div>
        )
      }
    ],
    [formatDate, formatTime, formatResult, handleLoadGame]
  )

  // Calculate memory usage
  const loadedGamesCount = useMemo(() => {
    return Object.values(monthlyGames).reduce((sum, games) => sum + games.length, 0)
  }, [monthlyGames])

  const selectedMonthInfo = useMemo(() => {
    return monthlySummary.find(entry => entry.month === selectedMonth)
  }, [monthlySummary, selectedMonth])

  const isMonthFullyLoaded = useMemo(() => {
    if (!selectedMonth || !selectedMonthInfo) return false
    const loadedCount = monthlyGames[selectedMonth]?.length || 0
    return loadedCount === selectedMonthInfo.total
  }, [selectedMonth, selectedMonthInfo, monthlyGames])

  return (
    <section className="space-y-6">
      {/* Memory Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-surface-secondary border border-fg-08 rounded">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="kol-mono-12 uppercase">Game Archive Status</h3>
            {isLoading && <Pill variant="subtle" size="sm">Loading...</Pill>}
          </div>
          <p className="kol-mono-12 text-fg-64">
            {loadedMonths.size} of {monthOptions.length} months loaded · {loadedGamesCount.toLocaleString()} games in memory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill variant="subtle" size="sm">
            {monthLabel}
          </Pill>
          {selectedMonthInfo && (
            <Pill variant="subtle" size="sm">
              {selectedMonthInfo.total} total
            </Pill>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="kol-mono-16">Browse Games</h3>
          <Tag>
            {`${tableRows.length} shown · ${filteredGames.length.toLocaleString()} filtered`}
          </Tag>
        </div>
        <p className="kol-mono-14 text-auto/70 leading-relaxed">
          Select a month to load games. Initially showing a random sample of 5 games.
          Use filters to narrow your search or load the full month.
        </p>
      </div>

      {/* Month Selector with Load Button */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <Dropdown
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="analysis-control w-full sm:w-auto"
            placeholder="Select month..."
          />

          {selectedMonth && !loadedMonths.has(selectedMonth) && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleLoadMonth(selectedMonth)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : `Load ${selectedMonthInfo?.total || 0} games from ${monthLabel}`}
            </Button>
          )}

          {selectedMonth && loadedMonths.has(selectedMonth) && !isMonthFullyLoaded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLoadMonth(selectedMonth)}
              disabled={isLoading}
            >
              Load full month ({selectedMonthInfo?.total || 0} games)
            </Button>
          )}
        </div>
      </div>

      {/* Filters - only show when month is loaded */}
      {loadedMonths.has(selectedMonth) && (
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <Dropdown
              options={timeClassOptions}
              value={selectedTimeClass}
              onChange={setSelectedTimeClass}
              className="analysis-control w-full sm:w-auto"
            />
            <Dropdown
              options={resultOptions}
              value={selectedResult}
              onChange={setSelectedResult}
              className="analysis-control w-full sm:w-auto"
            />
          </div>
          <div className="w-full md:w-auto md:min-w-[280px]">
            <Input
              placeholder="Search opponent, ECO, or control…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              iconLeft="search-16"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="analysis-table-wrapper">
        {!selectedMonth || !loadedMonths.has(selectedMonth) ? (
          <div className="analysis-table-empty">
            <p className="kol-mono-14 text-auto/70">
              {selectedMonth
                ? 'Click "Load games" to view this month\'s games'
                : 'Select a month from the dropdown above to get started'}
            </p>
          </div>
        ) : tableRows.length === 0 ? (
          <div className="analysis-table-empty">
            <p className="kol-mono-14 text-auto/70">
              No games match the current filters. Try expanding your search criteria.
            </p>
          </div>
        ) : (
          <Table
            caption="Archive of chess games matching current filters"
            columns={columns}
            rows={tableRows}
          />
        )}

        {canShowAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllGames((value) => !value)}
          >
            {showAllGames
              ? 'Show fewer games'
              : `Show all ${filteredGames.length.toLocaleString()} games`}
          </Button>
        )}
      </div>
    </section>
  )
}

export default GameArchiveTable
