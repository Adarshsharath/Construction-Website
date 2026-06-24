import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import api from "../services/api";
import Input from "../components/UI/Input";
import TextArea from "../components/UI/TextArea";
import Button from "../components/UI/Button";

const Contact = ({ settings = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/api/inquiries", formData);
      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "There was an error submitting your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Maps embed URL from database settings (admin-configurable)
  const mapEmbedUrl = settings.map_url ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.7463722212!2d-97.85023909778248!3d30.307982264627263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0ef5441%3A0x11a34b8d74542bb2!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus";

  return (
    <div className="w-full min-h-screen bg-brand-grayBg py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16 animate-slide-up">
          <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
            Get in touch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight">
            Connect With Our Desk
          </h1>
          <div className="w-16 h-1 bg-brand-orange rounded-full" />
          <p className="text-xs sm:text-sm text-brand-dark/60 font-light max-w-xl">
            Whether you want a preliminary construction budget calculation or need a project scheduler consult, we are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-dark/5 p-6 sm:p-10 shadow-xs flex flex-col gap-8 animate-slide-up">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-brand-dark">Send an Inquiry</h2>
              <p className="text-xs text-brand-dark/55 mt-1 font-light">We will respond within 24 business hours.</p>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm p-4 rounded-lg font-medium">
                Thank you! Your construction inquiry has been logged successfully.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm p-4 rounded-lg font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  id="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  label="Phone Number"
                  id="phone"
                  required
                  placeholder="e.g. +1 555-019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <Input
                label="Email Address"
                id="email"
                type="email"
                required
                placeholder="e.g. john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <TextArea
                label="Project Details & Requirements"
                id="message"
                required
                rows={5}
                placeholder="Describe your site parameters, timeline, category (residential/commercial) or renovation details..."
                value={formData.message}
                onChange={handleChange}
              />
              <div>
                <Button type="submit" isLoading={loading} className="w-full sm:w-auto">
                  Send Message <Send size={14} className="ml-2" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right: Info & Map */}
          <div className="lg:col-span-5 flex flex-col gap-8 animate-slide-up animate-delay-100">
            {/* Quick Contacts Panel */}
            <div className="bg-white rounded-2xl border border-brand-dark/5 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              <h3 className="text-base sm:text-lg font-bold text-brand-dark">Company Information</h3>
              <div className="flex flex-col gap-5">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-brand-dark/45 font-medium">Office Location</span>
                    <span className="text-xs sm:text-sm text-brand-dark font-semibold leading-relaxed">
                      {settings.address || "782 Construction Boulevard, Floor 14, Austin, TX 78701"}
                    </span>
                  </div>
                </div>

                {/* Call */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-brand-dark/45 font-medium">Call Operations</span>
                    <a
                      href={`tel:${(settings.phone || "+15553829182").replace(/[^\d+]/g, "")}`}
                      className="text-xs sm:text-sm text-brand-dark font-semibold hover:text-brand-orange transition-colors"
                    >
                      {settings.phone || "+1 (555) 382-9182"}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-brand-dark/45 font-medium">Email Desk</span>
                    <a
                      href={`mailto:${settings.email || "info@novabuildgroup.com"}`}
                      className="text-xs sm:text-sm text-brand-dark font-semibold hover:text-brand-orange transition-colors break-all"
                    >
                      {settings.email || "info@novabuildgroup.com"}
                    </a>
                  </div>
                </div>

                {/* WhatsApp Action */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg shrink-0 mt-0.5">
                    <MessageCircle size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-brand-dark/45 font-medium">WhatsApp Assistance</span>
                    <a
                      href={`https://wa.me/${(settings.whatsapp || "+15553829182").replace(/[^\d]/g, "")}?text=Hi NovaBuild Group, I am interested in building services.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-brand-orange font-semibold hover:underline"
                    >
                      Click to chat live
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-2xl border border-brand-dark/5 overflow-hidden shadow-xs h-64 bg-brand-grayBg relative">
              <iframe
                title="Office Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[10%]"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
