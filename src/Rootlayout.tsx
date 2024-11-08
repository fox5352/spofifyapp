import { Outlet } from 'react-router-dom'
// local imports
import Sidebar from './ui/Sidebar'
import Musicbar from './ui/Musicbar'
import { useFavorite } from './store/favorites'
import { useEffect } from 'react'

export default function RootLayout() {
  const { sync } = useFavorite()

  useEffect(() => {
    sync() // synchronize favorite data with local storage
  }, [sync])

  return (
    <div className="bg-[--bg-one] text-[--text] duration-300 transition-colors ease-linear">
      {/* TODO: header */}
      <main className="flex mb-[5rem]">
        <Sidebar />
        <div className="flex w-full h-full">
          <Outlet />
        </div>
      </main>
      {/* audio controls */}
      <Musicbar />
    </div>
  )
}
