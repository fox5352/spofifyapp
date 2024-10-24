/**
 * Podcast API Client Library
 * A TypeScript client for interacting with the podcast API endpoints.
 */

// https://podcast-api.netlify.app PREVIEW Objects This endpoint returns an array of PREVIEW objects, providing a summarized list of all available shows.
// https://podcast-api.netlify.app/genre/<ID> GENRE Objects This endpoint returns detailed information about a specific genre, identified by its ID
// https://podcast-api.netlify.app/id/<ID>SHOW Objects This endpoint returns detailed information about a specific show, including its seasons and episodes, identified by its ID.

/**
 * Represents a preview of a podcast show
 * @interface Preview
 */
export interface Preview {
  id: number
  title: string
  description: string
  seasons: number
  image: string
  genres: number[]
  updated: string
}

/**
 * Fetches and returns a sorted list of all available podcast shows
 * @returns Promise<Preview[] | null> Array of show previews sorted by title, or null if error occurs
 */
export async function getPreview(): Promise<Preview[] | null> {
  try {
    const res = await fetch('https://podcast-api.netlify.app')

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data: Preview[] = await res.json()

    // Sort the data array alphabetically by title
    data.sort((a, b) => a.title.localeCompare(b.title))

    return data
  } catch (error) {
    console.error('Error on getPreviewObjects:', error)
    return null
  }
}

/**
 * Represents a podcast genre
 * @interface Genre
 */
export interface Genre {
  id: number
  title: string
  description: string
  shows: string[]
}

/**
 * Fetches information about a specific genre
 * @param id - The genre ID to fetch
 * @returns Promise<Genre | null> Genre information or null if error occurs
 */
export async function getGenre(id: string | number): Promise<Genre | null> {
  try {
    const res = await fetch(`https://podcast-api.netlify.app/genre/${id}`)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error on getGenre:', error)
    return null
  }
}

/**
 * Fetches information about multiple genres
 * @param ids - Array of genre IDs to fetch
 * @returns Promise<Genre[] | null> Array of genre information or null if error occurs
 */
export async function getGenres(id: number[]): Promise<Genre[] | null> {
  try {
    const genres: Genre[] = []

    for (const genreId of id) {
      const genre = await getGenre(genreId.toString())
      if (genre) genres.push(genre)
    }

    return genres.length > 0 ? genres : null
  } catch (error) {
    console.error('Error on getGenres:', error)
    return null
  }
}

/**
 * gets all Genres
 */
export async function getAllGenres(): Promise<Genre[]> {
  const genres: Genre[] = []

  let counter = 1
  while (counter < 10) {
    const res = await getGenre(counter)

    if (res === null) {
      break
    }

    genres.push(res)
    counter++
  }
  return genres
}

/**
 * Represents a podcast episode
 * @interface Episode
 */
export interface Episode {
  title: string
  description: string
  episode: number
  file: string
}

/**
 * Represents a season of a podcast show
 * @interface Season
 */
export interface Season {
  season: number
  title: string
  image: string
  episodes: Episode[]
}

/**
 * Represents a complete podcast show with all details
 * @interface Show
 */
export interface Show {
  id: string
  title: string
  description: string
  seasons: Season[]
  image: string
  genres: string[]
  updated: string
}

/**
 * Fetches detailed information about a specific show
 * @param id - The show ID to fetch
 * @returns Promise<Show | null> Complete show information or null if error occurs
 */
export async function getShow(id: string): Promise<Show | null> {
  try {
    const res = await fetch(`https://podcast-api.netlify.app/id/${id}`)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error on getShow:', error)
    return null
  }
}
