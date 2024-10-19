import { Outlet } from 'react-router-dom'
// local imports
import Musicbar from './ui/Musicbar'
import Sidebar from './ui/Sidebar'

export default function RootLayout() {
  return (
    <>
      {/* TODO: header */}
      <main className="flex">
        <Sidebar />
        <div className="flex w-full h-full">
          <Outlet />
        </div>
      </main>
      {/* audio controls */}
      <Musicbar />
    </>
  )
}
