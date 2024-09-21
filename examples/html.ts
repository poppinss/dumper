/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createScript, createStyleSheet, dump, themes } from '../formatters/html/main.js'
import { obj } from './values.js'

const html = dump(obj, {
  styles: themes.nightOwl,
  inspectStaticMembers: true,
  collapse: ['DateTime'],
})

const output = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <style>
    ${createStyleSheet()}
  </style>
  <script>
    ${createScript()}
  </script>
</head>
<body>
  ${html}
</body>
</html>`

console.log(output)
