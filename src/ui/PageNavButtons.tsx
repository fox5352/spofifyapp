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
    <div className="flex gap-2 my-2 ">
      <button
        type="button"
        className="bg-transparent hover:bg-[--bg-two] hover:text-[--text] focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-full border-[1px] border-zinc-950 text-zinc-950 text-sm p-1.5 text-center inline-flex items-center duration-200 transition-all ease-linear"
        onClick={navigateToPreviousPage}
      >
        <MdArrowBack />
        <span className="sr-only">Previous Page</span>
      </button>

      <button
        type="button"
        className="bg-transparent hover:bg-[--bg-two] hover:text-[--text] focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-full border-[1px] border-zinc-950 text-zinc-950 text-sm p-1.5 text-center inline-flex items-center duration-200 transition-all ease-linear"
        onClick={navigateToNextPage}
      >
        <MdArrowForward />
        <span className="sr-only">Next Page</span>
      </button>
    </div>
  )
}

export default PageNavButtons
