import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const dataFile = new URL("../public/data/articles.json", import.meta.url);
const imageDirectory = new URL("../public/image/articles/", import.meta.url);
const originalCover = "https://cdn-images-1.medium.com/max/1024/1*MO-1iW1s45MTOW47whji9A.png";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function localizeArticleImages(articles) {
  await mkdir(imageDirectory, { recursive: true });
  let downloaded = 0;

  for (const article of articles) {
    const sources = [...new Set([...article.content.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map((match) => match[1]))]
      .filter((source) => source.startsWith("https://cdn-images-1.medium.com/"));

    for (const [index, source] of sources.entries()) {
      const extension = new URL(source).pathname.match(/\.(png|jpe?g|webp)$/i)?.[1]?.toLowerCase() || "png";
      const filename = source === originalCover ? "football-data-python.png" : `${article.slug}-${String(index + 1).padStart(2, "0")}.${extension}`;
      const localPath = `image/articles/${filename}`;
      const destination = new URL(filename, imageDirectory);

      if (!(await exists(destination))) {
        const response = await fetch(source);
        if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
          throw new Error(`Could not retrieve article image ${index + 1}: HTTP ${response.status}`);
        }
        const image = Buffer.from(await response.arrayBuffer());
        if (!image.length || image.length > 8_000_000) throw new Error(`Article image ${index + 1} has an unexpected size.`);
        await writeFile(destination, image);
        downloaded += 1;
      }

      article.content = article.content.replaceAll(source, localPath);
      if (article.thumbnail === source) article.thumbnail = localPath;
    }

    article.content = article.content.replace(/<img\b[^>]*src="https:\/\/medium\.com\/_\/stat[^"]*"[^>]*>/g, "");
  }

  return downloaded;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const articles = JSON.parse(await readFile(dataFile, "utf8"));
  const downloaded = await localizeArticleImages(articles);
  await writeFile(dataFile, `${JSON.stringify(articles, null, 2)}\n`);
  console.log(`Localized ${downloaded} new article image(s).`);
}
