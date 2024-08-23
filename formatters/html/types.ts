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
  /**
   * The shell div contains the head and the
   * pre tags
   */
  shell: string

  /**
   * Styles for the dumper head element that contains
   * the title and the source link anchor tag
   */
  head: string

  /**
   * Styles for the anchor tag that displays
   * the source file info
   */
  sourceLink: string

  pre: string
  braces: string
  brackets: string
  toggle: string

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
   * Styles for the Object label. Use braces setting to define
   * the braces color
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
   * Styles for the Array label. Use brackets setting to define
   * the brackets color
   */
  arrayLabel: string

  /**
   * Styles for the Map label. Use brackets setting to define
   * the brackets color
   */
  mapLabel: string

  /**
   * Styles for the Set label. Use brackets setting to define
   * the brackets color
   */
  setLabel: string

  weakSetLabel: string
  weakRefLabel: string
  weakMapLabel: string
  observableLabel: string
  promiseLabel: string
  generatorLabel: string
  prototypeLabel: string

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

/**
 * Config accepted by the HTML Formatter
 */
export type HTMLFormatterConfig = {
  styles?: Partial<HTMLPrinterStyles>
  cspNonce?: string

  /**
   * The head section contains the metadata about the
   * dumped values. It can have a title and a link
   * to the source file that printed the dump
   */
  head?: {
    title?: string
    source?: {
      link: string
      text: string
    }
  }
}
