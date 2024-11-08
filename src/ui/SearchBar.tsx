import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { MdMenu } from 'react-icons/md'
// utils
import { debounce } from '../lib/utils'
// components
import QueryFilterModal from './QueryFilterModal'
import { SelectMenuProps } from './SelectMenu'

/**
 * SearchBar - componet provides a input to update title query param of current page its in
 */
function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMenuActive, setIsMenuActive] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  /**
   * takes and onChange event and debounces it as updates the query param
   */
  const handleInput = debounce((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const value = event.target.value

    if (value.trim() === '' || value.trim() === '*') {
      searchParams.delete('title')
    } else {
      searchParams.set('title', value)
    }

    setSearchParams(searchParams)
  }, 600)

  // toggles menu
  const toggleMenu = (event: FormEvent) => {
    event.preventDefault()
    setIsMenuActive((prev) => !prev)
  }

  // clears query param
  const clearQuery = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    searchParams.delete('title')
    setSearchParams(searchParams)

    if (inputRef?.current) {
      inputRef.current.value = ''
    }
  }

  /**
   * updates search param on change event
   */
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    searchParams.set(event.target.name, event.target.value)
    setSearchParams(searchParams)
  }

  // SelectMenuProp that sets select options and pass a onChnage function
  const filters: SelectMenuProps[] = [
    {
      title: 'Sort alphabetically',
      onChange: handleChange,
      name: 'order',
      options: [
        { text: 'A-z', value: 'a-z' },
        { text: 'Z-a', value: 'z-a' },
        { text: 'newest', value: 'dsc' },
        { text: 'oldest', value: 'asc' },
      ],
    },
  ]

  return (
    <>
      <form className="flex w-11/12 my-1.5 max-w-screen-md px-2 p-1 bg-[--bg-two] rounded-full">
        <button
          className={`flex justify-center items-center w-12 p-1 text-white rounded-md hover:scale-95 duration-200 transition-all ease-linear ${isMenuActive ? 'text-zinc-950 bg-gradient-to-r' : ''} from-[--ac-one] to-purple-500 duration-200 transition-all ease-linear`}
          onClick={toggleMenu}
        >
          <MdMenu className="h-full w-auto" />
        </button>
        <label className="hidden" htmlFor="search-bar">
          search bar
        </label>
        <input
          className="w-full rounded-full border border-zinc-950 text-nowrap py-1 px-2 text-center"
          ref={inputRef}
          id="search-bar"
          onChange={handleInput}
          type="text"
        />
        <button
          className="flex justify-center items-center w-12 p-1 text-white rounded-md hover:scale-95 hover:text-purple-500 duration-200 transition-all ease-linear"
          onClick={clearQuery}
        >
          <FaTrash />
        </button>
      </form>
      <div className="flex justify-center w-full">
        <QueryFilterModal
          isActive={isMenuActive}
          toggleFunction={() => setIsMenuActive((prev) => !prev)}
          filters={filters}
        />
      </div>
    </>
  )
}

export default SearchBar
