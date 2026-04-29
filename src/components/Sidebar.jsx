import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { user, logoutUser } = useContext(AuthContext);

  const menuItems = [
    {
      path: "/dashboard",
      name: "Tableau de bord",
      icon: "📊",
    },
    {
      path: "/historiques",
      name: "Historiques",
      icon: "📋",
    },
  ];

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">FleetManager</h2>
        <div className="user-info">
          <span className="user-name">{user?.name || "Utilisateur"}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
