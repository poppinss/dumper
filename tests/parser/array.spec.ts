/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Parser } from '../../src/parser.js'

test.group('Parser | Array', () => {
  test('tokenize arrays', ({ expect }) => {
    const parser = new Parser()

    parser.parse([0, 1])

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "name": "Array",
          "size": 2,
          "type": "array-start",
        },
        {
          "index": 0,
          "type": "array-value-start",
        },
        {
          "type": "number",
          "value": 0,
        },
        {
          "index": 0,
          "type": "array-value-end",
        },
        {
          "index": 1,
          "type": "array-value-start",
        },
        {
          "type": "number",
          "value": 1,
        },
        {
          "index": 1,
          "type": "array-value-end",
        },
        {
          "size": 2,
          "type": "array-end",
        },
      ]
    `)
  })

  test('tokenize array with mixed values', ({ expect }) => {
    const parser = new Parser()

    parser.parse([{ id: 1 }, { id: 2 }, 3, 4, { email: 'foo@bar.com' }])

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "name": "Array",
          "size": 5,
          "type": "array-start",
        },
        {
          "index": 0,
          "type": "array-value-start",
        },
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "id",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "number",
          "value": 1,
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "index": 0,
          "type": "array-value-end",
        },
        {
          "index": 1,
          "type": "array-value-start",
        },
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "id",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "number",
          "value": 2,
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "index": 1,
          "type": "array-value-end",
        },
        {
          "index": 2,
          "type": "array-value-start",
        },
        {
          "type": "number",
          "value": 3,
        },
        {
          "index": 2,
          "type": "array-value-end",
        },
        {
          "index": 3,
          "type": "array-value-start",
        },
        {
          "type": "number",
          "value": 4,
        },
        {
          "index": 3,
          "type": "array-value-end",
        },
        {
          "index": 4,
          "type": "array-value-start",
        },
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "email",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'foo@bar.com'",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "index": 4,
          "type": "array-value-end",
        },
        {
          "size": 5,
          "type": "array-end",
        },
      ]
    `)
  })

  test('parse arrays with circular dependency', ({ expect }) => {
    const parser = new Parser()
    const users: any[] = []
    users.push(users)

    parser.parse(users)
    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "name": "Array",
          "size": 1,
          "type": "array-start",
        },
        {
          "index": 0,
          "type": "array-value-start",
        },
        {
          "type": "array-circular-ref",
        },
        {
          "index": 0,
          "type": "array-value-end",
        },
        {
          "size": 1,
          "type": "array-end",
        },
      ]
    `)
  })

  test('parse arrays with nested circular dependency', ({ expect }) => {
    const parser = new Parser()
    const users: any[] = []
    users.push({
      team: {
        name: 'foo',
        users: users,
      },
    })

    parser.parse(users)
    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "name": "Array",
          "size": 1,
          "type": "array-start",
        },
        {
          "index": 0,
          "type": "array-value-start",
        },
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "team",
        },
        {
          "type": "object-value-start",
        },
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
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
          "value": "'foo'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "users",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "array-circular-ref",
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
          "type": "object-end",
        },
        {
          "index": 0,
          "type": "array-value-end",
        },
        {
          "size": 1,
          "type": "array-end",
        },
      ]
    `)
  })

  test('limit array parsing at max-depth', ({ expect }) => {
    const parser = new Parser({ depth: 2 })

    parser.parse([
      { id: 1 },
      {
        team: [
          {
            name: 'foo',
          },
        ],
      },
    ])

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "name": "Array",
          "size": 2,
          "type": "array-start",
        },
        {
          "index": 0,
          "type": "array-value-start",
        },
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "id",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "number",
          "value": 1,
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "index": 0,
          "type": "array-value-end",
        },
        {
          "index": 1,
          "type": "array-value-start",
        },
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "team",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "array-max-depth-ref",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "index": 1,
          "type": "array-value-end",
        },
        {
          "size": 2,
          "type": "array-end",
        },
      ]
    `)
  })

  test('limit array parsing at max-length', ({ expect }) => {
    const parser = new Parser({ maxArrayLength: 3 })

    parser.parse([1, 2, 3, 4])

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "name": "Array",
          "size": 4,
          "type": "array-start",
        },
        {
          "index": 0,
          "type": "array-value-start",
        },
        {
          "type": "number",
          "value": 1,
        },
        {
          "index": 0,
          "type": "array-value-end",
        },
        {
          "index": 1,
          "type": "array-value-start",
        },
        {
          "type": "number",
          "value": 2,
        },
        {
          "index": 1,
          "type": "array-value-end",
        },
        {
          "index": 2,
          "type": "array-value-start",
        },
        {
          "type": "number",
          "value": 3,
        },
        {
          "index": 2,
          "type": "array-value-end",
        },
        {
          "limit": 3,
          "size": 4,
          "type": "array-max-length-ref",
        },
        {
          "size": 4,
          "type": "array-end",
        },
      ]
    `)
  })
})
