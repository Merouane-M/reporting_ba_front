import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sofigrey text-center px-6">
      <h1 className="text-7xl font-bold text-sofiblue mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page introuvable</h2>
      <p className="text-gray-600 mb-6">
        Oups… la page que vous cherchez n’existe pas.
      </p>

      <button
        onClick={() => navigate("/home")}
        className="bg-sofiblue text-white px-6 py-3 rounded-lg font-semibold shadow hover:opacity-90"
      >
        Retour à l’accueil
      </button>
    </div>
  );
}

export default NotFound;
