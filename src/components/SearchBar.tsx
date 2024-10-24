import { ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { debounce } from '../lib/utils'

function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams()

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

  return (
    <form className="flex w-11/12 my-1.5 max-w-md ml-6 md:ml-0">
      <label className="hidden" htmlFor="search-bar">
        search bar
      </label>
      <input
        id="search-bar"
        className="w-full rounded-full border border-zinc-950 text-nowrap py-1 px-2 text-center"
        onChange={handleInput}
        type="text"
      />
    </form>
  )
}

export default SearchBar
