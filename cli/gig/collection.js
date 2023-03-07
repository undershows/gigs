import got from 'got'
import dayjs from 'dayjs'
import matter from 'gray-matter'
import path from 'path'
import { access, constants, readFile, rm, writeFile } from 'node:fs/promises'

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
 * 
 */
const removeImage = async (imageFilename) => {
  const imagePath = getImageFullPath(imageFilename)
  await access(imagePath, constants.W_OK)
  await rm(imagePath)
}

/**
 * TODO
 */
export const add = async ({ state, city, date, posterUrl }) => {
  const poster = await fetchImage(posterUrl)
  const collection = await getCollection(state)
  const gig = { poster, city, date: dayjs(date).format('DD/MM/YYYY HH:mm') }
  
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

  if (collection.data.gigs) {
    await Promise.all(
      collection.data.gigs.map((gig) => removeImage(gig.poster))
    )
  }

  const gigsWithImages = await Promise.all(
    gigs.map(async (gig) => ({
      ...gig,
      poster: await fetchImage(gig.poster)
    }))
  )

  collection.data.gigs = gigsWithImages
  await saveCollection(state, collection)
}