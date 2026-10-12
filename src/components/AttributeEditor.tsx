import { useState } from 'react'
import { WriteError, type Exchange } from '../api/client'
import { useWriteAttribute } from '../api/queries'
import type { Attribute } from '../model'
import { type Draft, parseDraft, toDraft } from '../validate'

const FIELD =
  'rounded-md border border-zinc-300 bg-white px-2 py-1 font-mono text-sm focus:border-zinc-500 focus:outline-none'

export function AttributeEditor({ attribute: a }: { attribute: Attribute }) {
  const write = useWriteAttribute(a.module, a.name)
  // null = untouched, so the field keeps following the machine's live value.
  const [draft, setDraft] = useState<Draft | null>(null)
  const current = draft ?? toDraft(a.value)
  const parsed = parseDraft(a, current)
  const error = draft !== null && 'error' in parsed ? parsed.error : null
  const changed = draft !== null && 'value' in parsed && parsed.value !== a.value

  const edit = (next: Draft) => {
    write.reset()
    setDraft(next)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!changed || !('value' in parsed)) return
    write.mutate(parsed.value, { onSuccess: () => setDraft(null) })
  }

  const id = `${a.module}-${a.name}`
  const exchange = write.data ?? (write.error instanceof WriteError ? write.error.exchange : null)

  return (
    <form onSubmit={submit} className="space-y-1">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="sr-only">
          New value for {a.label}
        </label>
        {a.type === 'BOOL' ? (
          <input
            id={id}
            type="checkbox"
            checked={current === true}
            onChange={(e) => edit(e.target.checked)}
            className="h-4 w-4"
          />
        ) : a.options.length > 0 ? (
          <select id={id} value={String(current)} onChange={(e) => edit(e.target.value)} className={FIELD}>
            {a.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={a.type === 'STRING' ? 'text' : 'number'}
            step={a.type === 'INT' ? 1 : 'any'}
            min={a.min ?? undefined}
            max={a.max ?? undefined}
            value={String(current)}
            onChange={(e) => edit(e.target.value)}
            className={`${FIELD} w-36`}
          />
        )}
        <button
          type="submit"
          disabled={!changed || write.isPending}
          className="rounded-md bg-zinc-900 px-3 py-1 text-sm font-medium text-white hover:bg-zinc-700 disabled:bg-zinc-300"
        >
          {write.isPending ? 'Setting…' : 'Set'}
        </button>
        {draft !== null && !write.isPending && (
          <button
            type="button"
            onClick={() => {
              write.reset()
              setDraft(null)
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900"
          >
            Cancel
          </button>
        )}
      </div>

      <p aria-live="polite" className="min-h-4 text-xs">
        {error && <span className="text-red-700">{error}</span>}
        {write.isError && <span className="text-red-700">Not set: {write.error.message}</span>}
        {write.isSuccess && (
          <span className="text-emerald-700">
            Set to {String(write.variables)}. The value above is read back from the machine.
          </span>
        )}
      </p>

      {exchange && <RawExchange exchange={exchange} />}
    </form>
  )
}

function RawExchange({ exchange: x }: { exchange: Exchange }) {
  return (
    <details className="text-xs">
      <summary className="cursor-pointer text-zinc-500 select-none hover:text-zinc-900">Raw request / response</summary>
      <pre className="mt-1 overflow-x-auto rounded-md bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-zinc-200">
        {`> ${x.request}
> Content-Type: application/json
>
> ${x.body}

< ${x.status ?? 'no response'} · ${x.ms} ms
<
< ${x.response}`}
      </pre>
    </details>
  )
}
