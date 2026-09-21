export function assetUrl(value = "") {
  const base = import.meta.env.BASE_URL || "/";
  const requested = value || "image/project/pr27_710BE012DE26B437956D.png";
  if (/^(https?:|data:)/.test(requested)) return requested;
  return `${base}${requested.replace(/^(\.\/|\/)+/, "")}`;
}

export function normalizeTechnology(value = "") {
  const normalized = value.trim().toLowerCase();
  const aliases = {
    "power bi": "Power BI",
    "powerbi": "Power BI",
    "power query": "Power Query",
    "my sql": "SQL",
    mysql: "SQL",
    "microsoft sql server ssms": "SQL",
    sql: "SQL",
    python: "Python",
    excel: "Excel",
    "microsoft excel": "Excel",
    numpy: "NumPy",
    pandas: "Pandas",
    seaborn: "Seaborn",
    sklearn: "Scikit-learn",
    "scikit-learn": "Scikit-learn",
    jupyter: "Jupyter Notebook",
    notebooks: "Jupyter Notebook",
    "jupyter notebooks": "Jupyter Notebook",
  };
  return aliases[normalized] || value.trim();
}

export function projectTechnologies(project) {
  const unique = new Set((project.badges || []).map(normalizeTechnology).filter(Boolean));
  return [...unique];
}

export function projectCategory(project) {
  const technologies = projectTechnologies(project);
  if (technologies.includes("Power BI")) return "Power BI";
  if (technologies.includes("Python")) return "Python";
  if (technologies.includes("SQL")) return "SQL";
  if (technologies.includes("Excel")) return "Excel";
  return "Analytics";
}

export function projectViewerType(project) {
  if (project.demo?.includes("powerbi.com")) return "powerbi";
  if (project.github) return "github";
  return "overview";
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function plainTextFromHtml(html = "") {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, "text/html");
  return documentNode.body.textContent?.replace(/\s+/g, " ").trim() || "";
}

export function readingTime(html = "") {
  const words = plainTextFromHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function parseGithubUrl(url = "") {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    const [owner, repo, mode, branch, ...pathParts] = parts;
    if (!owner || !repo) return null;
    return {
      owner,
      repo: repo.replace(/\.git$/, ""),
      branch: mode === "tree" || mode === "blob" ? branch : "",
      path: mode === "tree" || mode === "blob" ? pathParts.join("/") : "",
      directFile: mode === "blob",
    };
  } catch {
    return null;
  }
}

export function decodeGithubContent(value = "") {
  const binary = atob(value.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}
