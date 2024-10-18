import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import RootLayout from './Rootlayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<h1>hello, react</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
