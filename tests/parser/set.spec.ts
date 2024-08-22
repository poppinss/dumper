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

test.group('Parser | Set', () => {
  test('tokenize sets', ({ expect }) => {
    const parser = new Parser()

    parser.parse(new Set([0, 1, 4, 10]))

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 4,
          "type": "set-start",
        },
        {
          "index": 0,
          "type": "set-value-start",
        },
        {
          "type": "number",
          "value": 0,
        },
        {
          "index": 0,
          "type": "set-value-end",
        },
        {
          "index": 1,
          "type": "set-value-start",
        },
        {
          "type": "number",
          "value": 1,
        },
        {
          "index": 1,
          "type": "set-value-end",
        },
        {
          "index": 2,
          "type": "set-value-start",
        },
        {
          "type": "number",
          "value": 4,
        },
        {
          "index": 2,
          "type": "set-value-end",
        },
        {
          "index": 3,
          "type": "set-value-start",
        },
        {
          "type": "number",
          "value": 10,
        },
        {
          "index": 3,
          "type": "set-value-end",
        },
        {
          "size": 4,
          "type": "set-end",
        },
      ]
    `)
  })

  test('tokenize sets with complex values', ({ expect }) => {
    const parser = new Parser()

    parser.parse(new Set([{ id: 1 }, { id: 2 }, { id: 10, isAdmin: true }]))

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 3,
          "type": "set-start",
        },
        {
          "index": 0,
          "type": "set-value-start",
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
          "type": "set-value-end",
        },
        {
          "index": 1,
          "type": "set-value-start",
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
          "type": "set-value-end",
        },
        {
          "index": 2,
          "type": "set-value-start",
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
          "value": 10,
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "isAdmin",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "boolean",
          "value": true,
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "index": 2,
          "type": "set-value-end",
        },
        {
          "size": 3,
          "type": "set-end",
        },
      ]
    `)
  })

  test('tokenize sets with ciricular dependencies', ({ expect }) => {
    const parser = new Parser()

    const scores: Set<any> = new Set()
    scores.add(scores)
    parser.parse(scores)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 1,
          "type": "set-start",
        },
        {
          "index": 0,
          "type": "set-value-start",
        },
        {
          "type": "set-circular-ref",
        },
        {
          "index": 0,
          "type": "set-value-end",
        },
        {
          "size": 1,
          "type": "set-end",
        },
      ]
    `)
  })

  test('limit set parsing at max-depth', ({ expect }) => {
    const parser = new Parser({ depth: 2 })
    const scores = new Set([0, 1, 4, 10])

    parser.parse({
      user: {
        scores,
      },
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
          "value": "user",
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
          "value": "scores",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "set-max-depth-ref",
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
      ]
    `)
  })

  test('limit set parsing at max-array-length', ({ expect }) => {
    const parser = new Parser({ maxArrayLength: 3 })
    const scores = new Set([0, 1, 4, 10])

    parser.parse(scores)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 4,
          "type": "set-start",
        },
        {
          "index": 0,
          "type": "set-value-start",
        },
        {
          "type": "number",
          "value": 0,
        },
        {
          "index": 0,
          "type": "set-value-end",
        },
        {
          "index": 1,
          "type": "set-value-start",
        },
        {
          "type": "number",
          "value": 1,
        },
        {
          "index": 1,
          "type": "set-value-end",
        },
        {
          "index": 2,
          "type": "set-value-start",
        },
        {
          "type": "number",
          "value": 4,
        },
        {
          "index": 2,
          "type": "set-value-end",
        },
        {
          "limit": 3,
          "size": 4,
          "type": "set-max-length-ref",
        },
        {
          "size": 4,
          "type": "set-end",
        },
      ]
    `)
  })
})
