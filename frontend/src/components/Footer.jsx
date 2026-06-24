import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "../assets/logo.png";

const Footer = ({ settings = {} }) => {
  const currentYear = new Date().getFullYear();
  const companyName = settings.company_name || "NovaBuild Group";
  
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-brand-dark/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Company Profile */}
          <div className="flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt={companyName}
                className="h-20 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              NovaBuild Group delivers structural excellence and premium architectural engineering services for residential, commercial, and renovation clients. We construct with safety and integrity.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4 md:pl-12 animate-slide-up animate-delay-100">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-brand-orange transition-colors font-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/works" className="text-sm text-gray-400 hover:text-brand-orange transition-colors font-light">
                  Our Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-brand-orange transition-colors font-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-brand-orange transition-colors font-light">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-gray-400 hover:text-brand-orange transition-colors font-light">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col gap-4 animate-slide-up animate-delay-200">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
              Contact Info
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 font-light leading-relaxed">
                  {settings.address || "782 Construction Boulevard, Floor 14, Austin, TX 78701"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-orange shrink-0" />
                <a
                  href={`tel:${settings.phone || "+1 (555) 382-9182"}`}
                  className="text-sm text-gray-400 hover:text-brand-orange transition-colors font-light"
                >
                  {settings.phone || "+1 (555) 382-9182"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-orange shrink-0" />
                <a
                  href={`mailto:${settings.email || "info@novabuildgroup.com"}`}
                  className="text-sm text-gray-400 hover:text-brand-orange transition-colors font-light break-all"
                >
                  {settings.email || "info@novabuildgroup.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-light">
          <p>© {currentYear} {companyName}. All rights reserved.</p>
          <p>Designed with premium aesthetics.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
