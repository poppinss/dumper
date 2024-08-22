/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { inspect } from 'node:util'
import is, { type TypeName } from '@sindresorhus/is'

import { Parser } from '../parser.js'
import type { Tokenizer } from '../types.js'
import { tokenizeArray, tokenizeObject } from '../helpers.js'

/**
 * Tokenizers are responsible for converting JS data types
 * to known dumper tokens.
 */
export const tokenizers: Partial<Record<TypeName, Tokenizer>> = {
  /**
   * Tokenizes an object and its properties.
   *  - Enable "showHidden" option to parse non-enumerable
   *  - Enable "inspectObjectPrototype" to parse prototype members
   */
  Object: (value: Record<string | symbol, any>, parser) => {
    tokenizeObject(value, parser, parser.config)
  },

  /**
   * Tokenizes an array of values
   */
  Array: (values: any[], parser) => {
    tokenizeArray(values, parser, parser.config)
  },

  /**
   * Tokenizes keys and values inside a map
   */
  Map: (values: Map<any, any>, parser) => {
    parser.context.mapsSeen = parser.context.mapsSeen ?? new Set()
    parser.context.depth = parser.context.depth ?? 0

    /**
     * Handle circular references of the same map and
     * limit traversing once maxDepth has been reached
     */
    if (parser.context.mapsSeen.has(values)) {
      parser.collect({ type: 'map-circular-ref' })
      return
    }
    if (parser.context.depth >= parser.config.depth) {
      parser.collect({ type: 'map-max-depth-ref' })
      return
    }

    /**
     * Track seen map and increment depth
     */
    parser.context.depth++
    parser.context.mapsSeen.add(values)

    let index = 0
    const size = values.size
    const limit = parser.config.maxArrayLength

    parser.collect({ type: 'map-start', size })

    for (let [key, value] of values) {
      if (index >= limit) {
        parser.collect({ type: 'map-max-length-ref', limit, size })
        break
      }

      parser.collect({ type: 'map-row-start', index })

      parser.collect({ type: 'map-key-start', index })
      parser.parse(key)
      parser.collect({ type: 'map-key-end', index })

      parser.collect({ type: 'map-value-start', index })
      parser.parse(value)
      parser.collect({ type: 'map-value-end', index })
      parser.collect({ type: 'map-row-end', index })
      index++
    }

    parser.collect({ type: 'map-end', size })

    /**
     * Decrement depth and untrack seen map
     */
    parser.context.depth--
    parser.context.mapsSeen.delete(values)
  },

  /**
   * Tokenizes values inside a set
   */
  Set: (values: Set<any>, parser) => {
    parser.context.setsSeen = parser.context.setsSeen ?? new Set()
    parser.context.depth = parser.context.depth ?? 0

    /**
     * Handle circular references of the same set and
     * limit traversing once maxDepth has been reached
     */
    if (parser.context.setsSeen.has(values)) {
      parser.collect({ type: 'set-circular-ref' })
      return
    }
    if (parser.context.depth >= parser.config.depth) {
      parser.collect({ type: 'set-max-depth-ref' })
      return
    }

    /**
     * Track seen set and increment depth
     */
    parser.context.depth++
    parser.context.setsSeen.add(values)

    let index = 0
    const size = values.size
    const limit = parser.config.maxArrayLength

    parser.collect({ type: 'set-start', size })

    for (let value of values) {
      if (index >= limit) {
        parser.collect({ type: 'set-max-length-ref', limit, size })
        break
      }

      parser.collect({ type: 'set-value-start', index })
      parser.parse(value)
      parser.collect({ type: 'set-value-end', index })
      index++
    }

    parser.collect({ type: 'set-end', size })

    /**
     * Decrement depth and untrack seen set
     */
    parser.context.depth--
    parser.context.setsSeen.delete(values)
  },

  /**
   * Tokenizes a function. If the function is a class created
   * using the [class] keyword, we will process its static
   * members when "config.inspectClassConstructor"
   * is enabled
   */
  Function: (value: Function, parser) => {
    const ConstructorName = value.constructor.name
    if (ConstructorName === 'GeneratorFunction') {
      return tokenizers.GeneratorFunction!(value, parser)
    }
    if (ConstructorName === 'AsyncGeneratorFunction') {
      return tokenizers.AsyncGeneratorFunction!(value, parser)
    }
    if (ConstructorName === 'AsyncFunction') {
      return tokenizers.AsyncFunction!(value, parser)
    }

    const isClass = is.class(value)
    parser.collect({
      type: 'function',
      isClass,
      isAsync: false,
      isGenerator: false,
      name: value.name || 'anonymous',
    })

    /**
     * Parsing static members of the class.
     */
    if (parser.config.inspectStaticMembers && isClass) {
      parser.collect({ type: 'static-members-start' })

      tokenizeObject(value, parser, {
        showHidden: true,
        depth: parser.config.depth,
        inspectObjectPrototype: false,
        membersToIgnore: ['prototype', 'name', 'length'],
      })

      parser.collect({ type: 'static-members-end' })
    }
  },

  /**
   * Tokenizes a string value and handles max length and
   * correct quotes via the "util.inspect" method.
   */
  string: (value: string, parser) => {
    const formatted = inspect(value, {
      maxStringLength: parser.config.maxStringLength,
      customInspect: false,
    })
    parser.collect({ type: 'string', value: formatted })
  },

  /**
   * Tokenizes the URL instance as an object
   */
  URL: (value: URL, parser) => {
    tokenizeObject(
      {
        hash: value.hash,
        host: value.host,
        hostname: value.hostname,
        href: value.href,
        origin: value.origin,
        password: value.password,
        pathname: value.pathname,
        port: value.port,
        protocol: value.protocol,
        search: value.search,
        searchParams: value.searchParams,
        username: value.username,
      },
      parser,
      { constructorName: 'URL', ...parser.config }
    )
  },

  /**
   * Tokenizes the URLSearchParams instance as an object
   */
  URLSearchParams: (value: URLSearchParams, parser) => {
    tokenizeObject(Object.fromEntries(value), parser, {
      constructorName: 'URLSearchParams',
      ...parser.config,
    })
  },

  Error: function (value: Error, parser: Parser): void {
    tokenizeObject(value, parser, {
      eagerGetters: ['message', 'stack'],
      ...parser.config,
      showHidden: true,
    })
  },

  FormData: function (value: FormData, parser: Parser): void {
    tokenizeObject(Object.fromEntries(value.entries()), parser, {
      constructorName: 'FormData',
      ...parser.config,
    })
  },

  /**
   * Straight forward one's
   */
  undefined: (_, parser) => {
    parser.collect({ type: 'undefined' })
  },
  null: (_, parser) => {
    parser.collect({ type: 'null' })
  },
  symbol: (value: Symbol, parser) => {
    parser.collect({ type: 'symbol', value: String(value) })
  },
  number: (value: number, parser) => {
    parser.collect({ type: 'number', value })
  },
  boolean: (value: boolean, parser) => {
    parser.collect({ type: 'boolean', value })
  },
  bigint: (value: BigInt, parser) => {
    parser.collect({ type: 'bigInt', value: `${value.toString()}n` })
  },
  Date: (value: Date, parser) => {
    parser.collect({ type: 'date', value: value.toISOString() })
  },
  RegExp: (value: RegExp, parser) => {
    parser.collect({ type: 'regexp', value: String(value) })
  },
  Buffer: (value: Buffer, parser) => {
    parser.collect({
      type: 'buffer',
      value: inspect(value),
    })
  },
  WeakSet: (_, parser) => {
    parser.collect({ type: 'weak-set' })
  },
  WeakMap: (_, parser) => {
    parser.collect({ type: 'weak-map' })
  },
  WeakRef: function (_, parser: Parser): void {
    parser.collect({ type: 'weak-ref' })
  },
  Generator: function (_, parser: Parser): void {
    parser.collect({ type: 'generator', isAsync: false })
  },
  AsyncGenerator: function (_, parser: Parser): void {
    parser.collect({ type: 'generator', isAsync: true })
  },
  GeneratorFunction: function (value: GeneratorFunction, parser: Parser): void {
    parser.collect({
      type: 'function',
      isGenerator: true,
      isClass: false,
      isAsync: false,
      name: value.name || 'anonymous',
    })
  },
  AsyncGeneratorFunction: function (value: AsyncGeneratorFunction, parser: Parser): void {
    parser.collect({
      type: 'function',
      isGenerator: true,
      isClass: false,
      isAsync: true,
      name: value.name || 'anonymous',
    })
  },
  AsyncFunction: function (value: Function, parser: Parser): void {
    parser.collect({
      type: 'function',
      isGenerator: false,
      isClass: false,
      isAsync: true,
      name: value.name || 'anonymous',
    })
  },
  Observable: function (_, parser: Parser): void {
    parser.collect({ type: 'observable' })
  },
  Blob: function (value: Blob, parser: Parser): void {
    parser.collect({ type: 'blob', size: value.size, contentType: value.type })
  },
  Promise: function (value: Promise<any>, parser: Parser): void {
    parser.collect({
      type: 'promise',
      isFulfilled: !inspect(value).includes('pending'),
    })
  },
  NaN: function (_: number, parser: Parser): void {
    parser.collect({ type: 'number', value: Number.NaN })
  },
  Int8Array: function (value: Int8Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  Uint8Array: function (value: Uint8Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  Int16Array: function (value: Int16Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  Uint16Array: function (value: Uint16Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  Int32Array: function (value: Int32Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  Uint32Array: function (value: Uint32Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  Float32Array: function (value: Float32Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  Float64Array: function (value: Float64Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  BigInt64Array: function (value: BigInt64Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
  BigUint64Array: function (value: BigUint64Array, parser: Parser): void {
    tokenizeArray(value, parser, parser.config)
  },
}
