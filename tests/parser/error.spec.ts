/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exception, getFilename } from '@poppinss/utils'
import { Parser } from '../../src/parser.js'

const FILE_PATH = getFilename(import.meta.url)

test.group('Parser | Error', () => {
  test('tokenize error', ({ expect }) => {
    const parser = new Parser({ maxStringLength: 150 })
    const error = new Error('Something went wrong')

    parser.parse(error)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "Error",
          "type": "object-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "stack",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Error: Something went wrong\\\\n' +
        '    at Object.executor (${FILE_PATH}:19:19)\\\\n' +
        '    at TestRunner.#runTest (/Us'... 948 more characters",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "message",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Something went wrong'",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
      ]
    `)
  })

  test('tokenize poppinss error', ({ expect }) => {
    const parser = new Parser({ maxStringLength: 150 })
    const error = new Exception('Something went wrong', {
      code: 'E_SOMETHING_WENT_WRONG',
      status: 400,
    })

    parser.parse(error)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "Exception",
          "type": "object-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "stack",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Exception: Something went wrong\\\\n' +
        '    at Object.executor (${FILE_PATH}:72:19)\\\\n' +
        '    at TestRunner.#runTest '... 952 more characters",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "message",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Something went wrong'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "name",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Exception'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "status",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "number",
          "value": 400,
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "code",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'E_SOMETHING_WENT_WRONG'",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
      ]
    `)
  })

  test('tokenize error with cause', ({ expect }) => {
    const parser = new Parser({ maxStringLength: 150 })
    const fatal = new Error('Fatal error')
    const error = new Exception('Something went wrong', {
      code: 'E_SOMETHING_WENT_WRONG',
      status: 400,
      cause: fatal,
    })

    parser.parse(error)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "Exception",
          "type": "object-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "stack",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Exception: Something went wrong\\\\n' +
        '    at Object.executor (${FILE_PATH}:177:19)\\\\n' +
        '    at TestRunner.#runTest'... 953 more characters",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "message",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Something went wrong'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "cause",
        },
        {
          "type": "object-value-start",
        },
        {
          "constructorName": "Error",
          "type": "object-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "stack",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Error: Fatal error\\\\n' +
        '    at Object.executor (${FILE_PATH}:176:19)\\\\n' +
        '    at TestRunner.#runTest (/Users/virk'... 940 more characters",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "message",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Fatal error'",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "name",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Exception'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "status",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "number",
          "value": 400,
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "code",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'E_SOMETHING_WENT_WRONG'",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
      ]
    `)
  })

  test('detect circular dependencies with cause', ({ expect }) => {
    const parser = new Parser({ maxStringLength: 150 })
    const error = new Exception('Something went wrong', {
      code: 'E_SOMETHING_WENT_WRONG',
      status: 400,
    })
    error.cause = error

    parser.parse(error)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "Exception",
          "type": "object-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "stack",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Exception: Something went wrong\\\\n' +
        '    at Object.executor (${FILE_PATH}:335:19)\\\\n' +
        '    at TestRunner.#runTest'... 953 more characters",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "message",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Something went wrong'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "name",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'Exception'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "status",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "number",
          "value": 400,
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "code",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'E_SOMETHING_WENT_WRONG'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "cause",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "object-circular-ref",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
      ]
    `)
  })
})
