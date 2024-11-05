import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getAllGenres, getPreview, Preview } from '../../api/requests'

import ErrorMessage from '../../ui/ErrorMessage'
import Loading from '../../ui/Loading'
import { Card } from '../../ui/Card'

import PreviewFilterBar from '../../assets/components/PreviewFilterBar'
import PageNavButtons from '../../assets/components/PageNavButtons'
import SearchBar from '../../ui/SearchBar'

/**
 * Represents a genre category with its title and ID
 */
export interface GenreTag {
  title: string
  id: number
}

const ITEMS_PER_PAGE = 10

function Shows() {
  // Pagination and filtering state
  const [searchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page') || 0)
  const selectedGenre = searchParams.get('q') || '*'
  const titleQuery = searchParams.get('title') || '*'
  // page ordering
  const order = searchParams.get('order') || 'a-z'
  // page data
  const [previewCards, setPreviewCards] = useState<Preview[] | null>()

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string; color: string } | null>(
    null
  )
  const [availableGenres, setAvailableGenres] = useState<GenreTag[] | null>(
    null
  )

  // ----------------------------------------------- fetching functionality -----------------------------------------------
  /**
   * Fetches available genres from the database
   */
  useEffect(() => {
    const fetchGenre = async () => {
      const data: GenreTag[] = (await getAllGenres()).map((genres) => ({
        title: genres.title,
        id: genres.id,
      }))
      setAvailableGenres(data)
    }
    fetchGenre()
  }, [])

  /**
   * Fetches preview cards
   */
  const fetchPreviewCards = useMemo(async () => {
    setIsLoading(true)
    const previewData = await getPreview()
    if (previewData == null) {
      setError({
        message: 'Failed to fetch preview cards',
        color: 'text-rose-500',
      })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    return previewData
  }, [])

  useEffect(() => {
    const func = async () => {
      setIsLoading(true)
      setError(null)

      const previewData = await fetchPreviewCards

      if (!previewData) {
        setError({
          message: 'Failed to fetch preview cards',
          color: 'text-rose-500',
        })
        setIsLoading(false)
        return
      }

      setPreviewCards(previewData)
      setIsLoading(false)
    }
    func()
  }, [fetchPreviewCards])

  // ----------------------------------------------- filter functionality -----------------------------------------------
  /**
   * gets preview cards from memoized function and filters them by genre,or title
   */
  const filterPreviewData = useCallback(async () => {
    const getFilteredPreviewsByGenre = async (): Promise<
      Preview[] | undefined
    > => {
      const previewData = await fetchPreviewCards
      if (!previewData) return undefined

      // Return all previews if no genre filter is applied
      if (selectedGenre === '*') {
        return previewData
      }

      // Return undefined if no genres are available
      if (!availableGenres) return

      const selectedGenreData = availableGenres.find(
        (genre) => genre.title === selectedGenre
      )

      if (!selectedGenreData) return

      return previewData.filter((preview) =>
        preview.genres.includes(selectedGenreData.id)
      )
    }

    const filterPreviewsByTitle = (previews: Preview[]): Preview[] => {
      if (titleQuery === '*') return previews

      const normalizedQuery = titleQuery.toLowerCase()
      return previews.filter((preview) =>
        preview.title.toLowerCase().includes(normalizedQuery)
      )
    }

    // Apply filters sequentially
    const genreFilteredPreviews = await getFilteredPreviewsByGenre()
    if (!genreFilteredPreviews) return

    const filteredPreviews = filterPreviewsByTitle(genreFilteredPreviews)
    setPreviewCards(filteredPreviews)
  }, [selectedGenre, availableGenres, titleQuery, fetchPreviewCards])

  /**
   * filter preview data on selectedGenre and searched title
   */
  useEffect(() => {
    filterPreviewData()
  }, [filterPreviewData])

  /**
   * re-runs order filter when order query changes
   */
  useEffect(() => {
    if (!previewCards) return
    setPreviewCards(filterOrder(order, previewCards))
  }, [order])

  /**
   * Sorts a list of Preview items based on the specified order.
   *
   * @param order - The sorting order. Acceptable values:
   *                'a-z' for alphabetical ascending,
   *                'z-a' for alphabetical descending,
   *                'asc' for ascending by update date,
   *                'dsc' for descending by update date.
   * @param preview - Array of Preview items to be sorted.
   * @returns A new array of Preview items sorted according to the specified order.
   */
  const filterOrder = (order: string, preview: Preview[]): Preview[] => {
    const sortedPreviews = [...preview] // Create a copy to avoid mutating the original array

    switch (order) {
      case 'a-z':
        // Sort alphabetically by title in ascending order (A-Z)
        return sortedPreviews.sort((a, b) => a.title.localeCompare(b.title))

      case 'z-a':
        // Sort alphabetically by title in descending order (Z-A)
        return sortedPreviews.sort((a, b) => b.title.localeCompare(a.title))

      case 'asc':
        // Sort by 'updated' date in ascending order (oldest to newest)
        return sortedPreviews.sort(
          (a, b) =>
            new Date(a.updated).getTime() - new Date(b.updated).getTime()
        )

      case 'dsc':
        // Sort by 'updated' date in descending order (newest to oldest)
        return sortedPreviews.sort(
          (a, b) =>
            new Date(b.updated).getTime() - new Date(a.updated).getTime()
        )

      default:
        // Return the original order if no valid sorting order is specified
        return sortedPreviews
    }
  }

  // ----------------------------------------------- ui functionality -----------------------------------------------
  /**
   * Returns a slice of preview cards for the current page
   */
  const getCurrentPageCards = () => {
    if (previewCards) {
      const startIndex = currentPage * ITEMS_PER_PAGE
      const endIndex = Math.min(
        startIndex + ITEMS_PER_PAGE,
        previewCards.length
      )
      return filterOrder(order, previewCards)
        .slice(startIndex, endIndex)
        .map((preview) => <Card key={Number(preview.id)} {...preview} />)
    }
  }

  // ----------------------------------------------- page states -----------------------------------------------
  if (error) {
    return (
      <ErrorMessage
        className={error.color}
        message={error.message}
        size="text-3xl"
      />
    )
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Loading className="text-7xl h-full w-1/2 max-w-xs" />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <SearchBar />
      <PreviewFilterBar genres={availableGenres || []} />
      <div className="w-full flex flex-wrap justify-evenly gap-4 overflow-auto p-1">
        {previewCards && getCurrentPageCards()}
      </div>
      <PageNavButtons currentPage={currentPage} />
    </div>
  )
}

export default Shows
