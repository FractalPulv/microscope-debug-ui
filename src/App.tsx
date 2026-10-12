import { useMemo, useState } from 'react'
import { toModules } from './api/mapper'
import { useIndex } from './api/queries'
import { AutoRefresh, type PollMs } from './components/AutoRefresh'
import { ModulePanel } from './components/ModulePanel'
import { RawJsonDrawer } from './components/RawJsonDrawer'
import { SearchBox } from './components/SearchBox'
import { API_URL } from './config'
import type { Module } from './model'
import { countItems, filterModules } from './search'
import { useCollapsed } from './useCollapsed'

// Every collapsible key of a module: the module itself and its groups.
const sectionKeys = (m: Module) => [m.name, `${m.name}/attributes`, `${m.name}/properties`]

const BUTTON =
  'whitespace-nowrap rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50'

export default function App() {
  const [pollMs, setPollMs] = useState<PollMs>(false)
  const { data, error, isPending, isFetching, refetch, dataUpdatedAt } = useIndex(pollMs)
  const modules = useMemo(() => (data ? toModules(data) : []), [data])
  const [showRaw, setShowRaw] = useState(false)
  const [query, setQuery] = useState('')
  const searching = query.trim() !== ''
  const visible = useMemo(() => filterModules(modules, query), [modules, query])
  const { isOpen, toggle, expandAll, collapseAll, allExpanded, allCollapsed } = useCollapsed()
  const allKeys = useMemo(() => modules.flatMap(sectionKeys), [modules])

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="flex shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-base font-semibold">Debug Application</h1>
          <p className="font-mono text-xs text-zinc-500">{API_URL}</p>
        </div>
        <SearchBox value={query} onChange={setQuery} />
        <div className="ml-auto flex items-center gap-2">
          <AutoRefresh value={pollMs} onChange={setPollMs} updatedAt={dataUpdatedAt} fetching={isFetching} />
          <button onClick={expandAll} disabled={!data || searching || allExpanded} className={BUTTON}>
            Expand all
          </button>
          <button onClick={() => collapseAll(allKeys)} disabled={!data || searching || allCollapsed(allKeys)} className={BUTTON}>
            Collapse all
          </button>
          <button onClick={() => setShowRaw(true)} disabled={!data} className={BUTTON}>
            Raw JSON
          </button>
          <button onClick={() => refetch()} disabled={isFetching} className={BUTTON}>
            Refresh
          </button>
        </div>
      </header>

      {/* Only the content scrolls; the reserved scrollbar space shares its background. */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
        {isPending && <p className="p-6 text-sm text-zinc-500">Loading modules…</p>}

        {error && (
          <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-medium">Could not reach the Debug API.</p>
            <p className="mt-1 font-mono text-xs">{error.message}</p>
            <p className="mt-2 text-xs">Is the dummy API running at {API_URL}?</p>
          </div>
        )}

        {searching && data && (
          <p className="px-4 pt-4 text-xs text-zinc-500">
            {countItems(visible)} of {countItems(modules)} items match “{query.trim()}”
          </p>
        )}

        {searching && data && visible.length === 0 && (
          <p className="p-4 text-sm text-zinc-500">Nothing matches. Try part of a name, label or description.</p>
        )}

        <main className="grid grid-cols-1 items-start gap-4 p-4 lg:grid-cols-2">
          {visible.map((m) => (
            <ModulePanel
              key={m.name}
              module={m}
              // While searching, every match is shown expanded.
              isOpen={searching ? () => true : isOpen}
              onToggle={toggle}
            />
          ))}
        </main>
      </div>

      {showRaw && data && <RawJsonDrawer data={data} onClose={() => setShowRaw(false)} />}
    </div>
  )
}
