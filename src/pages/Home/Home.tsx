import { useEffect, useState } from 'react'
import { getPreview, Preview } from '../../api/requests'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import { Card } from '../../components/Card'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'

function Home() {
  // page data
  const amount = 15
  const [page, setPage] = useState(0)
  const [previews, setPreviews] = useState<Preview[] | null>()

  // page states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    getPreview()
      .then((data) => {
        setPreviews(data)
        setError(null)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (error) {
    return <ErrorMessage message={error} size="text-3xl" />
  }

  if (isLoading) {
    return <Loading />
  }

  const mapCards = () => {
    if (previews) {
      const curPage = page * amount
      const cap = Math.min(curPage + amount, previews.length)
      return previews
        .slice(curPage, cap)
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
    if (page < Math.floor(previews!.length / amount)) {
      setPage((prevPage) => prevPage + 1)
      handleScrollToTop()
    }
  }

  const prevPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1)
      handleScrollToTop()
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center mb-[5rem]">
      <nav>
        <button>awda</button>
      </nav>
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
