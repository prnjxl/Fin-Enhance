import { useState } from 'react'
import './App.css'
import Navigation from './layouts/Navigation.jsx'
import Footer from './layouts/Footer.jsx'
import Hero from './pages/Hero.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation />
      <Footer />
    </>
  )
}

export default App
