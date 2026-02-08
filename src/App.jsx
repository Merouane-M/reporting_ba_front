import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage'


function App() {
 

  return (
<Router>
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/home" element={<DashboardPage />} />
  </Routes>
</Router>
  )
}

export default App
