/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dump, themes } from '../formatters/console/main.js'
import { obj } from './values.js'

console.log(
  dump(obj, {
    styles: themes.default,
    inspectStaticMembers: true,
    collapse: ['DateTime'],
  })
)
