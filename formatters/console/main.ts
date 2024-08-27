/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '../../src/parser.js'
import { ConsoleFormatter } from './formatter.js'
import type { ConsoleDumpConfig } from './types.js'

export { ConsoleFormatter }
export { themes } from './themes.js'
export { ConsolePrinters } from './printers/main.js'

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
export function dump(value: any, config?: ConsoleDumpConfig) {
  const parser = new Parser(config)
  parser.parse(value)
  return new ConsoleFormatter(config).format(parser.flush())
}
