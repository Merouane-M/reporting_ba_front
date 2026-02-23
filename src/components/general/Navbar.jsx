import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

function Navbar({ hidden, isExpanded }) {
  const navigate = useNavigate();
  const { logout, profile, loadingProfile } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 right-0 z-10 h-1/14 bg-white shadow
        transition-all duration-300 ease-in-out
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${isExpanded ? "left-64 w-[calc(100%-16rem)]" : "left-16 w-[calc(100%-4rem)]"}
      `}
    >
      <div className="h-full w-full mx-2 px-5 flex justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {!loadingProfile && profile ? (
            <h1 className="text-2xl text-sofiblue font-medium mt-2">
              Bonjour, {profile.prenom} {profile.nom}
            </h1>
          ) : (
            <div className="w-48 h-6 bg-gray-200 animate-pulse rounded" />
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={() => navigate("/home")}>
            Accueil
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
