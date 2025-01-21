import './App.css'
import { BrowserRouter, Routes, Route } from "react-router"
import Authorization from './pages/Authorization'
import Home from './pages/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authorize" element={<Authorization />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
