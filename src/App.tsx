import { useMemo } from 'react'
import { toModules } from './api/mapper'
import { useIndex } from './api/queries'
import { ModulePanel } from './components/ModulePanel'
import { RawJsonPanel } from './components/RawJsonPanel'
import { API_URL } from './config'

export default function App() {
  const { data, error, isPending, isFetching, refetch } = useIndex()
  const modules = useMemo(() => (data ? toModules(data) : []), [data])

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-base font-semibold">Debug Application</h1>
          <p className="font-mono text-xs text-zinc-500">{API_URL}</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
        >
          {isFetching ? 'Loading…' : 'Refresh'}
        </button>
      </header>

      {isPending && <p className="p-6 text-sm text-zinc-500">Loading modules…</p>}

      {error && (
        <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Could not reach the Debug API.</p>
          <p className="mt-1 font-mono text-xs">{error.message}</p>
          <p className="mt-2 text-xs">Is the dummy API running at {API_URL}?</p>
        </div>
      )}

      {data && (
        <main className="grid min-h-0 flex-1 grid-cols-2 gap-4 p-4">
          <RawJsonPanel data={data} />
          <div className="min-h-0 space-y-4 overflow-auto">
            {modules.map((m) => (
              <ModulePanel key={m.name} module={m} />
            ))}
          </div>
        </main>
      )}
    </div>
  )
}
