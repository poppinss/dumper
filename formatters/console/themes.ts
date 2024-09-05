/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { styleText } from 'node:util'
import type { ConsolePrinterStyles } from './types.js'

/**
 * Default styles to use for pretty printing to ANSI output
 */
export const themes = {
  default: {
    braces: (value) => styleText('yellow', value),
    brackets: (value) => styleText('yellow', value),
    number: (value) => styleText('yellow', value),
    bigInt: (value) => styleText('yellow', styleText('bold', value)),
    boolean: (value) => styleText('yellow', styleText('italic', value)),
    string: (value) => styleText('green', value),
    null: (value) => styleText('dim', value),
    undefined: (value) => styleText('dim', value),
    prototypeLabel: (value) => styleText('dim', value),
    symbol: (value) => styleText('magenta', value),
    regex: (value) => styleText('red', value),
    date: (value) => styleText('magenta', value),
    buffer: (value) => styleText('magenta', value),
    functionLabel: (value) => styleText('cyan', styleText('italic', value)),
    arrayLabel: (value) => styleText('cyan', styleText('underline', value)),
    objectLabel: (value) => styleText('cyan', styleText('underline', value)),
    mapLabel: (value) => styleText('cyan', value),
    setLabel: (value) => styleText('cyan', value),
    objectKey: (value) => styleText('blue', value),
    objectKeyPrefix: (value) => styleText('dim', value),
    classLabel: (value) => styleText('cyan', value),
    weakSetLabel: (value) => styleText('cyan', value),
    weakRefLabel: (value) => styleText('cyan', value),
    weakMapLabel: (value) => styleText('cyan', value),
    observableLabel: (value) => styleText('cyan', value),
    promiseLabel: (value) => styleText('blue', value),
    generatorLabel: (value) => styleText('cyan', value),
    blobLabel: (value) => styleText('magenta', value),
    unknownLabel: (value) => styleText('magenta', value),
  },
} satisfies Record<string, ConsolePrinterStyles>
