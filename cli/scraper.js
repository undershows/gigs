import meow from 'meow'
import { scrape } from './gig/scraper.js'

const cli = meow(`
  Usage
    $ node ./scraper.js [url]

  Example
    $ node ./scraper.js https://nkls.dev/undershows-gigs/
`, {
  importMeta: import.meta
})

const [url] = cli.input
console.log(await scrape(url))