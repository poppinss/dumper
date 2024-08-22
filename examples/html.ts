/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '../src/parser.js'
import { obj } from './values.js'
import { HTMLFormatter } from '../formatters/html/main.js'

const parser = new Parser({
  inspectStaticMembers: true,
  inspectObjectPrototype: true,
})
parser.parse(obj)

const formatter = new HTMLFormatter({})
console.log(formatter.format(parser.flush()))
