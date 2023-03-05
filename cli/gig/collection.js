import got from 'got'
import dayjs from 'dayjs'
import matter from 'gray-matter'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'path'

/**
 * 
 */
const getFullPath = (state, dir = 'src/content/state') =>
  path.join(process.cwd(), dir, `${state.toLowerCase()}.md`)

/**
 * 
 */
const getCollection = async (state) => {
  const contents = await readFile(getFullPath(state))  
  return matter(contents)
}

/**
 * 
 */
const saveCollection = async (state, collection) => {
  const data = matter.stringify(collection.content, collection.data)
  await writeFile(getFullPath(state), data)
}

/**
 * 
 */
const getImageFullPath = (filename, dir = 'public/images/posters') =>
  path.join(process.cwd(), dir, filename)

/**
 * 
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
export const add = async ({ state, city, date, posterUrl }) => {
  const poster = await fetchImage(posterUrl)
  const collection = await getCollection(state)
  const gig = { poster, city, date: dayjs(date).format('DD/MM/YYYY HH:mm') }
  
  collection.data.gigs = collection.data.gigs
    ? [ ...collection.data.gigs, gig ]
    : [ gig ]

  await saveCollection(state, collection)
}