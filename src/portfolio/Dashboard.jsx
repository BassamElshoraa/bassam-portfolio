import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Award,
  BadgeDollarSign,
  Check,
  Database,
  Download,
  Edit3,
  ExternalLink,
  FileJson,
  FolderKanban,
  ImagePlus,
  LayoutDashboard,
  Plus,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  LogOut,
  BookOpen,
  Sparkles,
  Star,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioContent, useTheme } from "./context.jsx";
import SourceEditor from "./SourceEditor.jsx";
import { assetUrl, projectCategory, slugify } from "./utils.js";

const blankProject = {
  title: "",
  slug: "",
  description: "",
  challenge: "",
  approach: "",
  impact: "",
  image: "",
  badges: [],
  github: "",
  demo: "",
  featured: false,
};

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function StatusPill({ mode }) {
  const labels = {
    workspace: "Saving to project files",
    remote: "Publishing through GitHub",
    readonly: "Connect to edit",
  };
  return <span className={`status-pill status-${mode}`}><span /> {labels[mode] || mode}</span>;
}

function ProjectEditor({ project, onClose, onSave, onImageUpload }) {
  const [draft, setDraft] = useState(copy(project));
  const [uploading, setUploading] = useState(false);

  const field = (name) => ({
    value: draft[name] || "",
    onChange: (event) => setDraft((current) => ({ ...current, [name]: event.target.value })),
  });

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const image = await onImageUpload(file);
      setDraft((current) => ({ ...current, image }));
    } catch {
      // The dashboard displays the upload error without changing this project.
    } finally {
      setUploading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    onSave({
      ...draft,
      title: draft.title.trim(),
      slug: draft.slug.trim() || slugify(draft.title),
      badges: Array.isArray(draft.badges) ? draft.badges : `${draft.badges}`.split(",").map((item) => item.trim()).filter(Boolean),
    });
  };

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <form className="admin-modal" onSubmit={submit}>
        <div className="admin-modal-head">
          <div><span className="eyebrow">Project editor</span><h2>{project.id ? "Edit project" : "Add a new project"}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close editor"><X size={20} /></button>
        </div>

        <div className="editor-grid">
          <label className="field field-span-2"><span>Project title</span><input required {...field("title")} /></label>
          <label className="field"><span>Slug</span><input placeholder="generated-from-title" {...field("slug")} /></label>
          <label className="field"><span>Technologies</span><input placeholder="Power BI, DAX, SQL" value={(draft.badges || []).join?.(", ") ?? draft.badges} onChange={(event) => setDraft((current) => ({ ...current, badges: event.target.value.split(",").map((item) => item.trim()) }))} /></label>
          <label className="field field-span-2"><span>Short description</span><textarea required rows="3" {...field("description")} /></label>
          <label className="field"><span>Challenge</span><textarea rows="4" {...field("challenge")} /></label>
          <label className="field"><span>Approach</span><textarea rows="4" {...field("approach")} /></label>
          <label className="field field-span-2"><span>Outcome / impact</span><textarea rows="3" {...field("impact")} /></label>
          <label className="field"><span>GitHub URL</span><input type="url" placeholder="https://github.com/..." {...field("github")} /></label>
          <label className="field"><span>Power BI / demo URL</span><input type="url" placeholder="https://app.powerbi.com/..." {...field("demo")} /></label>
          <label className="field field-span-2"><span>Image path or URL</span><input {...field("image")} /></label>
          <label className="upload-card field-span-2">
            {draft.image ? <img src={assetUrl(draft.image)} alt="Project preview" /> : <ImagePlus size={28} />}
            <span>{uploading ? "Uploading image…" : "Upload a project cover"}</span>
            <small>PNG, JPG, WEBP · published with the site after upload</small>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} disabled={uploading} />
          </label>
          <label className="check-field field-span-2"><input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => setDraft((current) => ({ ...current, featured: event.target.checked }))} /><Star size={17} /> Feature this project on the homepage</label>
        </div>

        <div className="admin-modal-actions"><button className="button button-ghost" type="button" onClick={onClose}>Cancel</button><button className="button" type="submit"><Save size={17} /> Save project</button></div>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const { site, projects, articles, mode, saveContent, loading, connectGithub, disconnectGithub, githubUser, uploadAsset, listSourceFiles, readSourceFile, saveSourceFile } = usePortfolioContent();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("projects");
  const [draftSite, setDraftSite] = useState(() => site ? copy(site) : null);
  const [draftProjects, setDraftProjects] = useState(() => copy(projects));
  const [draftArticles, setDraftArticles] = useState(() => copy(articles));
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [advancedJson, setAdvancedJson] = useState("");
  const [mediaPath, setMediaPath] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const importRef = useRef(null);

  useEffect(() => { if (site) setDraftSite(copy(site)); }, [site]);
  useEffect(() => { setDraftProjects(copy(projects)); }, [projects]);
  useEffect(() => { setDraftArticles(copy(articles)); }, [articles]);
  useEffect(() => { if (site) setAdvancedJson(JSON.stringify(site, null, 2)); }, [site]);

  const filteredProjects = useMemo(
    () => draftProjects.filter((project) => `${project.title} ${(project.badges || []).join(" ")}`.toLowerCase().includes(query.toLowerCase())),
    [draftProjects, query],
  );

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  const persist = async (nextSite = draftSite, nextProjects = draftProjects, nextArticles = draftArticles) => {
    setSaving(true);
    try {
      await saveContent(nextSite, nextProjects, nextArticles);
      setDraftSite(copy(nextSite));
      setDraftProjects(copy(nextProjects));
      setDraftArticles(copy(nextArticles));
      notify(mode === "remote" ? "Committed to GitHub. Pages will publish shortly." : "Saved to project files.");
      return true;
    } catch (error) {
      notify(`Not saved: ${error.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const signIn = async (event) => {
    event.preventDefault();
    setConnecting(true);
    try {
      const user = await connectGithub(token.trim());
      setToken("");
      notify(`Connected as ${user}.`);
    } catch (error) {
      notify(error.message);
    } finally {
      setConnecting(false);
    }
  };

  const saveProject = async (project) => {
    const exists = Boolean(project.id);
    const normalized = { ...project, id: exists ? project.id : Math.max(0, ...draftProjects.map((item) => Number(item.id) || 0)) + 1 };
    const next = exists ? draftProjects.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...draftProjects];
    setDraftProjects(next);
    setEditingProject(null);
    await persist(draftSite, next);
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete “${project.title}”? This will remove it from the published site after saving.`)) return;
    const next = draftProjects.filter((item) => item.id !== project.id);
    setDraftProjects(next);
    await persist(draftSite, next);
  };

  const uploadImage = async (file) => {
    try {
      const path = await uploadAsset(file);
      notify("Asset uploaded. Save the related content to publish its new path.");
      return path;
    } catch (error) {
      notify(`Upload failed: ${error.message}`);
      throw error;
    }
  };

  const exportContent = () => {
    const blob = new Blob([JSON.stringify({ site: draftSite, projects: draftProjects, articles: draftArticles }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bassam-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importContent = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (!payload.site || !Array.isArray(payload.projects) || !Array.isArray(payload.articles)) {
        throw new Error("This backup is incomplete: site, projects, and articles are required.");
      }
      await persist(payload.site, payload.projects, payload.articles);
    } catch (error) {
      notify(`Not imported: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  };

  const setProfile = (name, value) => setDraftSite((current) => ({ ...current, profile: { ...current.profile, [name]: value } }));
  const setProfileList = (name, value) => setProfile(name, value.split(",").map((item) => item.trim()).filter(Boolean));
  const setOrganization = (index, name, value) => setDraftSite((current) => ({ ...current, organizations: (current.organizations || []).map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
  const addOrganization = () => setDraftSite((current) => ({ ...current, organizations: [...(current.organizations || []), { name: "New organization", role: "Role", logo: "", website: "" }] }));
  const removeOrganization = (index) => setDraftSite((current) => ({ ...current, organizations: (current.organizations || []).filter((_, itemIndex) => itemIndex !== index) }));
  const setExperience = (index, name, value) => setDraftSite((current) => ({ ...current, experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
  const addExperience = () => setDraftSite((current) => ({ ...current, experience: [{ id: `experience-${Date.now()}`, role: "New role", company: "Company", website: "", period: "Period", location: "Location", current: false, bullets: ["Achievement or responsibility"] }, ...current.experience] }));
  const removeExperience = (index) => setDraftSite((current) => ({ ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) }));
  const setService = (index, name, value) => setDraftSite((current) => ({ ...current, services: (current.services || []).map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
  const addService = () => setDraftSite((current) => ({ ...current, services: [...(current.services || []), { id: `service-${Date.now()}`, icon: "dashboard", title: "New service", description: "Describe the business value of this service.", deliverables: ["First deliverable"] }] }));
  const removeService = (index) => setDraftSite((current) => ({ ...current, services: (current.services || []).filter((_, itemIndex) => itemIndex !== index) }));
  const setCertification = (index, name, value) => setDraftSite((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
  const addCertification = () => setDraftSite((current) => ({ ...current, certifications: [...current.certifications, { title: "New certification", issuer: "Issuer", period: "Issue date", image: "" }] }));
  const removeCertification = (index) => setDraftSite((current) => ({ ...current, certifications: current.certifications.filter((_, itemIndex) => itemIndex !== index) }));
  const setEducation = (index, name, value) => setDraftSite((current) => ({ ...current, education: current.education.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
  const addEducation = () => setDraftSite((current) => ({ ...current, education: [...current.education, { degree: "New program", school: "Institution", period: "Period", location: "Location", image: "" }] }));
  const removeEducation = (index) => setDraftSite((current) => ({ ...current, education: current.education.filter((_, itemIndex) => itemIndex !== index) }));
  const setExpertise = (index, name, value) => setDraftSite((current) => ({ ...current, expertise: current.expertise.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
  const addExpertise = () => setDraftSite((current) => ({ ...current, expertise: [...current.expertise, { title: "New skill area", icon: "dashboard", description: "", skills: [] }] }));
  const removeExpertise = (index) => setDraftSite((current) => ({ ...current, expertise: current.expertise.filter((_, itemIndex) => itemIndex !== index) }));
  const setArticle = (index, name, value) => setDraftArticles((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item));
  const setSiteArray = (key, index, name, value) => setDraftSite((current) => ({ ...current, [key]: (current[key] || []).map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
  const setUi = (name, value) => setDraftSite((current) => ({ ...current, ui: { ...(current.ui || {}), [name]: value } }));
  const setDesign = (name, value) => setDraftSite((current) => ({ ...current, ui: { ...(current.ui || {}), design: { ...(current.ui?.design || {}), [name]: value } } }));

  const nav = [
    { id: "projects", label: "Projects", icon: <FolderKanban size={18} /> },
    { id: "articles", label: "Articles", icon: <BookOpen size={18} /> },
    { id: "skills", label: "Skills", icon: <Sparkles size={18} /> },
    { id: "services", label: "Services", icon: <BadgeDollarSign size={18} /> },
    { id: "profile", label: "Profile", icon: <UserRound size={18} /> },
    { id: "experience", label: "Experience", icon: <LayoutDashboard size={18} /> },
    { id: "credentials", label: "Credentials", icon: <Award size={18} /> },
    { id: "presentation", label: "Presentation", icon: <Settings2 size={18} /> },
    { id: "source", label: "Site source", icon: <Edit3 size={18} /> },
    { id: "media", label: "Media", icon: <ImagePlus size={18} /> },
    { id: "advanced", label: "Advanced content", icon: <FileJson size={18} /> },
    { id: "data", label: "Backups", icon: <Database size={18} /> },
  ];

  if (loading || !draftSite) {
    return <div className="page-loader"><span className="loader-ring" /><p>Loading your content workspace…</p></div>;
  }

  if (mode === "readonly") {
    return (
      <div className="dashboard-gate">
        <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to portfolio</Link>
        <form className="dashboard-gate-card" onSubmit={signIn}>
          <ShieldCheck size={34} />
          <span className="eyebrow">Private content workspace</span>
          <h1>Edit and publish from any device</h1>
          <p>Enter a fine-grained GitHub token limited to <strong>BassamElshoraa/bassam-portfolio</strong> with <strong>Contents: Read and write</strong>. Every save creates a commit and triggers GitHub Pages publishing.</p>
          <label className="field"><span>GitHub token</span><input type="password" required autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} placeholder="github_pat_…" /></label>
          <button className="button" type="submit" disabled={connecting}>{connecting ? "Connecting…" : "Connect securely"}</button>
          <small>The token stays in this page’s memory only. It is not stored in the browser or website files. Close or refresh the tab to end the session.</small>
          <a className="text-link" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">Create a fine-grained token <ExternalLink size={15} /></a>
        </form>
        {notice && <div className="admin-toast" role="status">{notice}</div>}
      </div>
    );
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <Link className="brand" to="/"><span className="brand-copy"><strong>Portfolio OS</strong><small>{githubUser ? `Connected as ${githubUser}` : "Local workspace"}</small></span></Link>
        <nav>{nav.map((item) => <button className={activeTab === item.id ? "active" : ""} type="button" key={item.id} onClick={() => setActiveTab(item.id)}>{item.icon}{item.label}</button>)}</nav>
        <div className="admin-sidebar-bottom"><StatusPill mode={mode} /><button type="button" onClick={toggleTheme}><Settings2 size={17} /> {theme === "dark" ? "Light theme" : "Dark theme"}</button>{githubUser && <button type="button" onClick={disconnectGithub}><LogOut size={17} /> End session</button>}<Link to="/"><ArrowLeft size={17} /> Back to portfolio</Link></div>
      </aside>

      <main className="admin-main">
        <div className="admin-mobile-actions"><Link to="/"><ArrowLeft size={16} /> Portfolio</Link><button type="button" onClick={toggleTheme}><Settings2 size={16} /> Theme</button>{githubUser && <button type="button" onClick={disconnectGithub}><LogOut size={16} /> Sign out</button>}</div>
        <label className="admin-mobile-nav"><span>Dashboard section</span><select value={activeTab} onChange={(event) => setActiveTab(event.target.value)}>{nav.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <header className="admin-topbar">
          <div><span className="eyebrow">Content dashboard</span><h1>{nav.find((item) => item.id === activeTab)?.label}</h1></div>
          <div className="admin-topbar-actions"><Link className="button button-ghost button-small" to="/" target="_blank" rel="noreferrer">Preview site <ExternalLink size={15} /></Link><button className="button button-small" type="button" onClick={() => persist()} disabled={saving}>{saving ? "Saving…" : <><Save size={16} /> Save all</>}</button></div>
        </header>

        {activeTab === "projects" && (
          <section className="admin-section">
            <div className="admin-toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" /></label><button className="button" type="button" onClick={() => setEditingProject(copy(blankProject))}><Plus size={18} /> Add project</button></div>
            <div className="admin-stats"><div><strong>{draftProjects.length}</strong><span>Total projects</span></div><div><strong>{draftProjects.filter((item) => item.featured).length}</strong><span>Featured projects</span></div><div><strong>{draftProjects.filter((item) => item.demo).length}</strong><span>Interactive demos</span></div><div><strong>{draftProjects.filter((item) => item.github).length}</strong><span>GitHub repositories</span></div></div>
            <div className="admin-project-list">
              {filteredProjects.map((project) => (
                <article key={project.id}>
                  <img src={assetUrl(project.image)} alt="" />
                  <div className="admin-project-copy"><div><span>{projectCategory(project)}</span>{project.featured && <span className="featured-label"><Star size={12} /> Featured</span>}</div><h3>{project.title}</h3><p>{project.description}</p></div>
                  <div className="admin-row-actions"><Link to={`/projects/${project.slug}`} target="_blank" aria-label="Preview project"><ExternalLink size={17} /></Link><button type="button" onClick={() => setEditingProject(copy(project))} aria-label="Edit project"><Edit3 size={17} /></button><button className="danger" type="button" onClick={() => deleteProject(project)} aria-label="Delete project"><Trash2 size={17} /></button></div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "articles" && (
          <section className="admin-section form-section">
            <div className="admin-section-head"><div><h2>Articles</h2><p>Articles are served from the site itself, so they remain available when Medium or its feed is unavailable.</p></div><div><button className="button button-ghost" type="button" onClick={() => setDraftArticles((current) => [{ id: String(Date.now()), title: "New article", slug: `article-${Date.now()}`, link: "", thumbnail: "", pubDate: new Date().toISOString(), author: draftSite.profile.name, categories: [], description: "", content: "" }, ...current])}><Plus size={17} /> Add article</button><button className="button" type="button" onClick={() => persist()} disabled={saving}><Save size={17} /> Save articles</button></div></div>
            <div className="experience-editor-list">
              {draftArticles.map((article, index) => (
                <article className="experience-editor" key={article.id}>
                  <div className="experience-editor-head"><strong>{article.title}</strong><div className="admin-row-actions"><Link to={`/articles/${article.slug}`} target="_blank" aria-label="Preview article"><ExternalLink size={17} /></Link><button className="icon-button danger" type="button" onClick={() => setDraftArticles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove article"><Trash2 size={16} /></button></div></div>
                  <div className="editor-grid">
                    <label className="field"><span>Title</span><input value={article.title || ""} onChange={(event) => setArticle(index, "title", event.target.value)} /></label>
                    <label className="field"><span>Slug</span><input value={article.slug || ""} onChange={(event) => setArticle(index, "slug", event.target.value)} /></label>
                    <label className="field"><span>Original article URL</span><input value={article.link || ""} onChange={(event) => setArticle(index, "link", event.target.value)} /></label>
                    <label className="field"><span>Published date</span><input value={article.pubDate || ""} onChange={(event) => setArticle(index, "pubDate", event.target.value)} /></label>
                    <label className="field field-span-2"><span>Cover image path</span><input value={article.thumbnail || ""} onChange={(event) => setArticle(index, "thumbnail", event.target.value)} /></label>
                    <label className="field field-span-2"><span>Short description</span><textarea rows="3" value={article.description || ""} onChange={(event) => setArticle(index, "description", event.target.value)} /></label>
                    <label className="field field-span-2"><span>Full article HTML</span><textarea rows="12" value={article.content || ""} onChange={(event) => setArticle(index, "content", event.target.value)} /></label>
                  </div>
                </article>
              ))}
            </div>
            <p className="admin-help">To refresh from Medium, use <code>npm run sync:articles</code> in the local workspace. This does not run automatically, so your manual edits remain intact.</p>
          </section>
        )}

        {activeTab === "skills" && (
          <section className="admin-section form-section">
            <div className="admin-section-head"><div><h2>Skill areas</h2><p>Edit every skill card, description, and displayed tool.</p></div><div><button className="button button-ghost" type="button" onClick={addExpertise}><Plus size={17} /> Add area</button><button className="button" type="button" onClick={() => persist()} disabled={saving}><Save size={17} /> Save skills</button></div></div>
            <div className="experience-editor-list">
              {(draftSite.expertise || []).map((item, index) => (
                <article className="experience-editor" key={`${item.title}-${index}`}>
                  <div className="experience-editor-head"><strong>{item.title}</strong><button className="icon-button danger" type="button" onClick={() => removeExpertise(index)} aria-label="Remove skill area"><Trash2 size={16} /></button></div>
                  <div className="editor-grid">
                    <label className="field field-span-2"><span>Area title</span><input value={item.title || ""} onChange={(event) => setExpertise(index, "title", event.target.value)} /></label>
                    <label className="field"><span>Visual icon</span><select value={item.icon || "dashboard"} onChange={(event) => setExpertise(index, "icon", event.target.value)}><option value="dashboard">Dashboard</option><option value="activity">Analytics</option><option value="workflow">Workflow</option><option value="teaching">Education</option></select></label>
                    <label className="field field-span-2"><span>Description</span><textarea rows="3" value={item.description || ""} onChange={(event) => setExpertise(index, "description", event.target.value)} /></label>
                    <label className="field field-span-2"><span>Tools and practices, one per line</span><textarea rows="6" value={(item.skills || []).join("\n")} onChange={(event) => setExpertise(index, "skills", event.target.value.split("\n").map((value) => value.trim()).filter(Boolean))} /></label>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section className="admin-section form-section">
            <div className="admin-section-head"><div><h2>Paid services</h2><p>Edit the services clients can request from the public website.</p></div><div><button className="button button-ghost" type="button" onClick={addService}><Plus size={17} /> Add service</button><button className="button" type="button" onClick={() => persist()}><Save size={17} /> Save services</button></div></div>
            <p className="admin-help">The request form now sends through FormSubmit. Open the one-time activation email sent to <strong>{draftSite.profile.email}</strong> and confirm it so new requests reach your inbox. You can change the recipient under Profile.</p>
            <div className="experience-editor-list">
              {(draftSite.services || []).map((item, index) => (
                <article className="experience-editor" key={item.id}>
                  <div className="experience-editor-head"><strong>{item.title}</strong><button className="icon-button danger" type="button" onClick={() => removeService(index)} aria-label="Remove service"><Trash2 size={16} /></button></div>
                  <div className="editor-grid">
                    <label className="field"><span>Service title</span><input value={item.title || ""} onChange={(event) => setService(index, "title", event.target.value)} /></label>
                    <label className="field"><span>Icon key</span><input value={item.icon || "dashboard"} onChange={(event) => setService(index, "icon", event.target.value)} placeholder="dashboard, finance, automation, analysis, mentoring, training" /></label>
                    <label className="field field-span-2"><span>Description</span><textarea rows="3" value={item.description || ""} onChange={(event) => setService(index, "description", event.target.value)} /></label>
                    <label className="field field-span-2"><span>Deliverables, one per line</span><textarea rows="4" value={(item.deliverables || []).join("\n")} onChange={(event) => setService(index, "deliverables", event.target.value.split("\n").map((value) => value.trim()).filter(Boolean))} /></label>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "profile" && (
          <section className="admin-section form-section">
            <div className="admin-section-head"><div><h2>Public profile</h2><p>Edit the main story, contact links, availability, and resume.</p></div><button className="button" type="button" onClick={() => persist()}><Save size={17} /> Save profile</button></div>
            <div className="editor-grid">
              {["name", "displayName", "eyebrow", "headline", "subheadline", "location", "email", "phone", "linkedin", "github", "medium", "whatsapp", "resume", "photo"].map((name) => (
                <label className={name === "headline" || name === "subheadline" ? "field field-span-2" : "field"} key={name}><span>{name.replace(/([A-Z])/g, " $1")}</span>{name === "subheadline" ? <textarea rows="4" value={draftSite.profile[name] || ""} onChange={(event) => setProfile(name, event.target.value)} /> : <input value={draftSite.profile[name] || ""} onChange={(event) => setProfile(name, event.target.value)} />}</label>
              ))}
              <label className="field field-span-2"><span>Summary</span><textarea rows="5" value={draftSite.profile.summary || ""} onChange={(event) => setProfile("summary", event.target.value)} /></label>
              <label className="field field-span-2"><span>About details</span><textarea rows="5" value={draftSite.profile.aboutDetails || ""} onChange={(event) => setProfile("aboutDetails", event.target.value)} /></label>
              <label className="field field-span-2"><span>Rotating hero outcomes, comma separated</span><textarea rows="3" value={(draftSite.profile.rotatingWords || []).join(", ")} onChange={(event) => setProfileList("rotatingWords", event.target.value)} /></label>
              <label className="field field-span-2"><span>Tool keywords, comma separated</span><textarea rows="3" value={(draftSite.profile.toolKeywords || []).join(", ")} onChange={(event) => setProfileList("toolKeywords", event.target.value)} /></label>
            </div>
            <div className="dashboard-subsection">
              <div className="admin-section-head"><div><span className="eyebrow">About section</span><h3>Organizations</h3></div><button className="button button-ghost button-small" type="button" onClick={addOrganization}><Plus size={16} /> Add organization</button></div>
              <div className="experience-editor-list">
                {(draftSite.organizations || []).map((item, index) => (
                  <article className="experience-editor" key={`${item.name}-${index}`}>
                    <div className="experience-editor-head"><strong>{item.name}</strong><button className="icon-button danger" type="button" onClick={() => removeOrganization(index)} aria-label="Remove organization"><Trash2 size={16} /></button></div>
                    <div className="editor-grid">
                      <label className="field"><span>Name</span><input value={item.name || ""} onChange={(event) => setOrganization(index, "name", event.target.value)} /></label>
                      <label className="field"><span>Role</span><input value={item.role || ""} onChange={(event) => setOrganization(index, "role", event.target.value)} /></label>
                      <label className="field"><span>Short display name</span><input value={item.shortName || ""} onChange={(event) => setOrganization(index, "shortName", event.target.value)} placeholder="For example: DEPI" /></label>
                      <label className="field field-span-2"><span>Official website</span><input value={item.website || ""} onChange={(event) => setOrganization(index, "website", event.target.value)} placeholder="https://company.com/" /></label>
                      <label className="field field-span-2"><span>Logo path</span><input value={item.logo || ""} onChange={(event) => setOrganization(index, "logo", event.target.value)} placeholder="/image/organizations/logo.png" /></label>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "experience" && (
          <section className="admin-section form-section">
            <div className="admin-section-head"><div><h2>Experience timeline</h2><p>Keep dates and responsibilities synchronized with your resume.</p></div><div><button className="button button-ghost" type="button" onClick={addExperience}><Plus size={17} /> Add role</button><button className="button" type="button" onClick={() => persist()}><Save size={17} /> Save timeline</button></div></div>
            <div className="experience-editor-list">
              {draftSite.experience.map((item, index) => (
                <article className="experience-editor" key={item.id}>
                  <div className="experience-editor-head"><strong>{item.role}</strong><button className="icon-button danger" type="button" onClick={() => removeExperience(index)} aria-label="Remove role"><Trash2 size={16} /></button></div>
                  <div className="editor-grid">
                    <label className="field"><span>Role</span><input value={item.role} onChange={(event) => setExperience(index, "role", event.target.value)} /></label>
                    <label className="field"><span>Company</span><input value={item.company} onChange={(event) => setExperience(index, "company", event.target.value)} /></label>
                    <label className="field"><span>Official website</span><input value={item.website || ""} onChange={(event) => setExperience(index, "website", event.target.value)} placeholder="https://company.com/" /></label>
                    <label className="field"><span>Period</span><input value={item.period} onChange={(event) => setExperience(index, "period", event.target.value)} /></label>
                    <label className="field"><span>Location</span><input value={item.location} onChange={(event) => setExperience(index, "location", event.target.value)} /></label>
                    <label className="field field-span-2"><span>Logo path</span><input value={item.logo || ""} onChange={(event) => setExperience(index, "logo", event.target.value)} placeholder="/image/organizations/logo.png" /></label>
                    <label className="field field-span-2"><span>Additional logo paths (one per line)</span><textarea rows="2" value={(item.logos || []).join("\n")} onChange={(event) => setExperience(index, "logos", event.target.value.split("\n").map((value) => value.trim()).filter(Boolean))} placeholder="/image/organizations/logo.svg" /></label>
                    <label className="field field-span-2"><span>Achievements, one per line</span><textarea rows="5" value={(item.bullets || []).join("\n")} onChange={(event) => setExperience(index, "bullets", event.target.value.split("\n"))} /></label>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "credentials" && (
          <section className="admin-section form-section">
            <div className="admin-section-head"><div><h2>Education & certifications</h2><p>Manage the credentials displayed on the public website, including certificate images.</p></div><button className="button" type="button" onClick={() => persist()}><Save size={17} /> Save credentials</button></div>

            <div className="dashboard-subsection">
              <div className="admin-section-head"><div><span className="eyebrow">Certifications</span><h3>Professional certificates</h3></div><button className="button button-ghost button-small" type="button" onClick={addCertification}><Plus size={16} /> Add certificate</button></div>
              <div className="experience-editor-list">
                {draftSite.certifications.map((item, index) => (
                  <article className="experience-editor" key={`${item.title}-${index}`}>
                    <div className="experience-editor-head"><strong>{item.title}</strong><button className="icon-button danger" type="button" onClick={() => removeCertification(index)} aria-label="Remove certificate"><Trash2 size={16} /></button></div>
                    <div className="editor-grid">
                      <label className="field"><span>Title</span><input value={item.title || ""} onChange={(event) => setCertification(index, "title", event.target.value)} /></label>
                      <label className="field"><span>Issuer</span><input value={item.issuer || ""} onChange={(event) => setCertification(index, "issuer", event.target.value)} /></label>
                      <label className="field"><span>Period</span><input value={item.period || ""} onChange={(event) => setCertification(index, "period", event.target.value)} /></label>
                      <label className="field"><span>Image path</span><input value={item.image || ""} onChange={(event) => setCertification(index, "image", event.target.value)} placeholder="/image/certificate.jpg" /></label>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="dashboard-subsection">
              <div className="admin-section-head"><div><span className="eyebrow">Education</span><h3>Degrees and professional programs</h3></div><button className="button button-ghost button-small" type="button" onClick={addEducation}><Plus size={16} /> Add education</button></div>
              <div className="experience-editor-list">
                {draftSite.education.map((item, index) => (
                  <article className="experience-editor" key={`${item.degree}-${index}`}>
                    <div className="experience-editor-head"><strong>{item.degree}</strong><button className="icon-button danger" type="button" onClick={() => removeEducation(index)} aria-label="Remove education"><Trash2 size={16} /></button></div>
                    <div className="editor-grid">
                      <label className="field"><span>Degree or program</span><input value={item.degree || ""} onChange={(event) => setEducation(index, "degree", event.target.value)} /></label>
                      <label className="field"><span>School</span><input value={item.school || ""} onChange={(event) => setEducation(index, "school", event.target.value)} /></label>
                      <label className="field"><span>Period</span><input value={item.period || ""} onChange={(event) => setEducation(index, "period", event.target.value)} /></label>
                      <label className="field"><span>Location or type</span><input value={item.location || ""} onChange={(event) => setEducation(index, "location", event.target.value)} /></label>
                      <label className="field field-span-2"><span>Image path</span><input value={item.image || ""} onChange={(event) => setEducation(index, "image", event.target.value)} placeholder="/image/certificate.jpg" /></label>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "presentation" && (
          <section className="admin-section form-section">
            <div className="admin-section-head"><div><h2>Site presentation</h2><p>Control the hero roles, about highlights, section titles, footer, and search preview.</p></div><button className="button" type="button" onClick={() => persist()} disabled={saving}><Save size={17} /> Save presentation</button></div>
            <div className="dashboard-subsection"><div className="admin-section-head"><div><span className="eyebrow">Visual direction</span><h3>Design controls</h3><p>Adjust the accent, text size, spacing, and card shape without editing code.</p></div></div><div className="design-controls">
              <label className="field"><span>Accent color</span><input type="color" value={draftSite.ui?.design?.accent || "#1769d5"} onChange={(event) => setDesign("accent", event.target.value)} /></label>
              <label className="field"><span>Text scale · {draftSite.ui?.design?.fontScale || 100}%</span><input type="range" min="90" max="115" step="1" value={draftSite.ui?.design?.fontScale || 100} onChange={(event) => setDesign("fontScale", Number(event.target.value))} /></label>
              <label className="field"><span>Card corners · {draftSite.ui?.design?.cardRadius || 18}px</span><input type="range" min="8" max="32" step="1" value={draftSite.ui?.design?.cardRadius || 18} onChange={(event) => setDesign("cardRadius", Number(event.target.value))} /></label>
              <label className="field"><span>Section spacing · {draftSite.ui?.design?.sectionSpace || 110}px</span><input type="range" min="60" max="150" step="5" value={draftSite.ui?.design?.sectionSpace || 110} onChange={(event) => setDesign("sectionSpace", Number(event.target.value))} /></label>
            </div><div className="design-preview" style={{ "--preview-accent": draftSite.ui?.design?.accent || "#1769d5", borderRadius: `${draftSite.ui?.design?.cardRadius || 18}px` }}><span>Live style sample</span><strong>Clear analysis, confident decisions.</strong><p>The selected settings apply to the public site after you save.</p></div></div>
            <div className="dashboard-subsection"><h3>Names and page copy</h3><div className="editor-grid">
              {Object.entries({ brand: "Header brand", footerTagline: "Footer tagline", aboutTitle: "About heading", experienceTitle: "Experience heading", skillsTitle: "Skills heading", projectsTitle: "Projects heading", servicesTitle: "Services heading", servicesDescription: "Services introduction", articlesTitle: "Articles heading", contactTitle: "Contact headline", contactDescription: "Contact introduction", seoTitle: "Search title", seoDescription: "Search description", seoImage: "Social share image" }).map(([key, label]) => <label className={key.endsWith("Description") ? "field field-span-2" : "field"} key={key}><span>{label}</span><input value={draftSite.ui?.[key] || ""} onChange={(event) => setUi(key, event.target.value)} /></label>)}
            </div></div>
            <div className="dashboard-subsection"><div className="admin-section-head"><div><span className="eyebrow">Hero</span><h3>Professional roles</h3><p>Each role appears on its own, in the order listed here.</p></div><button className="button button-ghost button-small" type="button" onClick={() => setProfile("roleKeywords", [...(draftSite.profile.roleKeywords || []), "New role"])}><Plus size={16} /> Add role</button></div>
              <div className="experience-editor-list">{(draftSite.profile.roleKeywords || []).map((role, index) => <div className="experience-editor" key={index}><div className="experience-editor-head"><strong>Role {index + 1}</strong><button className="icon-button danger" type="button" onClick={() => setProfile("roleKeywords", draftSite.profile.roleKeywords.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove role ${index + 1}`}><Trash2 size={16} /></button></div><label className="field"><span>Role name</span><input value={role} onChange={(event) => setProfile("roleKeywords", draftSite.profile.roleKeywords.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /></label></div>)}</div>
            </div>
            <div className="dashboard-subsection"><div className="admin-section-head"><div><span className="eyebrow">About</span><h3>Highlight cards</h3></div><button className="button button-ghost button-small" type="button" onClick={() => setDraftSite((current) => ({ ...current, aboutHighlights: [...(current.aboutHighlights || []), { title: "New highlight", description: "" }] }))}><Plus size={16} /> Add highlight</button></div>
              <div className="experience-editor-list">{(draftSite.aboutHighlights || []).map((item, index) => <article className="experience-editor" key={`${item.title}-${index}`}><div className="experience-editor-head"><strong>{item.title}</strong><button className="icon-button danger" type="button" onClick={() => setDraftSite((current) => ({ ...current, aboutHighlights: current.aboutHighlights.filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Remove highlight"><Trash2 size={16} /></button></div><div className="editor-grid"><label className="field"><span>Title</span><input value={item.title || ""} onChange={(event) => setSiteArray("aboutHighlights", index, "title", event.target.value)} /></label><label className="field field-span-2"><span>Description</span><input value={item.description || ""} onChange={(event) => setSiteArray("aboutHighlights", index, "description", event.target.value)} /></label></div></article>)}</div>
            </div>
            <div className="dashboard-subsection"><div className="admin-section-head"><div><span className="eyebrow">Navigation</span><h3>Header links</h3></div><button className="button button-ghost button-small" type="button" onClick={() => setDraftSite((current) => ({ ...current, navigation: [...(current.navigation || []), { label: "New link", anchor: "home" }] }))}><Plus size={16} /> Add link</button></div>
              <div className="experience-editor-list">{(draftSite.navigation || []).map((item, index) => <article className="experience-editor" key={`${item.label}-${index}`}><div className="experience-editor-head"><strong>{item.label}</strong><button className="icon-button danger" type="button" onClick={() => setDraftSite((current) => ({ ...current, navigation: current.navigation.filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Remove navigation link"><Trash2 size={16} /></button></div><div className="editor-grid"><label className="field"><span>Label</span><input value={item.label || ""} onChange={(event) => setSiteArray("navigation", index, "label", event.target.value)} /></label><label className="field"><span>Section anchor</span><input value={item.anchor || ""} onChange={(event) => setSiteArray("navigation", index, "anchor", event.target.value.replace(/^#/, ""))} /></label></div></article>)}</div>
            </div>
            <div className="dashboard-subsection"><div className="admin-section-head"><div><span className="eyebrow">Visual assets</span><h3>Tool logos</h3></div></div><div className="editor-grid">{[...new Set([...(draftSite.profile.toolKeywords || []), ...Object.keys(draftSite.toolLogos || {})])].map((tool) => <label className="field" key={tool}><span>{tool} logo path</span><input value={draftSite.toolLogos?.[tool] || ""} onChange={(event) => setDraftSite((current) => ({ ...current, toolLogos: { ...(current.toolLogos || {}), [tool]: event.target.value } }))} /></label>)}</div></div>
          </section>
        )}

        {activeTab === "media" && (
          <section className="admin-section form-section"><div className="admin-section-head"><div><h2>Media library</h2><p>Upload a new image, logo, article cover, or PDF, then copy its path into the relevant content field.</p></div></div>
            <label className="upload-card admin-media-upload"><ImagePlus size={28} /><span>Choose PNG, JPG, WEBP, SVG, or PDF · maximum 4 MB</span><input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const path = await uploadImage(file); setMediaPath(path); } catch { /* Error is shown above. */ } event.target.value = ""; }} /></label>
            {mediaPath && <div className="data-card"><Check size={26} /><div><h3>Uploaded</h3><p><code>{mediaPath}</code></p><button className="button button-small" type="button" onClick={async () => { await navigator.clipboard.writeText(mediaPath); notify("Path copied."); }}>Copy path</button></div></div>}
            <p className="admin-help">On the published site, the upload creates a GitHub commit and Pages publishes it. Add its path to a profile, project, article, company, or credential field and save that section too.</p>
          </section>
        )}

        {activeTab === "source" && <SourceEditor mode={mode} listSourceFiles={listSourceFiles} readSourceFile={readSourceFile} saveSourceFile={saveSourceFile} />}

        {activeTab === "advanced" && (
          <section className="admin-section form-section"><div className="admin-section-head"><div><h2>Complete site data</h2><p>For fields that do not have a dedicated control, edit the complete site content safely as JSON. Projects and articles have separate editors.</p></div><button className="button button-ghost" type="button" onClick={() => setAdvancedJson(JSON.stringify(draftSite, null, 2))}>Load current form draft</button></div>
            <label className="field"><span>Site content JSON</span><textarea className="admin-json-editor" spellCheck="false" rows="24" value={advancedJson} onChange={(event) => setAdvancedJson(event.target.value)} /></label>
            <button className="button" type="button" disabled={saving} onClick={async () => { try { const next = JSON.parse(advancedJson); if (!next.profile || !Array.isArray(next.expertise) || !Array.isArray(next.experience)) throw new Error("Profile, expertise, and experience are required."); await persist(next, draftProjects, draftArticles); } catch (error) { notify(`Not saved: ${error.message}`); } }}><Save size={17} /> Validate and publish JSON</button>
          </section>
        )}

        {activeTab === "data" && (
          <section className="admin-section data-panel">
            <div className="data-card"><FileJson size={28} /><div><h2>Export a complete backup</h2><p>Download the public profile, experience, certifications, and every project as one JSON file.</p><button className="button" type="button" onClick={exportContent}><Download size={17} /> Export JSON</button></div></div>
            <div className="data-card"><Upload size={28} /><div><h2>Import a backup</h2><p>Restore a previously exported portfolio file. The imported content is validated before saving.</p><button className="button button-ghost" type="button" onClick={() => importRef.current?.click()}><Upload size={17} /> Choose JSON</button><input ref={importRef} hidden type="file" accept="application/json" onChange={importContent} /></div></div>
            <div className="data-card data-card-note"><Check size={28} /><div><h2>How publishing works</h2><p>In the local workspace, saves update <code>public/data</code>. On the published site, a short-lived GitHub token commits changes to the repository; GitHub Pages then deploys them. Changes are never silently stored only in this browser.</p></div></div>
          </section>
        )}
      </main>

      {editingProject && <ProjectEditor project={editingProject} onClose={() => setEditingProject(null)} onSave={saveProject} onImageUpload={uploadImage} />}
      {notice && <div className="admin-toast" role="status"><Check size={17} /> {notice}</div>}
    </div>
  );
}
