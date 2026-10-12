import type { Attribute, Module, Property } from './model'

// Case-insensitive substring search. Every word must match somewhere,
// so "gun volt" finds voltage_accelerator in the gun module.
function matches(item: Attribute | Property, words: string[]): boolean {
  const label = 'label' in item ? item.label : ''
  const haystack = [item.module, item.name, label, item.description].join(' ').toLowerCase()
  return words.every((w) => haystack.includes(w))
}

export function filterModules(modules: Module[], query: string): Module[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return modules

  return modules
    .map((m) => ({
      ...m,
      attributes: m.attributes.filter((a) => matches(a, words)),
      properties: m.properties.filter((p) => matches(p, words)),
    }))
    .filter((m) => m.attributes.length + m.properties.length > 0)
}

export const countItems = (modules: Module[]) =>
  modules.reduce((n, m) => n + m.attributes.length + m.properties.length, 0)
