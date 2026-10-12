import type { ReactNode } from 'react'
import type { Module } from '../model'
import { AttributeRow } from './AttributeRow'
import { PropertyRow } from './PropertyRow'

function Chevron({ open }: { open: boolean }) {
  return <span aria-hidden className={`text-[10px] text-zinc-400 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
}

interface GroupProps {
  title: string
  count: number
  open: boolean
  onToggle: () => void
  children: ReactNode
}

function Group({ title, count, open, onToggle, children }: GroupProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 border-y border-zinc-100 bg-zinc-50 px-4 py-1.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500 hover:bg-zinc-100"
      >
        <Chevron open={open} />
        {title} <span className="text-zinc-400">({count})</span>
      </button>
      {open && <ul className="divide-y divide-zinc-100">{children}</ul>}
    </div>
  )
}

interface ModulePanelProps {
  module: Module
  isOpen: (key: string) => boolean
  onToggle: (key: string) => void
}

export function ModulePanel({ module, isOpen, onToggle }: ModulePanelProps) {
  const key = module.name
  const open = isOpen(key)
  const count = module.attributes.length + module.properties.length

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <h2>
        <button
          onClick={() => onToggle(key)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-zinc-50"
        >
          <Chevron open={open} />
          <span className="font-mono text-sm font-semibold text-zinc-900">{module.name}</span>
          <span className="ml-auto text-xs font-normal text-zinc-400">{count} items</span>
        </button>
      </h2>
      {open && (
        <>
          {module.attributes.length > 0 && (
            <Group
              title="Attributes"
              count={module.attributes.length}
              open={isOpen(`${key}/attributes`)}
              onToggle={() => onToggle(`${key}/attributes`)}
            >
              {module.attributes.map((a) => (
                <AttributeRow key={a.name} attribute={a} />
              ))}
            </Group>
          )}
          {module.properties.length > 0 && (
            <Group
              title="Properties"
              count={module.properties.length}
              open={isOpen(`${key}/properties`)}
              onToggle={() => onToggle(`${key}/properties`)}
            >
              {module.properties.map((p) => (
                <PropertyRow key={p.name} property={p} />
              ))}
            </Group>
          )}
        </>
      )}
    </section>
  )
}
