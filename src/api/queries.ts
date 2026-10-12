import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Value } from '../model'
import { fetchIndex, writeAttribute } from './client'

export function useIndex() {
  return useQuery({ queryKey: ['index'], queryFn: fetchIndex })
}

// After a write we re-read instead of trusting our own value: the machine may
// change it again straight away, and responses can arrive out of order.
export function useWriteAttribute(module: string, name: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: Value) => writeAttribute(module, name, value),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['index'] }),
  })
}
