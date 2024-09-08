/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useColors from '@poppinss/colors'
import supportsColor from 'supports-color'
import type { ConsolePrinterStyles } from './types.js'

const colors = supportsColor.stdout ? useColors.ansi() : useColors.silent()

/**
 * Default styles to use for pretty printing to ANSI output
 */
export const themes = {
  default: {
    braces: (value) => colors.yellow(value),
    brackets: (value) => colors.yellow(value),
    number: (value) => colors.yellow(value),
    bigInt: (value) => colors.yellow().bold(value),
    boolean: (value) => colors.yellow().italic(value),
    string: (value) => colors.green(value),
    null: (value) => colors.dim(value),
    undefined: (value) => colors.dim(value),
    prototypeLabel: (value) => colors.dim(value),
    symbol: (value) => colors.magenta(value),
    regex: (value) => colors.red(value),
    date: (value) => colors.magenta(value),
    buffer: (value) => colors.magenta(value),
    functionLabel: (value) => colors.cyan().italic(value),
    arrayLabel: (value) => colors.cyan(value),
    objectLabel: (value) => colors.cyan(value),
    mapLabel: (value) => colors.cyan(value),
    setLabel: (value) => colors.cyan(value),
    objectKey: (value) => colors.blue(value),
    objectKeyPrefix: (value) => colors.dim(value),
    classLabel: (value) => colors.cyan(value),
    weakSetLabel: (value) => colors.cyan(value),
    weakRefLabel: (value) => colors.cyan(value),
    collapseLabel: (value) => colors.dim(value),
    circularLabel: (value) => colors.cyan(value),
    getterLabel: (value) => colors.cyan(value),
    weakMapLabel: (value) => colors.cyan(value),
    observableLabel: (value) => colors.cyan(value),
    promiseLabel: (value) => colors.blue(value),
    generatorLabel: (value) => colors.cyan(value),
    blobLabel: (value) => colors.magenta(value),
    unknownLabel: (value) => colors.magenta(value),
  },
} satisfies Record<string, ConsolePrinterStyles>
