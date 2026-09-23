import { readFile } from "node:fs/promises";

const index = JSON.parse(await readFile(new URL("../src/portfolio/codeFileIndex.json", import.meta.url), "utf8"));
const projects = JSON.parse(await readFile(new URL("../public/data/portfolioProjects.json", import.meta.url), "utf8"));
const failures = [];
for (const project of projects.filter((item) => index[item.slug])) {
  const source = new URL(project.github);
  const [owner, repo] = source.pathname.split("/").filter(Boolean);
  for (const file of index[project.slug]) {
    const encoded = file.split("/").map(encodeURIComponent).join("/");
    let found = false;
    for (const branch of ["main", "master"]) {
      const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encoded}`, { method: "HEAD" });
      if (response.ok) { found = true; break; }
    }
    if (!found) failures.push(`${project.slug}: ${file}`);
  }
}
console.log(`Indexed repositories: ${Object.keys(index).length}`);
console.log(`Missing files: ${failures.length}`);
failures.forEach((item) => console.log(item));
if (failures.length) process.exitCode = 1;
