/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import is from '@sindresorhus/is'
import type { Parser } from './parser.js'

const ObjectPrototype = Object.prototype
const ArrayPrototype = Array.prototype
const ObjectPrototypeKeys = Reflect.ownKeys(ObjectPrototype)
const ArrayPrototypeKeys = Reflect.ownKeys(ArrayPrototype)

/**
 * Helper to tokenize an object and its prototype
 */
export function tokenizeObject(
  value: Record<string | symbol, any>,
  parser: Parser,
  config: {
    depth: number
    showHidden: boolean
    collapse: string[]
    inspectObjectPrototype: boolean | 'unless-plain-object'
    constructorName?: string
    membersToIgnore?: (string | symbol)[]
    eagerGetters?: (string | symbol)[]
  }
) {
  parser.context.objectsSeen = parser.context.objectsSeen ?? new Set()
  parser.context.depth = parser.context.depth ?? 0

  /**
   * Handle circular references of the same object and
   * limit traversing once maxDepth has been reached
   */
  if (parser.context.objectsSeen.has(value)) {
    parser.collect({ type: 'object-circular-ref' })
    return
  }
  if (parser.context.depth >= parser.config.depth) {
    parser.collect({ type: 'object-max-depth-ref' })
    return
  }

  /**
   * Keep reference of the config properties to avoid
   * property access inside the for loop
   */
  const showHidden = config.showHidden

  /**
   * Grab metadata of the object.
   */
  const name = config.constructorName ?? Object.getPrototypeOf(value)?.constructor.name ?? null

  /**
   * Do not inspect children when constructor of the
   * object is meant to be collapsed.
   */
  if (config.collapse.includes(name)) {
    parser.collect({
      type: 'collapse',
      name: name,
      token: {
        type: 'object-start',
        constructorName: name,
      },
    })
    return
  }

  const ownKeys = Reflect.ownKeys(value)
  const eagerGetters = config.eagerGetters ?? []

  /**
   * Track seen object and increment depth
   */
  parser.context.depth++
  parser.context.objectsSeen.add(value)

  /**
   * Create a final collection of keys.
   *
   * When we have membersToIgnore, we will delete those members
   * from final keys set.
   */
  let keys: (string | symbol)[] = []
  if (config.membersToIgnore) {
    const keysSet = new Set([...ownKeys])
    config.membersToIgnore.forEach((m) => keysSet.delete(m))
    keys = Array.from(keysSet)
  } else {
    keys = ownKeys
  }

  parser.collect({ type: 'object-start', constructorName: name })

  /**
   * Looping over own keys (including non-enumerable)
   */
  for (let key of keys) {
    /**
     * Ensure property is known
     */
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (!descriptor) {
      continue
    }

    /**
     * Do not show "enumerable" properties unless "showHidden"
     * has been enabled.
     */
    if (!descriptor.enumerable && !showHidden) {
      continue
    }

    /**
     * Collect key with its meta-data
     */
    const isSymbol = typeof key === 'symbol'
    const isWritable = !!descriptor.set || !!descriptor.writable
    parser.collect({
      type: 'object-key',
      isSymbol,
      isWritable,
      value: String(key),
    })

    /**
     * Avoiding accessing getters to prevent
     * side-effects
     */
    if ('get' in descriptor && !eagerGetters.includes(key)) {
      parser.collect({ type: 'object-value-getter' })
      continue
    }

    /**
     * Inspect value
     */
    parser.collect({ type: 'object-value-start' })
    parser.parse(value[key])
    parser.collect({ type: 'object-value-end' })
  }

  /**
   * Tokenize the prototype of an object. Prototypes should
   * not count against the depth.
   */
  if (config.inspectObjectPrototype === true) {
    tokenizePrototype(value, parser, {
      membersToIgnore: ObjectPrototypeKeys,
    })
  } else if (config.inspectObjectPrototype === 'unless-plain-object' && !is.plainObject(value)) {
    tokenizePrototype(value, parser, {
      membersToIgnore: ObjectPrototypeKeys,
      prototypeToIgnore: ObjectPrototype,
    })
  }

  parser.collect({ type: 'object-end' })

  /**
   * Decrement depth and untrack seen object
   */
  parser.context.depth--
  parser.context.objectsSeen.delete(value)
}

/**
 * Tokenizes the prototype of a value by calling Object.getPrototypeOf
 * method on the value.
 */
