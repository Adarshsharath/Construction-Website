import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate the JWT token stored on client side
  const verifyToken = async (activeToken) => {
    try {
      const response = await api.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (response.data.valid) {
        setUser(response.data.username);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Authenticate user credentials
  const login = async (username, password) => {
    try {
      const response = await api.post("/api/auth/login", { username, password });
      const { access_token, username: resUser } = response.data;
      localStorage.setItem("admin_token", access_token);
      setToken(access_token);
      setUser(resUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid username or password credentials."
      };
    }
  };

  // Terminate authentication session
  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
