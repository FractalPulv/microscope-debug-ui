import type { Module } from '../model'
import { AttributeRow } from './AttributeRow'
import { PropertyRow } from './PropertyRow'

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="border-y border-zinc-100 bg-zinc-50 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {title} <span className="text-zinc-400">({count})</span>
      </h3>
      <ul className="divide-y divide-zinc-100">{children}</ul>
    </div>
  )
}

export function ModulePanel({ module }: { module: Module }) {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <header className="px-4 py-3">
        <h2 className="font-mono text-sm font-semibold text-zinc-900">{module.name}</h2>
      </header>
      {module.attributes.length > 0 && (
        <Group title="Attributes" count={module.attributes.length}>
          {module.attributes.map((a) => (
            <AttributeRow key={a.name} attribute={a} />
          ))}
        </Group>
      )}
      {module.properties.length > 0 && (
        <Group title="Properties" count={module.properties.length}>
          {module.properties.map((p) => (
            <PropertyRow key={p.name} property={p} />
          ))}
        </Group>
      )}
    </section>
  )
}
