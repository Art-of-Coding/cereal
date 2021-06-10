const registeredTypes = new Map<number, {
  serialize: (value: any) => Buffer,
  deserialize: (value: Buffer) => any
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
    deserialize: (value: Buffer) => T
  }
): void {
  if (isNaN(type) || type < 0 || type > 255) {
    throw new TypeError(`Expected 'type' to be in range 0-255`)
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

/**
 * Serialize a value.
 * @param type The type id (0-255 inclusive)
 * @param value The value to serialize
 * @returns The serialized value
 */
export function serialize<T = any>(
  type: number,
  value: T
): Buffer {
  const registeredType = registeredTypes.get(type)
  if (!registeredType) throw new Error(`Unknown type '${type}'`)

  const headerBuf = Buffer.allocUnsafe(5)
  const valueBuf = registeredType.serialize(value)

  headerBuf[0] = type
  headerBuf.writeInt32LE(valueBuf.byteLength, 1)

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

  return registeredType.deserialize(value.slice(5))
}