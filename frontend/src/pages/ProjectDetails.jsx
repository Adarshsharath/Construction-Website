import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, ArrowLeft, Maximize2 } from "lucide-react";
import api from "../services/api";
import Spinner from "../components/UI/Spinner";
import Lightbox from "../components/Lightbox";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-brand-grayBg">
        <Spinner size="large" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-grayBg p-4">
        <div className="text-center bg-white p-8 rounded-xl border border-brand-dark/5 shadow-xs max-w-md">
          <p className="text-sm text-red-500 font-medium mb-4">{error || "Project not found."}</p>
          <Link to="/works">
            <button className="px-5 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-lg hover:bg-brand-orangeHover transition-colors">
              Back to Portfolio
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Create list of all images (thumbnail + gallery list)
  const allImages = [project.thumbnail, ...(project.gallery || [])].filter(Boolean);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full min-h-screen bg-brand-grayBg py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <Link
          to="/works"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark/60 hover:text-brand-orange transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={16} />
          Back to all works
        </Link>

        {/* Main Details Panel */}
        <div className="bg-white rounded-2xl border border-brand-dark/5 overflow-hidden shadow-xs p-6 sm:p-10 mb-10 flex flex-col gap-10">
          
          {/* Header metadata */}
          <div className="flex flex-col gap-4 animate-slide-up">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Project Case Study
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight leading-tight">
              {project.title}
            </h1>
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-6 mt-2 text-xs font-semibold text-brand-dark/60">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-brand-orange" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-brand-orange" />
                <span>Completion Year: {project.year}</span>
              </div>
            </div>
          </div>

          {/* Featured Hero Banner */}
          <div 
            className="relative rounded-xl overflow-hidden aspect-[16/9] group cursor-zoom-in bg-brand-grayBg shadow-inner animate-slide-up animate-delay-100"
            onClick={() => openLightbox(0)}
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            {/* Hover overlay indicator */}
            <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="p-3 bg-white/95 text-brand-dark rounded-full shadow-lg">
                <Maximize2 size={20} />
              </div>
            </div>
          </div>

          {/* Description details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-brand-dark/5 animate-slide-up animate-delay-200">
            <div className="md:col-span-2 flex flex-col gap-4">
              <h3 className="text-base sm:text-lg font-bold text-brand-dark">Project Summary</h3>
              <p className="text-sm text-brand-dark/70 font-light leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
            
            <div className="bg-brand-grayBg rounded-xl p-6 flex flex-col gap-4 h-fit border border-brand-dark/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark/80">Project Profile</h4>
              <ul className="space-y-3.5 text-xs text-brand-dark/70 font-medium">
                <li className="flex justify-between py-1.5 border-b border-brand-dark/5">
                  <span className="text-brand-dark/45 font-light">Status:</span>
                  <span className="text-brand-dark">Completed</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-brand-dark/5">
                  <span className="text-brand-dark/45 font-light">Location:</span>
                  <span className="text-brand-dark text-right max-w-[150px] truncate">{project.location}</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-brand-dark/5">
                  <span className="text-brand-dark/45 font-light">Year:</span>
                  <span className="text-brand-dark">{project.year}</span>
                </li>
                <li className="flex justify-between py-1.5">
                  <span className="text-brand-dark/45 font-light">Audit Safety:</span>
                  <span className="text-green-600 font-bold">100% Certified</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gallery Showcase */}
        {allImages.length > 1 && (
          <div className="bg-white rounded-2xl border border-brand-dark/5 p-6 sm:p-10 shadow-xs flex flex-col gap-8 animate-slide-up animate-delay-300">
            <h3 className="text-base sm:text-lg font-bold text-brand-dark">Media Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {allImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative rounded-lg overflow-hidden aspect-[4/3] group cursor-zoom-in bg-brand-grayBg border border-brand-dark/5"
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} gallery ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-brand-dark/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Preview Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
