import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { connectGithub as openGithub, saveGithubContent, uploadGithubAsset } from "./githubContent.js";

const ContentContext = createContext(null);
const ThemeContext = createContext(null);

async function loadStaticContent() {
  const base = import.meta.env.BASE_URL || "/";
  const [siteResponse, projectsResponse, articlesResponse] = await Promise.all([
    fetch(`${base}data/siteContent.json`),
    fetch(`${base}data/portfolioProjects.json`),
    fetch(`${base}data/articles.json`),
  ]);

  if (!siteResponse.ok || !projectsResponse.ok || !articlesResponse.ok) {
    throw new Error("Could not load the portfolio content files.");
  }

  return {
    site: await siteResponse.json(),
    projects: await projectsResponse.json(),
    articles: await articlesResponse.json(),
  };
}

async function loadContent() {
  if (import.meta.env.MODE !== "github-pages") {
    try {
      const response = await fetch("/api/local-content", { cache: "no-store" });
      if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
        return { ...(await response.json()), mode: "workspace" };
      }
    } catch {
      // The local editing API is only available in the project workspace.
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

function validateContent({ site, projects, articles }) {
  if (!site?.profile?.name || !Array.isArray(site.expertise) || !Array.isArray(site.experience) || !Array.isArray(projects) || !Array.isArray(articles)) {
    throw new Error("Profile, expertise, experience, projects, and articles are required.");
  }
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const [type, collection] of [["project", projects], ["article", articles]]) {
    const slugs = new Set();
    for (const item of collection) {
      if (!item.title?.trim() || !slugPattern.test(item.slug || "")) throw new Error(`A ${type} needs a title and a URL slug using lowercase letters, numbers, and hyphens.`);
      if (slugs.has(item.slug)) throw new Error(`Duplicate ${type} URL slug: ${item.slug}`);
      slugs.add(item.slug);
    }
  }
}

export function ContentProvider({ children }) {
  const [site, setSite] = useState(null);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [mode, setMode] = useState("loading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [githubSession, setGithubSession] = useState(null);

  useEffect(() => {
    let active = true;

    loadContent()
      .then((payload) => {
        if (!active) return;
        setSite(payload.site);
        setProjects(payload.projects || []);
        setArticles(payload.articles || []);
        setMode(payload.mode);
        setLoading(false);
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

  const saveContent = useCallback(async (nextSite, nextProjects, nextArticles = articles) => {
    const payload = { site: nextSite, projects: nextProjects, articles: nextArticles };
    validateContent(payload);
    if (githubSession?.token) {
      await saveGithubContent(githubSession.token, payload);
      setMode("remote");
    } else if (mode === "workspace") {
      const response = await fetch("/api/local-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Workspace API is unavailable.");
      setMode("workspace");
    } else {
      throw new Error("Connect your GitHub account to publish changes. Nothing was saved in this browser.");
    }
    setSite(nextSite);
    setProjects(nextProjects);
    setArticles(nextArticles);
    return payload;
  }, [articles, githubSession, mode]);

  const connectGithub = useCallback(async (token) => {
    const result = await openGithub(token);
    setGithubSession({ token, user: result.user });
    setSite(result.content.site);
    setProjects(result.content.projects);
    setArticles(result.content.articles);
    setMode("remote");
    return result.user;
  }, []);

  const disconnectGithub = useCallback(() => {
    setGithubSession(null);
    setMode("readonly");
  }, []);

  const uploadAsset = useCallback(async (file) => {
    if (file.size > 4 * 1024 * 1024) throw new Error("Choose a file smaller than 4 MB.");
    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf"];
    if (!validTypes.includes(file.type)) throw new Error("Use PNG, JPG, WEBP, SVG, or PDF.");
    const extension = file.type === "image/svg+xml" ? "svg" : file.type === "application/pdf" ? "pdf" : file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const baseName = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "asset";
    const path = `${file.type === "application/pdf" ? "files" : "image"}/uploads/${Date.now()}-${baseName}.${extension}`;
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    if (githubSession?.token) {
      await uploadGithubAsset(githubSession.token, path, dataUrl);
      return path;
    }
    if (mode !== "workspace") throw new Error("Connect GitHub before uploading an asset.");
    const response = await fetch("/api/local-upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, dataUrl }) });
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Upload failed.");
    return (await response.json()).path;
  }, [githubSession, mode]);

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
      connectGithub,
      disconnectGithub,
      githubUser: githubSession?.user || "",
      uploadAsset,
    }),
    [site, projects, articles, loading, error, mode, saveContent, refreshArticles, connectGithub, disconnectGithub, githubSession, uploadAsset],
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
