/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { TokensMap } from '../../src/types.js'
import type { HTMLFormatter } from './main.js'

/**
 * CSS styles to use for pretty printing parser tokens. The values
 * should be compatible with the HTML style attribute.
 *
 * @example
 * ```ts
 * {
 *   pre: "background-color: black; color: white;"
 * }
 * ```
 */
export type HTMLPrinterStyles = {
  pre: string

  string: string
  number: string
  boolean: string
  bigInt: string
  undefined: string
  null: string
  symbol: string
  regex: string
  date: string
  buffer: string

  /**
   * Styles for displaying the function value with
   * its name
   */
  functionLabel: string

  /**
   * Styles for displaying the class value with
   * its name
   */
  classLabel: string

  /**
   * Styles for the Object label and opening/closing
   * curly braces
   */
  objectLabel: string

  /**
   * Styles for the Object key name
   */
  objectKey: string

  /**
   * Styles for the Object key prefix name.
   */
  objectKeyPrefix: string

  /**
   * Styles for the Array label and opening/closing
   * square brackets
   */
  arrayLabel: string

  /**
   * Styles for the Map label and opening/closing
   * curly braces
   */
  mapLabel: string

  /**
   * Styles for the Set label and opening/closing
   * square brackets
   */
  setLabel: string

  weakSetLabel: string
  weakRefLabel: string
  weakMapLabel: string
  observableLabel: string
  promiseLabel: string
  generatorLabel: string

  /**
   * Styles for displaying Blob keyword label. The blob
   * properties like the type and size are styled as
   * an object
   */
  blobLabel: string

  /**
   * Styles for displaying values not parsed by the
   * parser as first-class citizen but still printed
   * by casting them to String
   */
  unknownLabel: string
}

/**
 * Printers collection that are used to print parser
 * tokens to HTML output (one at a time)
 */
export type TokenPrinters = {
  [K in keyof TokensMap]: (
    /**
     * Value of the token
     */
    token: TokensMap[K],

    /**
     * Formatter reference
     */
    formatter: HTMLFormatter
  ) => string
}
