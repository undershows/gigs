import meow from 'meow'
import { scrape } from './gig/scraper.js'

const cli = meow(`
  Usage
    $ gig scraper
`, {
  importMeta: import.meta
})

console.log(await scrape())