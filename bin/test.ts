import { configure, processCLIArgs, run } from '@japa/runner'
import { expect } from '@japa/expect'
import { snapshot } from '@japa/snapshot'

processCLIArgs(process.argv.splice(2))
configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [expect(), snapshot()],
})

run()
