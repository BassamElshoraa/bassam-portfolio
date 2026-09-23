const owner = "BassamElshoraa";
const repository = "bassam-portfolio";
const apiRoot = `https://api.github.com/repos/${owner}/${repository}`;

const editableRoots = ["src/", "scripts/", "public/"];
const editableTopLevel = new Set(["index.html", "vite.config.js", "package.json", "README.md"]);
const editableExtensions = /\.(?:jsx?|tsx?|css|html?|json|md|svg|txt|xml|webmanifest)$/i;

export function isEditableSourcePath(path) {
  if (!path || path.includes("..") || path.includes("\\") || path.startsWith("/") || path.startsWith("public/data/") || path.startsWith("public/image/") || path.startsWith("public/files/")) return false;
  return editableTopLevel.has(path) || (editableRoots.some((root) => path.startsWith(root)) && editableExtensions.test(path));
}

function sourceEndpoint(path) {
  if (!isEditableSourcePath(path)) throw new Error("This file is not editable in the source workspace.");
  return `/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
}

async function githubRequest(token, path, options = {}) {
  const response = await fetch(path.startsWith("https://") ? path : `${apiRoot}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = response.status === 401 ? "The GitHub token is invalid or expired." : response.status === 403 ? "The token needs Contents read/write permission for this repository." : payload.message || `GitHub returned ${response.status}.`;
    throw new Error(message);
  }
  return payload;
}

function decodeBase64(value) {
  const binary = atob(value.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 8192) binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  return btoa(binary);
}

export async function connectGithub(token) {
  const user = await githubRequest(token, "https://api.github.com/user");
  const repo = await githubRequest(token, "");
  if (!repo.permissions?.push) throw new Error("This account cannot edit the portfolio repository.");
  const content = await readGithubContent(token);
  return { user: user.login, content };
}

export async function readGithubContent(token) {
  const paths = ["public/data/siteContent.json", "public/data/portfolioProjects.json", "public/data/articles.json"];
  const values = await Promise.all(paths.map(async (path) => {
    const file = await githubRequest(token, `/contents/${path}?ref=main`);
    return JSON.parse(decodeBase64(file.content));
  }));
  return { site: values[0], projects: values[1], articles: values[2] };
}

// Create one commit for all edited content and uploaded media. A non-forced ref update
// prevents silently overwriting changes made from another device.
export async function commitGithubFiles(token, files, message, expectedHead = "") {
  const ref = await githubRequest(token, "/git/ref/heads/main");
  const parentSha = ref.object.sha;
  if (expectedHead && parentSha !== expectedHead) throw new Error("The repository changed while you were editing. Reload this file before publishing.");
  const parent = await githubRequest(token, `/git/commits/${parentSha}`);
  const blobs = await Promise.all(files.map(async (file) => {
    const blob = await githubRequest(token, "/git/blobs", {
      method: "POST",
      body: JSON.stringify({ content: file.content, encoding: "base64" }),
    });
    return { path: file.path, mode: "100644", type: "blob", sha: blob.sha };
  }));
  const tree = await githubRequest(token, "/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree: blobs }),
  });
  const commit = await githubRequest(token, "/git/commits", {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha] }),
  });
  await githubRequest(token, "/git/refs/heads/main", {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  return commit.sha;
}

export async function saveGithubContent(token, { site, projects, articles }) {
  const files = [
    { path: "public/data/siteContent.json", content: encodeBase64(`${JSON.stringify(site, null, 2)}\n`) },
    { path: "public/data/portfolioProjects.json", content: encodeBase64(`${JSON.stringify(projects, null, 2)}\n`) },
    { path: "public/data/articles.json", content: encodeBase64(`${JSON.stringify(articles, null, 2)}\n`) },
  ];
  return commitGithubFiles(token, files, "Update portfolio content from dashboard");
}

export async function uploadGithubAsset(token, path, dataUrl) {
  const content = dataUrl.split(",")[1];
  if (!content) throw new Error("The selected file could not be read.");
  return commitGithubFiles(token, [{ path: `public/${path}`, content }], `Upload portfolio asset: ${path}`);
}

export async function listGithubSourceFiles(token) {
  const tree = await githubRequest(token, "/git/trees/main?recursive=1");
  if (tree.truncated) throw new Error("GitHub returned an incomplete file list. Try again later.");
  return (tree.tree || []).filter((item) => item.type === "blob" && item.size <= 600 * 1024 && isEditableSourcePath(item.path))
    .map((item) => ({ path: item.path, size: item.size })).sort((a, b) => a.path.localeCompare(b.path));
}

export async function readGithubSourceFile(token, path) {
  const file = await githubRequest(token, `${sourceEndpoint(path)}?ref=main`);
  if (!file.content || file.size > 600 * 1024) throw new Error("This source file is too large to edit here.");
  return { path, content: decodeBase64(file.content), sha: file.sha };
}

export async function saveGithubSourceFile(token, path, content, expectedSha) {
  if (typeof content !== "string" || new TextEncoder().encode(content).length > 600 * 1024) throw new Error("Keep source files under 600 KB.");
  const head = (await githubRequest(token, "/git/ref/heads/main")).object.sha;
  const current = await githubRequest(token, `${sourceEndpoint(path)}?ref=${head}`);
  if (current.sha !== expectedSha) throw new Error("This file changed on GitHub since you opened it. Reload it before saving so no changes are overwritten.");
  await commitGithubFiles(token, [{ path, content: encodeBase64(content) }], `Update portfolio source: ${path}`, head);
  return readGithubSourceFile(token, path);
}
