/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { htmlEscape, wordWrap } from '../helpers.js'
import type { TokenPrinters } from '../types.js'

const dropdownIcon = `<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="8" height="16" aria-label="" role="presentation" viewBox="0 0 256 512" style=""><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"></path> </svg>`

/**
 * HTML printers to pretty print parser tokens
 */
export const HTMLPrinters: TokenPrinters = {
  'object-start': (token, formatter) => {
    formatter.indentation.increment()
    const styles = formatter.styles.objectLabel
    const label = formatter.context.isStaticMember
      ? ' {'
      : `${token.constructorName || 'Object [null]'} {`

    return (
      '<span class="dumper-group dumper-object-group">' +
      `<span style="${styles}">${label}</span>` +
      `<button class="dumper-toggle"><span>${dropdownIcon}</span></button>` +
      '<samp>'
    )
  },

  'object-end': (_, formatter) => {
    formatter.indentation.decrement()
    const styles = formatter.styles.objectLabel
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`

    return indent + '</samp>' + `<span style="${styles}">}</span>` + '</span>'
  },

  'object-key': (token, formatter) => {
    formatter.context.isStack = token.value === 'stack'

    const styles = formatter.styles.objectKey
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`

    /**
     * Computing value
     */
    let value = token.value
    if (token.isSymbol) {
      value = `[${value}]`
    } else if (!/^[a-z$_][$\w]*$/i.test(value)) {
      value = `"${htmlEscape(value.replace(/"/g, '\\"'))}"`
    }

    /**
     * Computing prefix
     */
    let prefix = ''
    if (formatter.context.isStaticMember) {
      const prefixStyles = formatter.styles.objectKeyPrefix
      prefix = `<span class="dumper-object-prefix" style="${prefixStyles}">` + `static ` + '</span>'
    }

    return (
      indent +
      prefix +
      `<span class="dumper-object-key" style="${styles}">` +
      `${value}` +
      '</span>: '
    )
  },

  'object-circular-ref': (_, formatter) => {
    const styles = formatter.styles.objectLabel
    return `<span style="${styles}">[Object *Circular]</span>`
  },

  'object-max-depth-ref': (_, formatter) => {
    const styles = formatter.styles.objectLabel
    return `<span style="${styles}">[Object]</span>`
  },

  'object-value-getter': (_, formatter) => {
    const styles = formatter.styles.objectLabel
    return `<span style="${styles}">[Object Getter]</span>`
  },

  'object-value-start': () => {
    return ''
  },

  'object-value-end': () => {
    return `,`
  },

  'array-start': (token, formatter) => {
    formatter.indentation.increment()
    const styles = formatter.styles.arrayLabel
    const label = `Array:${token.size} [`

    return (
      '<span class="dumper-group dumper-array-group">' +
      `<span style="${styles}">${label}</span>` +
      `<button class="dumper-toggle"><span>${dropdownIcon}</span></button>` +
      '<samp>'
    )
  },

  'array-end': (_, formatter) => {
    formatter.indentation.decrement()
    const styles = formatter.styles.arrayLabel
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`

    return indent + '</samp>' + `<span style="${styles}">]</span>` + '</span>'
  },

  'array-value-start': (_, formatter) => {
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    return indent
  },

  'array-value-hole': (_, formatter) => {
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    const styles = formatter.styles.undefined
    return (
      indent +
      `<span class="dumper-undefined" style="${styles}">` +
      `${htmlEscape('<hole>')},` +
      '</span>'
    )
  },

  'array-value-end': () => {
    return `,`
  },

  'array-circular-ref': (_, formatter) => {
    const styles = formatter.styles.arrayLabel
    return `<span style="${styles}">[Array *Circular]</span>`
  },

  'array-max-depth-ref': (_, formatter) => {
    const styles = formatter.styles.arrayLabel
    return `<span style="${styles}">[Array]</span>`
  },

  'array-max-length-ref': (token, formatter) => {
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    const styles = formatter.styles.arrayLabel
    const itemsLeft = token.size - token.limit
    if (itemsLeft <= 0) {
      return ''
    }

    const label = itemsLeft === 1 ? `1 more item` : `${itemsLeft} more items`
    return `${indent}<span style="${styles}">[...${label}]</span>`
  },

  'map-start': (token, formatter) => {
    formatter.indentation.increment()
    const styles = formatter.styles.mapLabel
    const label = `Map:${token.size} {`

    return (
      '<span class="dumper-group dumper-map-group">' +
      `<span style="${styles}">${label}</span>` +
      `<button class="dumper-toggle"><span>${dropdownIcon}</span></button>` +
      '<samp>'
    )
  },

  'map-end': (_, formatter) => {
    formatter.indentation.decrement()
    const styles = formatter.styles.mapLabel
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`

    return indent + '</samp>' + `<span style="${styles}">}</span>` + '</span>'
  },

  'map-row-start': (_, formatter) => {
    const styles = formatter.styles.arrayLabel
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    formatter.indentation.increment()

    return indent + `<span style="${styles}">[</span>`
  },

  'map-row-end': (_, formatter) => {
    formatter.indentation.decrement()
    const styles = formatter.styles.arrayLabel
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    return indent + `<span style="${styles}">]</span>,`
  },

  'map-key-start': (_, formatter) => {
    const styles = formatter.styles.objectKey
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`

    return indent + `<span style="${styles}">key</span>: `
  },

  'map-key-end': function (): string {
    return ''
  },

  'map-value-start': (_, formatter) => {
    const styles = formatter.styles.objectKey
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`

    return indent + `<span style="${styles}">value</span>: `
  },

  'map-value-end': function (): string {
    return ''
  },

  'map-circular-ref': (_, formatter) => {
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    const styles = formatter.styles.mapLabel

    return `${indent}<span style="${styles}">[Map *Circular]</span>`
  },

  'map-max-depth-ref': (_, formatter) => {
    const styles = formatter.styles.mapLabel

    return `<span style="${styles}">[Map]</span>`
  },

  'map-max-length-ref': (token, formatter) => {
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    const styles = formatter.styles.mapLabel
    const itemsLeft = token.size - token.limit
    if (itemsLeft <= 0) {
      return ''
    }

    const label = itemsLeft === 1 ? `1 more item` : `${itemsLeft} more items`
    return `${indent}<span style="${styles}">[...${label}]</span>`
  },

  'set-start': (token, formatter) => {
    formatter.indentation.increment()
    const styles = formatter.styles.setLabel
    const label = `Set:${token.size} [`

    return (
      '<span class="dumper-group dumper-set-group">' +
      `<span class="dumper-set-label" style="${styles}">${label}</span>` +
      `<button class="dumper-toggle"><span>${dropdownIcon}</span></button>` +
      '<samp>'
    )
  },

  'set-end': (_, formatter) => {
    formatter.indentation.decrement()
    const styles = formatter.styles.setLabel
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`

    return indent + '</samp>' + `<span style="${styles}">]</span>` + '</span>'
  },

  'set-value-start': (_, formatter) => {
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    return indent
  },

  'set-value-end': () => {
    return `,`
  },

  'set-circular-ref': (_, formatter) => {
    const styles = formatter.styles.setLabel

    return `<span style="${styles}">[Set *Circular]</span>`
  },

  'set-max-depth-ref': (_, formatter) => {
    const styles = formatter.styles.setLabel

    return `<span style="${styles}">[Set]</span>`
  },

  'set-max-length-ref': (token, formatter) => {
    const indent = `${formatter.newLine}${formatter.indentation.getSpaces()}`
    const styles = formatter.styles.setLabel
    const itemsLeft = token.size - token.limit
    if (itemsLeft <= 0) {
      return ''
    }

    const label = itemsLeft === 1 ? `1 more item` : `${itemsLeft} more items`
    return `${indent}<span style="${styles}">[...${label}]</span>`
  },

  'string': (token, formatter) => {
    let value = token.value
    const indent = formatter.indentation.getSpaces()

    if (formatter.context.isStack) {
      value = token.value
        .split('\n')
        .map((row, index) => {
          let rowValue = `<span>${htmlEscape(row.trim())}</span>`
          if (index > 0) {
            rowValue = `${indent}${rowValue}`
          }
          return rowValue
        })
        .join('\n')
    } else {
      value = wordWrap(token.value, {
        newLine: formatter.newLine,
        indent: formatter.indentation.getSpaces(),
        width: 70,
      })
    }

    const styles = formatter.styles.string
    return `<span class="dumper-string" style="${styles}">` + `${value}` + '</span>'
  },

  'boolean': (token, formatter) => {
    const styles = formatter.styles.boolean
    return `<span class="dumper-boolean" style="${styles}">` + token.value + '</span>'
  },

  'number': (token, formatter) => {
    const styles = formatter.styles.number
    return `<span class="dumper-number" style="${styles}">` + token.value + '</span>'
  },

  'bigInt': (token, formatter) => {
    const styles = formatter.styles.bigInt
    return `<span class="dumper-big-int" style="${styles}">` + token.value + '</span>'
  },

  'undefined': (_, formatter) => {
    const styles = formatter.styles.undefined
    return `<span class="dumper-undefined" style="${styles}">` + 'undefined' + '</span>'
  },

  'null': (_, formatter) => {
    const styles = formatter.styles.null
    return `<span class="dumper-null" style="${styles}">` + 'null' + '</span>'
  },

  'symbol': (token, formatter) => {
    const styles = formatter.styles.symbol
    return `<span class="dumper-symbol" style="${styles}">` + token.value + '</span>'
  },

  'function': (token, formatter) => {
    const className = token.isClass ? 'dumper-class' : 'dumper-function'
    const styles = token.isClass ? formatter.styles.classLabel : formatter.styles.functionLabel

    const async = token.isAsync ? `async ` : ''
    const generator = token.isGenerator ? `*` : ''
    const label = token.isClass
      ? `[class ${token.name}]`
      : `[${async}${generator}function ${token.name}]`

    return `<span class="${className}" style="${styles}">` + label + '</span>'
  },

  'date': function (token, formatter): string {
    const styles = formatter.styles.date
    return `<span class="dumper-date" style="${styles}">` + token.value + '</span>'
  },

  'buffer': function (token, formatter): string {
    const styles = formatter.styles.buffer
    return `<span class="dumper-buffer" style="${styles}">` + htmlEscape(token.value) + '</span>'
  },

  'regexp': function (token, formatter): string {
    const styles = formatter.styles.regex
    return `<span class="dumper-regex" style="${styles}">` + token.value + '</span>'
  },

  'unknown': function (token, formatter): string {
    const styles = formatter.styles.unknownLabel
    return `<span class="dumper-value-unknown" style="${styles}">` + String(token.value) + '</span>'
  },

  'weak-set': function (_, formatter): string {
    const styles = formatter.styles.weakSetLabel
    return `<span class="dumper-weak-set" style="${styles}">` + `[WeakSet]` + '</span>'
  },

  'weak-ref': function (_, formatter): string {
    const styles = formatter.styles.weakRefLabel
    return `<span class="dumper-weak-ref" style="${styles}">` + `[WeakRef]` + '</span>'
  },

  'weak-map': function (_, formatter): string {
    const styles = formatter.styles.weakMapLabel
    return `<span class="dumper-weak-map" style="${styles}">` + `[WeakMap]` + '</span>'
  },

  'observable': function (_, formatter): string {
    const styles = formatter.styles.observableLabel
    return `<span class="dumper-observable" style="${styles}">` + `[Observable]` + '</span>'
  },

  'blob': function (token: { size: number; contentType: string }, formatter): string {
    const styles = formatter.styles.objectLabel
    const propertiesStart = `<span styles="${formatter.styles.objectKey}">{ `
    const propertiesEnd = `<span styles="${formatter.styles.objectKey}"> }</span></span>`

    const sizeProp = `<span styles="${formatter.styles.objectKey}">size: </span>`
    const sizeValue = `<span styles="${formatter.styles.number}">${token.size},</span>`

    const typeProp = `<span styles="${formatter.styles.objectKey}">type: </span>`
    const typeValue = `<span styles="${formatter.styles.string}">${token.contentType}</span>`

    return (
      `<span class="dumper-blob" style="${styles}">` +
      '[Blob]' +
      propertiesStart +
      `${sizeProp}${sizeValue} ${typeProp}${typeValue}` +
      propertiesEnd +
      '</span>'
    )
  },

  'promise': function (token: { isFulfilled: boolean }, formatter): string {
    const styles = formatter.styles.promiseLabel
    const label = token.isFulfilled ? 'resolved' : 'pending'
    return `<span class="dumper-promise" style="${styles}">` + `[Promise<${label}>]` + '</span>'
  },

  'generator': function (token: { isAsync: boolean }, formatter): string {
    const styles = formatter.styles.generatorLabel
    const label = token.isAsync ? '[AsyncGenerator] {}' : '[Generator] {}'
    return `<span class="dumper-generator" style="${styles}">` + label + '</span>'
  },

  'static-members-start': function (_, formatter): string {
    formatter.context.isStaticMember = true
    return ''
  },

  'static-members-end': function (_, formatter): string {
    formatter.context.isStaticMember = false
    return ''
  },
}
