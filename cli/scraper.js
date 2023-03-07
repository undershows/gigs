import meow from 'meow'
import * as R from 'ramda'
import { scrape } from './gig/scraper.js'
import { replaceAll } from './gig/collection.js'

const cli = meow(`
  Usage
    $ node ./scraper.js [url]

  Example
    $ node ./scraper.js https://nkls.dev/undershows-gigs/
`, {
  importMeta: import.meta
})

const [url] = cli.input
const gigsByState = R.pipe(
  R.groupBy(R.prop('state')),
  R.mapObjIndexed(R.map(R.dissoc('state')))
)(await scrape(url))

R.forEachObjIndexed(async (gigs, state) => {
  await replaceAll(state, gigs)
}, gigsByState)