import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthContext } from "../../context/AuthContext";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser, loading, error } = useAuth();
  const { login } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(email, password);
    login();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-sofiblue text-center">
        Connexion
      </h2>

      {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Mot de passe</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
