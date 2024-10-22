import { useEffect, useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import { Card } from '../../components/Card'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import { getPreview, Preview } from '../../api/requests'
import PreviewFilterBar from './components/PreviewFilterBar'

function Home() {
  // page pagination
  const [searchParams, setSearchParams] = useSearchParams()
  const getPageNum = Number(searchParams.get('page') || 0)
  const getAmount = 10
  const getOrder = searchParams.get('order') || 'new'
  const [previews, setPreviews] = useState<Preview[] | null>()

  // page states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // gets the previews
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const data = await getPreview()

      if (!data) {
        setError('Failed to find previews')
        setIsLoading(false)
        return
      }

      const filteredData = [...data].sort((a, b) => {
        const aDate = new Date(a.updated).getTime() // prev
        const bDate = new Date(b.updated).getTime() // next
        if (getOrder === 'new') {
          // if aDate is larger than bDate, returns positive (newer comes first)
          return bDate - aDate
        } else {
          // if aDate is smaller than bDate, returns negative (older comes first)
          return aDate - bDate
        }
      })

      setPreviews(filteredData)

      setIsLoading(false)
    }

    fetchData()
  }, [getOrder])

  if (error) {
    return <ErrorMessage message={error} size="text-3xl" />
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center ">
        <Loading className="text-7xl" />
      </div>
    )
  }

  const mapCards = () => {
    if (previews) {
      const startIndex = getPageNum * getAmount
      const endIndex = Math.min(startIndex + getAmount, previews.length)
      return previews
        .slice(startIndex, endIndex)
        .map((preview) => <Card key={Number(preview.id)} {...preview} />)
    }
  }

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const nextPage = () => {
    if (getPageNum < previews!.length / getAmount) {
      searchParams.set('page', (getPageNum + 1).toString())
      setSearchParams(searchParams)

      handleScrollToTop()
    }
  }

  const prevPage = () => {
    if (getPageNum > 0) {
      searchParams.set('page', (getPageNum - 1).toString())
      setSearchParams(searchParams)
      handleScrollToTop()
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center mb-[5rem]">
      <PreviewFilterBar />
      <div className="w-full flex flex-wrap justify-evenly gap-4 overflow-auto p-1">
        {previews && mapCards()}
      </div>
      <div>
        <button
          onClick={prevPage}
          className="px-2 py-1 rounded-md border border-neutral-300 bg-transparent text-sm hover:-translate-y-[2px] transform transition duration-200 hover:shadow-md"
        >
          <MdArrowBack />
        </button>

        <button
          onClick={nextPage}
          className="px-2 py-1 rounded-md border border-neutral-300 bg-transparent text-sm hover:-translate-y-[2px] transform transition duration-200 hover:shadow-md"
        >
          <MdArrowForward />
        </button>
      </div>
    </div>
  )
}

export default Home
