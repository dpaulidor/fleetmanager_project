import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Login.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation des champs
    if (!name || !email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    // Validation du mot de passe
    if (password.length < 4) {
      setError("Le mot de passe doit contenir au moins 4 caractères");
      return;
    }

    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Utiliser le service d'authentification
    const result = registerUser({ name, email, password });

    if (result.success) {
      setSuccess(result.message);
      // Rediriger vers la page de connexion après 1.5 secondes
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Inscription</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit">S'inscrire</button>

        <p className="register-link">
          Déjà un compte ? <a href="/">Se connecter</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
