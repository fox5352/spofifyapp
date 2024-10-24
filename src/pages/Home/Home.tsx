import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import { Card } from '../../components/Card'
import { getAllGenres, getPreview, Preview } from '../../api/requests'
import PreviewFilterBar from '../../assets/components/PreviewFilterBar'
import PageNavButtons from '../../assets/components/PageNavButtons'

/**
 * Represents a genre category with its title and ID
 */
export interface GenreTag {
  title: string
  id: number
}

// TODO: change home page to have a carousel and dashboard

const ITEMS_PER_PAGE = 10
/**
 * Home component that displays a paginated grid of preview cards with genre filtering
 * and sorting capabilities.
 */
function Home() {
  // Pagination and filtering state
  const [searchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page') || 0)
  const selectedGenre = searchParams.get('q') || '*'

  const [previewCards, setPreviewCards] = useState<Preview[] | null>()

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableGenres, setAvailableGenres] = useState<GenreTag[] | null>(
    null
  )

  // ----------------------------------------------- fetching functionality -----------------------------------------------
  /**
   * Fetches available genres from the database
   * Currently hardcoded to fetch genres with IDs 1-8
   */
  useEffect(() => {
    const fetchGenre = async () => {
      // const genreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const data: GenreTag[] = (await getAllGenres()).map((genres) => ({
        title: genres.title,
        id: genres.id,
      }))
      // (await getGenres(genreIds))? || []
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
      setError('Failed to fetch preview cards')
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
        setError('Failed to fetch preview cards')
        setIsLoading(false)
        return
      }

      setPreviewCards(previewData)
      setIsLoading(false)
    }
    func()
  }, [fetchPreviewCards])

  // ----------------------------------------------- filter functionality -----------------------------------------------
  const filterPreviewData = useCallback(async () => {
    if (selectedGenre === '*') {
      const previewData = await getPreview()

      if (!previewData) {
        return
      }

      setPreviewCards(previewData)
    }
    if (availableGenres) {
      const selectedGenreId = availableGenres.find((g) => {
        return g.title === selectedGenre
      })

      if (selectedGenreId) {
        const filteredPreviewData = (await getPreview())?.filter((preview) => {
          return preview.genres.includes(selectedGenreId.id)
        })

        setPreviewCards(filteredPreviewData)
      }
    }
  }, [selectedGenre, availableGenres])
  /**
   * filter preview data on selectedGenre change
   */
  useEffect(() => {
    filterPreviewData()
  }, [filterPreviewData])

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
      return previewCards
        .slice(startIndex, endIndex)
        .map((preview) => <Card key={Number(preview.id)} {...preview} />)
    }
  }

  // ----------------------------------------------- other page states -----------------------------------------------
  if (error) {
    return <ErrorMessage message={error} size="text-3xl" />
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Loading className="text-7xl h-full w-1/2 max-w-xs" />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full justify-center items-center mb-[5rem]">
      <PreviewFilterBar genres={availableGenres || []} />
      <div className="w-full flex flex-wrap justify-evenly gap-4 overflow-auto p-1">
        {previewCards && getCurrentPageCards()}
      </div>
      <PageNavButtons currentPage={currentPage} />
    </div>
  )
}

export default Home
