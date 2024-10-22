// https://podcast-api.netlify.app PREVIEW Objects This endpoint returns an array of PREVIEW objects, providing a summarized list of all available shows.
// https://podcast-api.netlify.app/genre/<ID> GENRE Objects This endpoint returns detailed information about a specific genre, identified by its ID
// https://podcast-api.netlify.app/id/<ID>SHOW Objects This endpoint returns detailed information about a specific show, including its seasons and episodes, identified by its ID.

export interface Preview {
  id: number
  title: string
  description: string
  seasons: number
  image: string
  genres: number[]
  updated: string
}

export async function getPreview(): Promise<Preview[] | null> {
  try {
    const res = await fetch('https://podcast-api.netlify.app')

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error on getPreviewObjects:', error)
    return null
  }
}

export interface Genre {
  id: number
  title: string
  description: string
  shows: string[]
}

export async function getGenre(id: string): Promise<Genre | null> {
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

export interface Episode {
  title: string
  description: string
  episode: number
  file: string
}

export interface Season {
  season: number
  title: string
  image: string
  episodes: Episode[]
}

export interface Show {
  id: string
  title: string
  description: string
  seasons: Season[]
  image: string
  genres: string[]
  updated: string
}

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
