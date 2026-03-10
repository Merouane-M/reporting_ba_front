import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

function ProtectedRoute() {
  const { isAuth, loadingProfile } = useAuthContext();

  if (loadingProfile) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;