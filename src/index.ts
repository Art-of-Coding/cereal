const registeredTypes = new Map<number, {
  serialize: (value: any) => Buffer,
  deserialize: (value: Buffer) => any,
}>()

/**
 * Register a type.
 * @param type The type id (0-255 inclusive)
 * @param fns.serialize The serialize method
 * @param fns.deserialize The deserialize method
 */
export function registerType<T>(
  type: number,
  fns: {
    serialize: (value: T) => Buffer,
    deserialize: (value: Buffer) => T,
  }
): void {
  if (isNaN(type) || type < 0 || type > 255) {
    throw new TypeError(`Expected 'type' to be in range 0-255`)
  } else if (typeof fns.serialize !== 'function') {
    throw new TypeError(`Expected 'serialize' to be a function`)
  } else if (typeof fns.deserialize !== 'function') {
    throw new TypeError(`Expected 'deserialize' to be a function`)
  }

  registeredTypes.set(type, fns)
}

/**
 * Get serialize and deserialize methods for type.
 * @param type The type id (0-255 inclusive)
 * @returns The type's methods
 */
export function getType(type: number) {
  return registeredTypes.get(type)
}

export function buildHeader(
  type: number,
  fn?: (value: any) => Buffer,
): Buffer {
  const headerBuf = Buffer.allocUnsafe(1)
  headerBuf[0] = type
  return headerBuf
}

/**
 * Serialize a value.
 * @param type The type id (0-255 inclusive)
 * @param value The value to serialize
 * @returns The serialized value
 */
export function serialize<T = any>(
  type: number,
  value: T,
  opts: {
    excludeHeader?: boolean,
  } = {}
): Buffer {
  const registeredType = registeredTypes.get(type)
  if (!registeredType) throw new Error(`Unknown type '${type}'`)

  const valueBuf = registeredType.serialize(value)

  if (opts.excludeHeader) {
    return valueBuf
  }

  const headerBuf = buildHeader(type)
  return Buffer.concat([headerBuf, valueBuf])
}

/**
 * Deserialize a value.
 * @param value The value to deserialize
 * @returns The deserialized value
 */
export function deserialize<T = any>(value: Buffer): T {
  const registeredType = registeredTypes.get(value[0])
  if (!registeredType) throw new Error(`Unknown type '${value[0]}'`)

  return registeredType.deserialize(value.slice(1))
}
