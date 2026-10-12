import { useEffect } from 'react'
import type { RawIndex } from '../api/raw'

export function RawJsonDrawer({ data, onClose }: { data: RawIndex; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-10 flex justify-end">
      <div className="absolute inset-0 bg-zinc-900/20" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-2xl flex-col bg-zinc-950 shadow-xl">
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Raw response · GET /</span>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Close <kbd className="ml-1 font-mono text-zinc-500">Esc</kbd>
          </button>
        </header>
        <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </aside>
    </div>
  )
}
