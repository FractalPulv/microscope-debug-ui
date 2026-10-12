// The app's own shapes. Components only use these, never the raw API types.

export type DataType = 'INT' | 'FLOAT' | 'STRING' | 'BOOL' | 'UNKNOWN'
export type Access = 'READ' | 'READWRITE'
export type Value = number | string | boolean | null

export interface Attribute {
  module: string
  name: string
  label: string
  description: string
  type: DataType
  access: Access
  value: Value
  defaultValue: Value
  options: string[]
  min: number | null
  max: number | null
  lastUpdate: number | null
}

export interface Property {
  module: string
  name: string
  description: string
  type: DataType
  value: Value
  defaultValue: Value
}

export interface Module {
  name: string
  attributes: Attribute[]
  properties: Property[]
}
