import { useCallback, useState } from 'react'

// Tracks which sections are collapsed, by key ("gun", "gun/attributes", ...).
// Everything is expanded unless its key is in the set.
export function useCollapsed() {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const isOpen = useCallback((key: string) => !collapsed.has(key), [collapsed])

  const toggle = useCallback((key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const expandAll = useCallback(() => setCollapsed(new Set()), [])
  const collapseAll = useCallback((keys: string[]) => setCollapsed(new Set(keys)), [])

  const allExpanded = collapsed.size === 0
  const allCollapsed = useCallback((keys: string[]) => keys.every((k) => collapsed.has(k)), [collapsed])

  return { isOpen, toggle, expandAll, collapseAll, allExpanded, allCollapsed }
}
