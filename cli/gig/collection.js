import got from 'got'
import { format, parse, isBefore, startOfDay } from 'date-fns'
import matter from 'gray-matter'
import * as R from 'ramda'
import path from 'path'
import { access, constants, readFile, rename, writeFile, mkdir, rm } from 'node:fs/promises'
import states from '../data/states.js'

/**
 * Where the gigs are.
 */
const GIGS_DIR = 'src/content/state'

/**
 * Where the posters are.
 */
const IMAGES_DIR = 'public/images/posters'

/**
 * Where legacy gigs goes to.
 */
const LEGACY_GIGS_DIR = 'legacy/content'

/**
 * Where removed posters goes to.
 */
const LEGACY_IMAGES_DIR = 'legacy/posters'

/**
 * TODO
 */
const DATE_FORMAT = 'dd/MM/yyyy HH:mm'

/**
 * TODO
 */
const getFullPath = (state, dir = GIGS_DIR) =>
  path.join(process.cwd(), dir, `${state.toLowerCase()}.md`)

/**
 * TODO
 */
const getCollection = async (state, dir = GIGS_DIR) => {
  const contents = await readFile(getFullPath(state, dir))
  return matter(contents)
}

/**
 * TODO
 */
const findOrCreateCollection = async (state, dir = GIGS_DIR) => {
  const collectionPath = getFullPath(state, dir)

  try {
    await access(collectionPath, constants.R_OK)
  } catch (err) {
    await writeFile(collectionPath, '---\n---')
  } finally {
    return await getCollection(state, dir)
  }
}

/**
 * TODO
 */
const saveCollection = async (state, collection, dir = GIGS_DIR) => {
  const data = matter.stringify(collection.content, collection.data)
  await writeFile(getFullPath(state, dir), data)
}

/**
 * TODO
 */
const getImageFullPath = (filename, dir = IMAGES_DIR) =>
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
const moveImageToLegacy = async (imageFilename) => {
  await mkdir(LEGACY_IMAGES_DIR, { recursive: true })

  const imagePath = getImageFullPath(imageFilename)
  await access(imagePath, constants.W_OK)

  const legacyPath = getImageFullPath(imageFilename, LEGACY_IMAGES_DIR)
  await rename(imagePath, legacyPath)
}

/**
 * TODO
 */
const moveImagesToLegacy = async (gigs) => {
  if (!gigs?.length) {
    return
  }

  await Promise.all(gigs.map((gig) => moveImageToLegacy(gig.poster)))
}

/**
 * TODO
 */
const removeImages = async (gigs) => {
  if (!gigs?.length) {
    return
  }

  await Promise.all(gigs.map((gig) => removeImage(gig.poster)))
}

/**
 * TODO
 */
const saveLegacy = async (state, gigs) => {
  await mkdir(LEGACY_GIGS_DIR, { recursive: true })

  const legacyCollection = await findOrCreateCollection(state, LEGACY_GIGS_DIR)
  await moveImagesToLegacy(gigs)

  legacyCollection.data.gigs = legacyCollection.data.gigs
    ? [ ...legacyCollection.data.gigs, ...gigs ]
    : [ ...gigs ]

  await saveCollection(state, legacyCollection, LEGACY_GIGS_DIR)
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
  await removeImages(collection.data.gigs)

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

    if (!removedGigs.length) {
      return
    }

    collection.data.gigs = remainingGigs

    await saveLegacy(state.abbr, removedGigs)
    await saveCollection(state.abbr, collection)
  })

  await Promise.all(promises)
}