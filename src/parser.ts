/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import is, { TypeName } from '@sindresorhus/is'
import { tokenizers } from './tokenizers/main.js'
import type { ParserConfig, Token } from './types.js'

/**
 * Parser is used to parse a JavaScript value into a set
 * of tokens that can be used to pretty-print the same
 * value.
 *
 * @example
 * ```ts
 * import { Parser } from '@poppinss/dumper'
 *
 * const parser = new Parser()
 * const value = {
 *   id: 1,
 *   username: 'foo',
 * }
 *
 * parser.parse(value)
 * parser.flush() // Token[]
 * ```
 */
export class Parser {
  #tokens: Token[] = []

  /**
   * Config shared with tokenizers
   */
  config: Readonly<Required<ParserConfig>>

  /**
   * Context maintained through out the parsing phase.
   * Each instance of Parser has its own context
   * that gets mutated internally.
   */
  context: Record<string, any>

  constructor(config?: ParserConfig, context?: Record<string, any>) {
    this.context = context || {}
    this.config = Object.freeze({
      showHidden: false,
      depth: 5,
      inspectObjectPrototype: false,
      inspectArrayPrototype: false,
      inspectStaticMembers: false,
      maxArrayLength: 100,
      maxStringLength: 1000,
      ...config,
    })
  }

  /**
   * Normalizes the type name of a property using additional
   * bit of checks. For example, the "is" module does not
   * use instanceOf checks and hence misses out on many
   * potentional improvements.
   */
  #normalizeTypeName(name: TypeName, value: any): TypeName {
    if (name === 'Object' && value instanceof Error) {
      return 'Error'
    }
    return name
  }

  /**
   * Collect a token inside the list of tokens. The order
   * of tokens matter during printing therefore you must
   * collect tokens in the right order.
   */
  collect(token: Token) {
    this.#tokens.push(token)
  }

  /**
   * Parses a value using the tokenizers. Under the hood the
   * tokenizers will call "parser.collect" to collect
   * tokens inside an array.
   *
   * You can use "parser.flush" method to get the list of
   * tokens.
   */
  parse(value: unknown) {
    const typeName = this.#normalizeTypeName(is.detect(value), value)
    const tokenizer = tokenizers[typeName]
    if (tokenizer) {
      tokenizer(value, this)
    } else {
      this.collect({ type: 'unknown', jsType: typeName, value })
    }
  }

  /**
   * Returns collected tokens and resets the internal state.
   */
  flush() {
    const tokens = this.#tokens
    this.#tokens = []
    this.context = {}
    return tokens
  }
}
