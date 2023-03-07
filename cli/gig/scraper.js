import got from 'got'
import * as R from 'ramda'
import * as cheerio from 'cheerio'
import { getYear, parse, format } from 'date-fns'
import { replaceAll } from './collection.js'

/**
 * Where to scrape gigs from.
 */
const DEFAULT_GIGS_URL = 'https://undershows.com.br/'

/**
 * Returns a formatted date according to the day and month passed.
 * 
 * @param {string} month 
 * @param {string} day
 * @returns {format}
 */
const getFormattedDate = (month, day) => {
  const year = getYear(Date.now())
  const hasSpecificDay = Number.isInteger(Number(day))
  const date = parse(
    `${year} ${month} ${hasSpecificDay ? day : ''}`,
    `yyyy MMMM ${hasSpecificDay ? 'dd' : ''}`,
    Date.now()
  )

  return format(date, hasSpecificDay ? 'dd/MM/yyyy 00:00' : `'--'/MM/yyyy 00:00`)
}

/**
 * Scrape gigs from a page.
 * 
 * @param {string} state
 * @param {string} url
 * @param {string} initialUrl
 * @param {import('got').GotReturn} response
 * @returns {Array}
 */
const scrapeGigs = async (state, url, initialUrl, response = null) => {
  const { rawBody } = response ?? await got(url) 
  const $ = cheerio.load(rawBody)
  const $gigs = $('p:has(+ img)')

  return $gigs.map((_, gig) => {
    const $gig = $(gig)
    const [city] = $gig.text().trim().split('/')
    const { href: poster } = new URL($gig.next('img').attr('src'), initialUrl)
    
    const [, month] = $gig
      .prevAll('p[style^="font-size:30px"]:has(+ p > b)')
      .eq(0)
      .text()
      .trim()
      .split('/')
    
    const day = $gig
      .prevAll('p[style^="font-size:20px"]:has(+ p > b)')
      .filter((_, el) => $(el).text().trim().match(/\/|^\d+$/))
      .eq(0)
      .text()
      .trim()

    const date = getFormattedDate(month, day)
    return { state, city, date, poster }
  }).toArray()
}

/**
 * Scrape gigs from all pages.
 * 
 * @param {string} url
 * @returns {Array}
 */
export const scrape = async (initialUrl = DEFAULT_GIGS_URL) => {
  const response = await got(initialUrl)
  const $ = cheerio.load(response.rawBody)

  const states = $('a.class1:not([href^=javascript])').map((_, state) => {
    const $state = $(state)
    return {
      abbr: $state.text().trim(),
      url: new URL($state.attr('href'), initialUrl)?.href
    }
  }).toArray()

  const gigs = [...await scrapeGigs('SP', '', initialUrl, response)]
  for (const state of states) {
    gigs.push(...await scrapeGigs(state.abbr, state.url, initialUrl))
  }

  return gigs
}

/**
 * Scrape gigs from all pages and save them
 * on the collection, replacing other gigs.
 * 
 * @param {string} url
 * @returns {undefined}
 */
export const scrapeAndReplace = async (initialUrl = DEFAULT_GIGS_URL) => {
  const gigsByState = R.pipe(
    R.groupBy(R.prop('state')),
    R.mapObjIndexed(R.map(R.dissoc('state')))
  )(await scrape(initialUrl))
  
  R.forEachObjIndexed(async (gigs, state) => {
    await replaceAll(state, gigs)
  }, gigsByState)
}