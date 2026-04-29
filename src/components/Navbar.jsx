import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h1 className="navbar-title">
            {user?.name ? `Bienvenue, ${user.name}` : "FleetManager"}
          </h1>
        </div>
        <div className="navbar-right">
          <div className="user-avatar">
            <span className="avatar-text">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
