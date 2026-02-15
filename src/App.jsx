import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/Notfound";
import DocumentsPage from "./pages/DocumentsPage";
import CreateDEEPage from "./pages/CreateDEEPage";
import EditDEEPage from "./pages/EditDEEPage";
import CreateDPCPage from "./pages/CreateDPCPage";
import EditDPCPage from "./pages/EditDPCPage";
import CreateDGRPage from "./pages/CreateDGRPage";
import EditDGRPage from "./pages/EditDGRPage";
import { DocumentProvider } from "./context/DocumentContext";

function App() {
  return (
    <Router>
      <DocumentProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<DashboardPage />} />

          <Route path="/documents/:type" element={<DocumentsPage />} />

          <Route path="/documents/dee/create" element={<CreateDEEPage />} />
          <Route path="/documents/dee/edit/:id" element={<EditDEEPage />} />

          <Route path="/documents/dpc/create" element={<CreateDPCPage />} />
          <Route path="/documents/dpc/edit/:id" element={<EditDPCPage />} />

          <Route path="/documents/dgr/create" element={<CreateDGRPage />} />
          <Route path="/documents/dgr/edit/:id" element={<EditDGRPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </DocumentProvider>
    </Router>
  );
}

export default App;
