import { useEffect, useState } from 'react'
// utils
import { getPreview, Preview } from '../../api/requests'
// components
import PreviewGallery from './components/PreviewGallery'
import Carousel from './components/Carousel'

/**
 * Home component that displays a carousel of latest previews and genre-based preview galleries with a small selection of preview cards below it
 */
function Home() {
  //page state
  const [error, setError] = useState<string | null>(null)

  //page data
  const [previews, setPreviews] = useState<Preview[] | null>(null)

  /**
   * Fetches preview data and sorts to get the 5 most recently updated items
   */
  useEffect(() => {
    const fetchPreviews = async () => {
      const res = await getPreview()

      if (!res) {
        setError('failed to fetch preview data')
        return
      }

      const getlatest = [...res]
        .sort((a, b) => {
          const aDate = new Date(a.updated).getTime()
          const bDate = new Date(b.updated).getTime()
          return bDate - aDate
        })
        .slice(0, 5)

      setError(null)
      setPreviews(getlatest)
    }
    fetchPreviews()
  }, [])

  return (
    <div className="flex flex-col w-full justify-center items-center space-y-9">
      <Carousel previews={previews} error={error} />
      <div className="flex flex-col justify-center space-y-12 max-w-screen-lg w-full">
        <PreviewGallery
          title="Some Shows"
          previews={previews?.slice(0, 3) || null}
        />
      </div>
    </div>
  )
}

export default Home
