import got from 'got'
import * as cheerio from 'cheerio'
import dayjs from 'dayjs'

/**
 * Where to scrape gigs from.
 */
const GIGS_URL = 'https://undershows.com.br/'

/**
 * Returns a formatted date according to the day and month passed.
 * 
 * @param {string} month 
 * @param {string} day
 * @returns {format}
 */
const getFormattedDate = (month, day) => {
  const year = dayjs().year()
  const hasSpecificDay = Number.isInteger(Number(day))
  const format = hasSpecificDay
    ? 'DD/MM/YYYY 00:00'
    : '[xx]/MM/YYYY 00:00'

  return dayjs(`${year} ${month} ${hasSpecificDay ? day : ''}`).format(format)
}

/**
 * Scrape gigs from a page.
 * 
 * @param {string} state
 * @param {string} url
 * @param {import('got').GotReturn} response
 * @returns {Array}
 */
const scrapeGigs = async (state, url, response = null) => {
  const { rawBody } = response ?? await got(url) 
  const $ = cheerio.load(rawBody)
  const $gigs = $('p:has(+ img)')

  return $gigs.map((_, gig) => {
    const $gig = $(gig)
    const [city] = $gig.text().split('/')
    const { href: poster } = new URL($gig.next('img').attr('src'), GIGS_URL)
    
    const [, month] = $gig
      .prevAll('p[style="font-size:30px"]:has(+ p > b)')
      .eq(0)
      .text()
      .split('/')
    
    const day = $gig
      .prevAll('p[style="font-size:20px"]:has(+ p > b)')
      .filter((_, el) => $(el).text().match(/\/|^\d+$/))
      .eq(0)
      .text()

    const date = getFormattedDate(month, day)
    return { state, city, date, poster }
  }).toArray()
}

/**
 * Scrape gigs from all pages.
 * 
 * @returns {Array}
 */
export const scrape = async () => {
  const response = await got(GIGS_URL)
  const $ = cheerio.load(response.rawBody)

  const states = $('a.class1[href$=.html]').map((_, state) => {
    const $state = $(state)
    return {
      abbr: $state.text(),
      url: new URL($state.attr('href'), GIGS_URL)?.href
    }
  }).toArray()

  const gigs = [...await scrapeGigs('SP', '', response)]
  for (const state of states) {
    gigs.push(...await scrapeGigs(state.abbr, state.url))
  }

  return gigs
}