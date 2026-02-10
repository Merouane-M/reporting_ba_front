import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken, logout as logoutService } from "../services/auth.service";
import { getProfile } from "../services/user.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuth(true);

      // Fetch profile once
      getProfile()
        .then((data) => setProfile(data))
        .finally(() => setLoadingProfile(false));
    } else {
      setLoadingProfile(false);
    }
  }, []);

  const login = async () => {
    setIsAuth(true);
    setLoadingProfile(true);

    // Fetch profile after login
    const data = await getProfile();
    setProfile(data);
    setLoadingProfile(false);
  };

  const logout = () => {
    logoutService(); // removes token from storage
    setIsAuth(false);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, profile, loadingProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
