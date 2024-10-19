import { Outlet } from 'react-router-dom'
import MusicBar from './ui/MusicBar'
import Sidebar from './ui/sidebar'

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
      <MusicBar />
    </>
  )
}
