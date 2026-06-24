import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { getMediaUrl } from "../services/api";

const ProjectCard = ({ project = {} }) => {
  const { _id, title, thumbnail, location, year } = project;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-brand-dark/5 transition-all duration-300 flex flex-col h-full animate-slide-up">
      {/* Image Wrapper */}
      <div className="relative overflow-hidden aspect-[4/3] bg-brand-grayBg">
        <img
          src={getMediaUrl(thumbnail)}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
            Featured Work
          </span>
          <h3 className="text-base sm:text-lg font-bold text-brand-dark line-clamp-1 group-hover:text-brand-orange transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Location & Calendar */}
        <div className="flex items-center gap-4 text-xs text-brand-dark/60 font-medium">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin size={14} className="text-brand-orange shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar size={14} className="text-brand-orange shrink-0" />
            <span>{year}</span>
          </div>
        </div>

        {/* Detail Link */}
        <div className="mt-auto pt-4 border-t border-brand-dark/5">
          <Link
            to={`/works/${_id}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-orange hover:text-brand-orangeHover group/btn transition-colors duration-200"
          >
            View Details
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
