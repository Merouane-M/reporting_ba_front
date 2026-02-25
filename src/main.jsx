import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext.jsx";
import { DocumentProvider } from "./context/DocumentContext";

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
          <DocumentProvider>

    <App />
          </DocumentProvider>
  </AuthProvider>
  </StrictMode>,
)
