import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'
import NotFound from './pages/Notfound';
import DocumentsPage from "./pages/DocumentsPage";


function App() {
 

  return (
<Router>
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/home" element={<DashboardPage />} />
    <Route path="/documents/:type" element={<DocumentsPage />} />


    <Route path="*" element={<NotFound />} />
  </Routes>
</Router>
  )
}

export default App
