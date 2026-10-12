import type { Access, Attribute, DataType, Module, Property } from '../model'
import type { RawAttribute, RawIndex, RawModule, RawProperty } from './raw'

const KNOWN_TYPES: DataType[] = ['INT', 'FLOAT', 'STRING', 'BOOL']

// Firmware may introduce types we don't know yet; keep them visible but read-only.
function toDataType(raw: string): DataType {
  const upper = String(raw).toUpperCase() as DataType
  return KNOWN_TYPES.includes(upper) ? upper : 'UNKNOWN'
}

// Anything that isn't explicitly writable is treated as read-only.
function toAccess(raw: string): Access {
  return String(raw).toUpperCase() === 'READWRITE' ? 'READWRITE' : 'READ'
}

// `name` is the list key: that is what the API uses in the URL.
export function toAttribute(module: string, name: string, raw: RawAttribute): Attribute {
  return {
    module,
    name,
    label: raw.label || name,
    description: raw.description ?? '',
    type: toDataType(raw.attributeType),
    access: toAccess(raw.access),
    value: raw.value,
    defaultValue: raw.default_value ?? null,
    options: raw.allowed_values ?? [],
    min: raw.min_value ?? null,
    max: raw.max_value ?? null,
    lastUpdate: raw.lastUpdate ?? null,
  }
}

export function toProperty(module: string, name: string, raw: RawProperty): Property {
  return {
    module,
    name,
    description: raw.description ?? '',
    type: toDataType(raw._dtype),
    value: raw._value,
    defaultValue: raw._defaultValue ?? null,
  }
}

export function toModule(name: string, raw: RawModule): Module {
  return {
    name,
    attributes: Object.entries(raw.attribute_list ?? {}).map(([key, a]) => toAttribute(name, key, a)),
    properties: Object.entries(raw.property_list ?? {}).map(([key, p]) => toProperty(name, key, p)),
  }
}

export function toModules(raw: RawIndex): Module[] {
  return Object.entries(raw).map(([name, mod]) => toModule(name, mod))
}
