/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dump, themes } from '../formatters/html/main.js'
import { obj } from './values.js'

console.log(
  dump(obj, {
    styles: themes.minLight,
    head: {
      title: 'DUMPER',
      source: {
        link: '',
        text: 'pages/posts/index.edge(32:2)',
      },
    },
  })
)
