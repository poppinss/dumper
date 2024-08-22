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

test.group('Parser | Object', () => {
  test('tokenize object with basic values', ({ expect }) => {
    const parser = new Parser()
    const date = new Date('2024-10-20')
    const adminWorkspace = Symbol.for('admin')

    parser.parse({
      id: BigInt(1),
      username: 'foo',
      age: 19,
      isAdmin: true,
      createdAt: date,
      updatedAt: null,
      regex: /[A-Z]+/g,
      deletedAt: null,
      auditedAt: undefined,
      [adminWorkspace]: adminWorkspace,
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
          "value": "id",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "bigInt",
          "value": "1n",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "username",
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
          "value": "age",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "number",
          "value": 19,
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "createdAt",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "date",
          "value": "2024-10-20T00:00:00.000Z",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "updatedAt",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "null",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "regex",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "regexp",
          "value": "/[A-Z]+/g",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "deletedAt",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "null",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "auditedAt",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "undefined",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": true,
          "isWritable": true,
          "type": "object-key",
          "value": "Symbol(admin)",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "symbol",
          "value": "Symbol(admin)",
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

  test('limit objects on max-depth', ({ expect }) => {
    const parser = new Parser({ depth: 3 })

    parser.parse({
      user: {
        id: 1,
        profile: {
          profile_id: 1,
          social: {
            handle: '@foo',
          },
        },
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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "profile",
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
          "value": "profile_id",
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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "social",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "object-max-depth-ref",
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
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
      ]
    `)
  })

  test('do not display object non-enumerable properties', ({ expect }) => {
    const parser = new Parser()
    const obj = {
      id: 1,
    }
    Object.defineProperty(obj, 'name', {
      value: 'virk',
      enumerable: false,
    })

    parser.parse(obj)
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
      ]
    `)
  })

  test('display object non-enumerable properties when showHidden is true', ({ expect }) => {
    const parser = new Parser({ showHidden: true })
    const obj = {
      id: 1,
    }
    Object.defineProperty(obj, 'name', {
      value: 'virk',
      enumerable: false,
    })

    parser.parse(obj)
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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": false,
          "type": "object-key",
          "value": "name",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'virk'",
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

  test('do not compute getters', ({ expect }) => {
    const parser = new Parser()
    const obj = {
      id: 1,
    }
    Object.defineProperty(obj, 'name', {
      get() {
        throw new Error('Should not be called')
      },
      enumerable: true,
    })

    parser.parse(obj)
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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": false,
          "type": "object-key",
          "value": "name",
        },
        {
          "type": "object-value-getter",
        },
        {
          "type": "object-end",
        },
      ]
    `)
  })

  test('parse objects with circular dependency', ({ expect }) => {
    const parser = new Parser()
    const user = {
      id: 1,
      profile: {
        name: 'foo',
        user: {},
      },
    }

    user.profile.user = user
    parser.parse(user)

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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "profile",
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
          "value": "user",
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
        {
          "type": "object-value-end",
        },
        {
          "type": "object-end",
        },
      ]
    `)
  })

  test('parse class instances', ({ expect }) => {
    const parser = new Parser()
    class User {
      id: number = 1
      name: string = 'virk'
    }

    const user = new User()
    parser.parse(user)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "User",
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
          "value": "'virk'",
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

  test('ignore prototype members even with showHidden', ({ expect }) => {
    const parser = new Parser({ showHidden: true })
    class User {
      id = 1
      name = 'virk'
      get username() {
        return 'virk'
      }
    }

    const user = new User()
    parser.parse(user)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "User",
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
          "value": "'virk'",
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

  test('parse prototype members using inspectObjectPrototype', ({ expect }) => {
    const parser = new Parser({
      inspectObjectPrototype: true,
    })
    class User {
      id = 1
      name = 'virk'
      get username() {
        return 'virk'
      }
      foo() {
        return 'a'
      }
    }

    const user = new User()
    parser.parse(user)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "User",
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
          "value": "'virk'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": false,
          "isSymbol": false,
          "isWritable": false,
          "type": "object-key",
          "value": "username",
        },
        {
          "type": "object-value-getter",
        },
        {
          "isOwnKey": false,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "foo",
        },
        {
          "type": "object-value-start",
        },
        {
          "isAsync": false,
          "isClass": false,
          "isGenerator": false,
          "name": "foo",
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

  test('tokenize URL instance', ({ expect }) => {
    const parser = new Parser()
    parser.parse(new URL('foo', 'https://bar.com'))

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "URL",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "hash",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "host",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'bar.com'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "hostname",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'bar.com'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "href",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'https://bar.com/foo'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "origin",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'https://bar.com'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "password",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "pathname",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'/foo'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "port",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "protocol",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'https:'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "search",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "searchParams",
        },
        {
          "type": "object-value-start",
        },
        {
          "constructorName": "URLSearchParams",
          "type": "object-start",
        },
        {
          "type": "object-end",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "username",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
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

  test('tokenize URL instance with search params', ({ expect }) => {
    const parser = new Parser()
    parser.parse(new URL('foo?fields=username', 'https://bar.com'))

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "URL",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "hash",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "host",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'bar.com'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "hostname",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'bar.com'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "href",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'https://bar.com/foo?fields=username'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "origin",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'https://bar.com'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "password",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "pathname",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'/foo'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "port",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "protocol",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'https:'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "search",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'?fields=username'",
        },
        {
          "type": "object-value-end",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "searchParams",
        },
        {
          "type": "object-value-start",
        },
        {
          "constructorName": "URLSearchParams",
          "type": "object-start",
        },
        {
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "fields",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'username'",
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
          "isOwnKey": true,
          "isSymbol": false,
          "isWritable": true,
          "type": "object-key",
          "value": "username",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "''",
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
