import type { Attribute } from '../model'
import { Badge } from './Badge'
import { ValueDisplay } from './ValueDisplay'

export function AttributeRow({ attribute: a }: { attribute: Attribute }) {
  return (
    <li className="space-y-2 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-zinc-900">{a.label}</div>
          <div className="font-mono text-xs text-zinc-500">{a.name}</div>
        </div>
        <ValueDisplay value={a.value} />
      </div>

      {a.description && <p className="text-xs text-zinc-600">{a.description}</p>}

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="blue">{a.type}</Badge>
        <Badge tone={a.access === 'READWRITE' ? 'amber' : 'neutral'}>
          {a.access === 'READWRITE' ? 'read/write' : 'read-only'}
        </Badge>
        {(a.min !== null || a.max !== null) && (
          <span className="font-mono text-[11px] text-zinc-500">
            range {a.min ?? '−∞'} – {a.max ?? '∞'}
          </span>
        )}
        {a.defaultValue !== null && (
          <span className="font-mono text-[11px] text-zinc-500">default {String(a.defaultValue)}</span>
        )}
        {a.lastUpdate !== null && (
          <span className="font-mono text-[11px] text-zinc-500">updated {a.lastUpdate.toFixed(1)}</span>
        )}
      </div>

      {a.options.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {a.options.map((option) => (
            <span
              key={option}
              className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${
                option === a.value
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-500'
              }`}
            >
              {option}
            </span>
          ))}
        </div>
      )}
    </li>
  )
}
