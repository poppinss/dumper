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
export const themes: Record<string, HTMLPrinterStyles> = {
  nightOwl: {
    pre: 'background-color: #061626; color: #c792ea;',
    toggle: 'color: #637777;',
    braces: 'color: #ffd700;',
    brackets: 'color: #ffd700;',
    number: 'color: #f78c6c;',
    bigInt: 'color: #f78c6c; font-weight: bold;',
    boolean: 'color: #ff5874; font-style: italic;',
    string: 'color: #ecc48d;',
    null: 'color: #7fdbca;',
    undefined: 'color: #7fdbca;',
    prototypeLabel: 'color: #637777;',
    symbol: 'color: #82aaff;',
    regex: 'color: #ff5874;',
    date: 'color: #7fdbca;',
    buffer: 'color: #7fdbca;',
    functionLabel: 'color: #89b4fa;',
    arrayLabel: 'color: #82aaff;',
    objectLabel: 'color: #82aaff;',
    mapLabel: 'color: #82aaff;',
    setLabel: 'color: #82aaff;',
    objectKey: 'color: #c792ea;',
    objectKeyPrefix: 'color: #637777; font-style: italic; font-weight: bold',
    classLabel: 'color: #82aaff;',
    weakSetLabel: 'color: #7fdbca;',
    weakRefLabel: 'color: #7fdbca;',
    weakMapLabel: 'color: #7fdbca;',
    observableLabel: 'color: #7fdbca;',
    promiseLabel: 'color: #7fdbca;',
    generatorLabel: 'color: #7fdbca;',
    blobLabel: 'color: #7fdbca;',
    unknownLabel: 'color: #7fdbca;',
  },
}
