import { useQuery } from '@tanstack/react-query'
import { fetchIndex } from './client'

export function useIndex() {
  return useQuery({ queryKey: ['index'], queryFn: fetchIndex })
}
