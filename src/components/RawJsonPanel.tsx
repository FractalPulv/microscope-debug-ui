import type { RawIndex } from '../api/raw'

export function RawJsonPanel({ data }: { data: RawIndex }) {
  return (
    <section className="flex min-h-0 flex-col rounded-lg border border-zinc-200 bg-zinc-950">
      <header className="border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Raw response · GET /
      </header>
      <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  )
}
