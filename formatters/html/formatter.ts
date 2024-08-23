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
import type { HTMLFormatterConfig, HTMLPrinterStyles } from './types.js'

/**
 * Copy-pasted from
 * https://github.com/ai/nanoid/blob/main/nanoid.js
 */
const seed = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
export let nanoid = (length = 15) => {
  let output = ''
  const random = crypto.getRandomValues(new Uint8Array(length))
  for (let n = 0; n < length; n++) {
    output += seed[63 & random[n]]
  }
  return output
}

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
  #cspNonce?: string

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

  constructor(config?: HTMLFormatterConfig, context?: Record<string, any>) {
    this.context = context || {}
    this.#cspNonce = config?.cspNonce
    this.styles = Object.freeze({ ...themes.nightOwl, ...config?.styles })
  }

  /**
   * Wraps the final output inside pre tags and add the script
   * to activate the frontend iteractions.
   */
  #wrapOutput(code: string) {
    const id = `dump-${nanoid()}`
    const nonce = this.#cspNonce ? ` nonce="${this.#cspNonce}"` : ''
    return (
      `<div id="${id}" class="dumper-dump">` +
      `<pre style="${this.styles.pre}"><code>${code}</code></pre>` +
      `<script${nonce}>dumperActivate('${id}')</script>` +
      '</div>'
    )
  }

  /**
   * Format a collection of tokens to HTML output wrapped
   * inside the `pre` tag.
   */
  format(tokens: Token[]) {
    return this.#wrapOutput(
      tokens
        .map((token) => {
          const formatter = HTMLPrinters[token.type]
          return formatter(token as any, this) || ''
        })
        .join('')
    )
  }
}
