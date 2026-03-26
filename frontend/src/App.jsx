import { useState } from 'react'
import './App.css'
import Navigation from './layouts/Navigation.jsx'
import Footer from './layouts/Footer.jsx'
import Form from './hooks/Form.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Card from './components/Card.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation />
      <Landing />
      <span>
        <Card />
        <Card />
        <Card />
      </span>
      <br />
      <Form />
      <Footer />
    </>
  )
}

export default App
