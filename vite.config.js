import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { Buffer } from "buffer";
import { createHash } from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localPortfolioContent() {
  const dataDirectory = path.join(__dirname, "public", "data");
  const siteFile = path.join(dataDirectory, "siteContent.json");
  const projectsFile = path.join(dataDirectory, "portfolioProjects.json");
  const articlesFile = path.join(dataDirectory, "articles.json");
  const editableTopLevel = new Set(["index.html", "vite.config.js", "package.json", "README.md"]);
  const generatedDirectoryNames = new Set(["node_modules", "dist", "build", ".sanity", ".git", "tmp"]);
  const sourceHash = (content) => createHash("sha256").update(content).digest("hex");
  const editableExtensions = /\.(?:jsx?|tsx?|css|html?|json|md|svg|txt|xml|webmanifest)$/i;
  const isEditableSourcePath = (filePath) => Boolean(filePath) && !filePath.includes("..") && !filePath.includes("\\") && !filePath.startsWith("/") && !/^public\/(?:data|image|files)\//.test(filePath) &&
    (editableTopLevel.has(filePath) || (["src/", "scripts/", "public/"].some((root) => filePath.startsWith(root)) && editableExtensions.test(filePath)));
  const resolveSource = (filePath) => {
    if (!isEditableSourcePath(filePath)) throw new Error("This source path is not editable.");
    return path.join(__dirname, ...filePath.split("/"));
  };
  const listSourceFiles = async () => {
    const files = [];
    async function visit(directory, prefix) {
      for (const entry of await fs.readdir(directory, { withFileTypes: true }).catch(() => [])) {
        const filePath = `${prefix}${entry.name}`;
        if (entry.isDirectory()) {
          if (!generatedDirectoryNames.has(entry.name) && !/^public\/(?:data|image|files)\//.test(`${filePath}/`)) await visit(path.join(directory, entry.name), `${filePath}/`);
        } else if (entry.isFile() && isEditableSourcePath(filePath)) {
          const size = (await fs.stat(path.join(directory, entry.name))).size;
          if (size <= 600 * 1024) files.push({ path: filePath, size });
        }
      }
    }
    for (const root of ["src", "scripts", "public"]) await visit(path.join(__dirname, root), `${root}/`);
    for (const filePath of editableTopLevel) {
      const size = (await fs.stat(resolveSource(filePath)).catch(() => null))?.size;
      if (size != null && size <= 600 * 1024) files.push({ path: filePath, size });
    }
    return files.sort((a, b) => a.path.localeCompare(b.path));
  };

  const sendJson = (response, statusCode, payload) => {
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(payload));
  };

  const readBody = (request, maxBytes = 5 * 1024 * 1024) => new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBytes) reject(new Error("Request is too large."));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });

  const writeJsonAtomically = async (target, value) => {
    const temporary = `${target}.tmp`;
    await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await fs.rename(temporary, target);
  };

  return {
    name: "local-portfolio-content",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url, "http://localhost").pathname;

        if (pathname === "/api/local-content" && request.method === "GET") {
          try {
            const [site, projects, articles] = await Promise.all([
              fs.readFile(siteFile, "utf8").then(JSON.parse),
              fs.readFile(projectsFile, "utf8").then(JSON.parse),
              fs.readFile(articlesFile, "utf8").then(JSON.parse),
            ]);
            return sendJson(response, 200, { site, projects, articles });
          } catch (error) {
            return sendJson(response, 500, { error: error.message });
          }
        }

        if (pathname === "/api/local-source-files" && request.method === "GET") {
          try { return sendJson(response, 200, await listSourceFiles()); }
          catch (error) { return sendJson(response, 500, { error: error.message }); }
        }

        if (pathname === "/api/local-source" && request.method === "GET") {
          try {
            const filePath = new URL(request.url, "http://localhost").searchParams.get("file");
            const content = await fs.readFile(resolveSource(filePath), "utf8");
            if (Buffer.byteLength(content) > 600 * 1024) throw new Error("This file is too large to edit here.");
            return sendJson(response, 200, { path: filePath, content, sha: sourceHash(content) });
          } catch (error) { return sendJson(response, 400, { error: error.message }); }
        }

        if (pathname === "/api/local-source" && request.method === "PUT") {
          try {
            const payload = JSON.parse(await readBody(request, 700 * 1024));
            const target = resolveSource(payload.path);
            const current = await fs.readFile(target, "utf8");
            if (sourceHash(current) !== payload.expectedSha) throw new Error("This file changed since you opened it. Reload before saving.");
            if (typeof payload.content !== "string" || Buffer.byteLength(payload.content) > 600 * 1024) throw new Error("Keep source files under 600 KB.");
            await fs.writeFile(target, payload.content, "utf8");
            return sendJson(response, 200, { path: payload.path, content: payload.content, sha: sourceHash(payload.content) });
          } catch (error) { return sendJson(response, 400, { error: error.message }); }
        }

        if (pathname === "/api/local-content" && request.method === "PUT") {
          try {
            const payload = JSON.parse(await readBody(request));
            if (!payload.site || typeof payload.site !== "object" || !Array.isArray(payload.projects) || !Array.isArray(payload.articles)) {
              return sendJson(response, 400, { error: "Expected site, projects, and articles content." });
            }
            await fs.mkdir(dataDirectory, { recursive: true });
            await Promise.all([
              writeJsonAtomically(siteFile, payload.site),
              writeJsonAtomically(projectsFile, payload.projects),
              writeJsonAtomically(articlesFile, payload.articles),
            ]);
            return sendJson(response, 200, { saved: true });
          } catch (error) {
            return sendJson(response, 400, { error: error.message });
          }
        }

        if (pathname === "/api/local-upload" && request.method === "POST") {
          try {
            const payload = JSON.parse(await readBody(request, 6 * 1024 * 1024));
            const match = /^data:(image\/(?:png|jpeg|webp|svg\+xml)|application\/pdf);base64,(.+)$/i.exec(payload.dataUrl || "");
            if (!match) return sendJson(response, 400, { error: "Use PNG, JPG, WEBP, SVG, or PDF." });

            const extension = match[1] === "application/pdf" ? "pdf" : match[1] === "image/svg+xml" ? "svg" : match[1].split("/")[1].replace("jpeg", "jpg");
            const baseName = path.basename(payload.name || "project-image", path.extname(payload.name || ""))
              .toLowerCase()
              .replace(/[^a-z0-9-]+/g, "-")
              .replace(/^-+|-+$/g, "") || "project-image";
            const filename = `${Date.now()}-${baseName}.${extension}`;
            const buffer = Buffer.from(match[2], "base64");
            if (buffer.byteLength > 4 * 1024 * 1024) return sendJson(response, 400, { error: "Image must be smaller than 4 MB." });

            const directory = match[1] === "application/pdf" ? "files" : "image";
            const uploadDirectory = path.join(__dirname, "public", directory, "uploads");
            await fs.mkdir(uploadDirectory, { recursive: true });
            await fs.writeFile(path.join(uploadDirectory, filename), buffer);
            return sendJson(response, 200, { path: `${directory}/uploads/${filename}` });
          } catch (error) {
            return sendJson(response, 400, { error: error.message });
          }
        }

        return next();
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? "/bassam-portfolio/" : "/",
  plugins: [
    localPortfolioContent(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "esbuild",
    cssMinify: "esbuild",
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
}));
