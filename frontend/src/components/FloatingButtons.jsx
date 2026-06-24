import React from "react";
import { Phone, MessageCircle } from "lucide-react";

const FloatingButtons = ({ phone = "+15553829182", whatsapp = "+15553829182" }) => {
  // Sanitize the inputs for anchors
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, ""); // wa.me prefers digits only

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanWhatsapp}?text=Hello%20NovaBuild%20Group,%20I%20would%20like%20to%20inquire%20about%20your%20construction%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 hover:shadow-xl transition-all duration-200 border border-white/10"
        title="Chat on WhatsApp"
        id="whatsapp-floating-btn"
      >
        <MessageCircle size={28} className="fill-white stroke-[#25D366] stroke-[1.5]" />
      </a>

      {/* Click to Call Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="flex items-center justify-center w-14 h-14 bg-brand-orange text-white rounded-full shadow-lg hover:scale-110 active:scale-95 hover:shadow-xl transition-all duration-200 border border-white/10"
        title="Call Now"
        id="call-floating-btn"
      >
        <Phone size={22} className="fill-white stroke-none" />
      </a>
    </div>
  );
};

export default FloatingButtons;
