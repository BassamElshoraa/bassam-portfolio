import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Github,
  GraduationCap,
  LayoutDashboard,
  Linkedin,
  Mail,
  Phone,
  Search,
  UserRoundCheck,
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
  mentoring: UserRoundCheck,
  training: GraduationCap,
};

const expertiseIcons = {
  "Business Intelligence": LayoutDashboard,
  "Analytics & Forecasting": Activity,
  "Data Engineering & Automation": Workflow,
  "Analytics Education": GraduationCap,
};

const toolLogos = {
  "Power BI": "/image/tools/powerbi.svg",
  SQL: "/image/tools/microsoftsqlserver.svg",
  Python: "/image/tools/python.svg",
  Excel: "/image/tools/microsoftexcel.svg",
  "Power Query": "/image/tools/microsoftexcel.svg",
  Tableau: "/image/tools/tableau.svg",
};

const toolIcons = {
  "Looker Studio": LayoutDashboard,
};

const skillLogoAliases = {
  "Power BI": "Power BI",
  "Power Query": "Power Query",
  Excel: "Excel",
  Tableau: "Tableau",
  Python: "Python",
  SQL: "SQL",
  "SQL Server": "SQL",
};

const skillIcons = {
  DAX: BarChart3,
  "Looker Studio": LayoutDashboard,
  Pandas: Database,
  Statsmodels: Activity,
  "Scikit-learn": Activity,
  Statistics: BarChart3,
  SSIS: Workflow,
  "Power Automate": Workflow,
  n8n: Workflow,
  "Curriculum Design": BookOpen,
  Mentoring: UserRoundCheck,
  Assessment: Award,
  "Data Storytelling": BarChart3,
};

