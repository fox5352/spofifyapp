import { Outlet } from 'react-router-dom'
// local imports
import Sidebar from './components/Sidebar'
import Musicbar from './components/Musicbar'

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
