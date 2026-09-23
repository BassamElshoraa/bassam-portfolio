import { ArrowUpRight, BarChart3, Code2, Database } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { assetUrl, projectCategory, projectTechnologies } from "./utils.js";

function CategoryIcon({ category }) {
  if (category === "Power BI") return <BarChart3 size={17} />;
  if (category === "SQL") return <Database size={17} />;
  return <Code2 size={17} />;
}

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function ProjectCard({ project, featured = false }) {
  const category = projectCategory(project);
  const technologies = projectTechnologies(project).slice(0, 4);
  const [isWideBanner, setIsWideBanner] = useState(false);

  return (
    <article className={featured ? "project-card project-card-featured" : "project-card"}>
      <Link className={`project-image-link${isWideBanner ? " has-wide-banner" : ""}`} to={`/projects/${project.slug}`} aria-label={`Open ${project.title}`}>
        <span className="project-cover-copy"><small>SELECTED WORK</small><strong>{project.title}</strong></span>
        <span className={`project-cover-thumb${isWideBanner ? " is-wide-banner" : ""}`}><img src={assetUrl(project.image)} alt="" loading="lazy" onLoad={(event) => setIsWideBanner(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight > 2.25)} onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.closest(".project-image-link").classList.add("image-missing"); }} /></span>
        <span className="project-category"><CategoryIcon category={category} /> {category}</span>
        <span className="project-open"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="project-card-body">
        <div className="project-meta">
          {technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        <h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.description}</p>
        <Link className="text-link" to={`/projects/${project.slug}`}>Explore case study <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
