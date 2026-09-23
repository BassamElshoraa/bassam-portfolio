import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const published = process.argv.includes("--pages");
const base = published ? "https://bassamelshoraa.github.io/bassam-portfolio/" : "http://127.0.0.1:4173/";
const [template, site, projects, articles] = await Promise.all([
  readFile(path.join(dist, "index.html"), "utf8"),
  readFile(path.join(root, "public/data/siteContent.json"), "utf8").then(JSON.parse),
  readFile(path.join(root, "public/data/portfolioProjects.json"), "utf8").then(JSON.parse),
  readFile(path.join(root, "public/data/articles.json"), "utf8").then(JSON.parse),
]);
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
for (const item of [...projects, ...articles]) {
  if (!validSlug.test(item.slug || "")) throw new Error(`Invalid content URL slug: ${item.slug}`);
}

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const plain = (value = "") => String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const absoluteAsset = (value = "") => /^https?:\/\//.test(value) ? value : `${base}${value.replace(/^\/+/, "")}`;
const routes = [
  { route: "", title: site.ui?.seoTitle || site.profile.name, description: site.ui?.seoDescription || site.profile.subheadline, image: site.ui?.seoImage || site.profile.photo },
  { route: "projects", title: `Projects | ${site.profile.name}`, description: `Browse ${projects.length} analytics, business intelligence, Python, SQL, and Power BI projects by ${site.profile.name}.`, image: site.ui?.seoImage || site.profile.photo },
  ...projects.map((item) => ({ route: `projects/${item.slug}`, title: `${item.title} | ${site.profile.name}`, description: item.description, image: item.image })),
  ...articles.map((item) => ({ route: `articles/${item.slug}`, title: `${item.title} | ${site.profile.name}`, description: plain(item.description || item.content).slice(0, 190), image: item.thumbnail || site.ui?.seoImage || site.profile.photo, type: "article" })),
  { route: "dashboard", title: `Content dashboard | ${site.profile.name}`, description: "Private content workspace", image: site.ui?.seoImage || site.profile.photo, noindex: true },
];

function staticContent(page) {
  const title = `<h1>${escapeHtml(page.title)}</h1>`;
  const description = `<p>${escapeHtml(page.description)}</p>`;
  const project = projects.find((item) => page.route === `projects/${item.slug}`);
  const article = articles.find((item) => page.route === `articles/${item.slug}`);
  if (project) return `${title}${description}<img src="${escapeHtml(absoluteAsset(project.image))}" alt="${escapeHtml(project.title)} preview" />${[project.challenge, project.approach, project.impact].filter(Boolean).map((part) => `<p>${escapeHtml(part)}</p>`).join("")}`;
  if (article) return `${title}<img src="${escapeHtml(absoluteAsset(article.thumbnail))}" alt="${escapeHtml(article.title)} cover" />${description}<p>${escapeHtml(plain(article.content).slice(0, 750))}</p>`;
  if (page.route === "projects") return `${title}${description}<ul>${projects.map((item) => `<li><a href="${base}projects/${encodeURIComponent(item.slug)}/">${escapeHtml(item.title)}</a></li>`).join("")}</ul>`;
  if (page.route === "") return `${title}${description}<p>${escapeHtml(site.profile.summary)}</p><p>${escapeHtml(site.profile.aboutDetails)}</p><p><a href="${base}projects/">Explore ${projects.length} projects</a></p>`;
  return title;
}

for (const page of routes) {
  const url = `${base}${page.route ? `${page.route}/` : ""}`;
  let html = template;
  const replaceTag = (pattern, replacement) => { html = html.replace(pattern, replacement); };
  replaceTag(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  replaceTag(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`);
  replaceTag(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeHtml(url)}" />`);
  replaceTag(/<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${page.type || "website"}" />`);
  replaceTag(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  replaceTag(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  replaceTag(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${escapeHtml(url)}" />`);
  replaceTag(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(absoluteAsset(page.image))}" />`);
  if (published) replaceTag(/<link rel="icon" type="image\/jpeg" href="[^"]*"\s*\/>/, '<link rel="icon" type="image/jpeg" href="/bassam-portfolio/image/personal/bassam-elshoraa-portrait-2026-optimized.jpg" />');
  if (page.noindex) html = html.replace("</head>", '    <meta name="robots" content="noindex,nofollow" />\n  </head>');
  html = html.replace('<div id="root"></div>', `<div id="root"><main class="static-fallback">${staticContent(page)}</main></div>`);
  const output = page.route ? path.join(dist, page.route, "index.html") : path.join(dist, "index.html");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.filter((page) => !page.noindex).map((page) => `  <url><loc>${escapeHtml(`${base}${page.route ? `${page.route}/` : ""}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap);
await writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`);
console.log(`Built ${routes.length} route documents and sitemap.`);
