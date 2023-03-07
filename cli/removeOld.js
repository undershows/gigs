import meow from 'meow'
import { removeOld } from './gig/collection.js'

meow(`
  Usage
    $ node ./removeOld.js
`, {
  importMeta: import.meta
})

await removeOld()