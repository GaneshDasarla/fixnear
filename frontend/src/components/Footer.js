import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [mode, setMode] = useState("normal");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme") || "normal";
    setMode(savedMode);
    document.body.className = savedMode === "black" ? "black" : "";
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "normal" ? "black" : "normal";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    document.body.className = newMode === "black" ? "black" : "";
  };

  return (
    <>
      {/* FOOTER CONTENT */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            {/* ✅ ADDED LINK (NO STRUCTURE CHANGE) */}
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h3>FixNear</h3>
            </Link>

            <p>
              Connecting you with trusted local service professionals,
              instantly.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <p>Browse All</p>
            <p>Plumbing</p>
            <p>Electrical</p>
            <p>Mechanic</p>
          </div>

          <div>
            <h4>Company</h4>
            <p>How It Works</p>
            <p>About Us</p>
            <p>Become a Provider</p>
          </div>

          <div>
            <h4>Support</h4>
            <p>Help Center</p>
            <p>Contact</p>
            <p>Privacy Policy</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 FixNear. All rights reserved.
        </div>
      </footer>

      {/* FLOATING THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {mode === "normal" ? "🌙" : "☀️"}
      </button>
    </>
  );
}

export default Footer;
