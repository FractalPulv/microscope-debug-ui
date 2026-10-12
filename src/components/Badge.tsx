import type { ReactNode } from 'react'

const TONES = {
  neutral: 'bg-zinc-100 text-zinc-600',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
}

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase ${TONES[tone]}`}>
      {children}
    </span>
  )
}
