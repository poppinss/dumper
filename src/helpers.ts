/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Parser } from './parser.js'

const ObjectPrototype = Reflect.ownKeys(Object.prototype)
const ArrayPrototye = Reflect.ownKeys(Array.prototype)

/**
 * Helper to tokenize an object and its prototype
 */
export function tokenizeObject(
  value: Record<string | symbol, any>,
  parser: Parser,
  config: {
    depth: number
    showHidden: boolean
    inspectObjectPrototype: boolean
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
   * Track seen object and increment depth
   */
  parser.context.depth++
  parser.context.objectsSeen.add(value)

  /**
   * Keep reference of the config properties
   */
  const showHidden = config.showHidden

  /**
   * Grab metadata of the object.
   */
  const name = config.constructorName ?? Object.getPrototypeOf(value)?.constructor.name ?? null
  const ownKeys = Reflect.ownKeys(value)
  const eagerGetters = config.eagerGetters ?? []

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
  if (config.inspectObjectPrototype) {
    tokenizePrototype(value, parser, { membersToIgnore: ObjectPrototype })
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
    membersToIgnore?: (string | symbol)[]
    eagerGetters?: (string | symbol)[]
  }
) {
  const objectPrototype = Object.getPrototypeOf(value)
  const ownKeys = Reflect.ownKeys(objectPrototype)
  const eagerGetters = config.eagerGetters ?? []

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

  parser.collect({ type: 'prototype-start' })

  /**
   * Looping over own keys (including non-enumerable)
   */
  for (let key of keys) {
    /**
     * Ignore constructor
     */
    if (key === 'constructor') {
      continue
    }

    /**
     * Ensure property is known
     */
    const descriptor = Object.getOwnPropertyDescriptor(objectPrototype, key)
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

  /**
   * Track seen array and increment depth
   */
  parser.context.depth++
  parser.context.arraysSeen.add(values)

  const limit = config.maxArrayLength
  const size = values.length
  const name = config.name || values.constructor.name
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
      membersToIgnore: ArrayPrototye,
    })
  }

  parser.collect({ type: 'array-end', size })

  /**
   * Decrement depth and untrack seen array
   */
  parser.context.depth--
  parser.context.arraysSeen.delete(values)
}
