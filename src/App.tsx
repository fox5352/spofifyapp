import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import RootLayout from './Rootlayout'
import Home from './pages/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
