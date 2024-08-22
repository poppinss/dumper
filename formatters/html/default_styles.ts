/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HTMLPrinterStyles } from './types.js'

/**
 * Default styles to use for pretty printing
 * the HTML output.
 */
export const defaultStyles: HTMLPrinterStyles = {
  pre: 'background-color: #1e1e2e; color: #cdd6f4',
  number: 'color: #fab387;',
  bigInt: 'color: #00b19c; font-weight: bold;',
  boolean: 'color: #00b19c; font-style: italic;',
  string: 'color: #a6e3a1;',
  null: 'color: #6c7086;',
  undefined: 'color: #6c7086;',
  symbol: 'color: #eba0ac;',
  regex: 'color: #f5c2e7;',
  date: 'color: #fab387;',
  buffer: 'color: #fab387;',
  functionLabel: 'color: #89b4fa;',
  arrayLabel: 'color: #f9e2af;',
  objectLabel: 'color: #f9e2af;',
  mapLabel: 'color: #f9e2af;',
  setLabel: 'color: #f9e2af;',
  objectKey: 'color: #cdd6f4;',
  prototypeLabel: 'color: #6c7086;',
  objectKeyPrefix: 'color: #6c7086; font-style: italic; font-weight: bold',
  classLabel: '',
  weakSetLabel: '',
  weakRefLabel: '',
  weakMapLabel: '',
  observableLabel: '',
  promiseLabel: '',
  generatorLabel: '',
  blobLabel: '',
  unknownLabel: '',
}
