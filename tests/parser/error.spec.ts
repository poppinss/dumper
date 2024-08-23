/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exception } from '@poppinss/utils'

import { Parser } from '../../src/parser.js'

test.group('Parser | Error', () => {
  test('tokenize error', ({ expect }) => {
    const parser = new Parser({ maxStringLength: 150 })
    const error = new Error('Something went wrong')

    parser.parse(error)
    const tokens = parser.flush()
    const errorStack = tokens.splice(3, 1)

    expect(errorStack).toEqual([
      {
        type: 'string',
        value: expect.any(String),
      },
    ])

    expect(tokens).toMatchInlineSnapshot(`
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
    const tokens = parser.flush()
    const errorStack = tokens.splice(3, 1)

    expect(errorStack).toEqual([
      {
        type: 'string',
        value: expect.any(String),
      },
    ])

    expect(tokens).toMatchInlineSnapshot(`
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
    const tokens = parser.flush()
    const errorStack = tokens.splice(3, 1)
    const causeStack = tokens.splice(13, 1)

    expect(errorStack).toEqual([
      {
        type: 'string',
        value: expect.any(String),
      },
    ])
    expect(causeStack).toEqual([
      {
        type: 'string',
        value: expect.any(String),
      },
    ])

    expect(tokens).toMatchInlineSnapshot(`
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
    const tokens = parser.flush()
    const errorStack = tokens.splice(3, 1)

    expect(errorStack).toEqual([
      {
        type: 'string',
        value: expect.any(String),
      },
    ])

    expect(tokens).toMatchInlineSnapshot(`
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
