import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.join(root, "dist");
const publicRoot = path.join(root, "public");
const portArgument = process.argv.find((argument) => argument.startsWith("--port="));
const port = Number(portArgument?.split("=")[1] || process.env.PORT || 4173);
const sourceHash = (content) => createHash("sha256").update(content).digest("hex");
const editableTopLevel = new Set(["index.html", "vite.config.js", "package.json", "README.md"]);
const generatedDirectoryNames = new Set(["node_modules", "dist", "build", ".sanity", ".git", "tmp"]);
const editableExtensions = /\.(?:jsx?|tsx?|css|html?|json|md|svg|txt|xml|webmanifest)$/i;
function editableSourcePath(filePath) {
  return Boolean(filePath) && !filePath.includes("..") && !filePath.includes("\\") && !filePath.startsWith("/") && !/^public\/(?:data|image|files)\//.test(filePath) &&
    (editableTopLevel.has(filePath) || (["src/", "scripts/", "public/"].some((prefix) => filePath.startsWith(prefix)) && editableExtensions.test(filePath)));
}
function sourceFile(filePath) {
  if (!editableSourcePath(filePath)) throw new Error("This source path is not editable.");
  return path.join(root, ...filePath.split("/"));
}
async function listSourceFiles() {
  const files = [];
  async function visit(directory, prefix) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true }).catch(() => [])) {
      const filePath = `${prefix}${entry.name}`;
      if (entry.isDirectory()) {
        if (!generatedDirectoryNames.has(entry.name) && !/^public\/(?:data|image|files)\//.test(`${filePath}/`)) await visit(path.join(directory, entry.name), `${filePath}/`);
      } else if (entry.isFile() && editableSourcePath(filePath)) {
        const size = (await fs.stat(path.join(directory, entry.name))).size;
        if (size <= 600 * 1024) files.push({ path: filePath, size });
      }
    }
  }
  for (const prefix of ["src", "scripts", "public"]) await visit(path.join(root, prefix), `${prefix}/`);
  for (const filePath of editableTopLevel) {
    const size = (await fs.stat(sourceFile(filePath)).catch(() => null))?.size;
    if (size != null && size <= 600 * 1024) files.push({ path: filePath, size });
  }
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readBody(request, maxBytes = 6 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBytes) reject(new Error("Request is too large."));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function writeJson(target, value) {
  const temporary = `${target}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporary, target);
}

function safePath(base, requestPath) {
  const candidate = path.resolve(base, `.${requestPath}`);
  const relative = path.relative(path.resolve(base), candidate);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative) ? candidate : null;
}

async function serveFile(response, filePath) {
  try {
    const data = await fs.readFile(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    response.end(data);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (pathname === "/api/local-source-files" && request.method === "GET") {
    try { return sendJson(response, 200, await listSourceFiles()); }
    catch (error) { return sendJson(response, 500, { error: error.message }); }
  }

  if (pathname === "/api/local-source" && request.method === "GET") {
    try {
      const filePath = new URL(request.url, `http://${request.headers.host}`).searchParams.get("file");
      const content = await fs.readFile(sourceFile(filePath), "utf8");
      if (Buffer.byteLength(content) > 600 * 1024) throw new Error("This file is too large to edit here.");
      return sendJson(response, 200, { path: filePath, content, sha: sourceHash(content) });
    } catch (error) { return sendJson(response, 400, { error: error.message }); }
  }

  if (pathname === "/api/local-source" && request.method === "PUT") {
    try {
      const payload = JSON.parse(await readBody(request, 700 * 1024));
      const target = sourceFile(payload.path);
      const current = await fs.readFile(target, "utf8");
      if (sourceHash(current) !== payload.expectedSha) throw new Error("This file changed since you opened it. Reload before saving.");
      if (typeof payload.content !== "string" || Buffer.byteLength(payload.content) > 600 * 1024) throw new Error("Keep source files under 600 KB.");
      await fs.writeFile(target, payload.content, "utf8");
      return sendJson(response, 200, { path: payload.path, content: payload.content, sha: sourceHash(payload.content) });
    } catch (error) { return sendJson(response, 400, { error: error.message }); }
  }

  if (pathname === "/api/local-content" && request.method === "GET") {
    try {
      const [site, projects, articles] = await Promise.all([
        fs.readFile(path.join(publicRoot, "data", "siteContent.json"), "utf8").then(JSON.parse),
        fs.readFile(path.join(publicRoot, "data", "portfolioProjects.json"), "utf8").then(JSON.parse),
        fs.readFile(path.join(publicRoot, "data", "articles.json"), "utf8").then(JSON.parse),
      ]);
      return sendJson(response, 200, { site, projects, articles });
    } catch (error) {
      return sendJson(response, 500, { error: error.message });
    }
  }

  if (pathname === "/api/local-content" && request.method === "PUT") {
    try {
      const payload = JSON.parse(await readBody(request));
      if (!payload.site || typeof payload.site !== "object" || !Array.isArray(payload.projects) || !Array.isArray(payload.articles)) {
        return sendJson(response, 400, { error: "Expected site, projects, and articles content." });
      }
      await Promise.all([
        writeJson(path.join(publicRoot, "data", "siteContent.json"), payload.site),
        writeJson(path.join(publicRoot, "data", "portfolioProjects.json"), payload.projects),
        writeJson(path.join(publicRoot, "data", "articles.json"), payload.articles),
      ]);
      return sendJson(response, 200, { saved: true });
    } catch (error) {
      return sendJson(response, 400, { error: error.message });
    }
  }

  if (pathname === "/api/local-upload" && request.method === "POST") {
    try {
      const payload = JSON.parse(await readBody(request));
      const match = /^data:(image\/(?:png|jpeg|webp|svg\+xml)|application\/pdf);base64,(.+)$/i.exec(payload.dataUrl || "");
      if (!match) return sendJson(response, 400, { error: "Use PNG, JPG, WEBP, SVG, or PDF." });
      const extension = match[1] === "application/pdf" ? "pdf" : match[1] === "image/svg+xml" ? "svg" : match[1].split("/")[1].replace("jpeg", "jpg");
      const baseName = path.basename(payload.name || "project-image", path.extname(payload.name || ""))
        .toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "project-image";
      const filename = `${Date.now()}-${baseName}.${extension}`;
      const buffer = Buffer.from(match[2], "base64");
      if (buffer.byteLength > 4 * 1024 * 1024) return sendJson(response, 400, { error: "Image must be smaller than 4 MB." });
      const directory = match[1] === "application/pdf" ? "files" : "image";
      const uploadDirectory = path.join(publicRoot, directory, "uploads");
      await fs.mkdir(uploadDirectory, { recursive: true });
      await fs.writeFile(path.join(uploadDirectory, filename), buffer);
      return sendJson(response, 200, { path: `${directory}/uploads/${filename}` });
    } catch (error) {
      return sendJson(response, 400, { error: error.message });
    }
  }

  const publicFile = (pathname.startsWith("/data/") || pathname.startsWith("/image/") || pathname.startsWith("/files/") || pathname.endsWith(".pdf"))
    ? safePath(publicRoot, pathname)
    : null;
  if (publicFile && await serveFile(response, publicFile)) return;

  const requestedFile = safePath(distRoot, pathname);
  if (requestedFile && await serveFile(response, requestedFile)) return;
  await serveFile(response, path.join(distRoot, "index.html"));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio local server: http://127.0.0.1:${port}/`);
  console.log(`Dashboard: http://127.0.0.1:${port}/dashboard`);
});
