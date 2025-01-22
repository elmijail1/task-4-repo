// general
import './App.css'
import { useEffect, useState } from 'react'
// routing
import { BrowserRouter, Routes, Route } from "react-router"
// authorization
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
// pages & components
import Authorization from './pages/Authorization'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  const [user, setUser] = useState(null)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setIsFetching(false)
        return
      }
      setUser(null)
      setIsFetching(false)
    })

    return () => unsubscribe()
  }, [])

  if (isFetching) {
    return <p>Loading...</p>
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/authorize" element={<Authorization />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
