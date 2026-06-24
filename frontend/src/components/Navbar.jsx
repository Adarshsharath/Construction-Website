import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = ({ companyName = "NovaBuild Group" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Our Works", path: "/works" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt={companyName}
              className="h-20 sm:h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 py-2 relative ${
                  isActive(link.path)
                    ? "text-brand-orange"
                    : "text-brand-dark/70 hover:text-brand-orange"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-orange rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
            {/* <Link
              to="/admin"
              className="text-xs font-semibold px-4 py-2 border border-brand-orange text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all duration-200"
            >
              Admin Portal
            </Link> */}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-dark hover:text-brand-orange transition-colors duration-200 focus:outline-none p-1.5 rounded-lg border border-brand-dark/10"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass border-t border-brand-dark/5 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-brand-dark/80 hover:bg-brand-dark/5 hover:text-brand-orange"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-brand-dark/5">
              {/* <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orangeHover transition-colors duration-200"
              >
                Admin Portal
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
