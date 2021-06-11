import { registerType } from './index'

export enum Type {
  Byte = 0,
  Boolean = 1,
  Int8 = 2,
  Int16 = 3,
  Int32 = 4,
  String = 5,
}

registerType<number>(Type.Byte, {
  serialize: value => {
    if (isNaN(value) || value < 0 || value > 255) {
      throw new TypeError(`Expected value to be in range 0-255 (inclusive)`)
    }

    const buf = Buffer.allocUnsafe(1)
    buf[0] = value

    return buf
  },
  deserialize: value => {
    return value[0]
  }
})

registerType(Type.Boolean, {
  serialize: value => {
    const buf = Buffer.allocUnsafe(1)
    buf[0] = value === true ? 1 : 0
    return buf
  },
  deserialize: value => {
    return value[0] === 1
  }
})

registerType(Type.Int8, {
  serialize: value => {
    const buf = Buffer.allocUnsafe(1)
    buf.writeInt8(0)
    return buf
  },
  deserialize: value => {
    return value.readInt8(0)
  }
})

registerType(Type.Int16, {
  serialize: value => {
    const buf = Buffer.allocUnsafe(2)
    buf.writeInt16LE(0)
    return buf
  },
  deserialize: value => {
    return value.readInt16LE(0)
  }
})

registerType<number>(Type.Int32, {
  serialize: value => {
    const buf = Buffer.allocUnsafe(4)
    buf.writeInt32LE(value)
    return buf
  },
  deserialize: value => {
    return value.readInt32LE(0)
  }
})

registerType<string>(Type.String, {
  serialize: value => {
    return Buffer.from(value, 'utf-8')
  },
  deserialize: value => {
    return value.toString('utf-8')
  }
})
