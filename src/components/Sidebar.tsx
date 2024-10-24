import { useState } from 'react'
import {
  MdFavorite,
  MdHeadphones,
  MdHome,
  MdMenu,
  MdSearch,
} from 'react-icons/md'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  // toggle function
  const tf = (style: string) => {
    return isExpanded ? style : ''
  }

  const toggleMenu = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="w-5">
      <aside
        className={`flex fixed z-40 h-fit my-1 mr-1 text-white bg-zinc-950 rounded-tr-lg rounded-br-lg w-10 overflow-hidden group  ${tf('w-44 fixed')} transition-all ease-in-out duration-300`}
      >
        <nav
          className={`w-10 ${tf('w-40')} transition-all ease-in-out duration-300 p-2`}
        >
          {/*  */}
          <h3 className="flex items-center text-2xl mb-3">
            <button
              className="text-2xl hover:text-purple-500"
              onClick={toggleMenu}
            >
              {isExpanded ? <MdHeadphones /> : <MdMenu />}
            </button>
            <span className={`text-transparent underline ${tf('text-white')}`}>
              Spofify
            </span>
          </h3>
          {/*  */}
          <div className="flex flex-col gap-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-1 text-lg hover:text-indigo-500 ${isActive ? 'text-indigo-500' : ''}`
              }
              to="/"
            >
              <span className="text-2xl">
                <MdHome />
              </span>
              <span className={`text-transparent ${tf('text-white')}`}>
                Home
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-1 text-lg hover:text-purple-500 ${isActive ? 'text-purple-500' : ''}`
              }
              to="/posts"
            >
              <span className="text-2xl">
                <MdSearch />
              </span>
              <span className={`text-transparent ${tf('text-white')}`}>
                Search
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-1 text-lg hover:text-purple-500 ${isActive ? 'text-purple-500' : ''}`
              }
              to="Favorites"
            >
              <span className="text-2xl">
                <MdFavorite />
              </span>
              <span className={`text-transparent ${tf('text-white')}`}>
                Favorites
              </span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </div>
  )
}

export default Sidebar
