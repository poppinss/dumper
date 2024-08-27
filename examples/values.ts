/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fooSymbol = Symbol.for('foo')
const blob = new Blob(['hello'])

class User {
  constructor() {
    Object.defineProperty(this, 'bar', {
      get() {
        return 'bar'
      },
      enumerable: true,
    })
  }

  #attributes = {
    username: 'virk',
  }

  get [fooSymbol]() {
    return 'hello'
  }

  get username() {
    return this.#attributes.username
  }

  static booted = false
  static boot() {
    this.booted = true
  }
}

const holes: any[] = ['a', 'b']
holes[4] = 'e'
holes[6] = 'g'
holes[7] = holes

const hooks: Set<(() => void) | { name: string; fn: (() => void) | Set<any> }> = new Set()
hooks.add(() => {})
hooks.add({ name: 'afterCreate', fn: async () => {} })
hooks.add({ name: 'beforeCreate', fn: async () => {} })
hooks.add({ name: 'self', fn: hooks })

const middleware: Map<{ name: string; type: string }, { fn: Function } | Map<any, any>> = new Map()
middleware.set({ name: 'auth', type: 'global' }, { fn: () => {} })
middleware.set({ name: 'bouncer', type: 'router' }, { fn: () => {} })
middleware.set({ name: 'assets', type: 'server' }, { fn: () => {} })
middleware.set({ name: 'self', type: 'reference' }, middleware)

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

class Model {
  constructor() {
    return new Proxy(this, {
      get() {},
    })
  }
}

const collection = new Collection(new User())
const e = {
  regex: /^x/i,
  buf: Buffer.from('abc'),
  holes: holes,
  circular: {},
}
e.circular = e

export const obj = {
  'a': 1,
  'team': 'owners',
  'b': [3, 4, undefined, null, 'and a string', { id: 1, isAdmin: false }],
  'bio': `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  'c': undefined,
  'd': null,
  blob,
  'user': new User(),
  'User': User,
  'error': new Error('Something went wrong'),
  'url': new URL('./index.js?username=virk', 'https://unpkg.com'),
  'e': e,
  collection,
  hooks,
  'promise': new Promise((resolve) => resolve('foo')),
  'model': new Model(),
  'balance': BigInt(100),
  'id': Symbol('1234'),
  'sc<o>res': new Set([1, 2, 3]),
  'classes': new Map([
    ['<english>', '1st'],
    ['<maths>', '2nd'],
  ]),
  middleware,
  'currentScores': new WeakSet([[1, 2, 3]]),
  'currentClasses': new WeakMap([
    [
      ['english', '1st'],
      ['maths', '2nd'],
    ],
  ]),
  'now': new Date(),
}
