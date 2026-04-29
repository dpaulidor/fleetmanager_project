import { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  logoutUser as authLogout,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté au chargement
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
