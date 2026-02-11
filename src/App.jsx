import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/Notfound';
import DocumentsPage from "./pages/DocumentsPage";
import { DocumentProvider } from './context/DocumentContext';

function App() {
  return (
    <Router>
      <DocumentProvider> 
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/documents/:type" element={<DocumentsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DocumentProvider>
    </Router>
  );
}

export default App;
