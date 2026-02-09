import { useNavigate } from "react-router-dom";

function Navbar({ hidden, isExpanded }) { // Accept isExpanded prop
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 right-0 z-50 h-1/14 bg-white shadow
                  transition-all duration-300 ease-in-out // Added transition-all for left/width changes
                  ${hidden ? "-translate-y-full" : "translate-y-0"}
                  ${isExpanded ? "left-64 w-[calc(100%-16rem)]" : "left-16 w-[calc(100%-4rem)]"}`} // Dynamic left and width
    >
      <div className="h-full max-w-7xl mx-auto px-2 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl text-sofiblue font-medium mt-2 text-center drop-shadow-3xl">
            Bonjour, Mr
          </h1>
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