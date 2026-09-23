import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const site = JSON.parse(await readFile(path.join(root, "public/data/siteContent.json"), "utf8"));
const projects = JSON.parse(await readFile(path.join(root, "public/data/portfolioProjects.json"), "utf8"));
const articles = JSON.parse(await readFile(path.join(root, "public/data/articles.json"), "utf8"));
const failures = [];
const slugs = new Set();
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

async function checkAsset(value, label) {
  if (!value || /^https?:\/\//.test(value)) return;
  try { await access(path.join(root, "public", value.replace(/^\/+/, ""))); }
  catch { failures.push(`Missing ${label}: ${value}`); }
}

await checkAsset(site.profile.photo, "profile photo");
await checkAsset(site.ui?.seoImage, "social preview");
for (const organization of site.organizations || []) await checkAsset(organization.logo, `${organization.name} logo`);
for (const logo of Object.values(site.toolLogos || {})) await checkAsset(logo, "tool logo");
for (const project of projects) {
  if (slugs.has(project.slug)) failures.push(`Duplicate project slug: ${project.slug}`);
  slugs.add(project.slug);
  if (!project.challenge || !project.approach || !project.impact) failures.push(`Incomplete project story: ${project.slug}`);
  await checkAsset(project.image, `${project.slug} cover`);
  const htmlPath = path.join(dist, "projects", project.slug, "index.html");
  try {
    const html = await readFile(htmlPath, "utf8");
    if (!html.includes(`<title>${escapeHtml(project.title)}`)) failures.push(`Wrong project title: ${project.slug}`);
  } catch { failures.push(`Missing project route: ${project.slug}`); }
}
for (const article of articles) {
  if (slugs.has(article.slug)) failures.push(`Duplicate article slug: ${article.slug}`);
  slugs.add(article.slug);
  await checkAsset(article.thumbnail, `${article.slug} cover`);
  for (const match of article.content.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
    await checkAsset(match[1], `${article.slug} inline image`);
  }
  try { await access(path.join(dist, "articles", article.slug, "index.html")); }
  catch { failures.push(`Missing article route: ${article.slug}`); }
}
for (const route of ["index.html", "projects/index.html", "dashboard/index.html", "sitemap.xml"]) {
  try { await access(path.join(dist, route)); }
  catch { failures.push(`Missing output: ${route}`); }
}
const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
if (sitemap.includes("netlify.app")) failures.push("Sitemap still has the previous host.");
if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exitCode = 1;
} else {
  console.log(`Verified ${projects.length} projects, ${articles.length} article(s), route documents, and local assets.`);
}
