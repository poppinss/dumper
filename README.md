# @poppinss/dumper

> Pretty print JavaScript data types in the terminal and the browser

Dumper is similar to Node.js [util.inspect](https://nodejs.org/api/util.html#utilinspectobject-options) but it provides more control over the output. You can use Dumper to generate HTML output, CLI output, or use its low-level API to create inspection tokens and render them using a custom formatter.

> [!IMPORTANT]
> Dumper is a low-level utility and you may have to write a wrapper around it for the framework of your choice.

## Installation

Install the package from the npm registry as follows.

```sh
npm i @poppinss/dumper
```

## HTML formatter

You can dump values to HTML output using the `dump` helper from the html sub-module. For example:

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
```

The HTML output contains a `pre` tag and a `script` tag. The `script` tag invokes a JavaScript function (for collapse/expand behavior) that must be present in the `<HEAD>` element of the HTML document.

You can grab the JavaScript snippet and the required global styles using the `createStyleSheet` and `createScript` helper methods. Following is a complete example of the same.

```ts
import { dump, createStyleSheet, createScript } from '@poppinss/dumper/html'

const values = {
  a: 0,
  b: 'string',
  c: {
    nested: 'object',
  },
}

const html = dump(values)

const output = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <style>
    ${createStyleSheet()}
  </style>
  <script>
    ${createScript()}
  </script>
</head>
<body>
  ${html}
</body>
</html>`
```

### Options

You may pass all of the [Parser options](#parser-options) alongside the following options as the second argument to the `dump` method.

- `styles`: The styles property is a key-value pair that contains CSS properties to style HTML elements. You can either define custom styles or use one of the pre-existing themes as a reference.
- `cspNonce`: If your application has CSP enabled, then you must define the [CSP nonce](https://content-security-policy.com/nonce/) for the inline `script` tag output alongside the `pre` tag.

Following is an example of using a pre-existing theme.

```ts
import { dump, themes } from '@poppinss/dumper/html'

dump(value, {
  styles: themes.catppuccin,
})
```

### Creating custom themes

You can also define your own themes as an object. Make sure to consult one of the [existing themes](https://github.com/poppinss/dumper/blob/1.x/formatters/html/themes.ts) to view all the available tokens.

```ts
import { dump } from '@poppinss/dumper/html'
import { HTMLPrinterStyles } from '@poppinss/dumper/html/types'

const myTheme: HTMLPrinterStyles = {
  pre: 'background-color: #1e1e2e; color: #94e2d5;',
  boolean: 'color: #cba6f7; font-style: italic;'
  string: 'color: #a6e3a1;',
  symbol: 'color: #f9e2af;',
  // ...rest of the styles
}

dump(value, {
  styles: myTheme,
})
```

## CLI formatter

You can dump values to the terminal using the `dump` helper from the console sub-module. For example:

```ts
import { dump } from '@poppinss/dumper/console'

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

### Options

You may pass all of the [Parser options](#parser-options) alongside the following options as the second argument to the `dump` method.

- `styles`: The styles property contains a set of functions for different tokens. Each function receives a string input and must return a styled output string. 

Following is an example of using a pre-existing theme.

```ts
import { dump, themes } from '@poppinss/dumper/console'

dump(value, {
  styles: themes.default,
})
```

You may create a custom theme as follows. Make sure to consult an [existing theme](https://github.com/poppinss/dumper/blob/1.x/formatters/console/themes.ts) to view all the available tokens.

```ts
import { styleText } from 'node:util'
import { dump } from '@poppinss/dumper/console'
import { ConsolePrinterStyles } from '@poppinss/dumper/console/types'

const myTheme: ConsolePrinterStyles = {
  number: (value) => styleText('yellow', value),
  bigInt: (value) => styleText('yellow', styleText('bold', value)),
  boolean: (value) => styleText('yellow', styleText('italic', value)),
  // ... styles for rest of the tokens
}

dump(value, {
  styles: myTheme,
})
```

## Supported data types

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
- BigInt
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
import { dump } from '@poppinss/dumper/console'

dump(values, {
  showHidden: false,
  depth: 5,
  inspectObjectPrototype: false,
  inspectArrayPrototype: false,
  inspectStaticMembers: false,
  maxArrayLength: 100,
  maxStringLength: 1000,
})
```

- `showHidden`: When set to true, the non-enumerable properties of an object will be processed. **Default: `false`**.
- `depth`: The depth at which to stop parsing nested values. The depth is shared among all tree like data structures. For example: Objects,Arrays,Maps and Sets. **Default: `5`**.
- `inspectObjectPrototype`: Inspect prototype properties of an object. The non-enumerable properties of prototype are included by default. **Default: `false`**.
- `inspectArrayPrototype`: Inspect prototype properties of an Array. This flag could be helpful for inspect prototype properties of extended arrays.
- `inspectStaticMembers`: Inspect static members of a class. Even though functions and classes are technically same, this config only applies to functions defined using the `[class]` keyword. **Default: `false`**.
- `maxArrayLength`: Maximum number of members to process for Arrays, Maps and Sets. **Default: `100`**.
- `maxStringLength`: Maximum number of characters to display for a string. **Default: `1000`**.

## Using Parser directly

For advanced use-cases you may use the Parser directly and create a custom formatter on top of it. Following is an example of the same. Also, feel free to consult implementation of the existing formatters.

```ts
import { Parser } from '@poppinss/dumper'
import { ParserConfig } from '@poppinss/dumper/types'

const config: ParserConfig = {}
const parser = new Parser(config)

const values = {
  a: 0,
  b: 'string',
  c: {
    nested: 'object',
  },
}

parser.parse(values)
const tokens = parser.flush()

console.log(tokens)
```

The `parser.flush` method returns a flat array of [tokens](https://github.com/poppinss/dumper/blob/1.x/src/types.ts#L30) and they must be printed in the same order as they are defined.

The official implementations (shipped with dumper) uses the concept of printers, where we have defined one printer for each token type that is responsible for returning the formatted value.

Following is an oversimplified example of creating custom printers. Once again, feel free to reference implementation of existing [formatters](https://github.com/poppinss/dumper/blob/1.x/formatters/html/printers/formatter.ts) and [printers](https://github.com/poppinss/dumper/blob/1.x/formatters/html/printers/main.ts).

```ts
const myCustomPrinters: [K in keyof TokensMap]: (
  token: TokensMap[K],
) => string = {
  'object-start': (token) => {
    return `Object {`
  },
  'object-end': (token) => {
    return `}`
  },
  'object-key': (token) => {
    return token.value
  },
  'object-value-start': (token) => {
    return ': '
  },
  'object-value-end': (token) => {
    return ', '
  }
}

const tokens = parser.flush()
const output = tokens.map((token) => {
  return myCustomPrinters[token.type](token)
}).join('')
```