import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'
import NotFound from './pages/Notfound';


function App() {
 

  return (
<Router>
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/home" element={<DashboardPage />} />


    <Route path="*" element={<NotFound />} />
  </Routes>
</Router>
  )
}

export default App
