# @poppinss/dumper

> Pretty print JavaScript data types in the terminal and the browser

Dumper is similar to Node.js [util.inspect](https://nodejs.org/api/util.html#utilinspectobject-options) but it provides more control over the output. You can use Dumper to generate HTML output, CLI output, or use its low-level API to create inspection tokens and render them using a custom formatter.

> [!IMPORTANT]  
> The package is in beta phase and may see some breaking changes in the API. However, if you are a tinkerer, please play with the package and provide your feedback :)

## Installation

Install the package from the npm registry as follows.

```sh
npm i @poppinss/dumper
```

## HTML formatter

You can dump values to an HTML output using the `dump` helper for the html sub-module. For example:

```ts
import { dump } from '@poppinss/dumper/html'

const values = {
  a: 0,
  b: 'string',
  c: {
    nested: 'object',
  },
}

const html = dump(values)
// Write HTML in response
```

## CLI formatter

You can dump values to the terminal using the `dump` helper for the cli sub-module. For example:

```ts
import { dump } from '@poppinss/dumper/cli'

const values = {
  a: 0,
  b: 'string',
  c: {
    nested: 'object',
  },
}

const ansiOutput = dump(values)
console.log(ansiOutput)
```

## Support data types

Following is the list of data types supported by Dumper. All other data types will be converted to their String representation by wrapping them inside the `String` function.

- Object
- Array
- Map
- Set
- Function
- string
- URL
- URLSearchParams
- Error
- FormData
- undefined
- null
- symbol
- number
- boolean
- bigint
- Date
- RegExp
- Buffer
- WeakSet
- WeakMap
- WeakRef
- Generator
- AsyncGenerator
- GeneratorFunction
- AsyncGeneratorFunction
- AsyncFunction
- Observable
- Blob
- Promise
- NaN
- Int8Array
- Uint8Array
- Int16Array
- Uint16Array
- Int32Array
- Uint32Array
- Float32Array
- Float64Array
- BigInt64Array
- BigUint64Array

## Parser options

Regardless of the output format, you can use one of the following options to tweak the parsing behaviour.

```ts
import { dump } from '@poppinss/dumper/cli'

dump(values, {
  showHidden: false,
  depth: 5,
  inspectObjectPrototype: false,
  inspectStaticMembers: false,
  maxArrayLength: 100,
  maxStringLength: 1000,
})
```

- `showHidden`: When set to true, the non-enumerable properties of an object will be processed. **Default: `false`**.
- `depth`: The depth at which to stop parsing nested values. The depth is shared among all tree like data structures. For example: Objects,Arrays,Maps and Sets. **Default: `5`**.
- `inspectObjectPrototype`: Inspect prototype properties of an object. The non-enumerable properties of prototype are included by default. **Default: `false`**.
- `inspectStaticMembers`: Inspect static members of a class. Even though functions and classes are technically same, this config only applies to functions defined using the `[class]` keyword. **Default: `false`**.
- `maxArrayLength`: Maximum number of members to process for Arrays, Maps and Sets. **Default: `100`**.
- `maxStringLength`: Maximum number of characters to display for a string. **Default: `1000`**.
