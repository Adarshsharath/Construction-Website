import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Lightbox = ({ images = [], currentIndex = 0, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Suppress body scroll
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onPrev, onNext]);

  if (images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-xs transition-all duration-300"
      onClick={onClose}
    >
      {/* Close Control */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Back Control */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-50 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      {/* Forward Control */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-50 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={36} />
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Gallery view ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl animate-fade-in"
        />
        {/* Gallery index banner */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-xs font-semibold select-none">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
