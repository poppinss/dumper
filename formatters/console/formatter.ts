/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { themes } from './themes.js'
import type { Token } from '../../src/types.js'
import { ConsolePrinters } from './printers/main.js'
import type { ConsoleFormatterConfig, ConsolePrinterStyles } from './types.js'

/**
 * ConsoleFormatter is used to format a collection of parser
 * tokens to CLI output.
 *
 * @example
 * ```ts
 * const parser = new Parser()
 * parser.parse(value)
 *
 * const tokens = parser.flush()
 *
 * const formatter = new ConsoleFormatter()
 * const output = formatter.format(tokens)
 * ```
 */
export class ConsoleFormatter {
  /**
   * Styles for output elements
   */
  readonly styles: ConsolePrinterStyles

  /**
   * Context maintained through out the printing
   * phase. Each instance has its own context
   * that gets mutated internally.
   */
  context: Record<string, any>

  /**
   * Value for the newline character
   */
  readonly newLine = '\n'

  /**
   * Utility to manage indentation
   */
  readonly indentation = {
    counter: 0,

    /**
     * Increment the identation by 1 step
     */
    increment() {
      this.counter++
    },

    /**
     * Decrement the identation by 1 step
     */
    decrement() {
      this.counter--
    },

    /**
     * Get the identation spaces as per the current
     * identation level
     */
    getSpaces() {
      return new Array(this.counter * 2 + 1).join(' ')
    },
  }

  constructor(config?: ConsoleFormatterConfig, context?: Record<string, any>) {
    this.context = context || {}
    this.styles = Object.freeze({ ...themes.default, ...config?.styles })
  }

  /**
   * Format a collection of tokens to ANSI output
   */
  format(tokens: Token[]) {
    return tokens
      .map((token) => {
        const formatter = ConsolePrinters[token.type]
        return formatter(token as any, this) || ''
      })
      .join('')
  }
}
