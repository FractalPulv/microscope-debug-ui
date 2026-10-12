import { API_URL } from '../config'
import type { Value } from '../model'
import type { RawIndex } from './raw'

export async function fetchIndex(): Promise<RawIndex> {
  const res = await fetch(`${API_URL}/`)
  if (!res.ok) throw new Error(`GET / failed with ${res.status}`)
  return res.json()
}

// What was sent and what came back, kept so the UI can show the raw exchange.
export interface Exchange {
  request: string
  body: string
  status: number | null
  response: string
  ms: number
}

export class WriteError extends Error {
  readonly exchange: Exchange

  constructor(message: string, exchange: Exchange) {
    super(message)
    this.exchange = exchange
  }
}

// Writes answer 200 with a plain-text body of SUCCESS or FAIL, so the body decides
// the outcome, not the status. 4xx means the request itself was not understood.
export async function writeAttribute(module: string, name: string, value: Value): Promise<Exchange> {
  const url = `${API_URL}/${encodeURIComponent(module)}/attribute/${encodeURIComponent(name)}`
  const body = JSON.stringify({ value })
  const exchange: Exchange = { request: `POST ${url}`, body, status: null, response: '', ms: 0 }
  const started = performance.now()

  let res: Response
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  } catch (err) {
    exchange.ms = Math.round(performance.now() - started)
    exchange.response = String(err)
    throw new WriteError('Could not reach the Debug API', exchange)
  }

  const text = await res.text()
  exchange.ms = Math.round(performance.now() - started)
  exchange.status = res.status
  exchange.response = text

  if (!res.ok) {
    let message = `Request failed with ${res.status}`
    try {
      message = JSON.parse(text).error ?? message
    } catch {
      // keep the generic message
    }
    throw new WriteError(message, exchange)
  }

  const outcome = text.trim()
  if (outcome === 'SUCCESS') return exchange
  if (outcome === 'FAIL') throw new WriteError('The machine rejected the value', exchange)
  throw new WriteError(`Unexpected response: ${outcome.slice(0, 80)}`, exchange)
}
