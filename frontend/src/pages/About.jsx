import React from "react";
import { Shield, Target, Compass, HardHat } from "lucide-react";

const About = ({ settings = {} }) => {
  const stats = [
    { label: "Years of Experience", count: "15+" },
    { label: "Completed Projects", count: "180+" },
    { label: "Safety Records Audit", count: "100%" },
    { label: "Active Engineers & Workforce", count: "350+" }
  ];

  return (
    <div className="w-full min-h-screen bg-brand-grayBg">
      
      {/* 1. Header Section */}
      <section className="bg-brand-dark text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80"
            alt="Architecture background"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 animate-slide-up">
          <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
            About Our Company
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Our Legacy of Trust & Engineering
          </h1>
          <div className="w-16 h-1 bg-brand-orange rounded-full" />
        </div>
      </section>

      {/* 2. Main Narrative & Image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story text */}
            <div className="flex flex-col gap-6 animate-slide-up">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                Pioneering Structural Masterpieces Since 2010
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/70 font-light leading-relaxed">
                {settings.about_text || "Founded in 2010, Apex Structures has established itself as a premier construction and engineering firm. We pride ourselves on executing high-quality, sustainable projects that shape skylines and empower communities."}
              </p>
              <p className="text-sm text-brand-dark/60 font-light leading-relaxed">
                Our approach is deeply collaborative. We work side-by-side with local city planners, certified architects, and environmental inspectors to ensure that our projects are not only beautiful but comply with LEED gold efficiency standards, water-conservation regulations, and local seismic parameters.
              </p>
            </div>

            {/* Collage image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-brand-grayBg animate-slide-up animate-delay-200">
              <img
                src="https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80"
                alt="Engineering details"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="py-16 bg-brand-dark text-white border-t border-brand-orange/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((st, i) => (
              <div 
                key={st.label} 
                className="flex flex-col gap-2 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-3xl sm:text-5xl font-extrabold text-brand-orange">{st.count}</span>
                <span className="text-xs text-gray-400 font-light uppercase tracking-wider">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vision & Mission Cards */}
      <section className="py-20 bg-brand-grayBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mission */}
            <div className="bg-white p-8 rounded-xl shadow-xs border border-brand-dark/5 flex flex-col gap-6 animate-slide-up">
              <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-lg w-fit">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold text-brand-dark">Our Mission</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-light leading-relaxed">
                To construct state-of-the-art facilities utilizing lean building technologies, local certified workforce resources, and raw material validation audits, bringing structural designs to life safely.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-xl shadow-xs border border-brand-dark/5 flex flex-col gap-6 animate-slide-up animate-delay-100">
              <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-lg w-fit">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-brand-dark">Our Vision</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-light leading-relaxed">
                To build sustainable infrastructures that inspire communities, utilizing carbon-neutral concrete, passive heating systems, and solar energy grids, reducing project environmental footprints.
              </p>
            </div>

            {/* Safety Core */}
            <div className="bg-white p-8 rounded-xl shadow-xs border border-brand-dark/5 flex flex-col gap-6 animate-slide-up animate-delay-200">
              <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-lg w-fit">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-brand-dark">Our Safety Philosophy</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-light leading-relaxed">
                We believe that every worker should return home safely. We enforce mandatory safety briefings, daily gear audits, standard hazard training, and maintain a rigorous zero-injury workplace standard.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
