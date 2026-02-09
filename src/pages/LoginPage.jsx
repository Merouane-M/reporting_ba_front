import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home"); // fake login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-sofigrey">
      <div className="relative w-6/7 h-[85vh] rounded-xl overflow-hidden shadow-2xl flex ">
        <img
          src="/LoginImage.jpg"
          alt="Login"
          className="absolute inset-0 w-full h-full object-cover "
        />

        <div className="relative z-10 flex w-full h-full">
          <div className="w-1/2 flex flex-col justify-center items-center  p-12 ">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary absolute top-4 left-4"
            >
              Retour
            </button>


            <img
              src="/logo-sofinance-white.svg"
              alt="Logo"
              className="w-1/3 h-1/3 drop-shadow-3xl object-contain"
            />

            <h1 className="text-4xl text-white mt-6 font-bold drop-shadow-3xl text-center">
              Bienvenue
            </h1>
            <h2 className="text-2xl text-white font-medium mt-2 text-center drop-shadow-3xl">
              sur l’outil de reporting Sofinance
            </h2>
          </div>

       
          <div className="w-1/2 flex justify-center items-center p-12">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-6 text-sofiblue text-center">
                Connexion
              </h2>

              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sofiblue"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-medium">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sofiblue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Masquer" : "Afficher"}
                  </button>
                </div>
              </div>

          
              <button
                type="submit"
                className="btn btn-primary w-full "
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
