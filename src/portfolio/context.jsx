import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ContentContext = createContext(null);
const ThemeContext = createContext(null);

const STORAGE_KEY = "bassam-portfolio-content-v2";

async function loadStaticContent() {
  const base = import.meta.env.BASE_URL || "/";
  const [siteResponse, projectsResponse] = await Promise.all([
    fetch(`${base}data/siteContent.json`),
    fetch(`${base}data/portfolioProjects.json`),
  ]);

  if (!siteResponse.ok || !projectsResponse.ok) {
    throw new Error("Could not load the portfolio content files.");
  }

  return {
    site: await siteResponse.json(),
    projects: await projectsResponse.json(),
  };
}

async function loadContent() {
  try {
    const response = await fetch("/api/local-content", { cache: "no-store" });
    if (response.ok) {
      return { ...(await response.json()), mode: "workspace" };
    }
  } catch {
    // The local workspace API only exists while the Vite development server runs.
  }

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return { ...JSON.parse(cached), mode: "browser" };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return { ...(await loadStaticContent()), mode: "readonly" };
}

async function fetchArticles(feedUrl) {
  if (!feedUrl) return [];

  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Medium feed is currently unavailable.");
  const payload = await response.json();

  return (payload.items || []).map((item, index) => ({
    id: item.guid || String(index),
    title: item.title,
    link: item.link,
    thumbnail: item.thumbnail,
    pubDate: item.pubDate,
    author: item.author || "Bassam El-Shoraa",
    categories: item.categories || [],
    description: item.description || "",
    content: item.content || item.description || "",
    slug: `${item.title || `article-${index}`}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  }));
}

export function ContentProvider({ children }) {
  const [site, setSite] = useState(null);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [mode, setMode] = useState("loading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    loadContent()
      .then((payload) => {
        if (!active) return;
        setSite(payload.site);
        setProjects(payload.projects || []);
        setMode(payload.mode);
        setLoading(false);
        fetchArticles(payload.site?.profile?.mediumFeed)
          .then((items) => {
            if (active && items) setArticles(items);
          })
          .catch(() => {
            if (active) setArticles([]);
          });
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const saveContent = useCallback(async (nextSite, nextProjects) => {
    const payload = { site: nextSite, projects: nextProjects };

    try {
      const response = await fetch("/api/local-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Workspace API is unavailable.");
      setMode("workspace");
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setMode("browser");
    }

    setSite(nextSite);
    setProjects(nextProjects);
    return payload;
  }, []);

  const refreshArticles = useCallback(async (feedUrl = site?.profile?.mediumFeed) => {
    const items = await fetchArticles(feedUrl);
    setArticles(items);
    return items;
  }, [site]);

  const value = useMemo(
    () => ({
      site,
      projects,
      articles,
      loading,
      error,
      mode,
      saveContent,
      refreshArticles,
    }),
    [site, projects, articles, loading, error, mode, saveContent, refreshArticles],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("portfolio-theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")) }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function usePortfolioContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error("usePortfolioContent must be used inside ContentProvider.");
  return value;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider.");
  return value;
}
