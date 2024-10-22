import { memo, useEffect, useState } from 'react'
import TagButton from './TagButton'
import { MdArrowDropDown, MdArrowDropUp, MdClose, MdMenu } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import Loading from '../../../components/Loading'
import { GenreTag } from '../Home'

const PreviewFilterBar = memo(
  function PreviewFilterBar({ genres }: { genres: GenreTag[] }) {
    // toggle menu bar
    const [isMenuActive, setIsMenuActive] = useState(false)
    // query management
    const [searchParams, setSearchParams] = useSearchParams()
    const [orderBy, setOrderBy] = useState(searchParams.get('order') || 'new')
    // page state
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      if (genres.length) {
        setIsLoading(false)
      }
    }, [genres])

    const toggleMenu = () => {
      setIsMenuActive((prev) => !prev)
    }

    const toggleOrderBy = () => {
      const newOrder = orderBy === 'new' ? 'old' : 'new'
      setOrderBy(newOrder)
      searchParams.set('order', newOrder)
      setSearchParams(searchParams)
    }

    const mapTags = (data: GenreTag) => {
      return (
        <TagButton key={data.id} param={data.title}>
          {data.title.slice(0, 12)}
        </TagButton>
      )
    }

    return (
      <nav className="flex items-center justify-between my-2 px-2 py-1 text-white bg-zinc-950 w-5/6 max-w-xl rounded-md relative">
        <button
          onClick={toggleOrderBy}
          className="p-[3px] relative transition-all duration-200 hover:scale-90"
          aria-label={`Sort by ${orderBy === 'new' ? 'newest' : 'oldest'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="flex justify-center items-center gap-1 px-2 py-0 bg-black rounded-[6px] relative group text-white active:bg-transparent">
            Sort by:{' '}
            {orderBy === 'new' ? <MdArrowDropUp /> : <MdArrowDropDown />}
          </div>
        </button>

        <button
          className="text-2xl hover:text-purple-500"
          onClick={toggleMenu}
          aria-label={isMenuActive ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuActive}
        >
          {isMenuActive ? <MdClose /> : <MdMenu />}
        </button>

        <div
          className={`absolute flex flex-wrap flex-shrink gap-x-1 gap-y-1.5 min-w-full w-min z-20 top-[110%] right-0 p-2 rounded-md bg-zinc-950 duration-200 transition-all ease-linear ${
            isMenuActive ? 'scale-100' : 'scale-0'
          }`}
          aria-hidden={!isMenuActive}
        >
          {isLoading ? (
            <div className="flex w-full justify-center">
              <Loading className="text-4xl" />
            </div>
          ) : (
            genres.map(mapTags)
          )}
        </div>
      </nav>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if the genres array has changed in content
    if (prevProps.genres.length !== nextProps.genres.length) {
      return false
    }

    return prevProps.genres.every(
      (genre, index) =>
        genre.id === nextProps.genres[index].id &&
        genre.title === nextProps.genres[index].title
    )
  }
)

export default PreviewFilterBar
