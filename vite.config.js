import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { Buffer } from "buffer";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localPortfolioContent() {
  const dataDirectory = path.join(__dirname, "public", "data");
  const siteFile = path.join(dataDirectory, "siteContent.json");
  const projectsFile = path.join(dataDirectory, "portfolioProjects.json");
  const uploadsDirectory = path.join(__dirname, "public", "image", "project", "uploads");

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
            const [site, projects] = await Promise.all([
              fs.readFile(siteFile, "utf8").then(JSON.parse),
              fs.readFile(projectsFile, "utf8").then(JSON.parse),
            ]);
            return sendJson(response, 200, { site, projects });
          } catch (error) {
            return sendJson(response, 500, { error: error.message });
          }
        }

        if (pathname === "/api/local-content" && request.method === "PUT") {
          try {
            const payload = JSON.parse(await readBody(request));
            if (!payload.site || typeof payload.site !== "object" || !Array.isArray(payload.projects)) {
              return sendJson(response, 400, { error: "Expected a site object and a projects array." });
            }
            await fs.mkdir(dataDirectory, { recursive: true });
            await Promise.all([
              writeJsonAtomically(siteFile, payload.site),
              writeJsonAtomically(projectsFile, payload.projects),
            ]);
            return sendJson(response, 200, { saved: true });
          } catch (error) {
            return sendJson(response, 400, { error: error.message });
          }
        }

        if (pathname === "/api/local-upload" && request.method === "POST") {
          try {
            const payload = JSON.parse(await readBody(request, 6 * 1024 * 1024));
            const match = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/i.exec(payload.dataUrl || "");
            if (!match) return sendJson(response, 400, { error: "Only PNG, JPG, and WEBP images are supported." });

            const extension = match[1].split("/")[1].replace("jpeg", "jpg");
            const baseName = path.basename(payload.name || "project-image", path.extname(payload.name || ""))
              .toLowerCase()
              .replace(/[^a-z0-9-]+/g, "-")
              .replace(/^-+|-+$/g, "") || "project-image";
            const filename = `${Date.now()}-${baseName}.${extension}`;
            const buffer = Buffer.from(match[2], "base64");
            if (buffer.byteLength > 4 * 1024 * 1024) return sendJson(response, 400, { error: "Image must be smaller than 4 MB." });

            await fs.mkdir(uploadsDirectory, { recursive: true });
            await fs.writeFile(path.join(uploadsDirectory, filename), buffer);
            return sendJson(response, 200, { path: `image/project/uploads/${filename}` });
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
