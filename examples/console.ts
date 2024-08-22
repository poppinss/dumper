/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { inspect } from 'node:util'
import { Parser } from '../src/parser.js'
import { print } from '../src/print.js'
import { consolePrinters } from '../src/printers/console.js'
import { obj } from './values.js'

// const parser = new Parser()
// parser.parse(obj)

// console.log(print(parser.flush(), consolePrinters))
console.log(inspect(obj, { colors: true, showHidden: true }))
