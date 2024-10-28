import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import RootLayout from './Rootlayout'
import Home from './pages/Home/Home'

import Posts from './pages/shows/Posts'
import PostDetail from './pages/shows/[showId]/ShowDetail'
import SeasonsSection from './pages/shows/[showId]/SeasonsSection'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:id" element={<PostDetail />}>
            <Route index element={<SeasonsSection />} />
            <Route path="season" element={<h2>season</h2>} />
          </Route>

          <Route path="*" element={<h1>404 ...</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
