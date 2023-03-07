import got from 'got'
import { format, parse, isBefore, startOfDay } from 'date-fns'
import matter from 'gray-matter'
import * as R from 'ramda'
import path from 'path'
import { access, constants, readFile, rm, writeFile } from 'node:fs/promises'
import states from '../data/states.js'

/**
 * TODO
 */
const DATE_FORMAT = 'dd/MM/yyyy HH:mm'

/**
 * TODO
 */
const getFullPath = (state, dir = 'src/content/state') =>
  path.join(process.cwd(), dir, `${state.toLowerCase()}.md`)

/**
 * TODO
 */
const getCollection = async (state) => {
  const contents = await readFile(getFullPath(state))  
  return matter(contents)
}

/**
 * TODO
 */
const saveCollection = async (state, collection) => {
  const data = matter.stringify(collection.content, collection.data)
  await writeFile(getFullPath(state), data)
}

/**
 * TODO
 */
const getImageFullPath = (filename, dir = 'public/images/posters') =>
  path.join(process.cwd(), dir, filename)

/**
 * TODO
 */
const fetchImage = async (imageUrl) => {
  const { rawBody, requestUrl } = await got(imageUrl)
  const filename = path.basename(requestUrl.pathname)

  await writeFile(getImageFullPath(filename), rawBody)
  return filename
}

/**
 * TODO
 */
const removeImage = async (imageFilename) => {
  const imagePath = getImageFullPath(imageFilename)
  await access(imagePath, constants.W_OK)
  await rm(imagePath)
}

/**
 * TODO
 */
const removeAllImages = async (gigs) => {
  if (!gigs?.length) {
    return
  }

  await Promise.all(gigs.map((gig) => removeImage(gig.poster)))
}

/**
 * TODO
 */
export const add = async ({ state, city, date, posterUrl }) => {
  const poster = await fetchImage(posterUrl)
  const collection = await getCollection(state)
  const gig = { poster, city, date: format(date, DATE_FORMAT) }
  
  collection.data.gigs = collection.data.gigs
    ? [ ...collection.data.gigs, gig ]
    : [ gig ]

  await saveCollection(state, collection)
}

/**
 * TODO
 */
export const replaceAll = async (state, gigs) => {
  const collection = await getCollection(state)
  await removeAllImages(collection.data.gigs)

  const gigsWithImages = await Promise.all(
    gigs.map(async (gig) => ({
      ...gig,
      poster: await fetchImage(gig.poster)
    }))
  )

  collection.data.gigs = gigsWithImages
  await saveCollection(state, collection)
}

/**
 * TODO
 */
export const removeAll = async () => {
  const promises = states.map(async (state) => {
    const collection = await getCollection(state.abbr)
    await removeAllImages(collection.data.gigs)

    collection.data.gigs = []
    await saveCollection(state.abbr, collection)
  })

  await Promise.all(promises)
}

/**
 * TODO
 */
export const removeOld = async () => {
  const promises = states.map(async (state) => {
    const collection = await getCollection(state.abbr)
    const [removedGigs, remainingGigs] = R.pipe(
      R.defaultTo([]),
      R.partition((gig) => {
        const date = parse(gig.date, DATE_FORMAT, Date.now())
        return isBefore(date, startOfDay(Date.now()))
      })
    )(collection.data.gigs)

    collection.data.gigs = remainingGigs

    await removeAllImages(removedGigs)
    await saveCollection(state.abbr, collection)
  })

  await Promise.all(promises)
}