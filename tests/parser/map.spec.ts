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

test.group('Parser | Map', () => {
  test('tokenize maps', ({ expect }) => {
    const parser = new Parser()

    parser.parse(
      new Map([
        ['maths', 10],
        ['english', 9],
      ])
    )

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 2,
          "type": "map-start",
        },
        {
          "index": 0,
          "type": "map-row-start",
        },
        {
          "index": 0,
          "type": "map-key-start",
        },
        {
          "type": "string",
          "value": "'maths'",
        },
        {
          "index": 0,
          "type": "map-key-end",
        },
        {
          "index": 0,
          "type": "map-value-start",
        },
        {
          "type": "number",
          "value": 10,
        },
        {
          "index": 0,
          "type": "map-value-end",
        },
        {
          "index": 0,
          "type": "map-row-end",
        },
        {
          "index": 1,
          "type": "map-row-start",
        },
        {
          "index": 1,
          "type": "map-key-start",
        },
        {
          "type": "string",
          "value": "'english'",
        },
        {
          "index": 1,
          "type": "map-key-end",
        },
        {
          "index": 1,
          "type": "map-value-start",
        },
        {
          "type": "number",
          "value": 9,
        },
        {
          "index": 1,
          "type": "map-value-end",
        },
        {
          "index": 1,
          "type": "map-row-end",
        },
        {
          "size": 2,
          "type": "map-end",
        },
      ]
    `)
  })

  test('tokenize maps with complex keys', ({ expect }) => {
    const parser = new Parser()

    parser.parse(
      new Map<any, any>([
        [Symbol('maths'), 10],
        [{ subject: 'english' }, 9],
      ])
    )

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 2,
          "type": "map-start",
        },
        {
          "index": 0,
          "type": "map-row-start",
        },
        {
          "index": 0,
          "type": "map-key-start",
        },
        {
          "type": "symbol",
          "value": "Symbol(maths)",
        },
        {
          "index": 0,
          "type": "map-key-end",
        },
        {
          "index": 0,
          "type": "map-value-start",
        },
        {
          "type": "number",
          "value": 10,
        },
        {
          "index": 0,
          "type": "map-value-end",
        },
        {
          "index": 0,
          "type": "map-row-end",
        },
        {
          "index": 1,
          "type": "map-row-start",
        },
        {
          "index": 1,
          "type": "map-key-start",
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
          "value": "subject",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'english'",
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "index": 1,
          "type": "map-key-end",
        },
        {
          "index": 1,
          "type": "map-value-start",
        },
        {
          "type": "number",
          "value": 9,
        },
        {
          "index": 1,
          "type": "map-value-end",
        },
        {
          "index": 1,
          "type": "map-row-end",
        },
        {
          "size": 2,
          "type": "map-end",
        },
      ]
    `)
  })

  test('tokenize maps with circular dependencies', ({ expect }) => {
    const parser = new Parser()
    const scores = new Map()
    scores.set('scores', scores)

    parser.parse(scores)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 1,
          "type": "map-start",
        },
        {
          "index": 0,
          "type": "map-row-start",
        },
        {
          "index": 0,
          "type": "map-key-start",
        },
        {
          "type": "string",
          "value": "'scores'",
        },
        {
          "index": 0,
          "type": "map-key-end",
        },
        {
          "index": 0,
          "type": "map-value-start",
        },
        {
          "type": "map-circular-ref",
        },
        {
          "index": 0,
          "type": "map-value-end",
        },
        {
          "index": 0,
          "type": "map-row-end",
        },
        {
          "size": 1,
          "type": "map-end",
        },
      ]
    `)
  })

  test('limit map parsing at max-depth', ({ expect }) => {
    const parser = new Parser({ depth: 2 })
    const scores = new Map()
    scores.set('english', 10)
    scores.set('maths', 11)

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
          "isOwnKey": true,
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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "scores",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "map-max-depth-ref",
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

  test('limit map parsing at max-array-length', ({ expect }) => {
    const parser = new Parser({ maxArrayLength: 2 })
    const scores = new Map()
    scores.set('english', 10)
    scores.set('maths', 11)
    scores.set('science', 20)

    parser.parse(scores)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "size": 3,
          "type": "map-start",
        },
        {
          "index": 0,
          "type": "map-row-start",
        },
        {
          "index": 0,
          "type": "map-key-start",
        },
        {
          "type": "string",
          "value": "'english'",
        },
        {
          "index": 0,
          "type": "map-key-end",
        },
        {
          "index": 0,
          "type": "map-value-start",
        },
        {
          "type": "number",
          "value": 10,
        },
        {
          "index": 0,
          "type": "map-value-end",
        },
        {
          "index": 0,
          "type": "map-row-end",
        },
        {
          "index": 1,
          "type": "map-row-start",
        },
        {
          "index": 1,
          "type": "map-key-start",
        },
        {
          "type": "string",
          "value": "'maths'",
        },
        {
          "index": 1,
          "type": "map-key-end",
        },
        {
          "index": 1,
          "type": "map-value-start",
        },
        {
          "type": "number",
          "value": 11,
        },
        {
          "index": 1,
          "type": "map-value-end",
        },
        {
          "index": 1,
          "type": "map-row-end",
        },
        {
          "limit": 2,
          "size": 3,
          "type": "map-max-length-ref",
        },
        {
          "size": 3,
          "type": "map-end",
        },
      ]
    `)
  })
})
