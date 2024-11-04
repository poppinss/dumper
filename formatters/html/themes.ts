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
export const themes = {
  nightOwl: {
    pre: 'background-color: #061626; color: #c792ea;',
    toggle: 'color: #4f5357; background: none; border: none;',
    braces: 'color: #ffd700;',
    brackets: 'color: #ffd700;',
    number: 'color: #f78c6c;',
    bigInt: 'color: #f78c6c; font-weight: bold;',
    boolean: 'color: #ff5874; font-style: italic;',
    string: 'color: #ecc48d;',
    null: 'color: #637777;',
    undefined: 'color: #637777;',
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
    collapseLabel: 'color: #7fdbca; font-style: italic;',
    getterLabel: 'color: #7fdbca;',
    circularLabel: 'color: #7fdbca;',
    weakSetLabel: 'color: #7fdbca;',
    weakRefLabel: 'color: #7fdbca;',
    weakMapLabel: 'color: #7fdbca;',
    observableLabel: 'color: #7fdbca;',
    promiseLabel: 'color: #7fdbca;',
    generatorLabel: 'color: #7fdbca;',
    blobLabel: 'color: #7fdbca;',
    unknownLabel: 'color: #7fdbca;',
  },
  minLight: {
    pre: 'background-color: #fff; color: #212121;',
    toggle: 'color: #989999; background: none; border: none;',
    braces: 'color: #0431fa;',
    brackets: 'color: #0431fa;',
    number: 'color: #1976d2;',
    bigInt: 'color: #1976d2; font-weight: bold;',
    boolean: 'color: #1976d2; font-style: italic;',
    string: 'color: #22863a;',
    null: 'color: #9c9c9d;',
    undefined: 'color: #9c9c9d;',
    prototypeLabel: 'color: #9c9c9d;',
    symbol: 'color: #d32f2f;',
    regex: 'color: #1976d2;',
    date: 'color: #7b3814;',
    buffer: 'color: #7b3814;',
    functionLabel: 'color: #6f42c1;',
    arrayLabel: 'color: #d32f2f;',
    objectLabel: 'color: #d32f2f;',
    mapLabel: 'color: #d32f2f;',
    setLabel: 'color: #d32f2f;',
    objectKey: 'color: #212121;',
    objectKeyPrefix: 'color: #9c9c9d; font-style: italic; font-weight: bold',
    classLabel: 'color: #6f42c1;',
    collapseLabel: 'color: #9c9c9d; font-style: italic;',
    getterLabel: 'color: #7b3814;',
    circularLabel: 'color: #7b3814;',
    weakSetLabel: 'color: #7b3814;',
    weakRefLabel: 'color: #7b3814;',
    weakMapLabel: 'color: #7b3814;',
    observableLabel: 'color: #7b3814;',
    promiseLabel: 'color: #7b3814;',
    generatorLabel: 'color: #7b3814;',
    blobLabel: 'color: #7b3814;',
    unknownLabel: 'color: #7b3814;',
  },
  catppuccin: {
    pre: 'background-color: #1e1e2e; color: #94e2d5;',
    toggle: 'color: #7c7c8c; background: none; border: none;',
    braces: 'color: #f38ba8;',
    brackets: 'color: #f38ba8;',
    number: 'color: #fab387;',
    bigInt: 'color: #fab387; font-weight: bold;',
    boolean: 'color: #cba6f7; font-style: italic;',
    string: 'color: #a6e3a1;',
    null: 'color: #6c7086;',
    undefined: 'color: #6c7086;',
    prototypeLabel: 'color: #6c7086;',
    symbol: 'color: #f9e2af;',
    regex: 'color: #cba6f7;',
    date: 'color: #94e2d5;',
    buffer: 'color: #94e2d5;',
    functionLabel: 'color: #cba6f7;',
    arrayLabel: 'color: #f9e2af;',
    objectLabel: 'color: #f9e2af;',
    mapLabel: 'color: #f9e2af;',
    setLabel: 'color: #f9e2af;',
    objectKey: 'color: #89b4fa;',
    objectKeyPrefix: 'color: #6c7086; font-style: italic; font-weight: bold',
    classLabel: 'color: #cba6f7;',
    collapseLabel: 'color: #6c7086; font-style: italic;',
    getterLabel: 'color: #94e2d5;',
    circularLabel: 'color: #94e2d5;',
    weakSetLabel: 'color: #94e2d5;',
    weakRefLabel: 'color: #94e2d5;',
    weakMapLabel: 'color: #94e2d5;',
    observableLabel: 'color: #94e2d5;',
    promiseLabel: 'color: #94e2d5;',
    generatorLabel: 'color: #94e2d5;',
    blobLabel: 'color: #94e2d5;',
    unknownLabel: 'color: #94e2d5;',
  },
  /**
   * Following is the list of defined variables
    --pre-bg-color
    --pre-fg-color
    --toggle-fg-color
    --braces-fg-color
    --brackets-fg-color
    --dt-number-fg-color
    --dt-bigint-fg-color
    --dt-boolean-fg-color
    --dt-string-fg-color
    --dt-null-fg-color
    --dt-undefined-fg-color
    --prototype-label-fg-color
    --dt-symbol-fg-color
    --dt-regex-fg-color
    --dt-date-fg-color
    --dt-buffer-fg-color
    --function-label-fg-color
    --array-label-fg-color
    --object-label-fg-color
    --map-label-fg-color
    --set-label-fg-color
    --object-key-fg-color
    --object-key-prefix-fg-color
    --class-label-fg-color
    --collpase-label-fg-color
    --getter-label-fg-color
    --circular-label-fg-color
    --weakset-label-fg-color
    --weakref-label-fg-color
    --weakmap-label-fg-color
    --observable-label-fg-color
    --promise-label-fg-color
    --generator-label-fg-color
    --blob-label-fg-color
    --unknown-label-fg-color
   */
  cssVariables: {
    pre: 'background-color: var(--pre-bg-color); color: var(--pre-fg-color);',
    toggle: 'color: var(--toggle-fg-color); background: none; border: none;',
    braces: 'color: var(--braces-fg-color);',
    brackets: 'color: var(--brackets-fg-color);',
    number: 'color: var(--dt-number-fg-color);',
    bigInt: 'color: var(--dt-bigint-fg-color); font-weight: bold;',
    boolean: 'color: var(--dt-boolean-fg-color); font-style: italic;',
    string: 'color: var(--dt-string-fg-color);',
    null: 'color: var(--dt-null-fg-color);',
    undefined: 'color: var(--dt-undefined-fg-color);',
    prototypeLabel: 'color: var(--prototype-label-fg-color);',
    symbol: 'color: var(--dt-symbol-fg-color);',
    regex: 'color: var(--dt-regex-fg-color);',
    date: 'color: var(--dt-date-fg-color);',
    buffer: 'color: var(--dt-buffer-fg-color);',
    functionLabel: 'color: var(--function-label-fg-color);',
    arrayLabel: 'color: var(--array-label-fg-color);',
    objectLabel: 'color: var(--object-label-fg-color);',
    mapLabel: 'color: var(--map-label-fg-color);',
    setLabel: 'color: var(--set-label-fg-color);',
    objectKey: 'color: var(--object-key-fg-color);',
    objectKeyPrefix:
      'color: var(--object-key-prefix-fg-color); font-style: italic; font-weight: bold',
    classLabel: 'color: var(--class-label-fg-color);',
    collapseLabel: 'color: var(--collpase-label-fg-color); font-style: italic;',
    getterLabel: 'color: var(--getter-label-fg-color);',
    circularLabel: 'color: var(--circular-label-fg-color);',
    weakSetLabel: 'color: var(--weakset-label-fg-color);',
    weakRefLabel: 'color: var(--weakref-label-fg-color);',
    weakMapLabel: 'color: var(--weakmap-label-fg-color);',
    observableLabel: 'color: var(--observable-label-fg-color);',
    promiseLabel: 'color: var(--promise-label-fg-color);',
    generatorLabel: 'color: var(--generator-label-fg-color);',
    blobLabel: 'color: var(--blob-label-fg-color);',
    unknownLabel: 'color: var(--unknown-label-fg-color);',
  },
} satisfies Record<string, HTMLPrinterStyles>
