import { ChangeEvent, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MdMenu } from 'react-icons/md'
//components
import QueryFilterModal from '../../../ui/QueryFilterModal'
import { SelectMenuProps } from '../../../ui/SelectMenu'

/**
 * Modal component for handling filtering of data
 */
export default function DashBoardFilterModal() {
  // local state
  const [isMenuActive, setIsMenuActive] = useState(false)

  // search params
  const [searchParams, setSearchParams] = useSearchParams()

  // togggle menu functoin
  const toggleMenu = () => setIsMenuActive((prev) => !prev)

  // handle for select menu
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    searchParams.set(event.target.name, event.target.value)
    setSearchParams(searchParams)
  }

  // select menu options
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
    <div className="flex flex-start w-full">
      <button
        className="w-10 h-10 border-2 rounded-full border-transparent bg-[--bg-two] hover:scale-90 duration-200 transition-all ease-linear overflow-hidden"
        onClick={toggleMenu}
        aria-label="Go back to previous page"
        type="button"
      >
        <MdMenu
          className={`w-full h-full p-0.5 ${isMenuActive ? 'text-indigo-500' : 'text-white'} bg-[--bg-two] duration-200 transition-all ease-linear overflow-hidden`}
        />
      </button>
      <QueryFilterModal
        isActive={isMenuActive}
        toggleFunction={toggleMenu}
        filters={filters}
      />
    </div>
  )
}
