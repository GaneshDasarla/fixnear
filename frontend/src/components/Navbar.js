import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/fixnearlogo.png";

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="top-navbar">

      {/* LEFT : LOGO + BRAND (CLICKABLE) */}
      <NavLink
        to="/"
        className="nav-left"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={logo} alt="FixNear Logo" className="nav-logo" />
        <span className="brand-name">FixNear</span>
      </NavLink>

      {/* CENTER : NAV LINKS */}
      <div className="nav-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Services
        </NavLink>

        <NavLink
          to="/how-it-works"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          How It Works
        </NavLink>

        <NavLink
          to="/become-provider"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Become a Provider
        </NavLink>
      </div>

      {/* RIGHT : AUTH BUTTONS or USER MENU */}
      <div className="nav-right">
        {token && user ? (
          <div className="user-menu">
            <NavLink to="/cart" className="nav-item" title="My Bookings">
              📋 Cart
            </NavLink>
            <NavLink to="/provider-dashboard" className="nav-item" title="Provider Dashboard">
              👷 Dashboard
            </NavLink>
            <span className="user-greeting">Welcome, {user.email}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/login" className="login-btn">
              Log In
            </NavLink>
            <NavLink to="/signup" className="signup-btn">
              Sign Up
            </NavLink>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
