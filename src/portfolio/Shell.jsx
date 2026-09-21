import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { usePortfolioContent, useTheme } from "./context.jsx";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Capabilities", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Credentials", href: "#credentials" },
  { label: "Insights", href: "#insights" },
];

export function Loader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="loader-ring" />
      <span className="loader-line" />
      <span>Loading portfolio</span>
    </div>
  );
}

export function Shell() {
  const { site, loading, error } = usePortfolioContent();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  if (loading) return <Loader />;

  if (error || !site) {
    return (
      <main className="error-state">
        <span className="eyebrow">Content unavailable</span>
        <h1>The portfolio could not be loaded.</h1>
        <p>{error || "Please refresh the page and try again."}</p>
      </main>
    );
  }

  const { profile } = site;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Bassam El-Shoraa home">
            <span className="brand-copy">
              <strong>Bassam El-Shoraa</strong>
              <small>Data • BI • Training</small>
            </span>
          </Link>

          <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.label} href={`${import.meta.env.BASE_URL}${item.href}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <a className="button button-small header-cta" href={`${import.meta.env.BASE_URL}#request`}>
              Hire me <ArrowUpRight size={16} />
            </a>
            <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Toggle navigation">
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-identity">
          <strong>Bassam El-Shoraa</strong>
          <p>Data made clear. Decisions made better.</p>
        </div>
        <div className="footer-links">
          <a href={`mailto:${profile.email}`} aria-label="Email Bassam"><Mail size={18} /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
          {import.meta.env.BASE_URL === "/" && <Link to="/dashboard" className="admin-link">Local dashboard</Link>}
        </div>
      </footer>
    </div>
  );
}
