import type { Attribute, Value } from './model'

export type Draft = string | boolean

// Turns what the user typed into a value of the attribute's type, checked against
// the schema. Mirrors the machine's own checks so we can say *why* before sending.
export function parseDraft(a: Attribute, draft: Draft): { value: Value } | { error: string } {
  if (a.type === 'BOOL') return { value: Boolean(draft) }

  if (a.type === 'INT' || a.type === 'FLOAT') {
    const text = String(draft).trim()
    if (text === '') return { error: 'Enter a number' }
    const n = Number(text)
    if (!Number.isFinite(n)) return { error: `${text} is not a number` }
    if (a.type === 'INT' && !Number.isInteger(n)) return { error: 'Must be a whole number' }
    if (a.min !== null && n < a.min) return { error: `Below the minimum of ${a.min}` }
    if (a.max !== null && n > a.max) return { error: `Above the maximum of ${a.max}` }
    return { value: n }
  }

  const text = String(draft)
  if (a.options.length > 0 && !a.options.includes(text)) {
    return { error: `Must be one of ${a.options.join(', ')}` }
  }
  return { value: text }
}

export const toDraft = (value: Value): Draft => (typeof value === 'boolean' ? value : String(value ?? ''))
