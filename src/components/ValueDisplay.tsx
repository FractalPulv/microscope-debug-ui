import type { Value } from '../model'

export function ValueDisplay({ value }: { value: Value }) {
  if (value === null) return <span className="font-mono text-sm text-zinc-400">null</span>
  if (typeof value === 'boolean') {
    return (
      <span
        className={`rounded-full px-2 py-0.5 font-mono text-xs font-medium ${
          value ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
        }`}
      >
        {String(value)}
      </span>
    )
  }
  return <span className="font-mono text-sm font-semibold text-zinc-900">{String(value)}</span>
}
