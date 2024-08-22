/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Observable } from 'rxjs'
import { test } from '@japa/runner'
import { createReadStream } from 'node:fs'
import { Parser } from '../../src/parser.js'

test.group('Parser', () => {
  test('tokenize observable', ({ expect }) => {
    const parser = new Parser()
    const observable = new Observable((subscriber) => {
      subscriber.next(1)
      subscriber.next(2)
      subscriber.next(3)
      setTimeout(() => {
        subscriber.next(4)
        subscriber.complete()
      }, 1000)
    })

    parser.parse(observable)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "type": "observable",
        },
      ]
    `)
  })

  test('tokenize blob', ({ expect }) => {
    const parser = new Parser()
    const blob = new Blob(['hello there'], {
      type: 'text/plain',
    })

    parser.parse(blob)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "contentType": "text/plain",
          "size": 11,
          "type": "blob",
        },
      ]
    `)
  })

  test('tokenize promise', ({ expect }) => {
    const parser = new Parser()
    const promise = new Promise((resolve) => {
      resolve({
        id: 1,
        name: 'foo',
        email: 'foo@bar.com',
        created_at: new Date('2024-10-20'),
      })
    })

    parser.parse(promise)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "isFulfilled": true,
          "type": "promise",
        },
      ]
    `)
  })

  test('tokenize form data', ({ expect }) => {
    const parser = new Parser()
    const fd = new FormData()
    fd.set('name', 'foo')
    fd.set('avatar', createReadStream(new URL('../../package.json', import.meta.url)))

    parser.parse(fd)

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "constructorName": "FormData",
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
          "value": "avatar",
        },
        {
          "type": "object-value-start",
        },
        {
          "type": "string",
          "value": "'[object Object]'",
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

  test('tokenize NaN', ({ expect }) => {
    const parser = new Parser()
    parser.parse(Number('foo'))

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "type": "number",
          "value": NaN,
        },
      ]
    `)
  })

  test('tokenize WeakRef', ({ expect }) => {
    const parser = new Parser()
    parser.parse(new WeakRef({ id: 1 }))

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "type": "weak-ref",
        },
      ]
    `)
  })

  test('tokenize generators', ({ expect }) => {
    const parser = new Parser()
    const fixture = (function* () {
      yield 4
    })()

    parser.parse(fixture)
    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "isAsync": false,
          "type": "generator",
        },
      ]
    `)
  })

  test('tokenize async generators', ({ expect }) => {
    const parser = new Parser()
    const fixture = (async function* () {
      yield 4
    })()

    parser.parse(fixture)
    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "isAsync": true,
          "type": "generator",
        },
      ]
    `)
  })
})
