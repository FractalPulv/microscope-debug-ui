import { useEffect, useRef } from 'react'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  const ref = useRef<HTMLInputElement>(null)

  // "/" focuses search from anywhere, like most dev tools.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative min-w-40 flex-1 max-w-md">
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onChange('')}
        placeholder="Search attributes and properties…"
        aria-label="Search attributes and properties"
        className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pr-8 pl-3 text-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none"
      />
      {!value && (
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-zinc-200 px-1.5 font-mono text-[10px] text-zinc-400">
          /
        </kbd>
      )}
    </div>
  )
}
