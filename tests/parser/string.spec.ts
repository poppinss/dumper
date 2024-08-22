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

test.group('Parser | String', () => {
  test('tokenize string', ({ expect }) => {
    const parser = new Parser()
    parser.parse('Hello world')

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "type": "string",
          "value": "'Hello world'",
        },
      ]
    `)
  })

  test('tokenize string with double quotes inside it', ({ expect }) => {
    const parser = new Parser()
    parser.parse('Hello"world')

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "type": "string",
          "value": "'Hello\\"world'",
        },
      ]
    `)
  })

  test('tokenize string with single and double quotes inside it', ({ expect }) => {
    const parser = new Parser()
    parser.parse('Hello"wor\'ld')

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "type": "string",
          "value": "\`Hello\\"wor'ld\`",
        },
      ]
    `)
  })

  test('tokenize string with single and double quotes and backticks inside it', ({ expect }) => {
    const parser = new Parser()
    parser.parse('H`ello"wor\'ld')

    expect(parser.flush()).toMatchInlineSnapshot(`
      [
        {
          "type": "string",
          "value": "'H\`ello\\"wor\\\\'ld'",
        },
      ]
    `)
  })
})
