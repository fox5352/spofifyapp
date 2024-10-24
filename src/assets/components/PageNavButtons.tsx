import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'

function PageNavButtons({ currentPage }: { currentPage: number }) {
  const [searchParams, setSearchParams] = useSearchParams()

  /**
   * Smoothly scrolls the window to the top
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /**
   * Handles navigation to the next page
   */
  const navigateToNextPage = () => {
    searchParams.set('page', (currentPage + 1).toString())
    setSearchParams(searchParams)
    scrollToTop()
    // if (previewCards && currentPage < previewCards.length / ITEMS_PER_PAGE) {
    // }
  }

  /**
   * Handles navigation to the previous page
   */
  const navigateToPreviousPage = () => {
    if (currentPage > 0) {
      searchParams.set('page', (currentPage - 1).toString())
      setSearchParams(searchParams)
      scrollToTop()
    }
  }

  // TODO: style better

  return (
    <div>
      <button
        onClick={navigateToPreviousPage}
        className="px-2 py-1 rounded-md border border-neutral-300 bg-transparent text-sm hover:-translate-y-[2px] transform transition duration-200 hover:shadow-md"
      >
        <MdArrowBack />
      </button>

      <button
        onClick={navigateToNextPage}
        className="px-2 py-1 rounded-md border border-neutral-300 bg-transparent text-sm hover:-translate-y-[2px] transform transition duration-200 hover:shadow-md"
      >
        <MdArrowForward />
      </button>
    </div>
  )
}

export default PageNavButtons
