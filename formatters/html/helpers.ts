/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * HTML escape string values so that they can be nested
 * inside the pre-tags.
 */
export function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/\\"/g, '&bsol;&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Wraps a string value to be on multiple lines after
 * a certain characters limit has been hit.
 */
export function wordWrap(
  value: string,
  options: {
    width: number
    indent: string
    newLine: string
  }
) {
  const width = options.width
  const indent = options.indent
  const newLine = `${options.newLine}${indent}`

  let regexString = '.{1,' + width + '}'
  regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)'

  const re = new RegExp(regexString, 'g')
  const lines = value.match(re) || []
  const result = lines
    .map(function (line) {
      if (line.slice(-1) === '\n') {
        line = line.slice(0, line.length - 1)
      }
      return htmlEscape(line)
    })
    .join(newLine)

  return result
}
