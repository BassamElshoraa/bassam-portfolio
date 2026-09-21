import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioContent } from "./context.jsx";
import ProjectCard from "./ProjectCard.jsx";
import { projectCategory } from "./utils.js";

const categories = ["All", "Power BI", "Python", "SQL", "Excel", "Analytics"];

export default function Projects() {
  const { projects } = usePortfolioContent();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const visibleProjects = useMemo(
    () => [...projects]
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(b.id) - Number(a.id))
      .filter((project) => category === "All" || projectCategory(project) === category)
      .filter((project) => `${project.title} ${project.description} ${(project.badges || []).join(" ")}`.toLowerCase().includes(query.toLowerCase())),
    [projects, category, query],
  );

  return (
    <div className="inner-page section-pad">
      <Link className="back-link" to="/"><ArrowLeft size={17} /> Back home</Link>
      <header className="page-intro">
        <span className="eyebrow">Project archive</span>
        <h1>{projects.length} projects across analytics, BI, and research.</h1>
        <p>Every project includes its context, tools, and available evidence. Open a project to explore the Power BI report or browse code and notebooks without leaving the portfolio.</p>
      </header>

      <div className="project-toolbar archive-toolbar">
        <div className="filter-list">
          {categories.filter((item) => item === "All" || projects.some((project) => projectCategory(project) === item)).map((item) => (
            <button className={category === item ? "filter-button active" : "filter-button"} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, tool, or topic" /></label>
      </div>

      <p className="result-count">Showing {visibleProjects.length} of {projects.length} projects</p>
      <div className="project-grid archive-grid">
        {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  );
}
