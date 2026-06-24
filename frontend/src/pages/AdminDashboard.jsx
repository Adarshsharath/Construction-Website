import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, FolderKanban, MailOpen, Settings as SettingsIcon, Plus, Pencil, Trash2, Check, CheckCircle2, Trash, X, Calendar, MapPin, Eye } from "lucide-react";
import logo from "../assets/logo.png";
import api from "../services/api";
import Spinner from "../components/UI/Spinner";
import Input from "../components/UI/Input";
import TextArea from "../components/UI/TextArea";
import Button from "../components/UI/Button";

const AdminDashboard = ({ settings = {}, onRefreshSettings }) => {
  const { logout, user } = useAuth();
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState("overview"); // overview, projects, inquiries, settings

  // DB Data States
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalInquiries: 0,
    pendingInquiries: 0
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Project Form States (Create & Edit)
  const [editingProject, setEditingProject] = useState(null); // If null, we are in "Create" mode
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    location: "",
    year: "",
    thumbnail: null,
    gallery: []
  });

  // Image Previews (Local URL storage)
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]); // Remaining server images during edit

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    company_name: "",
    hero_title: "",
    hero_subtitle: "",
    about_text: "",
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
    map_url: ""
  });

  // Selected Inquiry for Modal view
  const [viewingInquiry, setViewingInquiry] = useState(null);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projRes, inqRes, setRes] = await Promise.all([
        api.get("/api/projects"),
        api.get("/api/inquiries"),
        api.get("/api/settings")
      ]);

      const projs = projRes.data;
      const inqs = inqRes.data;
      const sets = setRes.data;

      setProjects(projs);
      setInquiries(inqs);
      
      // Calculate Stats
      const pendingCount = inqs.filter(i => i.status === "pending").length;
      setStats({
        totalProjects: projs.length,
        totalInquiries: inqs.length,
        pendingInquiries: pendingCount
      });

      // Load Settings into settings form
      setSettingsForm({
        company_name: sets.company_name || "",
        hero_title: sets.hero_title || "",
        hero_subtitle: sets.hero_subtitle || "",
        about_text: sets.about_text || "",
        phone: sets.phone || "",
        email: sets.email || "",
        whatsapp: sets.whatsapp || "",
        address: sets.address || "",
        map_url: sets.map_url || ""
      });

    } catch (err) {
      setError("Failed to fetch dashboard records. Please verify API server status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerAlert = (type, message) => {
    if (type === "success") {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setError(message);
      setTimeout(() => setError(""), 4000);
    }
  };

  // INQUIRY ACTIONS
  const handleMarkInquiry = async (id, currentStatus) => {
    setActionLoading(true);
    try {
      const nextStatus = currentStatus === "pending" ? "contacted" : "pending";
      await api.put(`/api/inquiries/${id}/status`, { status: nextStatus });
      triggerAlert("success", `Inquiry marked as ${nextStatus}!`);
      
      // Refresh only inquiries list
      const inqRes = await api.get("/api/inquiries");
      setInquiries(inqRes.data);
      const pendingCount = inqRes.data.filter(i => i.status === "pending").length;
      setStats(prev => ({ ...prev, pendingInquiries: pendingCount }));
      
      if (viewingInquiry && viewingInquiry._id === id) {
        setViewingInquiry(prev => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      triggerAlert("error", "Failed to update inquiry status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry message?")) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/inquiries/${id}`);
      triggerAlert("success", "Inquiry message deleted.");
      setViewingInquiry(null);
      
      // Refresh inquiries list
      const inqRes = await api.get("/api/inquiries");
      setInquiries(inqRes.data);
      setStats(prev => ({
        ...prev,
        totalInquiries: inqRes.data.length,
        pendingInquiries: inqRes.data.filter(i => i.status === "pending").length
      }));
    } catch (err) {
      triggerAlert("error", "Failed to delete inquiry.");
    } finally {
      setActionLoading(false);
    }
  };

  // SETTINGS ACTION
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    try {
      await api.put("/api/settings", settingsForm);
      triggerAlert("success", "Website settings updated successfully!");
      if (onRefreshSettings) onRefreshSettings(); // updates landing page layout
    } catch (err) {
      triggerAlert("error", "Failed to save site configurations.");
    } finally {
      setActionLoading(false);
    }
  };

  // PROJECT ACTIONS (CREATE & EDIT & DELETE)
  const openProjectForm = (project = null) => {
    setError("");
    if (project) {
      // Edit Mode
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        location: project.location,
        year: project.year,
        thumbnail: null,
        gallery: []
      });
      setThumbnailPreview(project.thumbnail);
      setGalleryPreviews([]);
      setExistingGallery(project.gallery || []);
    } else {
      // Create Mode
      setEditingProject(null);
      setProjectForm({
        title: "",
        description: "",
        location: "",
        year: new Date().getFullYear(),
        thumbnail: null,
        gallery: []
      });
      setThumbnailPreview("");
      setGalleryPreviews([]);
      setExistingGallery([]);
    }
    setShowProjectForm(true);
  };

  const handleProjectFileChange = (e) => {
    const { id, files } = e.target;
    if (!files || files.length === 0) return;

    if (id === "thumbnail") {
      const file = files[0];
      setProjectForm(prev => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else if (id === "gallery") {
      const selectedFiles = Array.from(files);
      setProjectForm(prev => ({ ...prev, gallery: [...prev.gallery, ...selectedFiles] }));
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedGalleryFile = (indexToRemove) => {
    setProjectForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove)
    }));
    setGalleryPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeExistingGalleryImage = (imageUrl) => {
    setExistingGallery(prev => prev.filter(url => url !== imageUrl));
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append("location", projectForm.location);
      formData.append("year", projectForm.year);
      
      if (projectForm.thumbnail) {
        formData.append("thumbnail", projectForm.thumbnail);
      }
      
      projectForm.gallery.forEach(file => {
        formData.append("gallery", file);
      });

      if (editingProject) {
        // Pass the remaining files to retain from server
        formData.append("existingGallery", JSON.stringify(existingGallery));
        await api.put(`/api/projects/${editingProject._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        triggerAlert("success", "Project updated successfully!");
      } else {
        if (!projectForm.thumbnail) {
          triggerAlert("error", "Thumbnail image is required for new projects.");
          setActionLoading(false);
          return;
        }
        await api.post("/api/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        triggerAlert("success", "New project added successfully!");
      }

      setShowProjectForm(false);
      
      // Refresh projects
      const projRes = await api.get("/api/projects");
      setProjects(projRes.data);
      setStats(prev => ({ ...prev, totalProjects: projRes.data.length }));
      
    } catch (err) {
      triggerAlert("error", err.response?.data?.message || "Failed to save project portfolio item.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this project? This will remove all files from storage.")) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/projects/${id}`);
      triggerAlert("success", "Project removed from database.");
      
      // Refresh projects
      const projRes = await api.get("/api/projects");
      setProjects(projRes.data);
      setStats(prev => ({ ...prev, totalProjects: projRes.data.length }));
    } catch (err) {
      triggerAlert("error", "Failed to delete project.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-brand-grayBg">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-brand-grayBg flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-brand-dark text-white flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Brand/Header logo */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-800">
            <img src={logo} alt="Logo" className="h-9 w-auto object-contain brightness-0 invert" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none">Console Control</span>
              <span className="text-[10px] text-gray-400 font-light mt-1">Hello, {user || "Admin"}</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => { setActiveTab("overview"); setShowProjectForm(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "overview" ? "bg-brand-orange text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>
            <button
              onClick={() => { setActiveTab("projects"); setShowProjectForm(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "projects" ? "bg-brand-orange text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <FolderKanban size={18} />
              Projects
            </button>
            <button
              onClick={() => { setActiveTab("inquiries"); setShowProjectForm(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "inquiries" ? "bg-brand-orange text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="relative">
                <MailOpen size={18} />
                {stats.pendingInquiries > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white">
                    {stats.pendingInquiries}
                  </span>
                )}
              </div>
              Inquiries
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setShowProjectForm(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "settings" ? "bg-brand-orange text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <SettingsIcon size={18} />
              Site Settings
            </button>
          </nav>
        </div>

        {/* Logout bottom button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-xs sm:text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-h-screen">
        
        {/* Banner notices */}
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm px-4 py-3 rounded-lg font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm px-4 py-3 rounded-lg font-medium animate-fade-in">
            {error}
          </div>
        )}

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8 animate-slide-up">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">Overview Dashboard</h1>
              <p className="text-xs text-brand-dark/50 mt-1 font-light">Summary of active metrics and incoming contact requests.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-xl border border-brand-dark/5 shadow-xs flex flex-col justify-between h-32">
                <span className="text-xs text-brand-dark/45 font-semibold uppercase tracking-wider">Total Projects</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-dark">{stats.totalProjects}</span>
              </div>
              {/* Card 2 */}
              <div className="bg-white p-6 rounded-xl border border-brand-dark/5 shadow-xs flex flex-col justify-between h-32">
                <span className="text-xs text-brand-dark/45 font-semibold uppercase tracking-wider">Total Inquiries</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-dark">{stats.totalInquiries}</span>
              </div>
              {/* Card 3 */}
              <div className="bg-white p-6 rounded-xl border border-brand-dark/5 shadow-xs flex flex-col justify-between h-32 relative">
                <span className="text-xs text-brand-dark/45 font-semibold uppercase tracking-wider">Pending Contacts</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-orange">{stats.pendingInquiries}</span>
                {stats.pendingInquiries > 0 && (
                  <span className="absolute top-6 right-6 w-2.5 h-2.5 bg-brand-orange rounded-full animate-ping" />
                )}
              </div>
            </div>

            {/* Recent inquiries preview */}
            <div className="bg-white rounded-xl border border-brand-dark/5 p-6 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-brand-dark">Recent Inquiries</h3>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Manage All
                </button>
              </div>

              {inquiries.length === 0 ? (
                <p className="text-xs text-brand-dark/40 py-4 font-light">No inquiries received yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-brand-dark/5 text-brand-dark/45 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Email</th>
                        <th className="py-3 px-2">Phone</th>
                        <th className="py-3 px-2">Date</th>
                        <th className="py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-dark/5 font-medium">
                      {inquiries.slice(0, 4).map((inq) => (
                        <tr key={inq._id} className="hover:bg-brand-grayBg/50">
                          <td className="py-3 px-2 text-brand-dark">{inq.name}</td>
                          <td className="py-3 px-2 text-brand-dark/70">{inq.email}</td>
                          <td className="py-3 px-2 text-brand-dark/70">{inq.phone}</td>
                          <td className="py-3 px-2 text-brand-dark/50">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                              inq.status === "contacted" ? "bg-green-100 text-green-800" : "bg-brand-orange/15 text-brand-orange"
                            }`}>
                              {inq.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PROJECTS MANAGEMENT ==================== */}
        {activeTab === "projects" && (
          <div className="flex flex-col gap-8 animate-slide-up">
            
            {/* Action headers */}
            {!showProjectForm ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">Projects Management</h1>
                    <p className="text-xs text-brand-dark/50 mt-1 font-light">Add, edit, or delete items from the database portfolio.</p>
                  </div>
                  <Button onClick={() => openProjectForm(null)} size="md">
                    <Plus size={16} className="mr-1" /> Add Project
                  </Button>
                </div>

                {/* Projects Grid List */}
                {projects.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-brand-dark/5 p-6">
                    <p className="text-xs text-brand-dark/45 font-medium">No projects in database. Click Add Project to begin.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj) => (
                      <div key={proj._id} className="bg-white border border-brand-dark/5 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between h-full">
                        <div className="aspect-[4/3] bg-brand-grayBg overflow-hidden relative">
                          <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5 flex flex-col gap-4 flex-grow">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm sm:text-base font-bold text-brand-dark line-clamp-1">{proj.title}</h3>
                            <div className="flex items-center gap-4 text-[10px] text-brand-dark/50 font-medium mt-1">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {proj.location}</span>
                              <span className="flex items-center gap-1"><Calendar size={12} /> {proj.year}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-auto pt-3 border-t border-brand-dark/5">
                            <button
                              onClick={() => openProjectForm(proj)}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand-grayBg hover:bg-brand-dark/5 text-brand-dark text-xs font-semibold rounded-lg transition-colors border border-brand-dark/5"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj._id)}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* CREATE/EDIT FORM */
              <div className="bg-white rounded-2xl border border-brand-dark/5 p-6 sm:p-10 shadow-xs flex flex-col gap-8">
                <div className="flex items-center justify-between pb-4 border-b border-brand-dark/5">
                  <h2 className="text-lg sm:text-xl font-extrabold text-brand-dark">
                    {editingProject ? `Edit Project: ${editingProject.title}` : "Add New Project"}
                  </h2>
                  <button
                    onClick={() => setShowProjectForm(false)}
                    className="p-1 text-brand-dark/65 hover:text-brand-orange transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <Input
                        label="Project Title"
                        id="title"
                        required
                        placeholder="e.g. Grand Horizon Luxury Residency"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <Input
                      label="Completion Year"
                      id="year"
                      type="number"
                      required
                      placeholder="e.g. 2024"
                      value={projectForm.year}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, year: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Location"
                      id="location"
                      required
                      placeholder="e.g. West Lake Hills, Austin, TX"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <TextArea
                    label="Project Description"
                    id="description"
                    required
                    rows={6}
                    placeholder="Enter project specifications, size, LEED configurations, and design narratives..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  />

                  {/* THUMBNAIL INPUT */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-brand-dark/75">
                      Thumbnail Image {!editingProject && <span className="text-brand-orange">*</span>}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleProjectFileChange}
                        className="text-xs text-brand-dark/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-orange/10 file:text-brand-orange hover:file:bg-brand-orange/20 cursor-pointer"
                      />
                      {thumbnailPreview && (
                        <div className="relative w-36 aspect-[4/3] rounded-lg border border-brand-dark/5 overflow-hidden">
                          <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GALLERY INPUTS */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-brand-dark/5">
                    <label className="text-xs font-semibold text-brand-dark/75">
                      Gallery Showcase Images
                    </label>
                    <input
                      type="file"
                      id="gallery"
                      accept="image/*"
                      multiple
                      onChange={handleProjectFileChange}
                      className="text-xs text-brand-dark/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-orange/10 file:text-brand-orange hover:file:bg-brand-orange/20 cursor-pointer"
                    />

                    {/* Previews of newly selected images */}
                    {galleryPreviews.length > 0 && (
                      <div className="flex flex-col gap-2 mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">New Images Selected</span>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                          {galleryPreviews.map((previewUrl, idx) => (
                            <div key={idx} className="relative aspect-[4/3] rounded-lg border border-brand-dark/5 overflow-hidden group">
                              <img src={previewUrl} alt={`New upload preview ${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeSelectedGalleryFile(idx)}
                                className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Server-stored images (Only in edit mode) */}
                    {editingProject && existingGallery.length > 0 && (
                      <div className="flex flex-col gap-2 mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/45">Current Gallery (To Retain)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                          {existingGallery.map((imgUrl, idx) => (
                            <div key={idx} className="relative aspect-[4/3] rounded-lg border border-brand-dark/5 overflow-hidden group">
                              <img src={imgUrl} alt={`Existing view ${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeExistingGalleryImage(imgUrl)}
                                className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Image"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-brand-dark/5">
                    <Button type="submit" isLoading={actionLoading}>
                      {editingProject ? "Update Project" : "Create Project"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowProjectForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: CONTACT INQUIRIES ==================== */}
        {activeTab === "inquiries" && (
          <div className="flex flex-col gap-8 animate-slide-up">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">Contact Inquiries</h1>
              <p className="text-xs text-brand-dark/50 mt-1 font-light">Review and reply to business contact forms submitted online.</p>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-brand-dark/5 p-6">
                <p className="text-xs text-brand-dark/45 font-medium">No contact messages received.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-brand-dark/5 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-brand-dark/5 text-brand-dark/45 uppercase tracking-wider font-semibold bg-brand-grayBg/50">
                        <th className="py-4 px-4">Contact</th>
                        <th className="py-4 px-4">Message Snippet</th>
                        <th className="py-4 px-4">Submitted Date</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-dark/5 font-medium">
                      {inquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-brand-grayBg/20">
                          {/* Contact Details */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="text-brand-dark font-bold">{inq.name}</span>
                              <span className="text-[10px] text-brand-dark/40 font-light mt-0.5">{inq.phone}</span>
                              <span className="text-[10px] text-brand-dark/40 font-light break-all">{inq.email}</span>
                            </div>
                          </td>
                          {/* Message snippet */}
                          <td className="py-4 px-4 max-w-[200px] truncate text-brand-dark/70 font-light">
                            {inq.message}
                          </td>
                          {/* Date */}
                          <td className="py-4 px-4 text-brand-dark/50 font-light">
                            {new Date(inq.created_at).toLocaleString()}
                          </td>
                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleMarkInquiry(inq._id, inq.status)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                inq.status === "contacted"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20"
                              }`}
                              title="Toggle contacted status"
                            >
                              {inq.status}
                            </button>
                          </td>
                          {/* Action Buttons */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingInquiry(inq)}
                                className="p-2 bg-brand-grayBg hover:bg-brand-dark/5 text-brand-dark/65 rounded-lg transition-colors border border-brand-dark/5"
                                title="View Message"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteInquiry(inq._id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                title="Delete Message"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: SITE SETTINGS ==================== */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl border border-brand-dark/5 p-6 sm:p-10 shadow-xs flex flex-col gap-8 animate-slide-up">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">Site Settings</h1>
              <p className="text-xs text-brand-dark/50 mt-1 font-light">Configure general brand names, contact coordinates, and text layouts.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-6 pt-4 border-t border-brand-dark/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  id="company_name"
                  required
                  placeholder="NovaBuild Group"
                  value={settingsForm.company_name}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, company_name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Hero Title"
                  id="hero_title"
                  required
                  placeholder="Pioneering Modern Architecture"
                  value={settingsForm.hero_title}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, hero_title: e.target.value }))}
                />
                <Input
                  label="Hero Subtitle"
                  id="hero_subtitle"
                  required
                  placeholder="Delivering premium commercial and residential complexes."
                  value={settingsForm.hero_subtitle}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                />
              </div>

              <TextArea
                label="About Us Text (Main narrative on About page)"
                id="about_text"
                required
                rows={6}
                placeholder="Write company history, core team principles, and focus..."
                value={settingsForm.about_text}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, about_text: e.target.value }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-brand-dark/5">
                <Input
                  label="Office Phone"
                  id="phone"
                  required
                  placeholder="+1 (555) 382-9182"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  label="Contact Email"
                  id="email"
                  type="email"
                  required
                  placeholder="info@novabuildgroup.com"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  label="WhatsApp Number (With country code, no +)"
                  id="whatsapp"
                  required
                  placeholder="15553829182"
                  value={settingsForm.whatsapp}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                />
              </div>

              <Input
                label="Physical Address"
                id="address"
                required
                placeholder="782 Construction Boulevard, Suite 14, Austin, TX"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
              />

              {/* Map URL Section */}
              <div className="flex flex-col gap-2 pt-4 border-t border-brand-dark/5">
                <label className="text-xs font-semibold text-brand-dark/75">
                  Google Maps Embed URL
                </label>
                <p className="text-[11px] text-brand-dark/45 font-light">
                  Go to <strong>Google Maps</strong> → search your location → click <strong>Share</strong> → <strong>Embed a map</strong> → copy the <code className="bg-brand-grayBg px-1 py-0.5 rounded text-[10px]">src="..."</code> URL and paste it below.
                </p>
                <textarea
                  id="map_url"
                  rows={3}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={settingsForm.map_url}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, map_url: e.target.value }))}
                  className="w-full px-4 py-2.5 text-xs rounded-lg border border-brand-dark/10 bg-white text-brand-dark outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none font-mono"
                />
                {/* Live Preview */}
                {settingsForm.map_url && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-brand-dark/5 h-48">
                    <iframe
                      title="Map Preview"
                      src={settingsForm.map_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-brand-dark/5">
                <Button type="submit" isLoading={actionLoading} className="px-8">
                  Save Configuration
                </Button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* INQUIRY MODAL (FULL VIEW) */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" onClick={() => setViewingInquiry(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full border border-brand-dark/5 overflow-hidden shadow-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="h-16 px-6 border-b border-brand-dark/5 flex items-center justify-between">
              <h3 className="font-bold text-brand-dark">Inquiry from {viewingInquiry.name}</h3>
              <button onClick={() => setViewingInquiry(null)} className="p-1 hover:text-brand-orange text-brand-dark/65 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              {/* Message Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-brand-grayBg p-4 rounded-xl border border-brand-dark/5">
                <div className="flex flex-col gap-1">
                  <span className="text-brand-dark/45 font-medium">Email Address</span>
                  <a href={`mailto:${viewingInquiry.email}`} className="text-brand-dark font-semibold hover:underline break-all">{viewingInquiry.email}</a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-brand-dark/45 font-medium">Phone Number</span>
                  <a href={`tel:${viewingInquiry.phone}`} className="text-brand-dark font-semibold hover:underline">{viewingInquiry.phone}</a>
                </div>
                <div className="flex flex-col gap-1 col-span-2 border-t border-brand-dark/5 pt-3">
                  <span className="text-brand-dark/45 font-medium">Submission Timestamp</span>
                  <span className="text-brand-dark font-semibold">{new Date(viewingInquiry.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Description Message */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark/50">Message Body</h4>
                <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-light whitespace-pre-wrap bg-brand-grayBg/30 p-4 rounded-xl border border-brand-dark/5">
                  {viewingInquiry.message}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-brand-grayBg/50 border-t border-brand-dark/5 flex justify-between gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMarkInquiry(viewingInquiry._id, viewingInquiry.status)}
              >
                {viewingInquiry.status === "pending" ? (
                  <><Check size={14} className="mr-1" /> Mark as Contacted</>
                ) : (
                  <><X size={14} className="mr-1" /> Mark as Pending</>
                )}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteInquiry(viewingInquiry._id)}
              >
                <Trash size={14} className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
