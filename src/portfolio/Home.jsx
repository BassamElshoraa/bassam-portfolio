import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Database,
  FileSpreadsheet,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioContent } from "./context.jsx";
import ProjectCard, { SectionHeader } from "./ProjectCard.jsx";
import ServiceRequestForm from "./ServiceRequestForm.jsx";
import { assetUrl, plainTextFromHtml, projectCategory, readingTime } from "./utils.js";

const categoryOrder = ["All", "Power BI", "Python", "SQL", "Excel", "Analytics"];

const serviceIcons = {
  dashboard: BarChart3,
  finance: FileSpreadsheet,
  automation: Workflow,
  analysis: Database,
  forecasting: ChartNoAxesCombined,
  training: GraduationCap,
};

export default function Home() {
  const { site, projects, articles } = usePortfolioContent();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const { profile, expertise, experience, education, certifications, services = [] } = site;

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(b.id) - Number(a.id)),
    [projects],
  );

  const featuredProjects = sortedProjects.filter((project) => project.featured).slice(0, 6);
  const projectPool = featuredProjects.length >= 6 ? featuredProjects : sortedProjects.slice(0, 6);

  const categories = categoryOrder.filter(
    (category) => category === "All" || projects.some((project) => projectCategory(project) === category),
  );

  const filteredProjects = sortedProjects
    .filter((project) => activeCategory === "All" || projectCategory(project) === activeCategory)
    .filter((project) => `${project.title} ${project.description} ${(project.badges || []).join(" ")}`.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  const credentials = [
    ...certifications.map((item) => ({ ...item, type: "Certification", subtitle: item.issuer })),
    ...education.map((item) => ({ ...item, type: "Education", title: item.degree, subtitle: item.school, period: `${item.period} · ${item.location}` })),
  ];

  return (
    <>
      <section className="hero section-pad">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <span className="eyebrow"><Sparkles size={15} /> {profile.eyebrow}</span>
            <h1>{profile.headline}</h1>
            <p className="hero-subtitle">{profile.subheadline}</p>

            <div className="role-keywords" aria-label="Professional roles">
              {(profile.roleKeywords || []).map((role) => <span key={role}>{role}</span>)}
            </div>

            <div className="tool-ribbon" aria-label="Core tools and capabilities">
              {(profile.toolKeywords || []).map((tool) => <span key={tool}>{tool}</span>)}
            </div>

            <div className="hero-actions">
              <a className="button" href="#work">View selected work <ArrowDown size={18} /></a>
              <a className="button button-ghost" href="#request">Request a service <ArrowRight size={18} /></a>
              <a className="text-link hero-resume-link" href={assetUrl(profile.resume)} target="_blank" rel="noreferrer">Open CV <ArrowUpRight size={16} /></a>
            </div>

            <div className="availability-row">
              <span className="status-dot" />
              <span>{profile.availability}</span>
              <span className="location"><MapPin size={15} /> {profile.location}</span>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay">
            <div className="portrait-frame">
              <img src={assetUrl(profile.photo)} alt="Bassam El-Shoraa" />
              <div className="portrait-tag portrait-tag-top"><BarChart3 size={17} /> Business intelligence</div>
              <div className="portrait-tag portrait-tag-bottom"><ChartNoAxesCombined size={17} /> Forecasting &amp; analysis</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="work">
        <SectionHeader
          eyebrow="Selected case studies"
          title="Work that answers business questions."
          description="Open a Power BI project to use the report immediately, or open a Python and SQL project to inspect the code inside the portfolio."
          action={<Link className="text-link section-action" to="/projects">Browse all {projects.length} projects <ArrowRight size={17} /></Link>}
        />
        <div className="featured-projects">
          {projectPool.map((project, index) => <ProjectCard key={project.id} project={project} featured={index < 2} />)}
        </div>
      </section>

      <section className="section-pad section-surface" id="services">
        <SectionHeader
          eyebrow="Services"
          title="Analytics work you can hire me for."
          description="From raw files and unclear reporting to a decision-ready dashboard, automated workflow, forecast, or training program."
          action={<a className="button button-small section-action" href="#request">Request a quote <ArrowRight size={16} /></a>}
        />
        <div className="services-grid">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon] || BarChart3;
            return (
              <article className="service-card" key={service.id}>
                <div className="service-card-icon"><Icon size={21} /></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>{(service.deliverables || []).map((item) => <li key={item}>{item}</li>)}</ul>
                <a className="text-link" href="#request" onClick={() => setSelectedService(service.title)}>Request this service <ArrowRight size={15} /></a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-pad" id="about">
        <SectionHeader
          eyebrow="Core capabilities"
          title="How I turn data into useful work."
          description="A practical mix of business intelligence, financial and operational reporting, forecasting, automation, and analytics education."
        />
        <div className="expertise-grid">
          {expertise.map((item, index) => (
            <article className="expertise-card" key={item.title}>
              <span className="card-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="chip-row">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad section-surface" id="experience">
        <SectionHeader
          eyebrow="Experience"
          title="Experience behind the work."
          description="Current roles first, followed by a verified timeline across analytics, research, reporting, and training."
          action={<a className="text-link section-action" href={assetUrl(profile.resume)} target="_blank" rel="noreferrer">Open full resume <ArrowUpRight size={17} /></a>}
        />
        <div className="timeline experience-timeline">
          {experience.map((item) => (
            <article className="timeline-item-new" key={item.id}>
              <div className="timeline-marker"><BriefcaseBusiness size={17} /></div>
              <div className="timeline-head">
                <div><h3>{item.role}</h3><p>{item.company}</p></div>
                <div className="timeline-date"><span>{item.period}</span><small>{item.location}</small></div>
              </div>
              <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad" id="credentials">
        <SectionHeader
          eyebrow="Credentials"
          title="Education and certifications."
          description="Formal study and professional programs that support the analytical, technical, and teaching work shown across the portfolio."
        />
        <div className="credentials-grid">
          {credentials.map((item) => (
            <article className="credential-card-modern" key={`${item.type}-${item.title}-${item.subtitle}`}>
              {item.image ? (
                <a className="credential-image" href={assetUrl(item.image)} target="_blank" rel="noreferrer" aria-label={`View ${item.title} credential`}>
                  <img src={assetUrl(item.image)} alt={`${item.title} credential`} loading="lazy" />
                  <span>View credential <ArrowUpRight size={15} /></span>
                </a>
              ) : (
                <div className="credential-image credential-image-placeholder"><Award size={32} /></div>
              )}
              <div className="credential-copy">
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <small>{item.period}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad section-surface project-explorer">
        <SectionHeader
          eyebrow="Project archive"
          title="Explore by tool or business question."
          description="Search the portfolio or filter by the project’s primary technology."
        />
        <div className="project-toolbar">
          <div className="filter-list" aria-label="Project categories">
            {categories.map((category) => (
              <button className={activeCategory === category ? "filter-button active" : "filter-button"} type="button" key={category} onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </div>
          <label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" /></label>
        </div>
        <div className="project-grid compact-project-grid">
          {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
        {!filteredProjects.length && <div className="empty-state"><Search size={26} /><h3>No matching projects</h3><p>Try another keyword or technology.</p></div>}
        <div className="center-action"><Link className="button button-ghost" to="/projects">View the complete archive <ArrowRight size={17} /></Link></div>
      </section>

      <section className="section-pad" id="insights">
        <SectionHeader
          eyebrow="Writing & insights"
          title="Ideas explained without the noise."
          description="Medium articles open in a focused reading experience, with the original article always one click away."
          action={<a className="text-link section-action" href={profile.medium} target="_blank" rel="noreferrer">Visit Medium <ArrowUpRight size={17} /></a>}
        />
        <div className="article-grid">
          {articles.slice(0, 3).map((article) => (
            <article className="article-card" key={article.id}>
              <div className="article-icon"><BookOpen size={21} /></div>
              <div className="article-details">
                <span>{new Date(article.pubDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} · {readingTime(article.content)} min read</span>
                <h3>{article.title}</h3>
                <p>{plainTextFromHtml(article.description).slice(0, 180)}…</p>
                <Link className="text-link" to={`/articles/${article.slug}`}>Read inside the portfolio <ArrowRight size={16} /></Link>
              </div>
            </article>
          ))}
          {!articles.length && (
            <div className="article-card article-placeholder">
              <BookOpen size={24} /><h3>Medium insights are loading</h3><p>You can still browse the full publication on Medium.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-pad contact-section">
        <div className="request-layout">
          <aside className="request-intro">
            <span className="eyebrow">Work with me</span>
            <h2>Turn your data problem into a clear deliverable.</h2>
            <p>{profile.summary}</p>
            <div className="request-contact-links">
              <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
            </div>
          </aside>
          <ServiceRequestForm key={selectedService || "service-request"} email={profile.email} services={services} initialService={selectedService} />
        </div>
      </section>
    </>
  );
}
