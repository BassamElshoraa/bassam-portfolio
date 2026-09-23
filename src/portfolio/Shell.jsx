import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
} from "lucide-react";
import { usePortfolioContent, useTheme } from "./context.jsx";

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
    if (loading) return undefined;
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return undefined;
    }
    const target = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, loading]);

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

  const { profile, ui = {}, navigation = [] } = site;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label={`${profile.displayName || profile.name} home`}>
            <span className="brand-wordmark"><span className="brand-prefix">{(ui.brand || "By Bassam").split(" ")[0]}</span>{(ui.brand || "By Bassam").split(" ").slice(1).join(" ")}</span>
          </Link>

          <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
            {navigation.map((item) => (
              <a key={item.anchor} href={`${import.meta.env.BASE_URL}#${item.anchor}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="header-socials" aria-label="Contact links">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
              <a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={16} /></a>
              <a href={`tel:${profile.phone}`} aria-label="Phone"><Phone size={16} /></a>
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>
            </div>
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <a className="button button-small header-cta" href={`${import.meta.env.BASE_URL}#contact`}>
              Request a service <ArrowUpRight size={16} />
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
          <strong className="footer-name-mark"><span>{(profile.displayName || profile.name).split(" ")[0]}</span> {(profile.displayName || profile.name).split(" ").slice(1).join(" ")}</strong>
          <p>{ui.footerTagline || "Data made clear. Decisions made better."}</p>
        </div>
        <div className="footer-links">
          <a href={`mailto:${profile.email}`} aria-label="Email Bassam"><Mail size={18} /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
          <Link to="/dashboard" className="admin-link">Content dashboard</Link>
        </div>
      </footer>
    </div>
  );
}
