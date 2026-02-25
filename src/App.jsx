import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/Notfound";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";

import CreateDEEPage from "./pages/CreateDEEPage";
import EditDEEPage from "./pages/EditDEEPage";

import CreateDPCPage from "./pages/CreateDPCPage";
import EditDPCPage from "./pages/EditDPCPage";

import CreateDGRPage from "./pages/CreateDGRPage";
import EditDGRPage from "./pages/EditDGRPage";

import CreateDCSPage from "./pages/CreateDCSPage";
import EditDCSPage from "./pages/EditDCSPage";

import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<DashboardPage />} />

          <Route path="/documents/:type" element={<DocumentsPage />} />

          <Route path="/documents/dee/create" element={<CreateDEEPage />} />
          <Route path="/documents/dee/edit/:id" element={<EditDEEPage />} />

          <Route path="/documents/dpc/create" element={<CreateDPCPage />} />
          <Route path="/documents/dpc/edit/:id" element={<EditDPCPage />} />

          <Route path="/documents/dgr/create" element={<CreateDGRPage />} />
          <Route path="/documents/dgr/edit/:id" element={<EditDGRPage />} />

          <Route path="/documents/dcs/create" element={<CreateDCSPage />} />
          <Route path="/documents/dcs/edit/:id" element={<EditDCSPage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
