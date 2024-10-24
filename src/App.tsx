import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import RootLayout from './Rootlayout'
import Home from './pages/Home/Home'
import Posts from './pages/posts/Posts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="posts" element={<Posts />} />

          <Route path="*" element={<h1>404 ...</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
