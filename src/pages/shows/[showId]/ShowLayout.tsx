import { useEffect, useState } from 'react'
import { useParams, Outlet } from 'react-router-dom'
// utils
import { getShow } from '../../../api/requests'
// components
import ErrorMessage from '../../../ui/ErrorMessage'
import Loading from '../../../ui/Loading'
import ShowHeader from './components/ShowHeader'
// types
import type { Show } from '../../../api/requests'

/**
 * ShowDetail component displays detailed information about a TV show
 * including its title, description, seasons, and episodes
 */
export default function ShowLayout() {
  const { id } = useParams()
  const [show, setShow] = useState<Show | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    const fetchShow = async (showId: string) => {
      try {
        setIsLoading(true)
        const response = await getShow(showId)

        if (!response) {
          throw new Error('Failed to fetch show')
        }

        setShow(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch show')
      } finally {
        setIsLoading(false)
      }
    }

    if (!id) {
      setError('No show ID provided in URL parameters')
      return
    }

    fetchShow(id)
  }, [id]) // Added id to dependency array

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev)
  }

  if (error) {
    return <ErrorMessage message={error} size="text-3xl" />
  }

  if (isLoading) {
    return (
      <div
        className="w-screen h-screen flex justify-center items-center overflow-hidden"
        role="status"
      >
        <Loading className="text-7xl h-full w-1/2 max-w-xs" />
      </div>
    )
  }

  if (!show) {
    return null
  }

  return (
    <main className="flex flex-col w-full md:px-2 md:pt-0.5">
      <ShowHeader
        show={show}
        isDescriptionExpanded={isDescriptionExpanded}
        onToggleDescription={toggleDescription}
      />
      <Outlet context={show.seasons} />
    </main>
  )
}
