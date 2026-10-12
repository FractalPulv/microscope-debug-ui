import { API_URL } from '../config'
import type { RawIndex } from './raw'

export async function fetchIndex(): Promise<RawIndex> {
  const res = await fetch(`${API_URL}/`)
  if (!res.ok) throw new Error(`GET / failed with ${res.status}`)
  return res.json()
}
