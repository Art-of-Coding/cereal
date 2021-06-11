# Cereal

> Because it sounds like 'serial'. Get it?

Serialize and deserialize values in node.js.

## Install

Not available on npm yet, for obvious reasons (it's an early alpha).

If you want to try it out, fork or clone the repository.

## API

Forthcoming. Use the example and the source code.

### Supported types

- Byte
- Boolean
- Int8
- Int16
- Int32
- String

## Example

```ts
import { deserialize, registerType, serialize } from "./index";
import { Type } from "./types";

// Use one of the built-in types...
const serialized = serialize(Type.String, "I am a sentence");
const deserialized = deserialize(serialized);
```

```typescript
// ... or create a custom type
// numbers 0-99 are reserved for internal use
// numbers 100-255 can safely be used
enum CustomType {
  Position = 100,
}

// and register the type
registerType<[number, number]>(CustomType.Position, {
  serialize: (value) => {
    const buf = Buffer.allocUnsafe(8);
    buf.writeInt32LE(value[0], 0);
    buf.writeInt32LE(value[1], 4);
    return buf;
  },
  deserialize: (value) => {
    return [
      value.readInt32LE(0),
      value.readInt32LE(4),
    ];
  },
});

const serialized = serialize(Type.Position, [11, 22]);
const deserialized = deserialize(serialized);
```

## License

Copyright 2021 [Art of Coding](https://artofcoding.nl).

This software is licensed under [the MIT License](LICENSE).
