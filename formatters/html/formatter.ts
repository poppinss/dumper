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
import { HTMLPrinters } from './printers/main.js'
import type { HTMLPrinterStyles } from './types.js'

/**
 * HTMLFormatter is used to format a collection of parser
 * tokens into HTML output containing pre-tags.
 *
 * @example
 * ```ts
 * const parser = new Parser()
 * parser.parse(value)
 *
 * const tokens = parser.flush()
 *
 * const formatter = new HTMLFormatter()
 * const html = formatter.format(tokens)
 * ```
 */
export class HTMLFormatter {
  /**
   * Styles for output elements
   */
  readonly styles: HTMLPrinterStyles

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
      return new Array(this.counter * 2 + 1).join('&nbsp;')
    },
  }

  constructor(
    config?: {
      styles?: Partial<HTMLPrinterStyles>
    },
    context?: Record<string, any>
  ) {
    this.context = context || {}
    this.styles = Object.freeze({ ...themes.nightOwl, ...config?.styles })
  }

  /**
   * Wraps the final output into pre and code tags
   */
  #wrapInPre(code: string) {
    return `<pre style="${this.styles.pre}"><code>${code}</code></pre>`
  }

  /**
   * Format a collection of tokens to HTML output wrapped
   * inside the `pre` tag.
   */
  format(tokens: Token[]) {
    return this.#wrapInPre(
      tokens
        .map((token) => {
          const formatter = HTMLPrinters[token.type]
          return formatter(token as any, this) || ''
        })
        .join('')
    )
  }
}
