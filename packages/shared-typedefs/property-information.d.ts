declare module 'property-information/html' {
  const schema: object

  export default schema
}

declare module 'property-information/find' {
  interface Info {
    space?: string
    attribute: string
    property: string
    boolean: boolean
    overloadedBoolean: boolean
    number: boolean
    spaceSeparated: boolean
    commaSeparated: boolean
    commaOrSpaceSeparated: boolean
    mustUseProperty: boolean
    defined: boolean
  }

  export default function find(schema: object, prop: string): Info
}
