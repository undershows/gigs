import meow from 'meow'
import { removeAll } from './gig/collection.js'

meow(`
  Usage
    $ node ./removeAll.js
`, {
  importMeta: import.meta
})

await removeAll()