// Data is consumer-provided via the `chessData` prop (no bundled dataset).
// Required chessData functions: loadMonthGames(month), loadFullDataset(),
// getMonthlySummary(), getGamePgnByIdAsync(id, month).
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Dropdown, Input, Button, Table, Pill } from '@kolkrabbi/kol-component'

import { TIME_CLASS_LABELS, RESULT_LABELS } from './labels.js'

const MAX_VISIBLE_GAMES = 5

// Dropdown sentinel for the whole-archive scope (brief 4.0).
const ALL_GAMES = 'all'

const GameArchiveTable = ({ chessData, onGameLoad }) => {
  const {
    loadMonthGames = async () => [],
    loadFullDataset = async () => [],
    getMonthlySummary = () => [],
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

  // Heavy data - loaded on demand. No fetch on mount (brief 4.0): the archive
  // opens on "All games" selected, and data only moves on the button press.
  const [loadedMonths, setLoadedMonths] = useState(new Set())
  const [monthlyGames, setMonthlyGames] = useState({}) // { "2024-08": [...games], all: [...] }
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(ALL_GAMES)
  const [selectedTimeClass, setSelectedTimeClass] = useState('all')
  const [selectedResult, setSelectedResult] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAllGames, setShowAllGames] = useState(false)

  // Scope options: "All games" first (the item the dropdown opens on), months below
  const monthOptions = useMemo(() => {
    const formatted = (monthlySummary || [])
      .filter((entry) => entry?.month && entry.month !== 'unknown')
      .map((entry) => ({
        label: monthFormatter.format(new Date(`${entry.month}-01T00:00:00Z`)),
        value: entry.month,
        count: entry.total
      }))
      .reverse()
    return [{ label: 'All games', value: ALL_GAMES }, ...formatted]
  }, [monthlySummary, monthFormatter])

  // Load scope data when explicitly requested — the `all` path hits the same
  // memoized fetch as the month path, so whichever runs first pays the one fetch.
  const handleLoadMonth = useCallback(async (month) => {
    if (loadedMonths.has(month)) {
      // Already loaded, just switch to it
      setSelectedMonth(month)
      return
    }

    setIsLoading(true)
    const games = month === ALL_GAMES ? await loadFullDataset() : await loadMonthGames(month)
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
        label: TIME_CLASS_LABELS[timeClass] ?? timeClass,
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
        label: RESULT_LABELS[result] ?? result,
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
    if (selectedMonth === ALL_GAMES) return 'All games'
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
        return RESULT_LABELS[result] ?? result
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
  }, [onGameLoad])

  const columns = useMemo(
    () => [
      {
        header: 'DATE',
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
        header: 'OPPONENT',
        accessor: 'opponent',
        className: 'kol-table-cell-text analysis-table__cell',
        render: (game) => <span>{game.opponent?.username ?? 'Opponent'}</span>
      },
      {
        header: 'RESULT',
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
        header: 'COLOR',
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
        header: 'TIME CONTROL',
        accessor: 'timeControl',
        className: 'kol-table-cell-text analysis-table__cell hidden md:table-cell',
        headerClassName: 'kol-table-cell-title hidden md:table-cell',
        render: (game) => {
          const label = game.timeClass
            ? (TIME_CLASS_LABELS[game.timeClass] ?? game.timeClass)
            : '—'
          return <span>{label}</span>
        }
      },
      {
        header: 'RATING',
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
        header: 'LINK',
        accessor: 'url',
        className: 'kol-table-cell-text analysis-table__actions-cell',
        headerClassName: 'kol-table-cell-title analysis-table__actions-header',
        render: (game) => (
          <div className="analysis-table__actions">
            <Button
              variant="outline"
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
                CHESS.COM →
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
    if (selectedMonth === ALL_GAMES) {
      const total = monthlySummary.reduce((sum, entry) => sum + (entry?.total ?? 0), 0)
      return { month: ALL_GAMES, total }
    }
    return monthlySummary.find(entry => entry.month === selectedMonth)
  }, [monthlySummary, selectedMonth])

  return (
    <section className="space-y-6">
      {/* Memory Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-surface-secondary border border-fg-08 rounded">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="kol-helper-12">GAME ARCHIVE STATUS</h3>
            {isLoading && <Pill variant="subtle" size="sm">Loading...</Pill>}
          </div>
          <p className="kol-mono-12 text-fg-64">
            {loadedMonths.has(ALL_GAMES)
              ? 'entire set loaded'
              : `${[...loadedMonths].filter((m) => m !== ALL_GAMES).length} of ${monthOptions.length - 1} months loaded`}
            {' · '}{loadedGamesCount.toLocaleString()} games in memory
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
          <h3 className="kol-sans-heading-05">Browse Games</h3>
          <Pill variant="subtle" size="sm">
            {`${tableRows.length} shown · ${filteredGames.length.toLocaleString()} filtered`}
          </Pill>
        </div>
        <p className="kol-mono-14 text-auto/70 leading-relaxed">
          Pick a scope — the entire set or a single month — then load games.
          Use filters to narrow your search.
        </p>
      </div>

      {/* Month Selector with Load Button */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <Dropdown
            size="sm"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="analysis-control w-full sm:w-auto"
            placeholder="Select month..."
          />

          {/* Scope-aware, generic labels (brief 4.0) — the dropdown already
            * names the month, so the button never repeats it. */}
          {selectedMonth && !loadedMonths.has(selectedMonth) && (
            <Button
              variant="primary"
              size="sm"
              className="analysis-control"
              onClick={() => handleLoadMonth(selectedMonth)}
              disabled={isLoading}
            >
              {isLoading
                ? 'Loading...'
                : selectedMonth === ALL_GAMES
                  ? 'Load entire set'
                  : 'Load month'}
            </Button>
          )}
        </div>
      </div>

      {/* Filters - only show when month is loaded */}
      {loadedMonths.has(selectedMonth) && (
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <Dropdown
              size="sm"
              options={timeClassOptions}
              value={selectedTimeClass}
              onChange={setSelectedTimeClass}
              className="analysis-control w-full sm:w-auto"
            />
            <Dropdown
              size="sm"
              options={resultOptions}
              value={selectedResult}
              onChange={setSelectedResult}
              className="analysis-control w-full sm:w-auto"
            />
          </div>
          <div className="w-full md:w-auto md:min-w-[280px]">
            <Input
              size="sm"
              width="100%"
              placeholder="Search opponent, ECO, or control…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              iconLeft="search"
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
                ? `Click "${selectedMonth === ALL_GAMES ? 'Load entire set' : 'Load month'}" to view games`
                : 'Select a scope from the dropdown above to get started'}
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
