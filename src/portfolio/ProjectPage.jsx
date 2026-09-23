import { useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Code2,
  ExternalLink,
  Lightbulb,
  Maximize2,
  Target,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import GithubViewer from "./GithubViewer.jsx";
import ProjectCard from "./ProjectCard.jsx";
import { usePortfolioContent } from "./context.jsx";
import { assetUrl, projectCategory, projectTechnologies } from "./utils.js";

export default function ProjectPage() {
  const { slug } = useParams();
  const { projects } = usePortfolioContent();
  const project = projects.find((item) => item.slug === slug);

  useEffect(() => {
    if (project) document.title = `${project.title} | Bassam El-Shoraa`;
  }, [project]);

  const related = useMemo(() => {
    if (!project) return [];
    const category = projectCategory(project);
    return projects.filter((item) => item.slug !== project.slug && projectCategory(item) === category).slice(0, 3);
  }, [project, projects]);

  if (!project) {
    return (
      <section className="inner-page section-pad error-state">
        <span className="eyebrow">Project not found</span>
        <h1>This case study is not available.</h1>
        <Link className="button" to="/projects">Browse all projects</Link>
      </section>
    );
  }

  const technologies = projectTechnologies(project);
  const category = projectCategory(project);
  const isPowerBi = category === "Power BI" && project.demo?.includes("powerbi.com");
  const isCodeProject = ["Python", "SQL"].includes(category) && Boolean(project.github);

  const story = [
    { icon: <Target size={20} />, label: "Challenge", value: project.challenge },
    { icon: <Lightbulb size={20} />, label: "Approach", value: project.approach },
    { icon: <CheckCircle2 size={20} />, label: "Outcome", value: project.impact },
  ].filter((item) => item.value);

  return (
    <div className="project-page inner-page section-pad">
      <Link className="back-link" to="/projects"><ArrowLeft size={17} /> Project archive</Link>

      <header className="project-intro">
        <div>
          <span className="eyebrow">{category} project</span>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
        <div className="project-meta project-meta-large">{technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      </header>

      {isPowerBi && (
        <section className="project-primary-viewer powerbi-project-viewer" aria-label={`${project.title} Power BI report`}>
          <div className="workspace-bar">
            <div><BarChart3 size={18} /><span><strong>Interactive Power BI report</strong><small>Use the report controls, filters, and pages directly below.</small></span></div>
            <a href={project.demo} target="_blank" rel="noreferrer">Full screen <Maximize2 size={15} /></a>
          </div>
          <div className="powerbi-frame"><iframe title={`${project.title} interactive Power BI report`} src={project.demo} allow="fullscreen" allowFullScreen loading="eager" /></div>
        </section>
      )}

      {isCodeProject && (
        <section className="project-primary-viewer code-project-viewer" aria-label={`${project.title} source code`}>
          <div className="workspace-bar workspace-bar-code">
            <div><Code2 size={18} /><span><strong>{category} source code</strong><small>Browse the project files and scroll through the code without leaving the portfolio.</small></span></div>
            <a href={project.github} target="_blank" rel="noreferrer">GitHub <ExternalLink size={15} /></a>
          </div>
          <GithubViewer url={project.github} title={project.title} slug={project.slug} kind={category} fallbackImage={project.image} compactHeader />
        </section>
      )}

      {!isPowerBi && !isCodeProject && (
        <section className="project-overview-fallback">
          <img src={assetUrl(project.image)} alt={`${project.title} preview`} onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.parentElement.classList.add("image-missing"); }} />
          <div><h2>Project overview</h2><p>{project.description}</p>{project.github && <a className="button button-ghost" href={project.github} target="_blank" rel="noreferrer">Open project <ArrowUpRight size={16} /></a>}</div>
        </section>
      )}

      {story.length > 0 && <section className="case-story case-story-after-viewer">
        {story.map((item) => (
          <article key={item.label}><div className="story-icon">{item.icon}</div><span>{item.label}</span><p>{item.value}</p></article>
        ))}
      </section>}

      {related.length > 0 && (
        <section className="related-projects">
          <div className="viewer-heading"><div><span className="eyebrow">Keep exploring</span><h2>Related projects</h2></div><Link className="text-link" to="/projects">All projects <ArrowUpRight size={16} /></Link></div>
          <div className="project-grid">{related.map((item) => <ProjectCard key={item.id} project={item} />)}</div>
        </section>
      )}
    </div>
  );
}
