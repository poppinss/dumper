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

  test('tokenize custom collections extending arrays', ({ expect }) => {
    const parser = new Parser({ inspectArrayPrototype: true })

    class Collection<T> extends Array<T> {
      items: T[] = []
      constructor(...items: T[]) {
        super(...items)
        this.items = items
      }

      first() {
        this.items[0]
      }

      last() {
        this.items[this.items.length - 1]
      }
    }

    const collection = new Collection(1, 2, 3)
    parser.parse(collection)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "name": "Collection",
          "size": 3,
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
          "type": "prototype-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "first",
        },
        {
          "type": "object-value-start",
        },
        {
          "isAsync": false,
          "isClass": false,
          "isGenerator": false,
          "name": "first",
          "type": "function",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "last",
        },
        {
          "type": "object-value-start",
        },
        {
          "isAsync": false,
          "isClass": false,
          "isGenerator": false,
          "name": "last",
          "type": "function",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "prototype-end",
        },
        {
          "size": 3,
          "type": "array-end",
        },
      ]
    `)
  })

  test('collapse values by their constructor name', ({ expect }) => {
    const parser = new Parser({
      collapse: ['Collection'],
    })
    class Collection extends Array {}

    parser.parse({
      users: new Collection(),
    })

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "Object",
          "type": "object-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "users",
        },
        {
          "type": "object-value-start",
        },
        {
          "name": "Collection",
          "token": {
            "name": "Collection",
            "size": 0,
            "type": "array-start",
          },
          "type": "collapse",
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
