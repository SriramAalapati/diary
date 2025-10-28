import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import DummyPage from './pages/Dummy'
import Dashboard from './pages/dashboard/Dashboard'
import Tasks from './pages/tasks/Tasks'
import Loans from './pages/loans/Loans'
import AuthPages from './pages/auth/AuthPages'
import UnderConstruction from './pages/UnderConstruction';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPages mode='login'/>}/>
          <Route path="/login" element={<AuthPages mode='login'/>}/>
          <Route path="/register" element={<AuthPages mode='register'/>}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/tasks" element={<ProtectedRoute><Tasks/></ProtectedRoute>}/>
          <Route path="/loans" element={<ProtectedRoute><Loans/></ProtectedRoute>}/>
          <Route path="/today" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/notes" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/tomorrow" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/job-tracker" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/study" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/goals" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/health" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/trash" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
          <Route path="/settings" element={<ProtectedRoute><UnderConstruction/></ProtectedRoute>}/>
        </Routes> 
      </Router>
    </>
  )
}

export default App
