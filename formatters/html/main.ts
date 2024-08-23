/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export { themes } from './themes.js'
export * as helpers from './helpers.js'
import { Parser } from '../../src/parser.js'
import { HTMLFormatter } from './formatter.js'
export { HTMLFormatter } from './formatter.js'
import { HTMLFormatterConfig } from './types.js'
import { ParserConfig } from '../../src/types.js'
export { HTMLPrinters } from './printers/main.js'

/**
 * Generate pretty printed HTML output for the provided value. You can
 * specify the parser and the formatter options as the 2nd argument.
 *
 * @example
 * ```ts
 * const html = dump(someValue)
 *
 * // With Parser options
 * const html = dump(someValue, {
 *   inspectObjectPrototype: true,
 *   depth: 10,
 *   showHidden: true,
 * })
 *
 * // With Formatter options
 * const html = dump(someValue, {
 *   styles: {
 *     number: 'color: yellow; font-weight: bold;'
 *   }
 * })
 * ```
 */
export function dump(value: any, config?: ParserConfig & HTMLFormatterConfig) {
  const parser = new Parser(config)
  parser.parse(value)
  return new HTMLFormatter(config).format(parser.flush())
}
