// Shapes exactly as the Debug API returns them. Only the mapper should import these.

export type RawValue = number | string | boolean | null

export interface RawAttribute {
  attributeName: string
  attributeType: string
  description: string
  label: string
  access: string
  allowed_values: string[]
  default_value: RawValue
  lastUpdate: number | null
  value: RawValue
  min_value: number | null
  max_value: number | null
}

export interface RawProperty {
  _name: string
  _defaultValue: RawValue
  _value: RawValue
  _dtype: string
  description: string
}

export interface RawCommand {
  name: string
  description: string
}

export interface RawModule {
  attribute_list?: Record<string, RawAttribute>
  property_list?: Record<string, RawProperty>
  command_list?: Record<string, RawCommand>
}

export type RawIndex = Record<string, RawModule>
