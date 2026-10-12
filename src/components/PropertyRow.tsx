import type { Property } from '../model'
import { Badge } from './Badge'
import { ValueDisplay } from './ValueDisplay'

export function PropertyRow({ property: p }: { property: Property }) {
  return (
    <li className="space-y-1.5 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-xs text-zinc-700">{p.name}</div>
        <ValueDisplay value={p.value} />
      </div>
      {p.description && <p className="text-xs text-zinc-600">{p.description}</p>}
      <div className="flex items-center gap-1.5">
        <Badge tone="blue">{p.type}</Badge>
        {p.defaultValue !== null && (
          <span className="font-mono text-[11px] text-zinc-500">default {String(p.defaultValue)}</span>
        )}
      </div>
    </li>
  )
}
