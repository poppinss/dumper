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

test.group('Parser | Function', () => {
  test('tokenize functions', ({ expect }) => {
    const parser = new Parser()
    class User {}

    parser.parse({
      fn: () => {},
      fnWithArgs: function (_id: number, _name: string) {},
      user: User,
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
          "value": "fn",
        },
        {
          "type": "object-value-start",
        },
        {
          "isAsync": false,
          "isClass": false,
          "isGenerator": false,
          "name": "fn",
          "type": "function",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "fnWithArgs",
        },
        {
          "type": "object-value-start",
        },
        {
          "isAsync": false,
          "isClass": false,
          "isGenerator": false,
          "name": "fnWithArgs",
          "type": "function",
        },
        {
          "type": "object-value-end",
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
          "isAsync": false,
          "isClass": true,
          "isGenerator": false,
          "name": "User",
          "type": "function",
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

  test('show class static members', ({ expect }) => {
    const parser = new Parser({ inspectStaticMembers: true })
    class User {
      static booted = false
      static create() {
        return new this()
      }
    }

    parser.parse(User)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "isAsync": false,
          "isClass": true,
          "isGenerator": false,
          "name": "User",
          "type": "function",
        },
        {
          "type": "static-members-start",
        },
        {
          "constructorName": "Function",
          "type": "object-start",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "create",
        },
        {
          "type": "object-value-start",
        },
        {
          "isAsync": false,
          "isClass": false,
          "isGenerator": false,
          "name": "create",
          "type": "function",
        },
        {
          "type": "object-value-end",
        },
        {
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "booted",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "boolean",
          "value": false,
        },
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
        {
          "type": "static-members-end",
        },
      ]
    `)
  })

  test('tokenize async function', ({ expect }) => {
    const parser = new Parser()
    async function generator() {}
    parser.parse(generator)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "isAsync": true,
          "isClass": false,
          "isGenerator": false,
          "name": "generator",
          "type": "function",
        },
      ]
    `)
  })

  test('tokenize generator function', ({ expect }) => {
    const parser = new Parser()
    function* generator(i: number) {
      yield i
      yield i + 10
    }

    parser.parse(generator)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "isAsync": false,
          "isClass": false,
          "isGenerator": true,
          "name": "generator",
          "type": "function",
        },
      ]
    `)
  })

  test('tokenize async generator function', ({ expect }) => {
    const parser = new Parser()
    async function* generator(i: number) {
      yield i
      yield i + 10
    }

    parser.parse(generator)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "isAsync": true,
          "isClass": false,
          "isGenerator": true,
          "name": "generator",
          "type": "function",
        },
      ]
    `)
  })
})
