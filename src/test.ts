import { registerType, serialize, deserialize } from './index'
import { Type } from './types'

const serialized = serialize(Type.Int32, 666)
console.log(serialized)

const deserialized = deserialize(serialized)
console.log(deserialized)
