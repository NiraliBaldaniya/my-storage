import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import SignUp from './Register'
import LogIn from './Login'
import Home from './Home'
import ProtectedRoute from './ProtectedRoute'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>

      <Route path="/Register" element={<SignUp />} />
      <Route path="/" element={<LogIn />} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
