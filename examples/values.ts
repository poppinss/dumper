/*
 * @poppinss/dumper
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fooSymbol = Symbol.for('foo')

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

const holes = ['a', 'b']
holes[4] = 'e'
holes[6] = 'g'

const hooks: Set<(() => void) | { name: string; fn: () => void }> = new Set()
hooks.add(() => {})
hooks.add({ name: 'afterCreate', fn: async () => {} })
hooks.add({ name: 'beforeCreate', fn: async () => {} })

const middleware: Map<{ name: string; type: string }, { fn: Function }> = new Map()
middleware.set({ name: 'auth', type: 'global' }, { fn: () => {} })
middleware.set({ name: 'bouncer', type: 'router' }, { fn: () => {} })
middleware.set({ name: 'assets', type: 'server' }, { fn: () => {} })

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

export const obj = {
  'a': 1,
  'team': 'owners',
  'b': [3, 4, undefined, null, 'and a string', { id: 1, isAdmin: false }],
  'bio': `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  'c': undefined,
  'd': null,
  'user': new User(),
  'User': User,
  'error': new Error('Something went wrong'),
  'url': new URL('./index.js?username=virk', 'https://unpkg.com'),
  'e': {
    regex: /^x/i,
    buf: Buffer.from('abc'),
    holes: holes,
  },
  collection,
  hooks,
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
