// filepath: src/services/authService.js

const USERS_KEY = "fleetmanager_users";
const CURRENT_USER_KEY = "fleetmanager_current_user";

// Obtenir tous les utilisateurs enregistrés
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Enregistrer un nouvel utilisateur
export const registerUser = (userData) => {
  const users = getUsers();
  
  // Vérifier si l'email existe déjà
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, message: "Cet email est déjà utilisé" };
  }
  
  // Créer le nouvel utilisateur
  const newUser = {
    id: Date.now(),
    email: userData.email,
    password: userData.password,
    name: userData.name,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return { success: true, message: "Inscription réussie", user: newUser };
};

// Authentifier un utilisateur
export const loginUser = (email, password) => {
  const users = getUsers();
  
  // Chercher l'utilisateur par email et mot de passe
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Stocker l'utilisateur courant (sans le mot de passe)
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, message: "Connexion réussie", user: userWithoutPassword };
  }
  
  return { success: false, message: "Email ou mot de passe incorrect" };
};

// Déconnexion
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  return { success: true, message: "Déconnexion réussie" };
};

// Obtenir l'utilisateur courant
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Vérifier si un utilisateur est connecté
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Supprimer un utilisateur (pour admin)
export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  return { success: true, message: "Utilisateur supprimé" };
};