import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, ArrowRight, ShieldCheck, Users, Clock, DollarSign, Home as HomeIcon, Building2, HardHat, Paintbrush } from "lucide-react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../components/UI/Spinner";
import Button from "../components/UI/Button";

const Home = ({ settings = {} }) => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const heroImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await api.get("/api/projects?limit=3");
        setFeaturedProjects(response.data);
      } catch (err) {
        setError("Could not load featured projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProjects();
  }, []);

  const services = [
    {
      title: "Residential Construction",
      desc: "Custom architectural design and engineering for custom villas, estates, and high-end modern residential complexes.",
      icon: HomeIcon
    },
    {
      title: "Commercial Construction",
      desc: "Robust scheduling and execution of retail developments, corporate offices, warehouses, and structural retrofitting.",
      icon: Building2
    },
    {
      title: "Renovation Works",
      desc: "Restructuring existing spaces to modern thermal and electrical standards while maintaining historical facades.",
      icon: HardHat
    },
    {
      title: "Interior Works",
      desc: "Premium fitouts, acoustic solutions, tailored woodwork, and custom LED ambiance structures for commercial/residential lobbies.",
      icon: Paintbrush
    }
  ];

  const highlights = [
    {
      title: "Safety & Quality",
      desc: "Every project adheres to OSHA regulations and strict materials verification tests.",
      icon: ShieldCheck
    },
    {
      title: "Expert Team",
      desc: "Our structural engineers, architects, and managers hold accredited safety credentials.",
      icon: Users
    },
    {
      title: "On-Time Handover",
      desc: "Critical-path scheduling ensures timelines are met without safety shortcuts.",
      icon: Clock
    },
    {
      title: "Transparent Valuation",
      desc: "Detailed bill of quantities (BOQ) with zero hidden operational overheads.",
      icon: DollarSign
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-brand-dark text-white overflow-hidden">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Premium Construction"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-start gap-8 max-w-3xl">
          <span className="text-xs sm:text-sm font-bold text-brand-orange uppercase tracking-widest bg-brand-orange/15 px-3.5 py-1.5 rounded-full border border-brand-orange/20 animate-slide-up">
            {settings.company_name || "NovaBuild Group"}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight animate-slide-up animate-delay-100">
            {settings.hero_title || "Constructing Excellence, Delivering Trust"}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed animate-slide-up animate-delay-200">
            {settings.hero_subtitle || "Leading premium industrial, commercial, and residential projects with top-tier safety and architectural standards."}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 w-full sm:w-auto animate-slide-up animate-delay-300">
            <a
              href={`tel:${settings.phone || "+15553829182"}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange hover:bg-brand-orangeHover text-white text-sm font-bold rounded-lg transition-colors shadow-lg w-full sm:w-auto"
            >
              <Phone size={16} className="fill-current" />
              Call Now
            </a>
            <a
              href={`https://wa.me/${(settings.whatsapp || "+15553829182").replace(/[^\d]/g, "")}?text=Hi NovaBuild Group, I am interested in building services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg border border-white/25 transition-all w-full sm:w-auto"
            >
              <MessageCircle size={18} className="fill-white stroke-none" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* 2. About Section Snippet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 animate-slide-up">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                Shaping the Horizon with Professional Integrity
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/70 font-light leading-relaxed">
                {settings.about_text || "Founded in 2010, Apex Structures has established itself as a premier construction and engineering firm. We pride ourselves on executing high-quality, sustainable projects that shape skylines and empower communities."}
              </p>
              <div>
                <Link to="/about">
                  <Button variant="primary" size="md">
                    Read Our Story <ArrowRight size={16} className="ml-2 inline" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Collage/Graphic representation */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-brand-grayBg animate-slide-up animate-delay-200">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                alt="Construction Planning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="py-20 bg-brand-grayBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4 max-w-2xl mx-auto animate-slide-up">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Our Expertise
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              A Full-Service Construction Suite
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60 font-light leading-relaxed">
              We manage design concepts, architectural engineering, material sourcing, on-site supervision, and delivery audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className={`bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-brand-dark/5 hover:shadow-md transition-shadow duration-300 flex flex-col gap-6 animate-slide-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="p-3.5 bg-brand-orange/10 text-brand-orange rounded-lg w-fit">
                  <svc.icon size={24} className="stroke-[2]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-brand-dark">{svc.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed font-light">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4 max-w-2xl mx-auto animate-slide-up">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              The NovaBuild Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              Engineered for High-Stress Performance
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60 font-light leading-relaxed">
              Over the years, we have optimized our logistics chain and safety models to provide a stress-free client engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((hl, i) => (
              <div
                key={hl.title}
                className="flex flex-col gap-4 p-5 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-lg w-fit">
                  <hl.icon size={22} className="stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-brand-dark">{hl.title}</h3>
                <p className="text-xs sm:text-sm text-brand-dark/60 leading-relaxed font-light">{hl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Projects Section */}
      <section className="py-20 bg-brand-grayBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col gap-4 animate-slide-up">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                Latest Deliveries
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                Featured Projects
              </h2>
            </div>
            <Link to="/works" className="animate-slide-up animate-delay-100">
              <Button variant="secondary" size="md">
                See All Works <ArrowRight size={14} className="ml-2 inline" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 w-full">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-xs sm:text-sm text-red-500 font-medium">{error}</div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-20 text-xs sm:text-sm text-brand-dark/50 font-medium">No projects found. Seed or add new ones in the admin panel.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((proj) => (
                <ProjectCard key={proj._id} project={proj} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Contact CTA Banner */}
      <section className="py-20 bg-brand-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex flex-col gap-4 max-w-2xl animate-slide-up">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Let's Build Something Exceptional Together
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-light">
                Connect with our scheduling and engineering desk to receive a detailed preliminary consult and price evaluation.
              </p>
            </div>
            <div className="shrink-0 animate-slide-up animate-delay-100">
              <Link to="/contact">
                <button className="px-8 py-4 bg-white text-brand-orange hover:bg-brand-grayBg rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm">
                  Request a Quote
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
