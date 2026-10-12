const POLL_OPTIONS = [
  { label: 'Off', ms: false },
  { label: 'Every 2s', ms: 2000 },
  { label: 'Every 5s', ms: 5000 },
  { label: 'Every 10s', ms: 10000 },
] as const

export type PollMs = (typeof POLL_OPTIONS)[number]['ms']

interface AutoRefreshProps {
  value: PollMs
  onChange: (ms: PollMs) => void
  updatedAt: number
  fetching: boolean
}

export function AutoRefresh({ value, onChange, updatedAt, fetching }: AutoRefreshProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 font-mono text-[11px] whitespace-nowrap text-zinc-500">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${fetching ? 'animate-pulse bg-blue-500' : value ? 'bg-emerald-500' : 'bg-zinc-300'}`}
        />
        {updatedAt ? `Updated ${new Date(updatedAt).toLocaleTimeString()}` : 'Not loaded'}
      </span>
      <label className="sr-only" htmlFor="auto-refresh">
        Auto-refresh
      </label>
      <select
        id="auto-refresh"
        value={String(value)}
        onChange={(e) => onChange(POLL_OPTIONS.find((o) => String(o.ms) === e.target.value)!.ms)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm"
      >
        {POLL_OPTIONS.map((o) => (
          <option key={o.label} value={String(o.ms)}>
            {o.ms ? `Auto-refresh: ${o.label.toLowerCase()}` : 'Auto-refresh: off'}
          </option>
        ))}
      </select>
    </div>
  )
}