export function tokenizePrototype(
  value: any,
  parser: Parser,
  config: {
    prototypeToIgnore?: any
    membersToIgnore?: (string | symbol)[]
    eagerGetters?: (string | symbol)[]
  }
) {
  const prototypeChain: { proto: any; keys: (string | symbol)[] }[] = []

  /**
   * Looping through the entire prototype chain and collecting
   * all the keys
   */
  for (
    let proto = Object.getPrototypeOf(value);
    proto && (!config.prototypeToIgnore || proto !== config.prototypeToIgnore);
    proto = Object.getPrototypeOf(proto)
  ) {
    let keys = Reflect.ownKeys(proto)

    /**
     * Remove keys when membersToIgnore properties are defined
     */
    if (config.membersToIgnore) {
      const keysSet = new Set([...keys])
      config.membersToIgnore.forEach((m) => keysSet.delete(m))
      keys = Array.from(keysSet)
    }

    prototypeChain.push({ proto, keys })
  }

  if (!prototypeChain.length) {
    return
  }

  const eagerGetters = config.eagerGetters ?? []
  parser.collect({ type: 'prototype-start' })

  /**
   * Looping over own keys (including non-enumerable)
   */
  for (let proto of prototypeChain) {
    for (let key of proto.keys) {
      /**
       * Ignore constructor
       */
      if (key === 'constructor') {
        continue
      }

      /**
       * Ensure property is known
       */
      const descriptor = Object.getOwnPropertyDescriptor(proto.proto, key)
      if (!descriptor) {
        continue
      }

      /**
       * Collect key with its meta-data
       */
      const isSymbol = typeof key === 'symbol'
      const isWritable = !!descriptor.set || !!descriptor.writable
      parser.collect({
        type: 'object-key',
        isSymbol,
        isWritable,
        value: String(key),
      })

      /**
       * Avoiding accessing getters to prevent
       * side-effects
       */
      if ('get' in descriptor && !eagerGetters.includes(key)) {
        parser.collect({ type: 'object-value-getter' })
        continue
      }

      /**
       * Inspect value
       */
      parser.collect({ type: 'object-value-start' })
      parser.parse(value[key])
      parser.collect({ type: 'object-value-end' })
    }
  }

  parser.collect({ type: 'prototype-end' })
}

/**
 * Helper to tokenize array like values.
 */
export function tokenizeArray(
  values:
    | Array<any>
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array,
  parser: Parser,
  config: {
    name?: string
    depth: number
    collapse: string[]
    inspectArrayPrototype: boolean
    maxArrayLength: number
  }
) {
  parser.context.arraysSeen = parser.context.arraysSeen ?? new Set()
  parser.context.depth = parser.context.depth ?? 0

  /**
   * Handle circular references of the same array and
   * limit traversing once maxDepth has been reached
   */
  if (parser.context.arraysSeen.has(values)) {
    parser.collect({ type: 'array-circular-ref' })
    return
  }
  if (parser.context.depth >= config.depth) {
    parser.collect({ type: 'array-max-depth-ref' })
    return
  }

  const limit = config.maxArrayLength
  const size = values.length
  const name = config.name || values.constructor.name

  /**
   * Do not inspect children when constructor of the
   * array is meant to be collapsed.
   */
  if (config.collapse.includes(name)) {
    parser.collect({
      type: 'collapse',
      name: name,
      token: {
        type: 'array-start',
        name,
        size,
      },
    })
    return
  }

  /**
   * Track seen array and increment depth
   */
  parser.context.depth++
  parser.context.arraysSeen.add(values)

  parser.collect({ type: 'array-start', name, size })

  for (let index = 0; index < size; index++) {
    if (index >= limit) {
      parser.collect({ type: 'array-max-length-ref', limit, size })
      break
    }

    const value = values[index]
    if (Object.hasOwn(values, index)) {
      parser.collect({ type: 'array-value-start', index })
      parser.parse(value)
      parser.collect({ type: 'array-value-end', index })
    } else {
      parser.collect({ type: 'array-value-hole', index })
    }
  }

  /**
   * Inspect prototype properties of the array
   */
  if (config.inspectArrayPrototype) {
    tokenizePrototype(values, parser, {
      membersToIgnore: ArrayPrototypeKeys,
      prototypeToIgnore: ArrayPrototype,
    })
  }

  parser.collect({ type: 'array-end', size })

  /**
   * Decrement depth and untrack seen array
   */
  parser.context.depth--
  parser.context.arraysSeen.delete(values)
}

/**
 * HTML escape string values so that they can be nested
 * inside the pre-tags.
 */
export function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/\\"/g, '&bsol;&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Wraps a string value to be on multiple lines after
 * a certain characters limit has been hit.
 */
export function wordWrap(
  value: string,
  options: {
    width: number
    indent: string
    newLine: string
    escape?: (value: string) => string
  }
) {
  const width = options.width
  const indent = options.indent
  const newLine = `${options.newLine}${indent}`

  let regexString = '.{1,' + width + '}'
  regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)'

  const re = new RegExp(regexString, 'g')
  const lines = value.match(re) || []
  const result = lines
    .map(function (line) {
      if (line.slice(-1) === '\n') {
        line = line.slice(0, line.length - 1)
      }
      return options.escape ? options.escape(line) : htmlEscape(line)
    })
    .join(newLine)

  return result
}
