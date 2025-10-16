import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import DummyPage from './pages/Dummy'
import Dashboard from './pages/dashboard/Dashboard'
import Tasks from './pages/tasks/Tasks'
import Loans from './pages/loans/Loans'
import Login from './pages/login/Login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/tasks" element={<Tasks/>}/>
          <Route path="/loans" element={<Loans/>}/>
        </Routes> 
      </Router>
    </>
  )
}

export default App
