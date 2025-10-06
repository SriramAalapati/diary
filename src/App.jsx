import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import DummyPage from './pages/Dummy'
import Dashboard from './pages/dashboard/Dashboard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
