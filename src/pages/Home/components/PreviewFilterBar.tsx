import { memo, useEffect, useState } from 'react'
import TagButton from './TagButton'
import { getGenres } from '../../../api/requests'
import { MdArrowDropDown, MdArrowDropUp, MdClose, MdMenu } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import Loading from '../../../components/Loading'

interface GenreTag {
  title: string
  id: number
}

const PreviewFilterBar = memo(function PreviewFilterBar() {
  // toggle menu bar
  const [isMenuActive, setIsMenuActive] = useState(false)
  // query management
  const [searchParams, setSearchParams] = useSearchParams()
  const [orderBy, setOrderBy] = useState(searchParams.get('order') || 'new')
  // page state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [genres, setGenres] = useState<GenreTag[]>([])

  // FIXME: takes very long onn initial load find a faster way to request data from api
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const buffer = []
      for (let index = 1; index < 9; index++) {
        buffer.push(index)
      }

      const data = await getGenres(buffer)
      if (!data) return setError('failed to retrieve genres')

      setError(null)
      setGenres(data)
      setIsLoading(false)
    }

    fetchData()
  }, [])

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
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="flex justify-center items-center gap-1 px-2 py-0 bg-black rounded-[6px] relative group text-white active:bg-transparent">
          Sort by: {orderBy === 'new' ? <MdArrowDropUp /> : <MdArrowDropDown />}
        </div>
      </button>

      <button className="text-2xl hover:text-purple-500" onClick={toggleMenu}>
        {isMenuActive ? <MdClose /> : <MdMenu />}
      </button>

      <div
        className={`absolute flex flex-wrap flex-shrink ${
          isMenuActive ? 'scale-100' : 'scale-0'
        } min-w-full w-min z-20 top-[110%] right-0 p-2 rounded-md bg-zinc-950 duration-200 transition-all ease-linear`}
      >
        {error && <p>{error}</p>}
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
})

export default PreviewFilterBar
