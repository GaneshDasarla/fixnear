import React, { createContext, useContext, useState, useEffect } from "react";
import config from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Persist token and user to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Validate backend availability and token on startup when we have a token/user
  useEffect(() => {
    const validateSession = async () => {
      if (!token || !user || !user.userId) return;

      try {
        // Ping a protected endpoint to validate token and backend availability
        const resp = await fetch(`${config.API_BASE}/api/bookings?userId=${user.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (resp.status === 401) {
          // Token invalid or expired
          setToken(null);
          setUser(null);
          setError("Session expired. Please log in again.");
        } else if (resp.ok) {
          setError("");
        } else {
          // Backend responded but non-OK (e.g., 500)
          setError("Backend is currently unavailable. Some features may not work.");
        }
      } catch (e) {
        // Network error - backend unreachable
        setError("Cannot reach backend. You're offline or the server is down.");
      }
    };

    validateSession();
    // re-run validation occasionally while app is open
    const interval = setInterval(validateSession, 60 * 1000);
    return () => clearInterval(interval);
  }, [token, user]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${config.API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      // Check if token exists in response (not null/undefined) to determine success
      if (!data.token) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      setUser({ 
        userId: data.userId, 
        userName: data.userName, 
        email: data.email 
      });
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${config.API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      // Check if token exists in response (not null/undefined) to determine success
      if (!data.token) {
        throw new Error(data.message || "Signup failed");
      }

      setToken(data.token);
      // store full user info returned from backend
      const userObj = { userId: data.userId, userName: data.userName, email: data.email };
      setUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setError("");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
