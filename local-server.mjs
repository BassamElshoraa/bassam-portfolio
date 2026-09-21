import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import { Buffer } from "node:buffer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.join(root, "dist");
const publicRoot = path.join(root, "public");
const portArgument = process.argv.find((argument) => argument.startsWith("--port="));
const port = Number(portArgument?.split("=")[1] || process.env.PORT || 4173);

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
  return candidate.startsWith(path.resolve(base)) ? candidate : null;
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

  if (pathname === "/api/local-content" && request.method === "GET") {
    try {
      const [site, projects] = await Promise.all([
        fs.readFile(path.join(publicRoot, "data", "siteContent.json"), "utf8").then(JSON.parse),
        fs.readFile(path.join(publicRoot, "data", "portfolioProjects.json"), "utf8").then(JSON.parse),
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
      await Promise.all([
        writeJson(path.join(publicRoot, "data", "siteContent.json"), payload.site),
        writeJson(path.join(publicRoot, "data", "portfolioProjects.json"), payload.projects),
      ]);
      return sendJson(response, 200, { saved: true });
    } catch (error) {
      return sendJson(response, 400, { error: error.message });
    }
  }

  if (pathname === "/api/local-upload" && request.method === "POST") {
    try {
      const payload = JSON.parse(await readBody(request));
      const match = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/i.exec(payload.dataUrl || "");
      if (!match) return sendJson(response, 400, { error: "Only PNG, JPG, and WEBP images are supported." });
      const extension = match[1].split("/")[1].replace("jpeg", "jpg");
      const baseName = path.basename(payload.name || "project-image", path.extname(payload.name || ""))
        .toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "project-image";
      const filename = `${Date.now()}-${baseName}.${extension}`;
      const buffer = Buffer.from(match[2], "base64");
      if (buffer.byteLength > 4 * 1024 * 1024) return sendJson(response, 400, { error: "Image must be smaller than 4 MB." });
      const uploadDirectory = path.join(publicRoot, "image", "project", "uploads");
      await fs.mkdir(uploadDirectory, { recursive: true });
      await fs.writeFile(path.join(uploadDirectory, filename), buffer);
      return sendJson(response, 200, { path: `image/project/uploads/${filename}` });
    } catch (error) {
      return sendJson(response, 400, { error: error.message });
    }
  }

  const publicFile = (pathname.startsWith("/data/") || pathname.startsWith("/image/") || pathname.endsWith(".pdf"))
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
