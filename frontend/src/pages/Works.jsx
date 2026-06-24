import React, { useState, useEffect } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../components/UI/Spinner";

const Works = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/api/projects");
        setProjects(response.data);
      } catch (err) {
        setError("Error loading our projects. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="w-full min-h-screen bg-brand-grayBg py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-4 mb-16 animate-slide-up">
          <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
            Our Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight">
            Projects We've Built
          </h1>
          <div className="w-16 h-1 bg-brand-orange rounded-full" />
          <p className="text-xs sm:text-sm text-brand-dark/60 font-light max-w-xl">
            Explore our diverse range of engineering landmarks. From modern sustainable office blocks to custom residential smart estates.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-32 w-full">
            <Spinner size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-sm text-red-500 font-medium bg-white rounded-xl border border-red-200 p-6 max-w-md mx-auto">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-xl border border-brand-dark/5 shadow-xs p-8 max-w-lg mx-auto animate-slide-up">
            <p className="text-sm text-brand-dark/50 font-medium">No projects found.</p>
            <p className="text-xs text-brand-dark/40 font-light mt-1">Please seed the database or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Works;
