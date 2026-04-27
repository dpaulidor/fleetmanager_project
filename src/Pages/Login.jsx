import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulation d'un utilisateur
    const fakeUser = {
      email: "admin@gmail.com",
      password: "1234",
    };

    if (email === fakeUser.email && password === fakeUser.password) {
      // Sauvegarde utilisateur
      localStorage.setItem("user", JSON.stringify({ email }));

      // Redirection
      navigate("/dashboard");
    } else {
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;