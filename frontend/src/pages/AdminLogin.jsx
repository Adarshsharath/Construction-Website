import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already authenticated, redirect to admin dashboard immediately
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(username, password);
    if (result.success) {
      navigate("/admin", { replace: true });
    } else {
      setError(result.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-brand-grayBg p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-brand-dark/5 p-8 sm:p-10 shadow-md flex flex-col gap-8 animate-slide-up">
        
        {/* Banner */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={logo}
            alt="Company Logo"
            className="h-16 w-auto object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark tracking-tight">
            Admin Console Portal
          </h1>
          <p className="text-xs text-brand-dark/50 font-light">
            Please authenticate to manage building portfolios, site details, and inquiries.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm p-4 rounded-lg font-medium text-center">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Admin Username"
            id="username"
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Security Password"
            id="password"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="pt-2">
            <Button type="submit" isLoading={loading} className="w-full py-3 text-sm font-semibold">
              Sign In to Console
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