function formatPhone(phone = "") {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+20") && digits.length === 12) {
    return `+20 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return phone;
}

function articleImage(article) {
  if (article.title === "Analyzing Football Data with Python") return assetUrl("image/articles/football-data-python.png");
  if (article.thumbnail) return article.thumbnail;
  const match = `${article.content || ""} ${article.description || ""}`.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

function CompanyLink({ href, children, className = "company-link" }) {
  if (!href) return children;
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

function ExperienceCompany({ item }) {
  if (item.companyLinks?.length) {
    return (
      <p className="company-links">
        {item.companyLinks.map((company, index) => (
          <span key={company.label}>
            {index > 0 && <span className="company-link-separator"> &amp; </span>}
            <CompanyLink href={company.website}>{company.label}</CompanyLink>
          </span>
        ))}
      </p>
    );
  }

  return <p><CompanyLink href={item.website}>{item.company}</CompanyLink></p>;
}

function SkillBadge({ skill }) {
  const logoKey = skillLogoAliases[skill];
  const Icon = skillIcons[skill] || BarChart3;

  return (
    <span className="skill-badge">
      <i className={logoKey ? "skill-badge-visual has-logo" : "skill-badge-visual"} aria-hidden="true">
        {logoKey ? <img src={assetUrl(toolLogos[logoKey])} alt="" /> : <Icon size={17} />}
      </i>
      <b>{skill}</b>
    </span>
  );
}

function RotatingOutcome({ words = [] }) {
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    if (words.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveWord((current) => (current + 1) % words.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <span className="rotating-outcome" aria-live="polite">
      <span className="rotating-outcome-word" key={words[activeWord] || "impact"}>
        {words[activeWord] || "business impact."}
      </span>
    </span>
  );
}

function CredentialSpotlight({ items = [] }) {
  const alxIndex = Math.max(0, items.findIndex((item) => item.title === "Professional Data Science Program"));
  const [activeIndex, setActiveIndex] = useState(alxIndex);

  if (!items.length) return null;

  const move = (direction) => {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  };

  const visible = [-1, 0, 1].map((offset) => {
    const index = (activeIndex + offset + items.length) % items.length;
    return { ...items[index], offset, originalIndex: index };
  });

  return (
    <div className="hero-credentials reveal">
      <div className="credential-strip-heading">
        <div className="credential-controls" aria-label="Certificate navigation">
          <button type="button" onClick={() => move(-1)} aria-label="Previous certificate"><ChevronLeft size={19} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next certificate"><ChevronRight size={19} /></button>
        </div>
      </div>

      <div className="credential-spotlight-track">
        {visible.map((item) => (
          <article
            className={`credential-spotlight-card ${item.offset === 0 ? "is-active" : ""}`}
            key={`${item.title}-${item.originalIndex}-${item.offset}`}
          >
            {item.image ? (
              <a className="credential-spotlight-image" href={assetUrl(item.image)} target="_blank" rel="noreferrer" aria-label={`View ${item.title} credential`}>
                <img src={assetUrl(item.image)} alt={`${item.title} credential`} loading="lazy" />
              </a>
            ) : (
              <div className="credential-spotlight-image credential-spotlight-placeholder"><Award size={34} /><span>{item.subtitle}</span></div>
            )}
            <div>
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <small>{item.period}</small>
            </div>
          </article>
        ))}
      </div>

      <div className="credential-dots" aria-hidden="true">
        {items.map((item, index) => (
          <span className={index === activeIndex ? "active" : ""} key={`${item.title}-${index}`} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { site, projects, articles } = usePortfolioContent();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const projectRailRef = useRef(null);
  const {
    profile,
    organizations = [],
    expertise,
    experience,
    education,
    certifications,
    services = [],
  } = site;

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(b.id) - Number(a.id)),
    [projects],
  );

  const categories = categoryOrder.filter(
    (category) => category === "All" || projects.some((project) => projectCategory(project) === category),
  );

  const filteredProjects = sortedProjects
    .filter((project) => activeCategory === "All" || projectCategory(project) === activeCategory)
    .filter((project) => `${project.title} ${project.description} ${(project.badges || []).join(" ")}`.toLowerCase().includes(search.toLowerCase()));

  const credentialPriority = {
    "Data Visualization in Power BI": 0,
    "Data Analysis Professional Track": 1,
    "Professional Data Science Program": 2,
    "Data Science & Machine Learning Program": 3,
    "Data Analysis Challenger Track": 4,
    "Intro to Descriptive Statistics": 5,
    "Bachelor's degree": 6,
  };

  const credentials = [
    ...certifications.map((item) => ({ ...item, type: "Certification", subtitle: item.issuer })),
    ...education.map((item) => ({
      ...item,
      type: "Education",
      title: item.degree,
      subtitle: item.school,
      period: `${item.period} · ${item.location}`,
    })),
  ].sort((a, b) => (credentialPriority[a.title] ?? 99) - (credentialPriority[b.title] ?? 99));

  const shinyWhite = organizations.find((item) => item.name.includes("Shiny White"));
  const teachingOrganizations = organizations
    .filter((item) => item.name.includes("Digilians") || item.name.includes("Digital Egypt"))
    .sort((a, b) => Number(b.name.includes("Digital Egypt")) - Number(a.name.includes("Digital Egypt")));
  const scrollProjects = (direction) => projectRailRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });

  return (
    <>
      <section className="hero section-pad" id="home">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <div className="hero-nameplate" aria-label="Bassam Elshoraa">
              <span>Bassam</span> Elshoraa
            </div>
            <h1>
              {profile.headline}{" "}
              <RotatingOutcome words={profile.rotatingWords} />
            </h1>
            <p className="hero-subtitle">{profile.subheadline}</p>

            <div className="role-keywords" aria-label="Professional roles">
              {(profile.roleKeywords || []).map((role) => <span key={role}>{role}</span>)}
            </div>

            <div className="tool-stack" aria-label="Tools I use">
              <div className="tool-grid">
                {(profile.toolKeywords || []).map((tool) => (
                  <span key={tool}>
                    <i>{toolLogos[tool] ? <img src={assetUrl(toolLogos[tool])} alt="" /> : (() => { const Icon = toolIcons[tool]; return Icon ? <Icon size={19} aria-hidden="true" /> : null; })()}</i>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="current-work" aria-label="Current roles">
              {shinyWhite && (
                <div className="current-work-row">
                  <div className="current-work-logos"><img src={assetUrl(shinyWhite.logo)} alt="Shiny White" /></div>
                  <p><strong>Data Analyst</strong><span><CompanyLink href={shinyWhite.website} className="current-company-link">Shiny White Dental Centers</CompanyLink></span></p>
                </div>
              )}
              <div className="current-work-row">
                <div className="current-work-logos stacked-logos">
                  {teachingOrganizations.map((organization) => <img src={assetUrl(organization.logo)} alt={organization.name} key={organization.name} />)}
                </div>
                <p>
                  <strong>Data Analysis Instructor</strong>
                  <span className="current-company-links">
                    {teachingOrganizations.map((organization, index) => (
                      <span key={organization.name}>
                        {index > 0 && <span className="current-company-separator"> and </span>}
                        <CompanyLink href={organization.website} className="current-company-link">
                          {organization.name.includes("Digital Egypt") ? "DEPI" : organization.name}
                        </CompanyLink>
                      </span>
                    ))}
                  </span>
                </p>
              </div>
            </div>

            <div className="hero-action-cluster">
              <div className="hero-actions">
                <a className="button" href={assetUrl(profile.resume)} target="_blank" rel="noreferrer">Resume <ArrowUpRight size={18} /></a>
                <a className="button button-ghost" href="#contact">Request a service <ArrowRight size={18} /></a>
              </div>
              <div className="hero-contact-links" aria-label="Direct contact links">
                <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
                <a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={18} /></a>
                <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
                <a className="hero-phone" href={`tel:${profile.phone}`}><Phone size={17} /><span>{formatPhone(profile.phone)}</span></a>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay">
            <div className="portrait-frame">
              <img src={assetUrl(profile.photo)} alt="Bassam El-Shoraa" />
            </div>
          </div>
        </div>

        <CredentialSpotlight items={credentials} />
      </section>

      <section className="section-pad section-surface" id="about">
        <SectionHeader
          title="About"
        />
        <div className="about-layout">
          <article className="about-story">
            <div className="about-copy">
              <p>{profile.summary}</p>
              {profile.aboutDetails && <p>{profile.aboutDetails}</p>}
            </div>
            <div className="about-focus-grid">
              <div><strong>Decision-ready BI</strong><span>From scattered data to clear KPIs and reports.</span></div>
              <div><strong>Financial clarity</strong><span>Budgets, forecasts, performance, and variance analysis.</span></div>
              <div><strong>Practical teaching</strong><span>Hands-on analytics training built around real work.</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-pad" id="experience">
        <SectionHeader
          title="Experience"
          action={<a className="text-link section-action" href={assetUrl(profile.resume)} target="_blank" rel="noreferrer">Open resume <ArrowUpRight size={17} /></a>}
        />
        <div className="experience-timeline">
          {experience.map((item) => (
            <article className="timeline-item-new" key={item.id}>
              <div className="timeline-meta">
                <div className="timeline-date"><span>{item.period}</span><small>{item.location}</small></div>
              </div>
              <div className="experience-body">
                <div className="timeline-head">
                  <div className={`timeline-marker ${item.logoTheme === "dark" ? "timeline-marker-dark" : ""} ${(item.logos || []).length > 1 ? "timeline-marker-multiple" : ""}`}>
                    {(item.logos || []).length ? (
                      item.logos.map((logo, logoIndex) => <img src={assetUrl(logo)} alt="" key={`${item.id}-logo-${logoIndex}`} />)
                    ) : item.logo ? <img src={assetUrl(item.logo)} alt="" /> : <BriefcaseBusiness size={22} />}
                  </div>
                  <div className="timeline-title-row">
                    <div className="timeline-title-copy">
                      <h3>{item.role}</h3>
                      <ExperienceCompany item={item} />
                    </div>
                    {item.current && <span className="current-role-label"><i /> Current role</span>}
                  </div>
                </div>
                <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad section-surface" id="skills">
        <SectionHeader
          title="Skills"
        />
        <div className="expertise-grid">
          {expertise.map((item) => {
            const Icon = expertiseIcons[item.title] || BarChart3;
            return (
              <article className="expertise-card" key={item.title}>
                <div className="expertise-icon"><Icon size={25} /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="chip-row expertise-tools">{item.skills.map((skill) => <SkillBadge skill={skill} key={skill} />)}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-pad project-explorer" id="projects">
        <SectionHeader
          title="Projects"
          action={<Link className="text-link section-action" to="/projects">Open dedicated archive <ArrowRight size={17} /></Link>}
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
        <div className="project-rail-meta">
          <div className="project-results-meta">Showing {filteredProjects.length} of {projects.length} projects</div>
          <div className="project-rail-controls" aria-label="Project navigation">
            <button type="button" onClick={() => scrollProjects(-1)} aria-label="Previous projects"><ChevronLeft size={19} /></button>
            <button type="button" onClick={() => scrollProjects(1)} aria-label="Next projects"><ChevronRight size={19} /></button>
          </div>
        </div>
        <div className="project-grid complete-project-grid" ref={projectRailRef}>
          {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
        {!filteredProjects.length && <div className="empty-state"><Search size={26} /><h3>No matching projects</h3><p>Try another keyword or technology.</p></div>}
      </section>

      <section className="section-pad section-surface" id="services">
        <SectionHeader
          title="Services"
          description="Analytics work you can hire me for."
          action={<a className="button button-small section-action" href="#contact">Request a quote <ArrowRight size={16} /></a>}
        />
        <div className="services-grid">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon] || BarChart3;
            return (
              <article className="service-card" key={service.id}>
                <div className="service-card-top">
                  <div className="service-card-icon"><Icon size={23} /></div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>{(service.deliverables || []).map((item) => <li key={item}>{item}</li>)}</ul>
                <a className="text-link" href="#contact" onClick={() => setSelectedService(service.title)}>Request this service <ArrowRight size={15} /></a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-pad" id="articles">
        <SectionHeader
          title="Articles"
          action={<a className="text-link section-action" href={profile.medium} target="_blank" rel="noreferrer">Visit Medium <ArrowUpRight size={17} /></a>}
        />
        <div className="article-grid">
          {articles.slice(0, 3).map((article) => {
            const image = articleImage(article);
            return (
              <article className="article-card" key={article.id}>
                <Link className="article-cover" to={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}>
                  {image ? <img src={image} alt="" loading="lazy" /> : <BookOpen size={28} />}
                </Link>
              <div className="article-details">
                <span>{new Date(article.pubDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} · {readingTime(article.content)} min read</span>
                <h3>{article.title}</h3>
                <p>{plainTextFromHtml(article.description).slice(0, 180)}…</p>
                <Link className="text-link" to={`/articles/${article.slug}`}>Read inside the portfolio <ArrowRight size={16} /></Link>
              </div>
            </article>
            );
          })}
          {!articles.length && (
            <div className="article-card article-placeholder">
              <BookOpen size={24} /><h3>Medium insights are loading</h3><p>You can still browse the full publication on Medium.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-pad contact-section" id="contact">
        <div className="request-layout">
          <aside className="request-intro">
            <span className="contact-section-title">Contact</span>
            <h2>Let’s build something useful.</h2>
            <p>Tell me what you need and I’ll reply with the clearest next step.</p>
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
