import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Works from "./pages/Works";
import ProjectDetails from "./pages/ProjectDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import api from "./services/api";

const AppContent = () => {
  const [settings, setSettings] = useState({});
  const location = useLocation();

  const fetchSettings = async () => {
    try {
      const response = await api.get("/api/settings");
      setSettings(response.data);
    } catch (err) {
      console.error("Could not load site configuration:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Determine if the visitor is navigating admin paths
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide general navigation elements on administrative console pages */}
      {!isAdminRoute && <Navbar companyName={settings.company_name} />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home settings={settings} />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:id" element={<ProjectDetails />} />
          <Route path="/about" element={<About settings={settings} />} />
          <Route path="/contact" element={<Contact settings={settings} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard settings={settings} onRefreshSettings={fetchSettings} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer settings={settings} />}
      {!isAdminRoute && (
        <FloatingButtons phone={settings.phone} whatsapp={settings.whatsapp} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
