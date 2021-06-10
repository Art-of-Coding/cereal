# Cereal

> Because it sounds like 'serial'. Get it?

Serialize and deserialize values in node.js.

## Install

Not available on npm yet, for obvious reasons (it's an early alpha).

If you want to try it out, fork or clone the repository.

## API

Forthcoming. Use the example and the source code.

## Example

```ts
import { deserialize, registerType, serialize } from "./index";

enum Type {
  String = 0,
}

// Register a type which can serialize and deserialize strings
registerType<string>(Type.String, {
  serialize: (value) => Buffer.from(value, "utf-8"),
  deserialize: (value) => value.toString("utf-8"),
});

// Serialize a string type
const serialized = serialize(Type.String, "I am a sentence");
// Deserialize a previously serialized value
const deserialized = deserialize(serialized);

console.log(serialized);
console.log(deserialized);
```

## License

Copyright 2021 [Art of Coding](https://artofcoding.nl).

This software is licensed under [the MIT License](LICENSE).
