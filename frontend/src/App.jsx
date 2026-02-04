import { useState } from 'react'
import './App.css'
import Navigation from './layouts/Navigation.jsx'
import Footer from './layouts/Footer.jsx'
import Form from './components/Form.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation />
      <Form></Form>
      <Footer />
    </>
  )
}

export default App
