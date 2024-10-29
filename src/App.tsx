import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import RootLayout from './Rootlayout'
import Home from './pages/Home/Home'

import Shows from './pages/shows/Shows'
import PostDetail from './pages/shows/[showId]/ShowDetail'
import SeasonsSection from './pages/shows/[showId]/SeasonsSection'
import SeasonDetail from './pages/shows/[showId]/SeasonDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="shows" element={<Shows />} />
          <Route path="shows/:id" element={<PostDetail />}>
            <Route index element={<SeasonsSection />} />
            <Route path="season" element={<SeasonDetail />} />
          </Route>

          <Route path="*" element={<h1>404 ...</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
