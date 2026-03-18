import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Loading from "./Loading";

function ProtectedRoute() {
  const { isAuth, loadingProfile } = useAuthContext();

  if (loadingProfile) {
    return <Loading />;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;